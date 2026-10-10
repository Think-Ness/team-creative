import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '6102 Creative System',
  description: 'Internal Creative Collaboration & Media Management Web Application',
};

import AppProviders from '@/components/layout/AppProviders';
import AppShell from '@/components/layout/AppShell';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
