import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const supabase = createAdminClient();

    // 1. Check if user is Super Admin Pusat
    if (trimmedEmail === 'superadmin@creative.id') {
      if (password !== '123123') {
        return NextResponse.json(
          { success: false, error: 'Password salah! Password default Super Admin adalah: 123123' },
          { status: 401 }
        );
      }

      // Upsert profile in Supabase to guarantee synchronization
      try {
        await supabase.from('profiles').upsert([
          {
            id: 'd0000000-0000-0000-0000-000000000001',
            display_name: 'Ahmad Fauzi (Super Admin)',
            job_title: 'Head of Creative / Creative Lead',
            avatar_path: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            is_active: true,
          },
        ]);
      } catch (err) {
        console.warn('Supabase profile sync skipped (offline/unreachable):', err);
      }

      const user = {
        id: 'usr-super-admin',
        name: 'Ahmad Fauzi (Super Admin)',
        email: 'superadmin@creative.id',
        role: 'super_admin',
        campus: 'Kantor Pusat / Multi-Kampus',
        division: 'Creative Management',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      };

      const response = NextResponse.json({ success: true, user });
      response.cookies.set('6102_user_session', JSON.stringify(user), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: false,
      });

      return response;
    }

    // 2. Check in Supabase profiles/users table
    try {
      const { data: dbProfile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .ilike('display_name', `%${trimmedEmail.split('@')[0]}%`)
        .single();

      if (dbProfile && !profileErr) {
        const user = {
          id: dbProfile.id,
          name: dbProfile.display_name,
          email: trimmedEmail,
          role: 'member',
          campus: 'Kampus Utama Jakarta',
          division: 'Graphic Design',
          avatar: dbProfile.avatar_path || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        };

        const response = NextResponse.json({ success: true, user });
        response.cookies.set('6102_user_session', JSON.stringify(user), {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: false,
        });
        return response;
      }
    } catch (e) {
      console.warn('Database lookup error:', e);
    }

    // 3. Check preset accounts (Multi-Campus Ecosystem)
    const presetUsers = [
      {
        id: 'usr-admin-jkt',
        name: 'Siti Sarah (Admin Kampus JKT)',
        email: 'admin.jkt@creative.id',
        password: '123123',
        role: 'campus_admin',
        campus: 'Kampus Utama Jakarta',
        division: 'Creative Management',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      },
      {
        id: 'usr-admin-bdg',
        name: 'Reza Pratama (Admin Kampus BDG)',
        email: 'admin.bdg@creative.id',
        password: '123123',
        role: 'campus_admin',
        campus: 'Kampus Bandung Hub',
        division: 'Film Production',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      },
      {
        id: 'usr-member-design',
        name: 'Budi Wicaksono',
        email: 'budi.design@creative.id',
        password: '123123',
        role: 'member',
        campus: 'Kampus Utama Jakarta',
        division: 'Graphic Design',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
      {
        id: 'usr-member-copy',
        name: 'Dewi Lestari',
        email: 'dewi.copy@creative.id',
        password: '123123',
        role: 'member',
        campus: 'Kampus Surabaya Studio',
        division: 'Copywriting',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      },
    ];

    const match = presetUsers.find(u => u.email.toLowerCase() === trimmedEmail);
    if (match) {
      if (password !== match.password) {
        return NextResponse.json(
          { success: false, error: 'Password salah! Password default adalah 123123' },
          { status: 401 }
        );
      }

      const { password: _, ...userWithoutPass } = match;
      const response = NextResponse.json({ success: true, user: userWithoutPass });
      response.cookies.set('6102_user_session', JSON.stringify(userWithoutPass), {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
      });
      return response;
    }

    return NextResponse.json(
      { 
        success: false, 
        error: `Akun "${email}" tidak ditemukan di sistem. Gunakan "superadmin@creative.id" dengan sandi "123123", atau pilih salah satu akun peran yang tersedia.` 
      },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Terjadi kesalahan server saat login.' },
      { status: 500 }
    );
  }
}
