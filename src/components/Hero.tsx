import { Link } from 'react-router';

import Logo from './Logo';

import type { Item } from 'types';
import { cn } from 'lib/helpers';

type HeroProps = React.PropsWithChildren<{
  item?: Item | null;
  isLoading?: boolean;
  isLogoALink?: boolean;
}>;

export default function Hero({ item, isLoading, isLogoALink, children }: HeroProps) {
  const renderLogo = () => {
    if (!item) return;
    return (
      <Logo
        src={item.logoUrl}
        title={item.title}
        className="absolute bottom-8 left-8 z-10 max-h-[125px] max-w-[375px]"
      />
    );
  };

  return (
    <div
      className={cn(
        'relative h-[500px] shrink-0 overflow-hidden rounded-t-3xl bg-neutral-900',
        isLoading && 'animate-pulse',
      )}
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

          {isLogoALink ? <Link to={`/${item.type}/${item.id}`}>{renderLogo()}</Link> : renderLogo()}
        </>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-neutral-950/50" />

      {children}
    </div>
  );
}
