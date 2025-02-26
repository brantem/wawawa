import Logo from './Logo';

import type { Item } from 'types';

export default function Hero({ item, children }: React.PropsWithChildren<{ item?: Item }>) {
  return (
    <div className="relative h-[500px] overflow-hidden rounded-t-xl bg-neutral-900">
      {item ? (
        <>
          <img
            ref={(img) => {
              if (!img) return;
              img.onload = () => img.classList.remove('opacity-0');
            }}
            src={item.backgroundUrl}
            className="absolute top-0 right-0 left-0 size-full object-cover opacity-0 transition-opacity"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-neutral-950/50" />

          <Logo src={item.logoUrl} alt={item.name} className="absolute bottom-8 left-8 max-h-[125px] max-w-[375px]" />
        </>
      ) : null}

      {children}
    </div>
  );
}
