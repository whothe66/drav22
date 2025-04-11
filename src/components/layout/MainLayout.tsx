
import React from 'react';
import { Navbar } from './Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <div className="flex-1 pt-16">
          <main className="container mx-auto py-8 page-transition">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
