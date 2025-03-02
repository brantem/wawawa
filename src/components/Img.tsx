import { cn } from 'lib/helpers';

export default function Img({ className, ...props }: React.ComponentPropsWithoutRef<'img'>) {
  return (
    <img
      ref={(img) => {
        if (!img) return;
        img.onload = () => img.classList.remove('opacity-0');
      }}
      className={cn('opacity-0 transition-opacity', className)}
      {...props}
    />
  );
}
