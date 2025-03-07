import { useId, useState } from 'react';
import { createWithEqualityFn as create } from 'zustand/traditional';
import { PencilIcon } from '@heroicons/react/16/solid';
import { CheckCircleIcon, PlusIcon, XMarkIcon } from '@heroicons/react/20/solid';

import Spinner from 'components/Spinner';

import type { SettingsOption } from 'types';
import Select from 'components/Select';
import { cn } from 'lib/helpers';

type URLFieldProps = {
  label: string;
  description?: string;
  options?: SettingsOption[];
  value: string | SettingsOption;
  onChange(url: string): Promise<void>;
};

export default function URLField({ label, description, options, value, onChange }: URLFieldProps) {
  const id = useId();
  const store = useStore();

  const isOpen = store.id === id;

  return (
    <div
      className={
        isOpen
          ? '-mx-4 -mt-4 flex flex-col gap-4 bg-gradient-to-t from-neutral-900 from-[calc(100%-66px)] to-transparent p-4 md:rounded-b-md'
          : undefined
      }
    >
      <div className="flex justify-between gap-2 max-md:flex-col md:h-8.5 md:items-center">
        <div className="flex flex-col">
          <span>{label}</span>
          {description ? <span className="text-sm text-neutral-500">{description}</span> : null}
        </div>

        <div className="flex items-center">
          <button
            className="flex h-8.5 w-9.5 shrink-0 items-center justify-center rounded-l-full border border-neutral-700 bg-neutral-800 pl-1 hover:border-neutral-600 hover:bg-neutral-700"
            onClick={() => {
              if (isOpen) {
                store.setId(null);
              } else {
                store.setId(id);
              }
            }}
          >
            {!isOpen ? (
              options ? (
                <PlusIcon className="size-5 stroke-white stroke-2" />
              ) : (
                <PencilIcon className="size-4" />
              )
            ) : (
              <XMarkIcon className="size-5 stroke-white stroke-2" />
            )}
          </button>

          {options ? (
            <Select
              className="w-full truncate rounded-l-none md:w-56"
              value={typeof value === 'string' ? value : value.url}
              onChange={(e) => onChange(e.target.value)}
            >
              {options.map((option) => (
                <option key={option.url} value={option.url}>
                  {option.name}
                </option>
              ))}
            </Select>
          ) : (
            <button className="w-full truncate rounded-r-full border border-neutral-200 bg-white px-4 py-1 text-center font-semibold text-neutral-950 hover:bg-neutral-100 md:w-56">
              {typeof value === 'string' ? value : value.name}
            </button>
          )}
        </div>
      </div>

      {isOpen ? (
        <>
          {options ? (
            <Options
              options={options}
              value={typeof value === 'string' ? value : value.url}
              onClick={(url) => {
                onChange(url);
                store.setId(null);
              }}
            />
          ) : null}
          <Form
            value={options ? '' : typeof value === 'string' ? value : value.url}
            onSubmit={onChange}
            onSuccess={() => store.setId(null)}
          />
        </>
      ) : null}
    </div>
  );
}

type OptionsProps = Required<Pick<URLFieldProps, 'options'>> & {
  value: string;
  onClick: (url: string) => void;
};

function Options({ options, value, onClick }: OptionsProps) {
  // TODO: delete button
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => {
        const isSelected = option.url === value;
        return (
          <div
            key={option.url}
            className="flex gap-2 rounded-md border border-neutral-800 py-1 pl-3 text-sm"
            onClick={() => onClick(option.url)}
          >
            <span className="w-32 shrink-0 truncate" title={option.name}>
              {option.name}
            </span>
            <span
              className={cn(
                'no-scrollbar flex-1 overflow-auto whitespace-nowrap text-neutral-500',
                !isSelected && 'pr-3',
              )}
            >
              {option.url}
            </span>
            {isSelected ? <CheckCircleIcon className="mr-1 size-5" /> : null}
          </div>
        );
      })}
    </div>
  );
}

type FormProps = {
  value: string;
  onSubmit(url: string): Promise<void>;
  onSuccess(): void;
};

function Form({ value, onSubmit, onSuccess }: FormProps) {
  const [url, setUrl] = useState(() => value);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        setIsLoading(true);
        try {
          await onSubmit(url.trim());
          onSuccess();
        } catch (err) {
          // TODO: this shouldn't be here
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
          className={cn(
            'flex-1 rounded-l-md border border-neutral-700 bg-neutral-800 px-3 py-1 text-white focus:z-10 disabled:text-neutral-500',
            url && 'invalid:border-red-500',
          )}
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
