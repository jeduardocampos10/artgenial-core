import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'lead-card' | 'table-row';
  count?: number;
}

export function SkeletonLoader({ className, variant = 'text', count = 1 }: SkeletonLoaderProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="card-corporate p-4 space-y-3">
            <div className="skeleton-shimmer h-4 w-3/4 rounded" />
            <div className="skeleton-shimmer h-3 w-1/2 rounded" />
            <div className="skeleton-shimmer h-8 w-full rounded" />
          </div>
        );
      case 'circle':
        return <div className="skeleton-shimmer w-10 h-10 rounded-full" />;
      case 'lead-card':
        return (
          <div className="card-corporate p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="skeleton-shimmer h-4 w-3/4 rounded" />
                <div className="skeleton-shimmer h-3 w-1/2 rounded" />
              </div>
              <div className="skeleton-shimmer h-5 w-12 rounded-full" />
            </div>
            <div className="skeleton-shimmer h-3 w-2/5 rounded" />
            <div className="flex justify-between pt-2 border-t border-border/50">
              <div className="flex gap-3">
                <div className="skeleton-shimmer h-4 w-16 rounded" />
                <div className="skeleton-shimmer h-4 w-16 rounded" />
              </div>
              <div className="skeleton-shimmer h-6 w-20 rounded" />
            </div>
          </div>
        );
      case 'table-row':
        return (
          <div className="flex gap-4 py-3 px-4 border-b border-border/50">
            <div className="skeleton-shimmer h-4 w-28 rounded" />
            <div className="skeleton-shimmer h-4 flex-1 rounded" />
            <div className="skeleton-shimmer h-4 w-24 rounded" />
            <div className="skeleton-shimmer h-4 w-20 rounded" />
            <div className="skeleton-shimmer h-4 w-16 rounded" />
          </div>
        );
      default:
        return <div className="skeleton-shimmer h-4 w-full rounded" />;
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}
