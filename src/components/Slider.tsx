import { Slider as S } from '@base-ui-components/react/slider';

export default function Slider(props: S.Root.Props) {
  return (
    <S.Root {...props}>
      <S.Control className="flex touch-none items-center px-1 py-3 select-none">
        <S.Track className="h-1 w-full rounded bg-neutral-700 select-none">
          <S.Indicator className="rounded bg-white select-none" />
          <S.Thumb className="h-6 w-3 rounded-full border-2 border-neutral-950 bg-white select-none" />
        </S.Track>
      </S.Control>
    </S.Root>
  );
}
