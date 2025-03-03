import { Link, type LinkProps } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';

import { cn } from 'lib/helpers';

export default function BackButton({ className, ...props }: Omit<LinkProps, 'children'>) {
  return (
    <Link
      className={cn(
        'rounded-md stroke-white p-2 transition-colors hover:bg-white hover:stroke-neutral-950 hover:text-neutral-950',
        className,
      )}
      {...props}
    >
      <ArrowLeftIcon className="size-5 [&>path]:stroke-[1.5]" />
    </Link>
  );
}
