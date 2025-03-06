import { useId, useState } from 'react';
import { createWithEqualityFn as create } from 'zustand/traditional';
import { Cog6ToothIcon } from '@heroicons/react/16/solid';
import { XMarkIcon } from '@heroicons/react/20/solid';

import Spinner from 'components/Spinner';

type URLFieldProps = {
  label: string;
  description?: string;
  value:
    | string
    | {
        url: string;
        name: string;
      };
} & Pick<FormProps, 'onSubmit'>;

export default function URLField({ label, description, value, onSubmit }: URLFieldProps) {
  const id = useId();
  const store = useStore();

  const isOpen = store.id === id;

  return (
    <div
      className={
        isOpen ? '-mx-4 -mt-4 bg-gradient-to-t from-neutral-900 from-50% to-transparent p-4 md:rounded-b-md' : undefined
      }
    >
      <div className="flex justify-between gap-2 max-md:flex-col md:h-8.5 md:items-center">
        <div className="flex flex-col">
          <span>{label}</span>
          {description ? <span className="text-sm text-neutral-500">{description}</span> : null}
        </div>

        <div className="flex items-center">
          <button
            className="flex h-8.5 w-9.5 shrink-0 items-center justify-center rounded-l-full border border-neutral-600 bg-neutral-800 hover:bg-neutral-700"
            onClick={() => {
              if (isOpen) {
                store.setId(null);
              } else {
                store.setId(id);
              }
            }}
          >
            {!isOpen ? (
              <Cog6ToothIcon className="size-4" />
            ) : (
              <XMarkIcon className="size-5 stroke-white stroke-[1.5]" />
            )}
          </button>

          <button className="relative flex w-full overflow-hidden rounded-r-full border border-neutral-200 bg-white text-center font-semibold text-neutral-950 hover:bg-neutral-100 md:w-56">
            <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-white to-transparent" />
            <span className="no-scrollbar inline-block min-w-full overflow-auto px-4 py-1 whitespace-nowrap">
              {typeof value === 'string' ? value : value.name}
            </span>
            <div className="absolute top-0 right-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent" />
          </button>
        </div>
      </div>

      {isOpen ? (
        <Form
          value={typeof value === 'string' ? value : value.url}
          onSubmit={onSubmit}
          onSuccess={() => store.setId(null)}
        />
      ) : null}
    </div>
  );
}

type FormProps = {
  value: string;
  onSubmit(value: string): Promise<void>;
  onSuccess(): void;
};

function Form({ value, onSubmit, onSuccess }: FormProps) {
  const [url, setUrl] = useState(() => value);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form
      className="mt-2 md:mt-4"
      onSubmit={async (e) => {
        e.preventDefault();

        setIsLoading(true);
        try {
          await onSubmit(url.trim());
          onSuccess();
        } catch (err) {
          let message = 'Failed to save';
          if (err instanceof Error) {
            switch (err.message) {
              case 'MISSING_MANIFEST':
                message = 'Invalid Stremio Addon URL';
                break;
              case 'INVALID':
                message = 'Addon not supported for this resource';
                break;
            }
          }
          setError(message);
        }
        setIsLoading(false);
      }}
    >
      <div className="flex w-full">
        <input
          type="url"
          className="flex-1 rounded-l-md border border-neutral-700 bg-neutral-800 px-3 py-1 text-white invalid:border-red-500 focus:z-10 disabled:text-neutral-500"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
          required
        />
        <button
          type="submit"
          className="relative overflow-hidden rounded-r-md border border-neutral-200 bg-white px-3 py-1 font-semibold text-neutral-950"
          disabled={isLoading}
        >
          <span>Save</span>
          {isLoading ? <Spinner className="absolute inset-0 flex items-center justify-center bg-white p-1.5" /> : null}
        </button>
      </div>
      {error ? <span className="mt-1 text-xs text-red-300">{error}</span> : null}
    </form>
  );
}

type State = {
  id: string | null;
  setId(id: string | null): void;
};

const useStore = create<State>()((set) => ({
  id: null,
  setId(id) {
    set({ id });
  },
}));
