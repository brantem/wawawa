import { Root, Track, Range, Thumb, SliderProps } from '@radix-ui/react-slider';

import { cn } from 'lib/helpers';

export default function Slider({ className, ...props }: SliderProps) {
  return (
    <Root className={cn('relative flex touch-none items-center select-none', className)} {...props}>
      <Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-neutral-700">
        <Range className="absolute h-full bg-white" />
      </Track>
      <Thumb className="block size-5 w-2.5 rounded-full border border-neutral-200 bg-white shadow transition-colors" />
    </Root>
  );
}
