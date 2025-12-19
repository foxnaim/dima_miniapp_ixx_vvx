'use client';

import dynamic from 'next/dynamic';

const AdminHelpPage = dynamic(() => import('@/pages/AdminHelpPage').then(mod => ({ default: mod.AdminHelpPage })), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

export default AdminHelpPage;

