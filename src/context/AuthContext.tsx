'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'super_admin' | 'campus_admin' | 'member';
export type Division = 
  | 'Graphic Design'
  | 'Copywriting'
  | 'Content'
  | 'Creative Management'
  | 'Event Coordinator'
  | 'Film Production'
  | 'Music Production'
  | 'Camera & Editorial';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  campus: string;
  division: Division;
  avatar: string;
}

export const PRESET_USERS: AppUser[] = [
  {
    id: 'usr-super-admin',
    name: 'Super Admin Pusat (Creative Lead)',
    email: 'superadmin@creative.id',
    password: '123123',
    role: 'super_admin',
    campus: 'Kantor Pusat / Multi-Kampus',
    division: 'Creative Management',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
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

interface AuthContextType {
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  switchUser: (userId: string) => void;
  loginWithCredentials: (email: string, password: string) => { success: boolean; error?: string };
  users: AppUser[];
  registerUser: (newUser: Omit<AppUser, 'id'>) => AppUser;
  updateUser: (id: string, updated: Partial<AppUser>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('6102_users');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return PRESET_USERS;
  });

  const [currentUser, setCurrentUserState] = useState<AppUser>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('6102_current_user');
      if (saved) {
        try { 
          const parsed = JSON.parse(saved);
          if (parsed && parsed.email) return parsed;
        } catch (e) {}
      }
    }
    return PRESET_USERS[0];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('6102_users', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('6102_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const setCurrentUser = (user: AppUser) => {
    setCurrentUserState(user);
  };

  const switchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUserState(found);
    }
  };

  const loginWithCredentials = (email: string, password: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === trimmedEmail);
    
    if (!found) {
      return { success: false, error: 'Email belum terdaftar. Gunakan superadmin@creative.id atau pilih akun demo.' };
    }

    if (found.password && found.password !== password) {
      return { success: false, error: 'Kata sandi (password) salah! Untuk akun demo gunakan password: 123123' };
    }

    setCurrentUserState(found);
    return { success: true };
  };

  const registerUser = (data: Omit<AppUser, 'id'>): AppUser => {
    const newUser: AppUser = {
      ...data,
      password: data.password || '123123',
      id: `usr-${Date.now()}`,
    };
    setUsers(prev => [newUser, ...prev]);
    return newUser;
  };

  const updateUser = (id: string, updated: Partial<AppUser>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
    if (currentUser.id === id) {
      setCurrentUserState(prev => ({ ...prev, ...updated }));
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser.id === id) {
      setCurrentUserState(PRESET_USERS[0]);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      switchUser,
      loginWithCredentials,
      users,
      registerUser,
      updateUser,
      deleteUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
