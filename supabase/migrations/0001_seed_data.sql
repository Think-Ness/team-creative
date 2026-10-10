-- ==============================================================================
-- 6102 CREATIVE SYSTEM — MIGRATION 0001: SEED DUMMY DATA
-- ==============================================================================

-- 1. SEED AUTH USERS (Mock users for testing in Supabase)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
VALUES 
  ('d0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ahmad@6102creative.com', crypt('Creative123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Ahmad Fauzi"}', now(), now()),
  ('d0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'siti@6102creative.com', crypt('Creative123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Siti Sarah"}', now(), now()),
  ('d0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'budi@6102creative.com', crypt('Creative123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Budi Wicaksono"}', now(), now()),
  ('d0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'reza@6102creative.com', crypt('Creative123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Reza Pratama"}', now(), now()),
  ('d0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dewi@6102creative.com', crypt('Creative123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dewi Lestari"}', now(), now())
ON CONFLICT (id) DO NOTHING;

-- 2. SEED PROFILES
INSERT INTO public.profiles (id, display_name, avatar_path, job_title, is_active)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Ahmad Fauzi', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Head of Creative', true),
  ('d0000000-0000-0000-0000-000000000002', 'Siti Sarah', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'Creative Producer & PM', true),
  ('d0000000-0000-0000-0000-000000000003', 'Budi Wicaksono', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Senior Visual Designer', true),
  ('d0000000-0000-0000-0000-000000000004', 'Reza Pratama', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Motion & Video Director', true),
  ('d0000000-0000-0000-0000-000000000005', 'Dewi Lestari', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Content & Copy Strategist', true)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  avatar_path = EXCLUDED.avatar_path,
  job_title = EXCLUDED.job_title;

-- 3. SEED ORGANIZATION
INSERT INTO public.organizations (id, name, slug, description, logo_path, created_by)
VALUES (
  'e0000000-0000-0000-0000-000000000001',
  '6102 Creative Network',
  'creative-network',
  'Sistem Kolaborasi dan Tata Kelola Aset Kreatif Multi-Kampus',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
  'd0000000-0000-0000-0000-000000000001'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug;

-- 4. SEED CAMPUSES
INSERT INTO public.campuses (id, organization_id, name, code, description)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Kampus Utama Jakarta', 'JKT-01', 'Pusat operasional dan studio siaran kreatif'),
  ('c0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'Kampus Bandung Creative Hub', 'BDG-01', 'Pusat riset desain visual dan laboratorium media'),
  ('c0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'Kampus Surabaya Studio', 'SBY-01', 'Unit produksi multimedia & sound engineering'),
  ('c0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', 'Kampus Yogyakarta Art Space', 'JOG-01', 'Kolektif ilustrasi dan pameran seni')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED CREATIVE UNITS
INSERT INTO public.creative_units (id, organization_id, campus_id, name, code, description)
VALUES
  ('u0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Brand & Visual Identity', 'BVI-JKT', 'Tata kelola brand guidelines & master template'),
  ('u0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Motion Graphics & 3D Lab', 'M3D-BDG', 'Eksplorasi visual kinetik & pemodelan 3D'),
  ('u0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Digital Publishing & Copy', 'DPC-JKT', 'Produksi editorial media sosial dan artikel'),
  ('u0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Video & Audio Production', 'VAP-SBY', 'Dokumentasi sinematik dan podcast')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED ORGANIZATION MEMBERSHIPS
INSERT INTO public.organization_memberships (organization_id, user_id, role, status)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'owner', 'active'),
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'project_manager', 'active'),
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', 'creative_lead', 'active'),
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000004', 'member', 'active'),
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000005', 'member', 'active')
ON CONFLICT (organization_id, user_id) DO UPDATE SET
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- 7. SEED IDEAS / REQUESTS
INSERT INTO public.ideas (id, organization_id, title, description, target_audience, estimated_budget, priority, status, submitted_by)
VALUES
  ('i0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Revamp Visual Identity 6102 (2026 Edition)', 'Pembaruan panduan warna, tipografi, dan aset digital terpadu untuk semua kampus.', 'Seluruh sivitas akademika & mitra eksternal', 15000000, 'high', 'accepted', 'd0000000-0000-0000-0000-000000000001'),
  ('i0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'Mini Seri Podcast: Behind the Canvas', 'Podcast audio visual 6 episode mewawancarai talenta dan mahasiswa kreatif lintas kampus.', 'Mahasiswa & Gen Z Kreatif', 7500000, 'medium', 'under_review', 'd0000000-0000-0000-0000-000000000005'),
  ('i0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'Motion Graphics Ramadhan 1448H', 'Paket animasi ucapan, bumper video, dan lower-thirds bernuansa islami kontemporer.', 'Komunitas & Publik Media Sosial', 5000000, 'urgent', 'accepted', 'd0000000-0000-0000-0000-000000000002'),
  ('i0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', 'Virtual 3D Interactive Campus Showcase', 'Aplikasi web 3D eksplorasi fasilitas kampus karya unit kreatif Bandung & Surabaya.', 'Calon Mahasiswa Baru & Pengunjung Web', 20000000, 'low', 'draft', 'd0000000-0000-0000-0000-000000000004')
ON CONFLICT (id) DO NOTHING;

-- 8. SEED PROJECTS
INSERT INTO public.projects (id, organization_id, campus_id, creative_unit_id, name, code, description, status, priority, start_date, due_date, project_manager_id, created_by, source_idea_id)
VALUES
  ('p0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000001', 'Annual Brand Refresh & Design System 2026', 'PRJ-2026-001', 'Standardisasi visual seluruh media sosial, banner, merchandise, dan booklet resmi.', 'active', 'high', '2026-02-01', '2026-04-30', 'd0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'i0000000-0000-0000-0000-000000000001'),
  ('p0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000002', 'Ramadhan Creative Campaign: Berbagi Cahaya', 'PRJ-2026-002', 'Produksi serial video renungan harian dan visual quote bertema Ramadhan.', 'planning', 'urgent', '2026-03-01', '2026-03-25', 'd0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'i0000000-0000-0000-0000-000000000003'),
  ('p0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000003', 'Social Media Daily Editorial Sprint Q1', 'PRJ-2026-003', 'Eksekusi 30 konten edukatif, infografis tren teknologi, dan showcase karya mahasiswa.', 'active', 'medium', '2026-01-15', '2026-03-31', 'd0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', NULL)
ON CONFLICT (id) DO NOTHING;

-- Update ideas converted link
UPDATE public.ideas
SET converted_project_id = 'p0000000-0000-0000-0000-000000000001'
WHERE id = 'i0000000-0000-0000-0000-000000000001';

UPDATE public.ideas
SET converted_project_id = 'p0000000-0000-0000-0000-000000000002'
WHERE id = 'i0000000-0000-0000-0000-000000000003';

-- 9. SEED CAMPAIGNS
INSERT INTO public.campaigns (id, organization_id, project_id, name, description, start_date, end_date, is_active)
VALUES
  ('m0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002', 'Mega Kampanye Ramadhan 1448H', 'Kampanye terpadu media sosial dan media cetak selama bulan suci', '2026-03-01', '2026-04-05', true),
  ('m0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Penerimaan Mahasiswa Kreatif Baru (PMKB)', 'Kampanye aktivasi pendaftaran mahasiswa baru rumpun seni & desain', '2026-02-15', '2026-06-30', true)
ON CONFLICT (id) DO NOTHING;

-- 10. SEED TASKS
INSERT INTO public.tasks (id, organization_id, project_id, title, description, status, priority, due_date, assigned_to)
VALUES
  ('t0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Finalisasi Color Palette & Typography Tokens (Figma)', 'Definisikan token warna netral dan aksen di file Figma master.', 'done', 'high', '2026-02-20', 'd0000000-0000-0000-0000-000000000003'),
  ('t0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Susun Booklet Brand Guidelines 2026 PDF', 'Kompilasi panduan logo usage, do & donts, serta grid layout ke dalam PDF interaktif.', 'in_progress', 'high', '2026-03-05', 'd0000000-0000-0000-0000-000000000003'),
  ('t0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002', 'Storyboard & Animatic Teaser Ramadhan 30 Detik', 'Buat storyboard alur visual video pembuka bulan ramadhan.', 'review', 'urgent', '2026-02-28', 'd0000000-0000-0000-0000-000000000004'),
  ('t0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003', 'Draft Copywriting 10 Carousel Instagram Tren AI Desain', 'Riset tren tools AI generative dan etika desain untuk dipublikasi.', 'in_progress', 'medium', '2026-03-02', 'd0000000-0000-0000-0000-000000000005'),
  ('t0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Export Vector Logo Asset Kit (.SVG, .EPS, .PNG)', 'Ekspor logo horizontal, vertikal, dan logomark dengan variasi dark & light mode.', 'todo', 'medium', '2026-03-10', 'd0000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- 11. SEED CONTENT ITEMS
INSERT INTO public.content_items (id, organization_id, project_id, title, channel, format, status, scheduled_at, published_at, created_by)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003', 'Carousel IG: 5 Prinsip Visual Design 6102', 'instagram', 'carousel', 'published', '2026-02-15 09:00:00+00', '2026-02-15 09:02:00+00', 'd0000000-0000-0000-0000-000000000005'),
  ('c1000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002', 'Video Teaser: Sambut Cahaya Ramadhan 1448H', 'youtube', 'video', 'in_review', '2026-03-10 17:00:00+00', NULL, 'd0000000-0000-0000-0000-000000000004'),
  ('c1000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003', 'Shorts/Reels: Behind The Design Process', 'tiktok', 'short_video', 'approved', '2026-03-04 12:00:00+00', NULL, 'd0000000-0000-0000-0000-000000000004'),
  ('c1000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Artikel Web: Identitas Baru 6102 Creative Network', 'website', 'article', 'draft', '2026-03-15 08:00:00+00', NULL, 'd0000000-0000-0000-0000-000000000005')
ON CONFLICT (id) DO NOTHING;

-- 12. SEED CONTENT VERSIONS
INSERT INTO public.content_versions (id, content_item_id, version_number, title, body, changelog, created_by)
VALUES
  ('v0000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 1, 'Carousel IG: 5 Prinsip Visual Design 6102', 'Slide 1: Cover\nSlide 2: Kejelasan Hirarki\nSlide 3: Tipografi Fungsional\nSlide 4: Warna Bertujuan\nSlide 5: Konsistensi Brand', 'Versi final setelah disetujui Creative Lead', 'd0000000-0000-0000-0000-000000000005'),
  ('v0000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 1, 'Video Teaser: Sambut Cahaya Ramadhan 1448H', 'Draft rough cut resolusi 1080p dengan musik latar instrumen gambus modern.', 'Initial rough cut submission', 'd0000000-0000-0000-0000-000000000004')
ON CONFLICT (id) DO NOTHING;

-- 13. SEED APPROVAL REQUESTS
INSERT INTO public.approval_requests (id, organization_id, content_item_id, project_id, requested_by, reviewer_id, status, decision_notes)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 'pending', NULL),
  ('a0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000002', 'approved', 'Visual rapi, tata letak seimbang dan pesan tersampaikan dengan elegan.')
ON CONFLICT (id) DO NOTHING;

-- 14. SEED ASSETS (Digital Assets linked to Google Drive / Storage)
INSERT INTO public.assets (id, organization_id, campus_id, creative_unit_id, name, file_path, file_size_bytes, mime_type, asset_type, uploaded_by)
VALUES
  ('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000001', '6102_Primary_Logo_Vector.svg', 'drive://1AbCdEfGhIjKlMnOpQrStUvWxYz/6102_Primary_Logo_Vector.svg', 104857, 'image/svg+xml', 'logo', 'd0000000-0000-0000-0000-000000000003'),
  ('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000001', 'Brand_Guidelines_Booklet_2026.pdf', 'drive://1BcDeFgHiJkLmNoPqRsTuVwXyZa/Brand_Guidelines_Booklet_2026.pdf', 5242880, 'application/pdf', 'document', 'd0000000-0000-0000-0000-000000000003'),
  ('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000002', 'Teaser_Ramadhan_Cut_01.mp4', 'drive://1CdEfGhIjKlMnOpQrStUvWxYzA/Teaser_Ramadhan_Cut_01.mp4', 83886080, 'video/mp4', 'video', 'd0000000-0000-0000-0000-000000000004'),
  ('f0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000003', 'Social_Feed_Master_Template.psd', 'drive://1DeFgHiJkLmNoPqRsTuVwXyZaB/Social_Feed_Master_Template.psd', 41943040, 'image/vnd.adobe.photoshop', 'template', 'd0000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- 15. SEED NOTIFICATIONS
INSERT INTO public.notifications (id, recipient_id, title, message, resource_type, resource_id)
VALUES
  ('n0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Permintaan Approval Baru', 'Reza Pratama mengajukan approval untuk Video Teaser Ramadhan.', 'approval_request', 'a0000000-0000-0000-0000-000000000001'),
  ('n0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000005', 'Konten Telah Disetujui', 'Carousel IG: 5 Prinsip Visual Design 6102 telah disetujui untuk tayang.', 'content_item', 'c1000000-0000-0000-0000-000000000001'),
  ('n0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 'Tugas Baru Ditugaskan', 'Siti Sarah menugaskan: Finalisasi Color Palette & Typography Tokens.', 'task', 't0000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- 16. SEED AUDIT LOGS
INSERT INTO public.audit_logs (organization_id, actor_id, action, resource_type, resource_id, details)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'create_organization', 'organizations', 'e0000000-0000-0000-0000-000000000001', '{"name":"6102 Creative Network"}'),
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'create_project', 'projects', 'p0000000-0000-0000-0000-000000000001', '{"title":"Annual Brand Refresh & Design System 2026"}'),
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'approve_content', 'approval_requests', 'a0000000-0000-0000-0000-000000000002', '{"status":"approved"}'),
  ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000003', 'upload_asset', 'assets', 'f0000000-0000-0000-0000-000000000001', '{"name":"6102_Primary_Logo_Vector.svg"}');
