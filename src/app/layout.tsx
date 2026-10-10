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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Topbar />
            <main className="page-content">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
