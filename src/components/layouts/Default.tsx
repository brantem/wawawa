import { cn } from 'lib/helpers';

type LayoutProps = Pick<React.ComponentPropsWithoutRef<'div'>, 'className' | 'children'>;

export default function Layout({ className, children }: LayoutProps) {
  return (
    <div className="px-4">
      <div className={cn('mx-auto max-w-5xl py-8', className)}>{children}</div>
    </div>
  );
}
