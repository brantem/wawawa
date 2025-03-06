import { cn } from 'lib/helpers';

type LayoutProps = Pick<React.ComponentPropsWithoutRef<'div'>, 'className' | 'children'>;

export default function Layout({ className, children }: LayoutProps) {
  return (
    <div className="min-h-full px-4">
      <div className={cn('mx-auto flex min-h-full max-w-[960px] flex-col gap-8 pt-3 pb-4 md:pb-8 lg:pt-14', className)}>
        {children}
      </div>
    </div>
  );
}
