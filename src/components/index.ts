/**
 * Централизованный экспорт компонентов
 * Упрощает импорты и улучшает tree-shaking
 */

// Основные компоненты
export { ErrorBoundary } from './ErrorBoundary';
export { Seo } from './Seo';
export { NavLink } from './NavLink';
export { AdminHeader, type AdminHeaderProps } from './AdminHeader';
export { AdminPageLayout } from './AdminPageLayout';

// Диалоги
export { CartDialog } from './CartDialog';
export { ReceiptDialog } from './ReceiptDialog';

// Карточки
export { ProductCard, MemoizedProductCard } from './ProductCard';
export { CartItem, MemoizedCartItem } from './CartItem';
export { OrderStatusBadge } from './OrderStatusBadge';

// Анимации
export { AnimatedList, AnimatedItem, HoverScale, PageTransition } from './animations';

// Иконки
export * from './icons';

// UI компоненты (re-export из ui/)
export { Button } from './ui/button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
export { Input } from './ui/input';
export { Label } from './ui/label';
export { Skeleton } from './ui/skeleton';
export { Alert, AlertDescription, AlertTitle } from './ui/alert';
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

