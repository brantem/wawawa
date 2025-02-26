import Logo from './Logo';

import type { Item } from 'types';
import { cn } from 'lib/helpers';

type HeroProps = React.PropsWithChildren<{
  item?: Item | null;
  isLoading?: boolean;
}>;

export default function Hero({ item, isLoading, children }: HeroProps) {
  return (
    <div
      className={cn('relative h-[500px] overflow-hidden rounded-t-3xl bg-neutral-900', isLoading && 'animate-pulse')}
    >
      {item ? (
        <>
          <img
            ref={(img) => {
              if (!img) return;
              img.onload = () => img.classList.remove('opacity-0');
            }}
            src={item.backgroundUrl}
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity"
            fetchPriority="high"
          />

          <Logo
            src={item.logoUrl}
            alt={item.name}
            className="absolute bottom-8 left-8 z-10 max-h-[125px] max-w-[375px]"
          />
        </>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-neutral-950/50" />

      {children}
    </div>
  );
}
