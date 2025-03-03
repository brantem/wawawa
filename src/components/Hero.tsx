import { Link } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import Img from 'components/Img';
import BackButton from 'components/BackButton';
import Logo from './Logo';

import type { Item } from 'types';
import { cn } from 'lib/helpers';

type HeroProps = React.PropsWithChildren<{
  item?: Item | null;
  isLoading?: boolean;
  hasBackButton?: boolean;
  isLogoALink?: boolean;
}>;

export default function Hero({ item, isLoading, hasBackButton, isLogoALink, children }: HeroProps) {
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
      {hasBackButton ? (
        <BackButton to="/" className="absolute top-6 left-6 z-10">
          <ArrowLeftIcon className="size-6 [&>path]:stroke-2" />
        </BackButton>
      ) : null}

      {item ? (
        <>
          <Img src={item.backgroundUrl} className="absolute inset-0 size-full object-cover" fetchPriority="high" />

          {isLogoALink ? <Link to={`/${item.type}/${item.id}`}>{renderLogo()}</Link> : renderLogo()}
        </>
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-neutral-950/50" />

      {children}
    </div>
  );
}
