# DATABASE.md

# 6102 Creative System — Database Specification

**Document type:** Technical Database Specification
**Database engine:** PostgreSQL
**Backend platform:** Supabase
**Authentication:** Supabase Auth
**File storage:** Supabase Storage
**Initial capacity:** Approximately 20 users
**Architecture:** Multi-organization, cross-campus collaboration
**Status:** Proposed implementation baseline

---

## 1. Purpose

This document defines the database architecture for 6102 Creative System. It is the technical reference for implementing database tables, relationships, constraints, indexes, Row Level Security (RLS), database functions, and version-controlled migrations.

The schema supports collaborative creative work across organizations, campuses, and creative units.

The database must provide:

* Reliable ownership and separation of organizational data.
* Role-based access control at the organization and creative-unit levels.
* Structured lifecycles for ideas, projects, campaigns, tasks, and content.
* Traceable review and approval processes.
* Controlled access to creative assets and uploaded files.
* Notifications and activity history.
* A foundation for future analytics and reporting.
* Portability to standard PostgreSQL infrastructure.

## 2. Database Design Principles

### 2.1 PostgreSQL as the source of truth

All persistent business data must be stored in PostgreSQL. Client-side state may improve responsiveness, but it must not be treated as authoritative for permissions, approvals, financial or operational status, or record ownership.

### 2.2 Explicit organizational ownership

Business records must belong to an organization through an `organization_id` column, directly or through an explicitly defined parent relationship.

Campus and creative-unit identifiers provide additional organizational context but do not replace organization ownership.

### 2.3 Separate authentication from application profiles

Supabase Auth manages credentials and authentication sessions. The `profiles` table stores application-specific user information.

Passwords must never be stored in `profiles`.

### 2.4 Least-privilege access

Every protected table must use RLS. Users should receive only the access necessary for their assigned responsibilities.

Application interfaces may hide unavailable actions, but database policies must independently enforce access.

### 2.5 Referential integrity

Use foreign keys, `NOT NULL`, `UNIQUE`, and `CHECK` constraints wherever practical. Avoid relying exclusively on frontend validation.

### 2.6 Explicit workflow states

Use constrained status values and document valid transitions. A database constraint can validate a status value, but transition permissions and workflow rules require additional enforcement.

### 2.7 Avoid premature complexity

The initial deployment serves approximately 20 users. Prefer conventional PostgreSQL features over unnecessary microservices, distributed databases, or elaborate event-processing infrastructure.

### 2.8 Migration-first development

Every schema modification must be committed as a version-controlled SQL migration. Never rely on undocumented production-only schema changes.

---

## 3. Entity Overview

The schema is organized into the following domains.

| Domain                       | Tables                                         |
| ---------------------------- | ---------------------------------------------- |
| Identity                     | `profiles`                                     |
| Organization                 | `organizations`, `campuses`, `creative_units`  |
| Membership and authorization | `organization_memberships`, `unit_memberships` |
| Ideas                        | `ideas`                                        |
| Projects and campaigns       | `projects`, `campaigns`                        |
| Execution                    | `tasks`                                        |
| Content production           | `content_items`, `content_versions`            |
| Approval                     | `approval_requests`                            |
| Collaboration                | `comments`                                     |
| Assets                       | `assets`, `content_assets`                     |
| Notifications                | `notifications`                                |
| Audit                        | `audit_logs`                                   |

Additional supporting tables may be introduced later for tags, custom fields, templates, or integrations when actual requirements justify them.

## 4. Relationship Model

The principal relationships are:

* One organization has many campuses.
* One organization has many creative units.
* One user has many organization memberships.
* One user may have memberships in several organizations.
* One user may belong to several creative units.
* One idea may be converted into a project.
* One project may contain many campaigns, tasks, and content items.
* One campaign may contain many tasks and content items.
* One content item may have many versions, comments, and asset attachments.
* One business record may have multiple approval requests over its lifecycle.
* One user may receive many notifications.
* Audit records identify the actor, action, and affected resource.

### 4.1 Simplified ER diagram

```
organizations
  ├── campuses
  ├── creative_units
  ├── organization_memberships ── profiles
  ├── unit_memberships ────────── profiles
  ├── ideas ───────────────────── profiles
  ├── projects
  │    ├── campaigns
  │    ├── tasks
  │    └── content_items
  │         ├── content_versions
  │         ├── content_assets ─── assets
  │         ├── comments
  │         └── approval_requests
  ├── notifications ───────────── profiles
  └── audit_logs ──────────────── profiles
```

The actual schema also supports approval requests for ideas and projects.

---

## 5. Naming and Data Conventions

* Table names: lowercase `snake_case`, plural nouns.
* Column names: lowercase `snake_case`.
* Primary keys: UUID.
* Timestamps: `timestamptz`.
* Dates without a time component: `date`.
* Human-readable names: `text`.
* Longer descriptions and content: `text`.
* Status values: `text` with `CHECK` constraints.
* JSONB: only for genuinely flexible metadata, not core relational data.
* File contents: Supabase Storage; store file metadata and storage references in PostgreSQL.
* All business timestamps should be generated or validated on the server.

Use UTC for persisted timestamps. Convert timestamps to the appropriate local timezone in the application interface.

Recommended common columns:

* `id`
* `created_at`
* `updated_at`
* `created_by`, where creator attribution is needed.

Do not add every common column to every table automatically. Join tables, append-only audit records, and immutable version records may require different conventions.

---

## 6. Extensions and Common Functions

Supabase projects commonly provide the `pgcrypto` extension, which includes `gen_random_uuid()` on supported PostgreSQL versions. Confirm the deployed version and extension availability before migration.

The following function maintains `updated_at`.

```
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
```

Apply this trigger to mutable tables containing both `created_at` and `updated_at`.

```
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
```

Repeat the trigger for each applicable table. Use a consistent trigger naming convention, such as `trg_projects_updated_at`.

Do not apply this trigger to immutable version records or append-only audit records unless their data model explicitly allows modification.

---

## 7. Core Schema

The following SQL defines the core tables and their essential constraints. Execute these statements in the migration order specified in Section 16.

### 7.1 Profiles

The application profile references the authenticated Supabase user.

```
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id)
    ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_path text,
  job_title text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_display_name_nonempty
    CHECK (length(trim(display_name)) > 0)
);
```

The application should create a profile when a user account is provisioned. Account creation must not grant organization membership automatically unless an explicitly authorized invitation or onboarding flow requires it.

Use a trusted server-side onboarding process or a carefully secured Auth trigger. Never allow an untrusted client to assign privileged roles through user metadata.

### 7.2 Organizations

An organization is the principal data isolation boundary.

```
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  logo_path text,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.profiles(id)
    ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT organizations_name_nonempty
    CHECK (length(trim(name)) > 0),
  CONSTRAINT organizations_slug_format
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
```

The organization creator does not automatically become an administrator merely because they created the record. Organization creation and the initial administrator membership must be provisioned through one trusted server-side transaction or equivalent controlled workflow.

### 7.3 Campuses

```
CREATE TABLE public.campuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT campuses_name_nonempty
    CHECK (length(trim(name)) > 0),
  CONSTRAINT campuses_org_id_id_unique
    UNIQUE (organization_id, id),
  CONSTRAINT campuses_org_code_unique
    UNIQUE (organization_id, code)
);
```

Campus codes may be null. If present, they must be unique within their organization.

### 7.4 Creative units

A creative unit represents an organizational team or division, such as design, photography, video production, writing, or social media.

```
CREATE TABLE public.creative_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,
  campus_id uuid,
  name text NOT NULL,
  code text,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT creative_units_org_id_id_unique
    UNIQUE (organization_id, id),

  CONSTRAINT creative_units_campus_fk
    FOREIGN KEY (organization_id, campus_id)
    REFERENCES public.campuses(organization_id, id)
    ON DELETE RESTRICT,

  CONSTRAINT creative_units_org_code_unique
    UNIQUE (organization_id, code),

  CONSTRAINT creative_units_name_nonempty
    CHECK (length(trim(name)) > 0)
);
```

A null `campus_id` indicates a unit operating across campuses or at the organization level.

The composite foreign key prevents a creative unit from referencing a campus belonging to another organization.

### 7.5 Organization memberships

Organization memberships define the user's role within an organization.

Initial role values:

* `owner`
* `admin`
* `creative_lead`
* `project_manager`
* `member`
* `viewer`

These are authorization roles, not necessarily job titles.

```
CREATE TABLE public.organization_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL
    REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  status text NOT NULL DEFAULT 'active',
  invited_by uuid REFERENCES public.profiles(id)
    ON DELETE SET NULL,
  joined_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT organization_memberships_role_check
    CHECK (role IN (
      'owner',
      'admin',
      'creative_lead',
      'project_manager',
      'member',
      'viewer'
    )),

  CONSTRAINT organization_memberships_status_check
    CHECK (status IN (
      'invited',
      'active',
      'suspended'
    )),

  CONSTRAINT organization_memberships_unique
    UNIQUE (organization_id, user_id),

  CONSTRAINT organization_memberships_org_id_id_unique
    UNIQUE (organization_id, id)
);
```

Membership rows with status `invited` or `suspended` must not grant normal application access. The exact invitation acceptance mechanism belongs in the authentication and onboarding implementation.

### 7.6 Unit memberships

A user can belong to several creative units. Unit memberships provide an additional assignment scope without replacing organization membership.

```
CREATE TABLE public.unit_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  creative_unit_id uuid NOT NULL,
  user_id uuid NOT NULL,
  unit_role text NOT NULL DEFAULT 'member',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT unit_memberships_role_check
    CHECK (unit_role IN (
      'lead',
      'editor',
      'member',
      'viewer'
    )),

  CONSTRAINT unit_memberships_status_check
    CHECK (status IN ('active', 'suspended')),

  CONSTRAINT unit_memberships_unique
    UNIQUE (creative_unit_id, user_id),

  CONSTRAINT unit_memberships_unit_fk
    FOREIGN KEY (organization_id, creative_unit_id)
    REFERENCES public.creative_units(organization_id, id)
    ON DELETE CASCADE,

  CONSTRAINT unit_memberships_org_member_fk
    FOREIGN KEY (organization_id, user_id)
    REFERENCES public.organization_memberships(organization_id, user_id)
    ON DELETE CASCADE
);
```

An active unit membership therefore requires an organization membership. If an organization membership is removed, its associated unit memberships are removed as well.

### 7.7 Ideas

Ideas are proposals that may later become projects.

```
CREATE TABLE public.ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,
  campus_id uuid,
  creative_unit_id uuid,
  title text NOT NULL,
  description text,
  problem_statement text,
  proposed_solution text,
  expected_impact text,
  estimated_budget numeric(14,2),
  status text NOT NULL DEFAULT 'draft',
  submitted_by uuid NOT NULL
    REFERENCES public.profiles(id) ON DELETE RESTRICT,
  submitted_at timestamptz,
  converted_project_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT ideas_status_check
    CHECK (status IN (
      'draft',
      'submitted',
      'under_review',
      'approved',
      'rejected',
      'converted',
      'archived'
    )),

  CONSTRAINT ideas_budget_nonnegative
    CHECK (estimated_budget IS NULL OR estimated_budget >= 0),

  CONSTRAINT ideas_title_nonempty
    CHECK (length(trim(title)) > 0),

  CONSTRAINT ideas_org_id_id_unique
    UNIQUE (organization_id, id),

  CONSTRAINT ideas_campus_fk
    FOREIGN KEY (organization_id, campus_id)
    REFERENCES public.campuses(organization_id, id)
    ON DELETE RESTRICT,

  CONSTRAINT ideas_unit_fk
    FOREIGN KEY (organization_id, creative_unit_id)
    REFERENCES public.creative_units(organization_id, id)
    ON DELETE RESTRICT
);
```

The `converted_project_id` foreign key is added after the projects table is created.

An idea's conversion must preserve the original idea record for traceability. Conversion should occur through a transaction that creates the project and links it to the originating idea.

### 7.8 Projects

Projects are the primary containers for coordinated creative work.

```
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,
  campus_id uuid,
  creative_unit_id uuid,
  source_idea_id uuid,
  title text NOT NULL,
  slug text,
  description text,
  objectives text,
  status text NOT NULL DEFAULT 'planning',
  priority text NOT NULL DEFAULT 'medium',
  project_manager_id uuid
    REFERENCES public.profiles(id) ON DELETE SET NULL,
  start_date date,
  due_date date,
  completed_at timestamptz,
  created_by uuid NOT NULL
    REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT projects_status_check
    CHECK (status IN (
      'planning',
      'active',
      'on_hold',
      'completed',
      'cancelled',
      'archived'
    )),

  CONSTRAINT projects_priority_check
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),

  CONSTRAINT projects_date_check
    CHECK (start_date IS NULL OR due_date IS NULL
      OR due_date >= start_date),

  CONSTRAINT projects_title_nonempty
    CHECK (length(trim(title)) > 0),

  CONSTRAINT projects_org_id_id_unique
    UNIQUE (organization_id, id),

  CONSTRAINT projects_source_idea_unique
    UNIQUE (source_idea_id),

  CONSTRAINT projects_campus_fk
    FOREIGN KEY (organization_id, campus_id)
    REFERENCES public.campuses(organization_id, id)
    ON DELETE RESTRICT,

  CONSTRAINT projects_unit_fk
    FOREIGN KEY (organization_id, creative_unit_id)
    REFERENCES public.creative_units(organization_id, id)
    ON DELETE RESTRICT,

  CONSTRAINT projects_source_idea_fk
    FOREIGN KEY (organization_id, source_idea_id)
    REFERENCES public.ideas(organization_id, id)
    ON DELETE RESTRICT
);
```

A project may originate from an idea, but direct project creation is also permitted.

`UNIQUE (source_idea_id)` ensures an idea is not converted into multiple projects. PostgreSQL permits multiple null values in this constraint.

After creating `projects`, add the reverse reference:

```
ALTER TABLE public.ideas
ADD CONSTRAINT ideas_converted_project_fk
FOREIGN KEY (organization_id, converted_project_id)
REFERENCES public.projects(organization_id, id)
ON DELETE RESTRICT;
```

A trigger or trusted database function should ensure the source idea and resulting project point to each other consistently. The application must not be allowed to arbitrarily link unrelated records.

### 7.9 Campaigns

Campaigns represent coordinated communication or promotional initiatives. A campaign can belong to a project or exist independently within an organization.

```
CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id uuid,
  title text NOT NULL,
  description text,
  objective text,
  status text NOT NULL DEFAULT 'draft',
  start_date date,
  end_date date,
  created_by uuid NOT NULL
    REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT campaigns_status_check
    CHECK (status IN (
      'draft',
      'planning',
      'active',
      'paused',
      'completed',
      'cancelled',
      'archived'
    )),

  CONSTRAINT campaigns_date_check
    CHECK (start_date IS NULL OR end_date IS NULL
      OR end_date >= start_date),

  CONSTRAINT campaigns_title_nonempty
    CHECK (length(trim(title)) > 0),

  CONSTRAINT campaigns_org_id_id_unique
    UNIQUE (organization_id, id),

  CONSTRAINT campaigns_project_fk
    FOREIGN KEY (organization_id, project_id)
    REFERENCES public.projects(organization_id, id)
    ON DELETE RESTRICT
);
```

### 7.10 Tasks

Tasks represent actionable work assigned to an individual.

```
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id uuid NOT NULL,
  campaign_id uuid,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo',
  priority text NOT NULL DEFAULT 'medium',
  assigned_to uuid
    REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by uuid NOT NULL
    REFERENCES public.profiles(id) ON DELETE RESTRICT,
  start_date date,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT tasks_status_check
    CHECK (status IN (
      'todo',
      'in_progress',
      'in_review',
      'blocked',
      'done',
      'cancelled'
    )),

  CONSTRAINT tasks_priority_check
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),

  CONSTRAINT tasks_date_check
    CHECK (start_date IS NULL OR due_date IS NULL
      OR due_date >= start_date),

  CONSTRAINT tasks_title_nonempty
    CHECK (length(trim(title)) > 0),

  CONSTRAINT tasks_org_id_id_unique
    UNIQUE (organization_id, id),

  CONSTRAINT tasks_project_fk
    FOREIGN KEY (organization_id, project_id)
    REFERENCES public.projects(organization_id, id)
    ON DELETE RESTRICT,

  CONSTRAINT tasks_campaign_fk
    FOREIGN KEY (organization_id, campaign_id)
    REFERENCES public.campaigns(organization_id, id)
    ON DELETE RESTRICT
);
```

This initial model requires each task to belong to a project. A campaign-associated task must still belong to a project; a database trigger or transactional function must validate that the campaign belongs to that same project when `campaign_id` is present.

If the product later requires independent campaign tasks, change this model through a migration rather than allowing ambiguous ownership.

### 7.11 Content items

Content items represent deliverables such as social media posts, articles, videos, posters, and other creative outputs.

```
CREATE TABLE public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id uuid NOT NULL,
  campaign_id uuid,
  title text NOT NULL,
  description text,
  content_type text NOT NULL,
  channel text,
  status text NOT NULL DEFAULT 'draft',
  body text,
  scheduled_at timestamptz,
  published_at timestamptz,
  assigned_to uuid
    REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by uuid NOT NULL
    REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT content_items_type_check
    CHECK (content_type IN (
      'social_post',
      'article',
      'video',
      'poster',
      'graphic',
      'photography',
      'presentation',
      'other'
    )),

  CONSTRAINT content_items_status_check
    CHECK (status IN (
      'draft',
      'in_production',
      'in_review',
      'changes_requested',
      'approved',
      'scheduled',
      'published',
      'rejected',
      'archived'
    )),

  CONSTRAINT content_items_title_nonempty
    CHECK (length(trim(title)) > 0),

  CONSTRAINT content_items_org_id_id_unique
    UNIQUE (organization_id, id),

  CONSTRAINT content_items_project_fk
    FOREIGN KEY (organization_id, project_id)
    REFERENCES public.projects(organization_id, id)
    ON DELETE RESTRICT,

  CONSTRAINT content_items_campaign_fk
    FOREIGN KEY (organization_id, campaign_id)
    REFERENCES public.campaigns(organization_id, id)
    ON DELETE RESTRICT
);
```

The application or a database trigger must verify that an attached campaign belongs to the same project as the content item.

### 7.12 Content versions

Version records preserve the history of creative text and other version-specific metadata.

```
CREATE TABLE public.content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  content_item_id uuid NOT NULL,
  version_number integer NOT NULL,
  body text,
  change_summary text,
  created_by uuid NOT NULL
    REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT content_versions_number_positive
    CHECK (version_number > 0),

  CONSTRAINT content_versions_unique
    UNIQUE (content_item_id, version_number),

  CONSTRAINT content_versions_org_id_id_unique
    UNIQUE (organization_id, id),

  CONSTRAINT content_versions_item_fk
    FOREIGN KEY (organization_id, content_item_id)
    REFERENCES public.content_items(organization_id, id)
    ON DELETE RESTRICT
);
```

Generate version numbers on the server or inside a transaction that safely serializes concurrent version creation for the same content item. Do not calculate them solely in the browser.

For binary files, preserve file versions in storage and reference them through asset records rather than storing binary contents in PostgreSQL.

### 7.13 Approval requests

This table supports approvals for ideas, projects, and content items without using an unconstrained polymorphic reference.

Exactly one target reference must be populated.

```
CREATE TABLE public.approval_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,

  idea_id uuid,
  project_id uuid,
  content_item_id uuid,

  requested_by uuid NOT NULL
    REFERENCES public.profiles(id) ON DELETE RESTRICT,
  reviewer_id uuid
    REFERENCES public.profiles(id) ON DELETE RESTRICT,

  status text NOT NULL DEFAULT 'pending',
  request_note text,
  decision_note text,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT approval_requests_status_check
    CHECK (status IN (
      'pending',
      'approved',
      'changes_requested',
      'rejected',
      'cancelled'
    )),

  CONSTRAINT approval_requests_exactly_one_target
    CHECK (
      num_nonnulls(idea_id, project_id, content_item_id) = 1
    ),

  CONSTRAINT approval_requests_org_id_id_unique
    UNIQUE (organization_id, id),

  CONSTRAINT approval_requests_idea_fk
    FOREIGN KEY (organization_id, idea_id)
    REFERENCES public.ideas(organization_id, id)
    ON DELETE RESTRICT,

  CONSTRAINT approval_requests_project_fk
    FOREIGN KEY (organization_id, project_id)
    REFERENCES public.projects(organization_id, id)
    ON DELETE RESTRICT,

  CONSTRAINT approval_requests_content_fk
    FOREIGN KEY (organization_id, content_item_id)
    REFERENCES public.content_items(organization_id, id)
    ON DELETE RESTRICT
);
```

For reviewer assignment, approval decisions, and workflow changes, use a trusted database function or server-side transaction.

The approval process must verify that:

1. The requester can submit the specified resource for review.
2. The reviewer has permission to review that resource.
3. The resource belongs to the stated organization.
4. The request is still pending when a decision is made.
5. The final decision and target status are updated atomically.
6. The requester cannot impersonate a reviewer by changing a client-supplied user ID.

If multiple reviewers or sequential approval stages become necessary, introduce `approval_steps` and `approval_step_decisions` rather than overloading a single reviewer field.

### 7.14 Comments

Comments may be attached to an idea, project, campaign, task, or content item.

```
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,

  idea_id uuid,
  project_id uuid,
  campaign_id uuid,
  task_id uuid,
  content_item_id uuid,

  author_id uuid NOT NULL
    REFERENCES public.profiles(id) ON DELETE RESTRICT,
  body text NOT NULL,
  edited_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT comments_exactly_one_target
    CHECK (
      num_nonnulls(
        idea_id,
        project_id,
        campaign_id,
        task_id,
        content_item_id
      ) = 1
    ),

  CONSTRAINT comments_body_nonempty
    CHECK (length(trim(body)) > 0),

  CONSTRAINT comments_org_id_id_unique
    UNIQUE (organization_id, id),

  CONSTRAINT comments_idea_fk
    FOREIGN KEY (organization_id, idea_id)
    REFERENCES public.ideas(organization_id, id)
    ON DELETE CASCADE,

  CONSTRAINT comments_project_fk
    FOREIGN KEY (organization_id, project_id)
    REFERENCES public.projects(organization_id, id)
    ON DELETE CASCADE,

  CONSTRAINT comments_campaign_fk
    FOREIGN KEY (organization_id, campaign_id)
    REFERENCES public.campaigns(organization_id, id)
    ON DELETE CASCADE,

  CONSTRAINT comments_task_fk
    FOREIGN KEY (organization_id, task_id)
    REFERENCES public.tasks(organization_id, id)
    ON DELETE CASCADE,

  CONSTRAINT comments_content_fk
    FOREIGN KEY (organization_id, content_item_id)
    REFERENCES public.content_items(organization_id, id)
    ON DELETE CASCADE
);
```

The application should restrict comment editing and deletion to the author and explicitly authorized administrators, subject to the organization's moderation policy.

### 7.15 Assets

Assets store metadata for uploaded files, not the files themselves.

```
CREATE TABLE public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,
  storage_bucket text NOT NULL DEFAULT 'creative-assets',
  storage_path text NOT NULL,
  original_filename text NOT NULL,
  mime_type text,
  file_size_bytes bigint,
  checksum_sha256 text,
  title text,
  description text,
  license_type text,
  attribution text,
  visibility text NOT NULL DEFAULT 'organization',
  uploaded_by uuid NOT NULL
    REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT assets_visibility_check
    CHECK (visibility IN (
      'private',
      'organization',
      'public'
    )),

  CONSTRAINT assets_file_size_check
    CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0),

  CONSTRAINT assets_storage_location_unique
    UNIQUE (storage_bucket, storage_path),

  CONSTRAINT assets_org_id_id_unique
    UNIQUE (organization_id, id),

  CONSTRAINT assets_filename_nonempty
    CHECK (length(trim(original_filename)) > 0)
);
```

Storage paths must be generated by the server using a controlled convention, such as:

```
{organization_id}/{asset_id}/{sanitized_filename}
```

Do not trust a user-supplied storage path as proof of authorization. Validate the bucket, object path, organization ownership, MIME type, and file-size limit.

The `public` visibility value is a business-level designation. It does not automatically make an object publicly accessible in Supabase Storage. Public access must be implemented intentionally.

### 7.16 Content asset attachments

A content item may use multiple assets, and an asset may be reused across multiple content items.

```
CREATE TABLE public.content_assets (
  organization_id uuid NOT NULL,
  content_item_id uuid NOT NULL,
  asset_id uuid NOT NULL,
  usage_role text NOT NULL DEFAULT 'attachment',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (content_item_id, asset_id),

  CONSTRAINT content_assets_role_check
    CHECK (usage_role IN (
      'cover',
      'thumbnail',
      'source',
      'attachment',
      'final_output'
    )),

  CONSTRAINT content_assets_content_fk
    FOREIGN KEY (organization_id, content_item_id)
    REFERENCES public.content_items(organization_id, id)
    ON DELETE CASCADE,

  CONSTRAINT content_assets_asset_fk
    FOREIGN KEY (organization_id, asset_id)
    REFERENCES public.assets(organization_id, id)
    ON DELETE CASCADE
);
```

The composite foreign keys prevent attaching assets across organizations.

### 7.17 Notifications

Notifications are private to their recipients.

```
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL
    REFERENCES public.organizations(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL
    REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id uuid
    REFERENCES public.profiles(id) ON DELETE SET NULL,
  notification_type text NOT NULL,
  title text NOT NULL,
  body text,
  resource_type text,
  resource_id uuid,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

Examples include task assignments, review requests, approval decisions, and project updates.

Notifications should be generated by trusted server-side operations or database triggers with a well-defined event policy.

`resource_type` and `resource_id` are intentionally generic because notifications may reference different resource types. Since a generic pair cannot have an ordinary foreign key to every target table, the application must validate references before creating them. The resource link must also be checked for authorization when opened.

### 7.18 Audit logs

Audit records document significant business and security actions.

```
CREATE TABLE public.audit_logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  organization_id uuid
    REFERENCES public.organizations(id) ON DELETE SET NULL,
  actor_id uuid
    REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  request_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

Audit events may include:

* Organization membership changes.
* Role and permission changes.
* Project creation, cancellation, and completion.
* Approval decisions.
* Asset access or deletion where auditability is required.
* Changes to important workflow settings.
* Administrative operations.

Do not store passwords, access tokens, session tokens, secret keys, or unnecessary personal information in audit metadata.

The application must not allow ordinary users to modify or delete audit records. For stronger integrity, use a narrowly scoped database function or trusted server-side writer and deny direct client inserts as well as updates and deletes. Database owners and privileged operators remain capable of changing the underlying database; audit logs should not be described as tamper-proof against those operators.

---

## 8. Workflow Rules

Database status constraints prevent invalid status strings. They do not, by themselves, enforce valid transitions.

The following transitions should be enforced by trusted server-side logic or dedicated PostgreSQL functions.

### 8.1 Idea lifecycle

```
draft
  → submitted
  → under_review
  → approved
  → converted
```

Alternative outcomes:

```
under_review → changes_requested
under_review → rejected
draft → archived
approved → archived
```

If `changes_requested` is required as an idea status, add it to the status constraint in a migration before implementing the transition.

### 8.2 Project lifecycle

```
planning → active
active → on_hold
on_hold → active
active → completed
planning → cancelled
active → cancelled
completed → archived
```

Only authorized roles should complete, cancel, or archive projects.

### 8.3 Task lifecycle

```
todo → in_progress
in_progress → in_review
in_review → done
in_review → in_progress
in_progress → blocked
blocked → in_progress
todo → cancelled
```

The exact workflow can be adjusted to match the approved product requirements.

### 8.4 Content lifecycle

```
draft → in_production
in_production → in_review
in_review → approved
in_review → changes_requested
changes_requested → in_production
approved → scheduled
scheduled → published
```

Publication must not be inferred merely because an approval request has been approved. Scheduling and publication are separate operations.

### 8.5 Approval lifecycle

A decision must be conditional on the request still being pending. For example, a transaction may update a request only when `status = 'pending'`, verify the affected row count, update the target resource, and record the actor.

This prevents two reviewers from successfully making conflicting decisions against the same pending request.

---

## 9. Row Level Security (RLS)

### 9.1 Mandatory rules

Enable RLS on every table exposed to client access through Supabase's Data API.

Policies must be designed around:

1. Active authentication.
2. Active organization membership.
3. The user's role.
4. Campus or creative-unit scope, when applicable.
5. The target resource's organization.
6. Ownership or assignment, where applicable.
7. The action being performed.

An organization administrator should not automatically gain access to another organization's data.

A campus-scoped unit member must not automatically gain organization-wide edit permissions.

### 9.2 Helper functions

Centralize frequently used authorization checks in carefully secured helper functions.

The following is an illustrative starting point for checking active organization membership.

```
CREATE OR REPLACE FUNCTION public.is_org_member(
  p_organization_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_memberships m
    WHERE m.organization_id = p_organization_id
      AND m.user_id = (SELECT auth.uid())
      AND m.status = 'active'
    );
$$;
```

An organization role helper can follow the same pattern.

```
CREATE OR REPLACE FUNCTION public.has_org_role(
  p_organization_id uuid,
  p_allowed_roles text[]
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_memberships m
    WHERE m.organization_id = p_organization_id
      AND m.user_id = (SELECT auth.uid())
      AND m.status = 'active'
      AND m.role = ANY(p_allowed_roles)
  );
$$;
```

These helpers must be tested against the final RLS policies. A `SECURITY INVOKER` function runs with the caller's permissions, so membership-table RLS can affect its result. Do not add permissive policies merely to make a helper work.

If a `SECURITY DEFINER` helper is necessary to avoid RLS recursion, it must be reviewed separately: use a fixed search path, fully qualified object names, narrowly scoped execution grants, and no user-controlled dynamic SQL. Revoke default execution privileges where appropriate and grant execution only to intended roles. A definer helper must never become a general authorization bypass.

### 9.3 Enable RLS

Enable RLS on all client-exposed tables.

```
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
```

Apply policies to each table individually. Enabling RLS without creating the necessary policies will deny normal client access, which is safer than accidentally exposing all records.

### 9.4 Example: organization access

```
CREATE POLICY organizations_select_member
ON public.organizations
FOR SELECT
TO authenticated
USING (
  public.is_org_member(id)
);
```

For organization updates, use a separate policy restricted to authorized roles.

```
CREATE POLICY organizations_update_admin
ON public.organizations
FOR UPDATE
TO authenticated
USING (
  public.has_org_role(id, ARRAY['owner', 'admin'])
)
WITH CHECK (
  public.has_org_role(id, ARRAY['owner', 'admin'])
);
```

The `WITH CHECK` condition prevents a permitted user from changing the row into a state outside the allowed scope. Additional rules may be necessary to protect fields such as ownership or administrative settings.

Organization creation should use a trusted onboarding process. Do not create a broad policy that lets any authenticated user assign themselves the `owner` role.

### 9.5 Example: profile access

A user should be able to read their own profile and update permitted fields on that profile.

```
CREATE POLICY profiles_select_self
ON public.profiles
FOR SELECT
TO authenticated
USING (
  id = (SELECT auth.uid())
);

CREATE POLICY profiles_update_self
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  id = (SELECT auth.uid())
)
WITH CHECK (
  id = (SELECT auth.uid())
);
```

This is only a row-level restriction. It does not prevent a user from changing sensitive columns such as `is_active` or `job_title`.

Use column-level grants, a controlled update function, or another server-side mechanism to restrict which profile fields the client can change. Provisioning and account suspension must remain administrative operations.

### 9.6 Example: ideas

Organization members may read ideas in their organization.

```
CREATE POLICY ideas_select_member
ON public.ideas
FOR SELECT
TO authenticated
USING (
  public.is_org_member(organization_id)
);
```

A basic insert policy can restrict creation to active organization members.

```
CREATE POLICY ideas_insert_member
ON public.ideas
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_org_member(organization_id)
  AND submitted_by = (SELECT auth.uid())
);
```

This policy is an initial baseline, not the complete production permission model. If the application supports private drafts, unit-scoped proposals, or campus-specific visibility, the `SELECT` policy must incorporate those rules.

For updates, separate ordinary draft editing from administrative status transitions. Do not grant every organization member unrestricted updates to all idea fields.

### 9.7 Example: projects

Read access:

```
CREATE POLICY projects_select_member
ON public.projects
FOR SELECT
TO authenticated
USING (
  public.is_org_member(organization_id)
);
```

Project creation:

```
CREATE POLICY projects_insert_manager
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_org_role(
    organization_id,
    ARRAY['owner', 'admin', 'creative_lead', 'project_manager']
  )
  AND created_by = (SELECT auth.uid())
);
```

Project update:

```
CREATE POLICY projects_update_manager
ON public.projects
FOR UPDATE
TO authenticated
USING (
  public.has_org_role(
    organization_id,
    ARRAY['owner', 'admin', 'creative_lead', 'project_manager']
  )
)
WITH CHECK (
  public.has_org_role(
    organization_id,
    ARRAY['owner', 'admin', 'creative_lead', 'project_manager']
  )
);
```

If project managers should only edit their assigned projects, extend the policy with an assignment check. A role-based policy should match the permissions defined in `PRD.md`.

### 9.8 Policy matrix

Use this as a starting point. The final permissions must match the approved product requirements.

| Resource       | Read                                           | Create                   | Update                                               | Delete                                  |
| -------------- | ---------------------------------------------- | ------------------------ | ---------------------------------------------------- | --------------------------------------- |
| Profiles       | Self and explicitly permitted colleagues       | Trusted onboarding       | Own permitted fields or admin                        | Controlled account lifecycle            |
| Organizations  | Active members                                 | Trusted onboarding       | Owner/admin                                          | Controlled archival or deletion         |
| Campuses       | Organization members                           | Admin                    | Admin                                                | Admin, subject to references            |
| Creative units | Organization members                           | Admin/creative lead      | Admin/creative lead                                  | Admin, subject to references            |
| Memberships    | Authorized organization members                | Admin/invitation flow    | Admin/invitation flow                                | Admin                                   |
| Ideas          | Organization members, subject to visibility    | Members                  | Author for drafts; authorized reviewers for workflow | Restricted                              |
| Projects       | Organization members                           | Managers/creative leads  | Authorized project roles                             | Restricted                              |
| Campaigns      | Organization members                           | Project roles            | Project roles                                        | Restricted                              |
| Tasks          | Organization members, subject to project scope | Project roles            | Authorized assignee/project roles                    | Restricted                              |
| Content        | Organization members, subject to scope         | Project roles            | Authorized content roles                             | Restricted                              |
| Versions       | Authorized content viewers                     | Trusted version creation | Immutable                                            | Restricted                              |
| Approvals      | Requester and authorized reviewers             | Authorized requester     | Assigned reviewer/workflow                           | Cancel by authorized requester or admin |
| Comments       | Users with target access                       | Authorized participants  | Author/moderator                                     | Author/moderator                        |
| Assets         | Authorized users                               | Authorized uploaders     | Uploader/asset manager                               | Restricted                              |
| Notifications  | Recipient                                      | Trusted event process    | Recipient can mark read                              | Controlled cleanup                      |
| Audit logs     | Authorized auditors/admins                     | Trusted writer           | No client updates                                    | No client deletes                       |

The table expresses intended behavior rather than granting access automatically. Every policy must be written and tested for the specific table.

### 9.9 Important RLS implementation notes

* Use `TO authenticated` for authenticated-user policies.
* Use `(SELECT auth.uid())` in policy expressions where appropriate to avoid unnecessary repeated evaluation.
* Index columns used in RLS predicates.
* Use restrictive `WITH CHECK` conditions for inserts and updates.
* Keep administrative operations on a trusted server or controlled database function.
* Test cross-organization access explicitly.
* Test anonymous access explicitly.
* Test suspended memberships and revoked roles.
* Do not assume a hidden UI control provides security.
* Do not use a client-supplied `user_id` as proof of the current user's identity.
* Remember that database owners and privileged service credentials can bypass ordinary RLS protections.

### 9.10 Service-role credentials

The Supabase service-role key bypasses RLS and must never be included in browser bundles, public environment variables, client-side configuration, or downloadable source files.

Use a server-only secret for trusted administrative tasks. Prefer user-scoped authenticated requests when normal RLS enforcement is appropriate.

---

## 10. Supabase Storage Security

Store uploaded files in private buckets by default.

Recommended initial bucket:

```
creative-assets
```

Suggested object layout:

```
{organization_id}/{asset_id}/{filename}
```

The database `assets` table records the bucket and object path.

Storage access must be enforced by `storage.objects` policies and, where necessary, server-side authorization checks. RLS on `public.assets` does not automatically secure Storage objects.

The application must verify:

1. The user is authenticated.
2. The user has active access to the organization.
3. The storage path belongs to the intended organization and asset.
4. The operation is allowed for the user's role.
5. The file size and MIME type meet the configured limits.

Use signed URLs for temporary downloads of private files when appropriate. Avoid permanent public URLs for confidential creative materials.

Do not trust the folder name alone as an authorization check. Validate the path against the relevant database record and authorized organization.

When deleting an asset, coordinate database and Storage cleanup carefully. PostgreSQL cannot automatically guarantee an atomic transaction across Supabase Storage and the database. Use a retryable server-side cleanup process and record failures for operational follow-up.

---

## 11. Indexing Strategy

Create indexes based on the actual queries used by dashboards, lists, calendars, notifications, and reports.

PostgreSQL automatically creates indexes for primary keys and unique constraints. Do not duplicate those indexes unnecessarily.

Recommended initial indexes:

```
CREATE INDEX idx_campuses_org
  ON public.campuses (organization_id);

CREATE INDEX idx_units_org_campus
  ON public.creative_units (organization_id, campus_id);

CREATE INDEX idx_org_memberships_user_status
  ON public.organization_memberships (user_id, status);

CREATE INDEX idx_unit_memberships_user_status
  ON public.unit_memberships (user_id, status);

CREATE INDEX idx_ideas_org_status_created
  ON public.ideas (organization_id, status, created_at DESC);

CREATE INDEX idx_ideas_submitter
  ON public.ideas (submitted_by, created_at DESC);

CREATE INDEX idx_projects_org_status_due
  ON public.projects (organization_id, status, due_date);

CREATE INDEX idx_projects_manager
  ON public.projects (project_manager_id, status);

CREATE INDEX idx_campaigns_org_dates
  ON public.campaigns (organization_id, start_date, end_date);

CREATE INDEX idx_tasks_org_status_due
  ON public.tasks (organization_id, status, due_date);

CREATE INDEX idx_tasks_assignee_status_due
  ON public.tasks (assigned_to, status, due_date);

CREATE INDEX idx_content_org_status_updated
  ON public.content_items (
    organization_id, status, updated_at DESC
  );

CREATE INDEX idx_content_project
  ON public.content_items (project_id, created_at DESC);

CREATE INDEX idx_content_campaign
  ON public.content_items (campaign_id);

CREATE INDEX idx_content_versions_item
  ON public.content_versions (
    content_item_id, version_number DESC
  );

CREATE INDEX idx_approvals_reviewer_status
  ON public.approval_requests (
    reviewer_id, status, created_at DESC
  );

CREATE INDEX idx_approvals_org_status
  ON public.approval_requests (
    organization_id, status, created_at DESC
  );

CREATE INDEX idx_comments_idea
  ON public.comments (idea_id, created_at);

CREATE INDEX idx_comments_project
  ON public.comments (project_id, created_at);

CREATE INDEX idx_comments_task
  ON public.comments (task_id, created_at);

CREATE INDEX idx_comments_content
  ON public.comments (content_item_id, created_at);

CREATE INDEX idx_assets_org_created
  ON public.assets (organization_id, created_at DESC);

CREATE INDEX idx_notifications_recipient_unread
  ON public.notifications (recipient_id, created_at DESC)
  WHERE read_at IS NULL;

CREATE INDEX idx_audit_logs_org_created
  ON public.audit_logs (organization_id, created_at DESC);

CREATE INDEX idx_audit_logs_resource
  ON public.audit_logs (resource_type, resource_id, created_at DESC);
```

These indexes are a starting point. Validate them against query plans and real usage before adding more.

PostgreSQL does not automatically create an index on the referencing side of every foreign key. Add indexes for foreign-key columns used frequently in joins, deletion checks, or access policies.

For full-text search, introduce a dedicated search vector or carefully designed indexes when search requirements are finalized. Avoid adding trigram or full-text extensions without a demonstrated need.

---

## 12. Audit and Activity Recording

Audit logs and user-facing activity feeds have different purposes.

**Audit logs** preserve important administrative and security events.

**Activity feeds** provide a user-friendly history of project and content changes.

For the initial release, audit records can support a subset of the activity feed, but avoid exposing internal security metadata to ordinary users.

Important operations should be recorded through trusted code paths. Examples include:

* Role assignments and removals.
* Approval decisions.
* Project completion or cancellation.
* Changes to organization settings.
* Asset deletion.
* Administrative account changes.

For stronger consistency, perform the business operation and audit insert in the same database transaction or database function. If an audit insert is mandatory, the business operation should fail when the audit record cannot be written.

Avoid using client-controlled triggers or client-provided metadata as the sole source of trustworthy actor identity. Derive the actor from the authenticated database context or a trusted server-side process.

---

## 13. Data Retention and Deletion

Use soft archival for business records that must remain available for organizational history.

Recommended practices:

* Archive completed projects rather than deleting them.
* Preserve approved content and its version history.
* Restrict deletion of records referenced by approvals or audit requirements.
* Remove organization memberships when access is revoked.
* Delete or anonymize user profile data according to a documented account-retention policy.
* Clean up orphaned Storage objects through a retryable process.
* Define a retention period for notifications and temporary records.
* Do not delete audit records merely because a user-facing resource is archived.

`ON DELETE CASCADE` should be used only where child records are genuinely dependent on their parent and can safely be removed. For important organizational records, prefer restricted deletion or an explicit archival process.

Before production deployment, document the consequences of deleting an organization, including assets, memberships, backups, and audit history.

---

## 14. Database Permissions and Operational Security

RLS controls which rows a user can access; SQL grants control which database operations a role may perform.

Both layers must be configured.

* Grant authenticated users only the table and function privileges they require.
* Grant anonymous users no access to private application data.
* Revoke unnecessary direct writes to sensitive tables.
* Restrict execution of privileged database functions.
* Use server-side functions for role changes, approval decisions, account provisioning, and other sensitive operations.
* Keep migration and database-owner credentials out of the application runtime.
* Review Supabase default grants and default privileges instead of assuming that enabling RLS is sufficient.
* Avoid placing privileged functions in an exposed schema unless they are deliberately designed and secured for that purpose.

A function with `SECURITY DEFINER` must have a fixed `search_path`, schema-qualified references, narrowly scoped privileges, and explicit authorization checks. Never accept a user-supplied actor ID as a substitute for authentication.

---

## 15. Validation and Integrity Rules

In addition to table constraints, implement the following rules through trusted server-side logic or database functions:

1. A campus and creative unit must belong to the same organization as the associated resource.
2. A campaign attached to a task or content item must belong to the same project when the project is specified.
3. Idea conversion must maintain a consistent relationship between the idea and its resulting project.
4. Only authorized reviewers may decide approval requests.
5. Approval decisions must update the request and target status consistently.
6. Only authorized roles may perform privileged status transitions.
7. Content versions must be created without duplicate or conflicting version numbers.
8. Storage paths must correspond to authorized asset records.
9. A notification must not disclose a resource that its recipient cannot access.
10. A user may not grant themselves organization ownership or administrative privileges.
11. Suspended organization or unit memberships must not retain normal access.
12. Audit records must not be directly editable by ordinary users.

Do not use database constraints alone for rules that depend on the current user's authorization or the previous status of a record.

---

## 16. Migration Plan

Keep migration files in source control. Use the Supabase CLI or another approved migration mechanism so that development, staging, and production environments share the same schema history.

Suggested migration sequence:

| Order | Example filename                            | Purpose                                               |
| ----- | ------------------------------------------- | ----------------------------------------------------- |
| 1     | `20261009000100_core_functions.sql`         | Common timestamp function and prerequisites           |
| 2     | `20261009000200_identity_organizations.sql` | Profiles, organizations, campuses, creative units     |
| 3     | `20261009000300_memberships.sql`            | Organization and unit memberships                     |
| 4     | `20261009000400_ideas_projects.sql`         | Ideas, projects, and conversion relationships         |
| 5     | `20261009000500_campaigns_tasks.sql`        | Campaigns and tasks                                   |
| 6     | `20261009000600_content.sql`                | Content items and content versions                    |
| 7     | `20261009000700_approvals_comments.sql`     | Approval requests and comments                        |
| 8     | `20261009000800_assets.sql`                 | Asset metadata and content attachments                |
| 9     | `20261009000900_notifications_audit.sql`    | Notifications and audit logs                          |
| 10    | `20261009001000_indexes.sql`                | Query and policy indexes                              |
| 11    | `20261009001100_rls_helpers.sql`            | Authorization helper functions                        |
| 12    | `20261009001200_rls_policies.sql`           | Table grants and RLS policies                         |
| 13    | `20261009001300_workflow_functions.sql`     | Approval, conversion, and status transition functions |
| 14    | `20261009001400_updated_at_triggers.sql`    | Timestamp triggers                                    |
| 15    | `20261009001500_storage_policies.sql`       | Private asset bucket and Storage policies             |

These filenames are examples for a new migration history. If the repository already contains migrations, continue its existing sequence rather than renaming or replacing applied migrations.

### 16.1 Migration rules

* Never edit a migration that has already been applied to a shared or production environment.
* Create a new migration for every subsequent schema change.
* Review generated SQL before deployment.
* Apply migrations to a development environment first.
* Test the migration against a clean database.
* Verify rollback or recovery procedures for destructive changes.
* Back up production data before high-risk migrations.
* Keep schema changes and corresponding application changes coordinated.

### 16.2 Supabase local workflow

Typical commands for a repository initialized with the Supabase CLI:

```
supabase init
supabase start
supabase migration new create_initial_schema
supabase db reset
supabase db lint
supabase db push
```

The exact available commands and flags depend on the installed CLI version and project configuration. Confirm the CLI version and project documentation before using them in automation.

Use local or staging credentials for development. Never commit `.env` files containing production secrets.

---

## 17. Testing Strategy

Database testing must include both structural integrity and authorization behavior.

### 17.1 Schema tests

* All primary keys and foreign keys exist.
* Unique constraints reject duplicate memberships.
* Cross-organization references are rejected.
* Invalid status values are rejected.
* Date ranges cannot end before they start.
* Negative budgets and file sizes are rejected.
* Approval requests cannot reference zero or multiple targets.
* Content version numbers remain unique.
* Required fields cannot be null.

### 17.2 RLS tests

Test using real authenticated user contexts or equivalent database test roles.

| Scenario                                                   | Expected result |
| ---------------------------------------------------------- | --------------- |
| User reads an organization they belong to                  | Allowed         |
| User reads an unrelated organization's private project     | Denied          |
| Suspended member attempts to access organization data      | Denied          |
| Viewer attempts a privileged project update                | Denied          |
| Member changes their own role to owner                     | Denied          |
| Unauthorized user attempts to decide an approval           | Denied          |
| User accesses another user's private notifications         | Denied          |
| Anonymous user reads private creative assets               | Denied          |
| User attempts to attach an asset from another organization | Denied          |
| Ordinary user attempts to edit audit records               | Denied          |

### 17.3 Workflow tests

* An idea can be converted into one project only.
* Invalid workflow transitions are rejected.
* An approval cannot be decided twice successfully.
* A review decision updates the appropriate resource.
* Content versions are created in a safe, consistent sequence.
* A task's campaign belongs to the same project.
* A content item's campaign belongs to the same project.
* Notifications are delivered only to intended recipients.

### 17.4 Performance tests

At the initial scale, optimize for correctness and predictable query behavior before introducing advanced infrastructure.

Measure:

* Dashboard query count and response time.
* Project and content list pagination.
* Calendar queries over date ranges.
* Unread notification retrieval.
* Search responsiveness.
* RLS query plans.
* Asset metadata queries.

Avoid loading an organization's complete content history into the browser. Use server-side pagination, filters, and bounded date queries.

---

## 18. Backup and Recovery

Configure backups according to the selected Supabase plan and the organization's recovery requirements.

Document:

* Backup frequency and retention.
* Recovery Point Objective (RPO).
* Recovery Time Objective (RTO).
* Restoration procedure.
* Database migration history.
* Storage file recovery requirements.
* Periodic restoration tests.

A PostgreSQL backup does not necessarily include the binary contents of Supabase Storage. Database and file-storage recovery must therefore be planned separately.

For migration to self-managed hosting, export and validate PostgreSQL data, migrate Storage objects, recreate access policies and authentication arrangements, and test the full application before changing production traffic.

---

## 19. Future Extensions

Add these only when supported by actual product requirements:

* `tags` and resource-tag join tables.
* `project_memberships` for project-specific access.
* Multi-stage `approval_steps`.
* `approval_step_decisions`.
* `activity_events` for a dedicated user-facing activity feed.
* `content_channels` for platform-specific publication metadata.
* `asset_versions` for explicit binary-file version tracking.
* `organization_settings` for configurable organization preferences.
* Full-text search and search-vector indexes.
* Integration event tables for external services.
* Reporting snapshots if live analytical queries become too expensive.

If project-specific access is introduced, update RLS policies across all related resources rather than treating project membership as a UI-only feature.

---

## 20. Definition of Done

The database implementation is ready for the initial production release when:

* All core tables and foreign keys are created through migrations.
* Organization ownership is consistently enforced.
* Membership and role checks are implemented.
* RLS is enabled and reviewed for every client-exposed table.
* Storage access is protected independently from database access.
* Approval and idea-conversion operations are transactional.
* Workflow transitions are validated.
* Appropriate indexes exist for the primary application queries.
* Sensitive operations produce the required audit records.
* Automated tests cover cross-organization isolation and privilege escalation.
* Backup and recovery procedures are documented and tested.
* Development, staging, and production schemas can be reproduced from version-controlled migrations.

## 21. Implementation Note

This document is the database design baseline for 6102 Creative System, not a claim that the entire schema is already deployed or production-verified.

Before the first production release, reconcile every role, workflow state, visibility rule, and deletion policy with `PRD.md` and `DESAIN.md`. Implement the migration sequence in a clean development environment, review the final SQL, and verify all RLS policies with representative user roles.

The resulting database should remain understandable, auditable, secure, and portable as the platform expands beyond its initial user base.
