'use client';

import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

const AdminOrdersPage = dynamic(() => import('@/pages/AdminOrdersPage').then(mod => ({ default: mod.AdminOrdersPage })), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

export default AdminOrdersPage;

