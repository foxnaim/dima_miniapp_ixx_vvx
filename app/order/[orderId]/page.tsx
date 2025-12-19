'use client';

import dynamic from 'next/dynamic';

const OrderPage = dynamic(() => import('@/pages/OrderPage').then(mod => ({ default: mod.OrderPage })), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
});

export default OrderPage;

