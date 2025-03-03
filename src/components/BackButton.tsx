import { Link, type LinkProps } from 'react-router';

import { cn } from 'lib/helpers';

export default function BackButton({ className, ...props }: LinkProps) {
  return (
    <Link
      className={cn(
        'rounded-md stroke-white p-2 transition-colors hover:bg-white hover:stroke-neutral-950 hover:text-neutral-950',
        className,
      )}
      {...props}
    />
  );
}
