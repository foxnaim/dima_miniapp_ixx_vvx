'use client';

import dynamic from 'next/dynamic';

const AdminPaymentPage = dynamic(() => import('@/pages/AdminPaymentPage').then(mod => ({ default: mod.AdminPaymentPage })), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

export default AdminPaymentPage;

