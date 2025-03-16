import { Progress as P } from '@base-ui-components/react/progress';

import { cn } from 'lib/helpers';

export default function Progress({ className, value }: { className?: string; value: number }) {
  return (
    <P.Root value={value}>
      <P.Track className={cn('h-1 overflow-hidden rounded bg-neutral-400/75', className)}>
        <P.Indicator className="h-full rounded bg-white" />
      </P.Track>
    </P.Root>
  );
}
