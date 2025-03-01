import { Link, useLocation, useNavigate } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import BackLink from 'components/BackLink';
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
  const location = useLocation();
  const navigate = useNavigate();

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
        <Link
          to="/"
          className="absolute top-6 left-6 z-10 rounded-md stroke-white p-2 transition-colors hover:bg-white hover:stroke-neutral-950 hover:text-neutral-950"
          onClick={(e) => {
            // go to `/` if user opened this page directly, otherwise go back
            if (location.key === 'default') return;
            e.preventDefault();
            navigate(-1);
          }}
        >
          <ArrowLeftIcon className="size-6 [&>path]:stroke-2" />
        </Link>
      ) : null}

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
