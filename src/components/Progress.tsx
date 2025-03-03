import { cn } from 'lib/helpers';

export default function Progress({ className, value }: { className?: string; value: number }) {
  return (
    <div className={cn('h-1 overflow-hidden rounded bg-neutral-400/75', className)}>
      <div className="h-full rounded bg-white" style={{ width: `${value}%` }} />
    </div>
  );
}
