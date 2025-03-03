import { Link, useLocation } from 'react-router';

import Img from 'components/Img';
import Logo from './Logo';

import type { Item } from 'types';
import { cn } from 'lib/helpers';

type HeroProps = React.PropsWithChildren<{
  item?: Item | null;
  isLoading?: boolean;
  isLogoALink?: boolean;
}>;

export default function Hero({ item, isLoading, isLogoALink, children }: HeroProps) {
  const location = useLocation();

  const renderLogo = () => {
    if (!item) return;
    return (
      <Logo
        src={item.logoUrl}
        title={item.title}
        className={cn(
          'absolute bottom-4 left-1/2 z-10 max-md:-translate-x-1/2 md:bottom-8 md:left-8 md:max-h-[125px] md:max-w-[375px]',
          location.pathname === '/'
            ? 'max-h-[75px] max-w-[200px]'
            : 'max-h-[125px] max-w-[calc(100%-var(--spacing)*16)]',
        )}
      />
    );
  };

  return (
    <div
      className={cn(
        'relative h-[350px] shrink-0 overflow-hidden bg-neutral-900 max-md:p-4 md:h-[500px] md:rounded-t-3xl',
        isLoading && 'animate-pulse',
      )}
    >
      {item ? (
        <>
          <Img
            src={item.backgroundUrl}
            className="absolute inset-0 size-full object-cover object-center"
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
