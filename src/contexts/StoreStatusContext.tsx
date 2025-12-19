import { createContext, useContext, type ReactNode } from 'react';
import { useStoreStatus as useStoreStatusService } from '@/hooks/useStoreStatus';
import type { StoreStatus } from '@/types/api';

type StoreStatusContextValue = {
  status: StoreStatus | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const StoreStatusContext = createContext<StoreStatusContextValue | undefined>(undefined);
export function StoreStatusProvider({ children }: { children: ReactNode }) {
  const storeStatus = useStoreStatusService();

  return (
    <StoreStatusContext.Provider value={storeStatus}>
      {children}
    </StoreStatusContext.Provider>
  );
}

/**
 * Хук для использования статуса магазина
 * 
 * @deprecated Используйте напрямую useStoreStatus из @/hooks/useStoreStatus
 * Оставлен для обратной совместимости
 */
export function useStoreStatus() {
  const ctx = useContext(StoreStatusContext);
  if (!ctx) throw new Error('useStoreStatus must be used within StoreStatusProvider');
  return ctx;
}

