import { CircleStackIcon } from '@heroicons/react/24/solid';

import URLField from './URLField';

import type { Settings } from 'types';
import { useSettings } from 'lib/hooks';

export default function Resources() {
  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div>
        <div className="flex items-center gap-3 md:h-8">
          <CircleStackIcon className="size-6" />
          <h2 className="flex items-center gap-2 text-lg font-semibold">Resources</h2>
        </div>
        <p className="text-sm text-neutral-500 max-md:mt-1 md:pl-9">
          Configure addons for exploring titles, showing details, playing videos, and supplying subtitles
        </p>
      </div>

      <div className="flex flex-col gap-4 md:pl-9">
        <Field label="Catalog" description="Display a collection of movies and series" name="catalog" />
        <Field label="Meta" description="Show details for movies and series" name="meta" />
        <Field label="Streams" description="Provide the source to watch movies and series" name="stream" />
        <Field label="Subtitles" description="Provide subtitles for movies and series" name="subtitles" />
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  description: string;
  name: Extract<keyof Settings, 'catalog' | 'meta' | 'stream' | 'subtitles'>;
};

function Field({ name, ...props }: FieldProps) {
  const { value, onSubmit } = useSettings((state) => ({
    value: state[name],
    async onSubmit(value: string) {
      await state.setUrl(name, value);
    },
  }));

  return <URLField {...props} value={value} onSubmit={onSubmit} />;
}
