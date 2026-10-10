import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET() {
  return handleSeed();
}

export async function POST() {
  return handleSeed();
}

async function handleSeed() {
  try {
    const supabase = createAdminClient();

    // Check if organization already exists
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('id', 'e0000000-0000-0000-0000-000000000001')
      .single();

    if (existingOrg) {
      return NextResponse.json({
        success: true,
        message: 'Database already seeded with demo organization.',
      });
    }

    // Insert Organization
    const { error: orgErr } = await supabase.from('organizations').upsert([
      {
        id: 'e0000000-0000-0000-0000-000000000001',
        name: '6102 Creative Network',
        slug: 'creative-network',
        description: 'Sistem Kolaborasi dan Tata Kelola Aset Kreatif Multi-Kampus',
      },
    ]);

    if (orgErr) throw orgErr;

    // Insert Campuses
    await supabase.from('campuses').upsert([
      {
        id: 'c0000000-0000-0000-0000-000000000001',
        organization_id: 'e0000000-0000-0000-0000-000000000001',
        name: 'Kampus Utama Jakarta',
        code: 'JKT-01',
        description: 'Pusat operasional dan studio siaran kreatif',
      },
      {
        id: 'c0000000-0000-0000-0000-000000000002',
        organization_id: 'e0000000-0000-0000-0000-000000000001',
        name: 'Kampus Bandung Creative Hub',
        code: 'BDG-01',
        description: 'Pusat riset desain visual dan laboratorium media',
      },
    ]);

    // Insert Creative Units
    await supabase.from('creative_units').upsert([
      {
        id: 'u0000000-0000-0000-0000-000000000001',
        organization_id: 'e0000000-0000-0000-0000-000000000001',
        campus_id: 'c0000000-0000-0000-0000-000000000001',
        name: 'Brand & Visual Identity',
        code: 'BVI-JKT',
      },
      {
        id: 'u0000000-0000-0000-0000-000000000002',
        organization_id: 'e0000000-0000-0000-0000-000000000001',
        campus_id: 'c0000000-0000-0000-0000-000000000002',
        name: 'Motion Graphics & 3D Lab',
        code: 'M3D-BDG',
      },
    ]);

    // Insert Projects
    await supabase.from('projects').upsert([
      {
        id: 'p0000000-0000-0000-0000-000000000001',
        organization_id: 'e0000000-0000-0000-0000-000000000001',
        name: 'Annual Brand Refresh & Design System 2026',
        code: 'PRJ-2026-001',
        description: 'Standardisasi visual seluruh media sosial, banner, merchandise, dan booklet resmi.',
        status: 'active',
        priority: 'high',
        start_date: '2026-02-01',
        due_date: '2026-04-30',
      },
      {
        id: 'p0000000-0000-0000-0000-000000000002',
        organization_id: 'e0000000-0000-0000-0000-000000000001',
        name: 'Ramadhan Creative Campaign: Berbagi Cahaya',
        code: 'PRJ-2026-002',
        description: 'Produksi serial video renungan harian dan visual quote bertema Ramadhan.',
        status: 'planning',
        priority: 'urgent',
        start_date: '2026-03-01',
        due_date: '2026-03-25',
      },
    ]);

    // Insert Tasks
    await supabase.from('tasks').upsert([
      {
        id: 't0000000-0000-0000-0000-000000000001',
        organization_id: 'e0000000-0000-0000-0000-000000000001',
        project_id: 'p0000000-0000-0000-0000-000000000001',
        title: 'Finalisasi Color Palette & Typography Tokens (Figma)',
        status: 'done',
        priority: 'high',
        due_date: '2026-02-20',
      },
      {
        id: 't0000000-0000-0000-0000-000000000002',
        organization_id: 'e0000000-0000-0000-0000-000000000001',
        project_id: 'p0000000-0000-0000-0000-000000000001',
        title: 'Susun Booklet Brand Guidelines 2026 PDF',
        status: 'in_progress',
        priority: 'high',
        due_date: '2026-03-05',
      },
      {
        id: 't0000000-0000-0000-0000-000000000003',
        organization_id: 'e0000000-0000-0000-0000-000000000001',
        project_id: 'p0000000-0000-0000-0000-000000000002',
        title: 'Storyboard Teaser Ramadhan 30 Detik',
        status: 'review',
        priority: 'urgent',
        due_date: '2026-02-28',
      },
    ]);

    return NextResponse.json({
      success: true,
      message: 'Initial dummy data seeded successfully via Supabase Admin Client!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
