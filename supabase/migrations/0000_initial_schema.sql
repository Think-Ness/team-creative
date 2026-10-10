-- ==============================================================================
-- 6102 CREATIVE SYSTEM — COMPLETE SUPABASE DATABASE SCHEMA
-- Migration: 0000_initial_schema.sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CORE UTILITY FUNCTIONS
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ==============================================================================
-- 3. CORE TABLES (18 TABLES)
-- ==============================================================================

-- Table: public.profiles
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

-- Table: public.organizations
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

-- Table: public.campuses
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

-- Table: public.creative_units
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

-- Table: public.organization_memberships
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

-- Table: public.unit_memberships
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

-- Table: public.ideas
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

-- Table: public.projects
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

-- Foreign key: ideas.converted_project_id -> projects.id
ALTER TABLE public.ideas
ADD CONSTRAINT ideas_converted_project_fk
FOREIGN KEY (organization_id, converted_project_id)
REFERENCES public.projects(organization_id, id)
ON DELETE RESTRICT;

-- Table: public.campaigns
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

-- Table: public.tasks
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

-- Table: public.content_items
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

-- Table: public.content_versions
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

-- Table: public.approval_requests
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

-- Table: public.comments
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

-- Table: public.assets
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

-- Table: public.content_assets
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

-- Table: public.notifications
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

-- Table: public.audit_logs
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

-- ==============================================================================
-- 4. UPDATED_AT TRIGGERS
-- ==============================================================================

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_organizations_updated_at ON public.organizations;
CREATE TRIGGER trg_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_campuses_updated_at ON public.campuses;
CREATE TRIGGER trg_campuses_updated_at
BEFORE UPDATE ON public.campuses
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_creative_units_updated_at ON public.creative_units;
CREATE TRIGGER trg_creative_units_updated_at
BEFORE UPDATE ON public.creative_units
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_organization_memberships_updated_at ON public.organization_memberships;
CREATE TRIGGER trg_organization_memberships_updated_at
BEFORE UPDATE ON public.organization_memberships
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_unit_memberships_updated_at ON public.unit_memberships;
CREATE TRIGGER trg_unit_memberships_updated_at
BEFORE UPDATE ON public.unit_memberships
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_ideas_updated_at ON public.ideas;
CREATE TRIGGER trg_ideas_updated_at
BEFORE UPDATE ON public.ideas
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_campaigns_updated_at ON public.campaigns;
CREATE TRIGGER trg_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_tasks_updated_at ON public.tasks;
CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_content_items_updated_at ON public.content_items;
CREATE TRIGGER trg_content_items_updated_at
BEFORE UPDATE ON public.content_items
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_approval_requests_updated_at ON public.approval_requests;
CREATE TRIGGER trg_approval_requests_updated_at
BEFORE UPDATE ON public.approval_requests
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_comments_updated_at ON public.comments;
CREATE TRIGGER trg_comments_updated_at
BEFORE UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_assets_updated_at ON public.assets;
CREATE TRIGGER trg_assets_updated_at
BEFORE UPDATE ON public.assets
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ==============================================================================
-- 5. INDEXES (25 INDEXES)
-- ==============================================================================

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

-- ==============================================================================
-- 6. SUPABASE AUTH USER TRIGGER (AUTO-SYNC PROFILES)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_path, job_title)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1),
      'Creative User'
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    'Team Member'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) HELPER FUNCTIONS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.is_org_member(p_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_memberships m
    WHERE m.organization_id = p_organization_id
      AND m.user_id = (SELECT auth.uid())
      AND m.status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_org_role(
  p_organization_id uuid,
  p_allowed_roles text[]
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
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

-- ==============================================================================
-- 8. ENABLE ROW LEVEL SECURITY
-- ==============================================================================

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

-- ==============================================================================
-- 9. ROW LEVEL SECURITY POLICIES
-- ==============================================================================

-- Profiles: Authenticated users can view active profiles; users can update their own
CREATE POLICY "profiles_select_authenticated"
  ON public.profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "profiles_insert_self"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "profiles_update_self"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

-- Organizations:
CREATE POLICY "organizations_select_member"
  ON public.organizations FOR SELECT TO authenticated
  USING (public.is_org_member(id) OR created_by = (SELECT auth.uid()));

CREATE POLICY "organizations_insert_authenticated"
  ON public.organizations FOR INSERT TO authenticated
  WITH CHECK (created_by = (SELECT auth.uid()));

CREATE POLICY "organizations_update_admin"
  ON public.organizations FOR UPDATE TO authenticated
  USING (public.has_org_role(id, ARRAY['owner', 'admin']))
  WITH CHECK (public.has_org_role(id, ARRAY['owner', 'admin']));

-- Organization Memberships:
CREATE POLICY "org_memberships_select"
  ON public.organization_memberships FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id) OR user_id = (SELECT auth.uid()));

CREATE POLICY "org_memberships_insert"
  ON public.organization_memberships FOR INSERT TO authenticated
  WITH CHECK (
    public.has_org_role(organization_id, ARRAY['owner', 'admin'])
    OR (user_id = (SELECT auth.uid()) AND role = 'owner')
  );

CREATE POLICY "org_memberships_update"
  ON public.organization_memberships FOR UPDATE TO authenticated
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin']))
  WITH CHECK (public.has_org_role(organization_id, ARRAY['owner', 'admin']));

CREATE POLICY "org_memberships_delete"
  ON public.organization_memberships FOR DELETE TO authenticated
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin']));

-- Campuses:
CREATE POLICY "campuses_select"
  ON public.campuses FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "campuses_manage"
  ON public.campuses FOR ALL TO authenticated
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin']))
  WITH CHECK (public.has_org_role(organization_id, ARRAY['owner', 'admin']));

-- Creative Units:
CREATE POLICY "units_select"
  ON public.creative_units FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "units_manage"
  ON public.creative_units FOR ALL TO authenticated
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin']))
  WITH CHECK (public.has_org_role(organization_id, ARRAY['owner', 'admin']));

-- Unit Memberships:
CREATE POLICY "unit_memberships_select"
  ON public.unit_memberships FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "unit_memberships_manage"
  ON public.unit_memberships FOR ALL TO authenticated
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'creative_lead']))
  WITH CHECK (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'creative_lead']));

-- Ideas:
CREATE POLICY "ideas_select_member"
  ON public.ideas FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "ideas_insert_member"
  ON public.ideas FOR INSERT TO authenticated
  WITH CHECK (public.is_org_member(organization_id) AND submitted_by = (SELECT auth.uid()));

CREATE POLICY "ideas_update_member"
  ON public.ideas FOR UPDATE TO authenticated
  USING (
    public.is_org_member(organization_id)
    AND (
      submitted_by = (SELECT auth.uid())
      OR public.has_org_role(organization_id, ARRAY['owner', 'admin', 'creative_lead', 'project_manager'])
    )
  );

CREATE POLICY "ideas_delete_admin"
  ON public.ideas FOR DELETE TO authenticated
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin']));

-- Projects:
CREATE POLICY "projects_select_member"
  ON public.projects FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "projects_insert_manager"
  ON public.projects FOR INSERT TO authenticated
  WITH CHECK (
    public.has_org_role(organization_id, ARRAY['owner', 'admin', 'creative_lead', 'project_manager'])
    AND created_by = (SELECT auth.uid())
  );

CREATE POLICY "projects_update_manager"
  ON public.projects FOR UPDATE TO authenticated
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'creative_lead', 'project_manager']))
  WITH CHECK (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'creative_lead', 'project_manager']));

-- Campaigns:
CREATE POLICY "campaigns_select_member"
  ON public.campaigns FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "campaigns_manage_manager"
  ON public.campaigns FOR ALL TO authenticated
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'creative_lead', 'project_manager']))
  WITH CHECK (public.has_org_role(organization_id, ARRAY['owner', 'admin', 'creative_lead', 'project_manager']));

-- Tasks:
CREATE POLICY "tasks_select_member"
  ON public.tasks FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "tasks_manage_member"
  ON public.tasks FOR ALL TO authenticated
  USING (public.is_org_member(organization_id))
  WITH CHECK (public.is_org_member(organization_id));

-- Content Items:
CREATE POLICY "content_items_select_member"
  ON public.content_items FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "content_items_manage_member"
  ON public.content_items FOR ALL TO authenticated
  USING (public.is_org_member(organization_id))
  WITH CHECK (public.is_org_member(organization_id));

-- Content Versions:
CREATE POLICY "content_versions_select"
  ON public.content_versions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "content_versions_insert"
  ON public.content_versions FOR INSERT TO authenticated
  WITH CHECK (created_by = (SELECT auth.uid()));

-- Approval Requests:
CREATE POLICY "approvals_select_member"
  ON public.approval_requests FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "approvals_manage_member"
  ON public.approval_requests FOR ALL TO authenticated
  USING (public.is_org_member(organization_id))
  WITH CHECK (public.is_org_member(organization_id));

-- Comments:
CREATE POLICY "comments_select_member"
  ON public.comments FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "comments_insert_member"
  ON public.comments FOR INSERT TO authenticated
  WITH CHECK (public.is_org_member(organization_id) AND author_id = (SELECT auth.uid()));

CREATE POLICY "comments_update_author"
  ON public.comments FOR UPDATE TO authenticated
  USING (author_id = (SELECT auth.uid()))
  WITH CHECK (author_id = (SELECT auth.uid()));

CREATE POLICY "comments_delete_author_admin"
  ON public.comments FOR DELETE TO authenticated
  USING (author_id = (SELECT auth.uid()) OR public.has_org_role(organization_id, ARRAY['owner', 'admin']));

-- Assets:
CREATE POLICY "assets_select_member"
  ON public.assets FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "assets_manage_member"
  ON public.assets FOR ALL TO authenticated
  USING (public.is_org_member(organization_id))
  WITH CHECK (public.is_org_member(organization_id));

-- Content Assets:
CREATE POLICY "content_assets_select"
  ON public.content_assets FOR SELECT TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "content_assets_manage"
  ON public.content_assets FOR ALL TO authenticated
  USING (public.is_org_member(organization_id))
  WITH CHECK (public.is_org_member(organization_id));

-- Notifications:
CREATE POLICY "notifications_select_recipient"
  ON public.notifications FOR SELECT TO authenticated
  USING (recipient_id = (SELECT auth.uid()));

CREATE POLICY "notifications_update_recipient"
  ON public.notifications FOR UPDATE TO authenticated
  USING (recipient_id = (SELECT auth.uid()))
  WITH CHECK (recipient_id = (SELECT auth.uid()));

-- Audit Logs:
CREATE POLICY "audit_logs_select_admin"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_org_role(organization_id, ARRAY['owner', 'admin']));

CREATE POLICY "audit_logs_insert_authenticated"
  ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (true);
