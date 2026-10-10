# 6102 CREATIVE SYSTEM
## Product Requirements Document (PRD)

**Product:** 6102 Creative System  
**Product Type:** Internal Creative Collaboration & Media Management Web Application  
**Version:** 1.0  
**Status:** Foundation / Initial Product Definition  
**Primary Users:** ±20 users across multiple campuses  
**Initial Deployment:** Vercel  
**Initial Database:** Supabase PostgreSQL  
**Application Stack:** Next.js + TypeScript

---

# 1. PRODUCT OVERVIEW

6102 Creative System adalah web application internal untuk mendigitalisasi ekosistem kreatif 6102 yang terdiri dari banyak kampus, talent, divisi, project, content source, media, brand asset, dan aktivitas kolaborasi.

Aplikasi ini bukan sekadar content management system dan bukan sekadar project management tool.

Aplikasi harus menjadi **operational system** untuk:

- Creative Governance
- Creative Project Management
- Content Management
- Cross-Campus Collaboration
- Talent Pool
- Brand Governance
- Asset & Archive Management
- Approval
- Content Calendar
- Creative Analytics
- Documentation

Prinsip utama:

> Centralized Direction, Decentralized Creativity.

Centralized:
- Brand
- Official Media
- Major Campaign
- Governance
- Approval
- Quality Control
- Strategic Direction

Decentralized:
- Talent
- Ideas
- Production
- Story
- Campus Content
- Technical Execution
- Creative Collaboration

---

# 2. PRODUCT VISION

## Vision

Building One Integrated Creative Ecosystem for 6102.

Membangun ekosistem kreatif 6102 yang terintegrasi, kolaboratif, profesional, terdokumentasi, dan dapat diteruskan oleh generasi berikutnya.

## Core Formula

> ONE IDENTITY  
> ONE OFFICIAL MEDIA  
> MULTIPLE CAMPUSES  
> MULTIPLE TALENTS  
> ONE CREATIVE DIRECTION

---

# 3. PRODUCT GOALS

## 3.1 Primary Goals

1. Menghubungkan creative talent lintas kampus.
2. Mengelola seluruh creative project secara terstruktur.
3. Mengelola request content dan project.
4. Menjaga konsistensi brand 6102.
5. Mengelola satu official media system.
6. Membuat talent database yang dapat dicari.
7. Membuat content calendar terpusat.
8. Menyediakan approval workflow.
9. Menyediakan central asset library dan archive.
10. Menyimpan riwayat keputusan dan aktivitas.
11. Mengurangi ketergantungan pada WhatsApp sebagai pusat workflow.
12. Membentuk institutional memory untuk 6102.

## 3.2 Non-Goals

Pada versi awal aplikasi tidak perlu:

- menjadi social media scheduler penuh seperti platform SaaS komersial;
- otomatis memposting ke Instagram;
- menjadi video editor;
- menjadi graphic design editor;
- menjadi cloud storage video RAW skala besar;
- memiliki AI generator sebagai fitur utama;
- membuat public-facing website yang kompleks.

---

# 4. PRODUCT PRINCIPLES

## 4.1 One Identity

Semua public-facing 6102 harus mengikuti identitas yang telah disepakati.

## 4.2 Multiple Campuses

Setiap kampus tetap memiliki karakter dan kreativitas masing-masing.

## 4.3 Collaboration Over Ego

Talent dipilih berdasarkan kebutuhan project, bukan berdasarkan kampus.

## 4.4 Professional Workflow

Setiap project memiliki:
- tujuan
- brief
- PIC
- timeline
- workflow
- review
- approval
- archive

## 4.5 Transparency

Setiap user dapat memahami hal yang memang menjadi scope aksesnya:
- siapa PIC
- status project
- deadline
- assignment
- approval
- blocker

## 4.6 Responsible Publication

Public content harus melalui review sesuai levelnya.

## 4.7 Archive Everything Important

Final asset, source file penting, approval, dan keputusan strategis harus terdokumentasi.

## 4.8 Minimal Bureaucracy

Tidak semua hal membutuhkan Creative Council.

Technical work harus tetap cepat.

---

# 5. TARGET USERS

## 5.1 Super Admin

Mengelola:
- system settings
- users
- roles
- permissions
- campuses
- divisions
- system configuration

## 5.2 Creative Council

Fokus:
- strategic creative direction
- major brand
- major campaign
- major public communication
- major identity

Tidak mengelola detail teknis harian.

## 5.3 Creative Director / Creative Lead

Fokus:
- creative direction
- cross-division coordination
- creative quality
- strategic project execution
- technical escalation

## 5.4 Creative Management

Fokus:
- request intake
- brief
- project creation
- assignment
- timeline
- monitoring
- review
- approval coordination
- archive

## 5.5 Division Lead

Mengelola talent dan pekerjaan dalam division masing-masing.

Contoh:
- Graphic Design
- Copywriting
- Content
- Film
- Music
- Photography
- Videography
- Event

## 5.6 Campus Representative

Menjadi penghubung antara kampus dan Creative Management.

Tugas:
- submit content
- submit event
- mengirim source material
- memberi informasi kampus
- mengajukan talent
- menjadi contact person

## 5.7 Creative Member / Talent

Dapat:
- melihat assignment
- mengerjakan task
- mengunggah hasil
- memperbarui availability
- mengelola portfolio
- berkolaborasi lintas kampus

---

# 6. ACCESS MODEL

Permission tidak hanya berdasarkan role.

Gunakan:

> ROLE + PERMISSION + SCOPE

Contoh:

Campus Representative Campus A:
- dapat mengelola content Campus A;
- dapat membuat request;
- dapat melihat project yang melibatkan Campus A;
- tidak dapat mengubah brand guideline;
- tidak dapat approve major identity.

Creative Management:
- dapat melihat seluruh campus;
- dapat membuat project;
- dapat assign talent;
- dapat mengatur workflow.

Creative Council:
- memiliki akses strategic approval.

---

# 7. CORE MODULES

## 7.1 Dashboard

Dashboard harus menampilkan informasi yang relevan sesuai role.

### Global Metrics

- Active Projects
- Pending Requests
- Pending Approvals
- Upcoming Deadlines
- Upcoming Events
- Content Scheduled
- Recent Activity

### Personal Section

- My Tasks
- My Projects
- My Pending Actions
- Recent Updates

Dashboard bukan halaman dekoratif. Setiap metric harus dapat diklik menuju data terkait.

---

# 8. CAMPUS MANAGEMENT

## Data

- Campus Name
- Code
- Description
- Representative
- Contact
- Status
- Members
- Creative Talent Count
- Created At

## Campus Detail

Menampilkan:
- profile
- representative
- members
- talents
- active projects
- submitted content
- events
- activity

---

# 9. DIVISION MANAGEMENT

Default divisions:

1. Graphic Design
2. Copywriting
3. Content
4. Creative Management
5. Event Coordinator
6. Film Production
7. Music Production
8. Camera & Editorial

Division dapat dikembangkan tanpa mengubah architecture.

---

# 10. TALENT POOL

Talent Pool merupakan database seluruh creative talent 6102.

## Required Fields

- Name
- Campus
- Division
- Skills
- Skill Level
- Portfolio URL
- Availability
- Contact
- Experience
- Equipment
- Notes
- Status

## Skill Level

- Beginner
- Intermediate
- Advanced
- Specialist

## Search & Filter

Filter berdasarkan:
- campus
- division
- skill
- skill level
- availability
- equipment
- status

## Talent Profile

Harus memiliki:
- profile
- skill
- portfolio
- experience
- equipment
- availability
- project history

---

# 11. CREATIVE REQUEST SYSTEM

Semua kebutuhan kreatif dapat masuk melalui request.

## Request Fields

- Request Number
- Request Type
- Campus
- Requester
- Event / Project
- Purpose
- Content Needed
- Platform
- Deadline
- Priority
- Reference
- Additional Notes
- Attachment
- Status

## Request Types

- Content
- Design
- Photography
- Videography
- Film
- Copywriting
- Event Coverage
- Brand
- Campaign
- Other

## Request Workflow

REQUESTED
→ REVIEWING
→ ACCEPTED / REJECTED
→ BRIEFING
→ PROJECT CREATED

Request yang diterima dapat berubah menjadi project.

---

# 12. PROJECT MANAGEMENT

Project adalah unit kerja utama.

## Project Fields

- Project Number
- Project Name
- Project Type
- Campus Scope
- Project Lead
- Creative Lead
- Priority
- Start Date
- Deadline
- Status
- Description
- Objective
- Brief
- Reference
- Budget / Cost jika diperlukan
- Related Event
- Related Content

## Project Type

### LOCAL PROJECT

Project khusus kampus.

### 6102 PROJECT

Project yang membawa identitas 6102 secara keseluruhan.

## Project Status

- Planning
- Briefing
- Concept
- Production
- Review
- Revision
- Approval
- Scheduled
- Completed
- Archived
- Cancelled

---

# 13. PROJECT TEAM

Tidak semua project membutuhkan struktur yang sama.

Available roles:

- Project Lead
- Creative Lead
- Designer
- Copywriter
- Photographer
- Videographer
- Editor
- Producer
- Content
- QC
- Other

User dapat memiliki lebih dari satu assignment.

---

# 14. TASK MANAGEMENT

Setiap project dapat memiliki task.

## Task Fields

- Task
- Project
- Assignee
- Priority
- Due Date
- Status
- Description
- Dependencies
- Attachment
- Comment

## Task Status

- Todo
- In Progress
- Review
- Revision
- Done
- Blocked

---

# 15. CONTENT MANAGEMENT

Content memiliki lifecycle tersendiri.

## Content Flow

IDEA
↓
BRIEF
↓
CONTENT PLAN
↓
ASSIGNMENT
↓
PRODUCTION
↓
EDITING
↓
COPYWRITING
↓
QC
↓
APPROVAL
↓
SCHEDULE
↓
PUBLISH
↓
ARCHIVE
↓
ANALYSIS

## Content Data

- Title
- Campus
- Content Tier
- Format
- Platform
- Project
- Creator
- Caption
- Script
- Deadline
- Publish Date
- Status
- Asset
- Approval
- Performance Data

---

# 16. CONTENT TIERS

## Tier 01 — Official

Major:
- announcement
- campaign
- event
- brand
- achievement

## Tier 02 — Campus Story

- activity
- achievement
- campus life
- project
- local story

## Tier 03 — Daily

- BTS
- candid
- atmosphere
- daily moment

## Tier 04 — Archive

- raw footage
- raw photo
- unused design
- interview
- historical documentation

---

# 17. REPRESENTATION BALANCE

Aplikasi tidak menggunakan hard quota seperti:

> setiap campus harus mendapatkan 3 posting.

Dashboard dapat menyediakan representation overview untuk membantu management melihat apakah ada kampus yang terlalu lama tidak mendapatkan representasi.

Kualitas tetap menjadi prioritas.

---

# 18. CONTENT CALENDAR

Calendar harus memiliki:
- Month view
- Week view
- List view
- Filter
- Search

Fields:
- Date
- Content
- Campus
- Format
- PIC
- Status
- Platform
- Priority

Status:
- Requested
- Briefing
- Concept
- Production
- Review
- Revision
- Approved
- Scheduled
- Published
- Archived

---

# 19. BRAND CENTER

Brand Center menjadi sumber resmi seluruh brand asset.

## Sections

- Brand Philosophy
- Logo
- Color
- Typography
- Graphic Language
- Photography Direction
- Motion Language
- Social Media System
- Brand Guideline

## Asset Metadata

- Asset Name
- Type
- Version
- Status
- Owner
- Usage Scope
- File
- Notes

Major brand asset tidak boleh diganti tanpa approval sesuai governance.

---

# 20. ASSET LIBRARY

Asset Library harus mendukung:
- design
- photo
- video
- music
- document
- brand asset
- archive

## Asset Metadata

- File Name
- Project
- Creator
- Campus
- Division
- Asset Type
- Copyright Status
- Usage Permission
- Usage Scope
- Source
- Version
- Tags
- Storage Link
- Created At

## Storage Principle

Database menyimpan metadata dan storage reference.

File besar tidak harus disimpan langsung di database.

Untuk RAW video/photo, gunakan external/object storage yang sesuai.

---

# 21. COPYRIGHT & ASSET POLICY

Setiap asset penting harus mencatat:

- Creator
- Owner
- Source
- Usage Permission
- Copyright Status
- Usage Scope

Asset dari internet tidak otomatis dianggap bebas digunakan.

Asset AI juga harus ditandai bila relevan.

---

# 22. AI POLICY

AI boleh digunakan sebagai:
- brainstorming
- ideation
- reference
- moodboard
- concept exploration
- research assistance

Public asset tetap wajib melalui human review.

Review memperhatikan:
- copyright
- factual accuracy
- originality
- misleading content
- brand consistency

Aplikasi tidak menjadikan AI sebagai pusat workflow.

---

# 23. APPROVAL SYSTEM

Approval mengikuti level keputusan.

## LOW

Local / internal content.

Approval:
- Project PIC / Campus Team

## MEDIUM

Public content.

Approval:
- Creative Management / Creative Lead

## HIGH

Major identity.

Approval:
- Creative Council / Musyawarah

## Approval Actions

- Approve
- Request Revision
- Reject

Setiap approval menyimpan:
- approver
- timestamp
- decision
- comment
- version

---

# 24. QUALITY CONTROL

## Visual QC

- logo
- typography
- color
- layout
- resolution
- alignment
- brand consistency

## Content QC

- name
- date
- place
- information
- spelling
- caption
- context

## Brand QC

- identity
- purpose
- public suitability
- 6102 representation

QC harus dapat dicatat sebagai checklist.

---

# 25. CROSS-CAMPUS COLLABORATION

Flow:

CAMPUS A
↓
REQUEST
↓
CREATIVE MANAGEMENT
↓
TALENT SEARCH
↓
CAMPUS B / CREATOR
↓
CONFIRMATION
↓
ASSIGNMENT
↓
PRODUCTION
↓
DELIVERY
↓
ARCHIVE

Talent tidak dianggap eksklusif milik kampusnya untuk project 6102.

---

# 26. EVENT MANAGEMENT

Event dapat menjadi parent context untuk:
- requests
- projects
- content
- coverage
- assets

## Before Event

- announcement
- poster
- teaser
- countdown
- registration information

## During Event

- photography
- videography
- live report
- story
- interview
- candid
- BTS

## After Event

- recap
- reels
- gallery
- highlight
- aftermovie
- testimonial
- archive

---

# 27. OFFICIAL MEDIA GOVERNANCE

Official 6102 Media adalah public face.

Semua official content harus memiliki:
- source
- creator
- content tier
- QC
- approval level
- publish date
- archive

Official media tidak harus dapat mem-posting otomatis pada MVP.

Aplikasi menjadi pusat planning, preparation, approval, scheduling record, dan archive.

---

# 28. NOTIFICATION SYSTEM

MVP:
- in-app notifications
- notification badge
- activity feed

Trigger:
- assignment
- mention
- approval request
- revision request
- deadline
- project update
- request status change

Email/WhatsApp integration dapat ditambahkan kemudian.

---

# 29. ACTIVITY LOG

Semua aktivitas penting dicatat.

Contoh:
- project created
- task assigned
- asset uploaded
- revision requested
- approval submitted
- approval granted
- content published
- user role changed

Activity log bersifat append-only untuk audit.

---

# 30. DATABASE INITIAL MODEL

Core entities:

- users
- profiles
- roles
- permissions
- role_permissions
- campuses
- campus_members
- divisions
- skills
- talents
- talent_skills
- talent_availability
- projects
- project_members
- tasks
- creative_requests
- events
- contents
- content_assets
- content_calendar
- approvals
- approval_actions
- brand_assets
- assets
- asset_versions
- comments
- notifications
- activity_logs
- system_settings

Relasi harus menggunakan foreign key yang jelas.

Jangan membuat satu tabel besar yang mencampur seluruh domain.

---

# 31. DATABASE DESIGN PRINCIPLES

1. PostgreSQL relational model.
2. UUID sebagai primary key untuk entity utama.
3. Foreign key untuk relational integrity.
4. created_at / updated_at pada entity yang relevan.
5. soft delete hanya jika memang dibutuhkan.
6. status menggunakan controlled values.
7. audit log untuk perubahan penting.
8. file disimpan sebagai reference, bukan blob database.
9. RLS Supabase diterapkan berdasarkan role dan campus scope.
10. Jangan menanam business logic penting hanya di frontend.

---

# 32. SECURITY

Minimum:
- Supabase Auth
- Row Level Security
- secure server-side validation
- role-based authorization
- permission checks
- input validation
- upload validation
- protected routes
- audit log

Tidak boleh mengandalkan:

> hidden button = security.

Permission harus diverifikasi server-side.

---

# 33. PERFORMANCE

Karena user hanya ±20 orang, fokus performance bukan pada massive scale tetapi pada UX.

Target:
- fast initial dashboard
- server-side data loading
- pagination untuk data panjang
- indexed database queries
- lazy loading untuk asset preview
- optimized image thumbnails
- avoid loading entire archive
- optimistic UI hanya pada action yang aman
- debounce search
- filter server-side

Jangan membuat dashboard mengambil seluruh database sekaligus.

---

# 34. FILE STORAGE ARCHITECTURE

Recommended:

```text
Application
    |
    +-- Supabase Database
    |      |
    |      +-- metadata
    |      +-- relations
    |      +-- permissions
    |
    +-- Storage
           |
           +-- documents
           +-- design
           +-- photo
           +-- video
           +-- music
           +-- archive
```

Pada tahap awal dapat menggunakan Supabase Storage atau external storage.

Architecture harus memungkinkan storage provider diganti tanpa mengubah domain model.

---

# 35. INITIAL FILE STRUCTURE

```text
6102-CREATIVE/
├── 01_BRAND/
├── 02_DESIGN/
├── 03_CONTENT/
├── 04_PHOTOGRAPHY/
├── 05_VIDEO/
├── 06_MUSIC/
├── 07_EVENT/
└── 08_ARCHIVE/
```

Project:

```text
PROJECT/
├── 01_BRIEF/
├── 02_REFERENCE/
├── 03_WORKING/
├── 04_REVIEW/
├── 05_FINAL/
└── 06_ARCHIVE/
```

---

# 36. APPLICATION NAVIGATION

Primary navigation:

- Dashboard
- Requests
- Projects
- Tasks
- Content
- Calendar
- Talent
- Campuses
- Events
- Brand
- Assets
- Approvals
- Activity
- Settings

Menu harus berubah berdasarkan permission.

---

# 37. WORKFLOW MASTER

## 37.1 REQUEST WORKFLOW

User
→ Create Request
→ Submit
→ Creative Management Review
→ Accept / Reject
→ Briefing
→ Project Created
→ Team Assigned

## 37.2 PROJECT WORKFLOW

Need
→ Request
→ Brief
→ Team
→ Concept
→ Production
→ Review
→ Revision
→ Approval
→ Deliver / Publish
→ Archive
→ Evaluation

## 37.3 CONTENT WORKFLOW

Source
→ Submission
→ Curation
→ Production
→ Copy
→ QC
→ Approval
→ Schedule
→ Publish
→ Archive
→ Analysis

## 37.4 BRAND WORKFLOW

Request
→ Brief
→ Research
→ Brand Strategy
→ Concept
→ Exploration
→ Internal Review
→ Council
→ Musyawarah
→ Revision
→ Final Presentation
→ Approval
→ Guideline
→ Release
→ Implementation

## 37.5 CROSS-CAMPUS WORKFLOW

Need
→ Request
→ Talent Search
→ Candidate
→ Confirmation
→ Assignment
→ Production
→ Delivery
→ Archive

---

# 38. DECISION LEVEL

## Level 01 — Campus

Local decision.

## Level 02 — Creative Team

Technical decision.

## Level 03 — Creative Council

Strategic decision.

Application harus membantu mengarahkan request ke approval level yang benar.

---

# 39. PROJECT CLASSIFICATION

### Local Project

Dikelola lokal.

### 6102 Project

Masuk central management.

Project type wajib ditentukan saat dibuat.

---

# 40. REPORTING

MVP:
- project overview
- content overview
- talent overview
- campus representation
- approval activity
- project completion

Future:
- social media performance
- content performance
- division productivity
- collaboration metrics
- campaign analysis

---

# 41. ANALYTICS

Analytics bukan sekadar angka.

Contoh:
- jumlah project per campus
- active project
- completed project
- request volume
- average completion time
- content production volume
- talent utilization
- cross-campus collaboration
- representation trend

---

# 42. AUDIT & DOCUMENTATION

Important decisions harus dapat disimpan.

Contoh:
- Council decision
- Brand decision
- major approval
- policy update

Dokumentasi menjadi institutional memory.

---

# 43. MVP SCOPE

Prioritas MVP:

### Phase 1

- Authentication
- User management
- Roles & permissions
- Campus
- Division
- Dashboard

### Phase 2

- Creative Request
- Project
- Task
- Project team
- Comments

### Phase 3

- Talent Pool
- Content
- Content Calendar
- Approval

### Phase 4

- Brand Center
- Asset Library
- Activity Log
- Archive

### Phase 5

- Analytics
- advanced notifications
- advanced reporting

---

# 44. FUTURE FEATURES

Potential:
- Google Drive integration
- Instagram API integration
- WhatsApp notification
- email notification
- advanced calendar
- campaign management
- media performance dashboard
- automated archive
- public portfolio
- AI-assisted metadata/search
- asset tagging
- version comparison

Future features tidak boleh mengganggu core architecture.

---

# 45. DEPLOYMENT

Initial:

```text
GitHub
   ↓
Vercel
   ↓
Next.js
   ↓
Supabase
```

Environment variables:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

Service role key hanya server-side.

---

# 46. MIGRATION-FRIENDLY ARCHITECTURE

Aplikasi harus menghindari ketergantungan yang tidak perlu terhadap Vercel.

Domain logic:
- project
- content
- talent
- approval
- permission
- archive

harus berada pada application/database layer.

Dengan demikian deployment dapat dipindahkan ke:
- VPS
- dedicated server
- institutional server
- self-hosted infrastructure

tanpa rewrite total.

---

# 47. UX REQUIREMENTS

- responsive desktop/mobile
- keyboard-friendly untuk dashboard
- clear hierarchy
- low cognitive load
- predictable navigation
- fast feedback
- clear status
- clear empty state
- clear error state
- accessible contrast
- no unnecessary animation

---

# 48. ANTI AI-SLOP REQUIREMENTS

DILARANG:

- gradient berlebihan
- glassmorphism sebagai default
- neon color
- oversized rounded cards
- dashboard penuh card dekoratif
- emoji sebagai icon
- random icon dalam setiap heading
- excessive shadows
- excessive blur
- meaningless decorative shapes
- fake statistics
- unnecessary AI-style copy
- excessive animation
- every section placed inside a card

WAJIB:

- professional
- restrained
- functional
- information-dense where appropriate
- clear spacing
- strong typography
- consistent components
- purposeful visual hierarchy

---

# 49. ACCEPTANCE CRITERIA

MVP dianggap siap apabila:

1. User dapat login.
2. Admin dapat membuat campus.
3. Admin dapat mengatur role.
4. Campus Representative dapat membuat request.
5. Management dapat menerima request.
6. Request dapat menjadi project.
7. Project dapat memiliki team.
8. Project dapat memiliki task.
9. Talent dapat dicari.
10. Content dapat dibuat.
11. Content dapat masuk calendar.
12. Approval dapat dilakukan.
13. Brand asset dapat dikelola.
14. Asset dapat diarsipkan.
15. Activity dapat ditelusuri.
16. RLS membatasi data sesuai scope.
17. Mobile dan desktop usable.
18. Tidak ada permission penting yang hanya dilakukan di frontend.

---

# 50. SUCCESS METRICS

Setelah sistem berjalan:

- seluruh creative request masuk melalui system;
- seluruh major project memiliki PIC;
- talent database mulai terisi;
- content calendar menjadi single source of truth;
- major brand decision terdokumentasi;
- final asset dapat ditemukan kembali;
- cross-campus collaboration dapat dilacak;
- ketergantungan pada chat sebagai project tracker berkurang.

---

# 51. IMPLEMENTATION ROADMAP

## Phase 01 — FOUNDATION

- repository
- Next.js
- Supabase
- Auth
- database foundation
- role system
- campus
- division

## Phase 02 — OPERATIONS

- request
- project
- task
- assignment
- dashboard

## Phase 03 — CREATIVE NETWORK

- talent
- skills
- portfolio
- availability
- cross-campus collaboration

## Phase 04 — MEDIA

- content
- content calendar
- approval
- publication workflow

## Phase 05 — BRAND & ASSET

- brand center
- asset library
- versioning
- archive
- copyright metadata

## Phase 06 — ANALYTICS

- reporting
- representation
- productivity
- campaign analysis

---

# 52. FINAL PRODUCT PRINCIPLE

6102 Creative System bukan aplikasi untuk mengontrol kreativitas.

Aplikasi ini dibuat untuk:

> connect the people, organize the work, protect the identity, document the process, and preserve the legacy.

Sistem harus membuat kreativitas menjadi lebih mudah dikolaborasikan, bukan lebih birokratis.

**Different Campuses. Different Talents. Different Stories.**

**One Identity. One Direction. One Creative Ecosystem.**

**6102 CREATIVE.**
