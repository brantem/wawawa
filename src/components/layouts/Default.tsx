import { cn } from 'lib/helpers';

type LayoutProps = Pick<React.ComponentPropsWithoutRef<'div'>, 'className' | 'children'>;

export default function Layout({ className, children }: LayoutProps) {
  return (
    <div className="h-full md:px-4">
      <div className={cn('mx-auto flex h-full max-w-5xl flex-col gap-8 md:py-8', className)}>{children}</div>
    </div>
  );
}
