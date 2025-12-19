'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CatalogPage } from '@/pages/CatalogPage';
import { getUserId, isAdmin } from '@/lib/telegram';
import { ADMIN_IDS } from '@/types/api';
import { useAdminView } from '@/contexts/AdminViewContext';

export default function HomePage() {
  const router = useRouter();
  const { forceClientView } = useAdminView();
  const userId = getUserId();
  const isUserAdmin = userId ? isAdmin(userId, ADMIN_IDS) : false;

  useEffect(() => {
    if (isUserAdmin && !forceClientView) {
      router.replace('/admin');
    }
  }, [isUserAdmin, forceClientView, router]);

  if (isUserAdmin && !forceClientView) {
    return null; // Редирект обрабатывается
  }

  return <CatalogPage />;
}

