import { cn } from 'lib/helpers';

export default function Select({ className, ...props }: React.ComponentPropsWithoutRef<'select'>) {
  return (
    <select
      className={cn(
        'appearance-none rounded-full border border-neutral-200 bg-white bg-none px-4 py-1 text-center font-semibold text-neutral-950 outline-none',
        'enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-500 disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
