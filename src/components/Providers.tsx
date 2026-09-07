"use client";

import React from 'react';
import { AuthProvider } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import PageTransition from '@/components/PageTransition';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PageTransition>{children}</PageTransition>
      </AuthProvider>
    </ThemeProvider>
  );
}
