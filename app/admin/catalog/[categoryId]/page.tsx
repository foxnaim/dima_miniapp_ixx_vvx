'use client';

import dynamic from 'next/dynamic';

const AdminCategoryPage = dynamic(() => import('@/pages/AdminCategoryPage').then(mod => ({ default: mod.AdminCategoryPage })), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

export default AdminCategoryPage;

