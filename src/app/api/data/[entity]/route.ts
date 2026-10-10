import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

const TABLE_MAP: Record<string, string> = {
  projects: 'projects',
  requests: 'ideas',
  tasks: 'tasks',
  content: 'content_items',
  campuses: 'campuses',
  talent: 'profiles',
  assets: 'assets',
  approvals: 'approval_requests',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;
    const tableName = TABLE_MAP[entity] || entity;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn(`Supabase GET ${tableName} warning:`, error.message);
      return NextResponse.json({ success: true, data: [], db_error: error.message });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;
    const tableName = TABLE_MAP[entity] || entity;
    const body = await req.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from(tableName)
      .upsert([body])
      .select()
      .single();

    if (error) {
      console.warn(`Supabase POST ${tableName} warning:`, error.message);
      return NextResponse.json({ success: true, data: body, db_note: error.message });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;
    const tableName = TABLE_MAP[entity] || entity;
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.warn(`Supabase PUT ${tableName} warning:`, error.message);
      return NextResponse.json({ success: true, data: body, db_note: error.message });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ entity: string }> }
) {
  try {
    const { entity } = await params;
    const tableName = TABLE_MAP[entity] || entity;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.warn(`Supabase DELETE ${tableName} warning:`, error.message);
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
