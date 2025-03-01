import { cn } from 'lib/helpers';

export default function Select({ className, ...props }: React.ComponentPropsWithoutRef<'select'>) {
  return (
    <select
      className={cn(
        'appearance-none rounded-full border border-neutral-200 bg-white px-4 py-1 text-center font-semibold text-neutral-950 outline-none hover:bg-neutral-100',
        className,
      )}
      {...props}
    />
  );
}
