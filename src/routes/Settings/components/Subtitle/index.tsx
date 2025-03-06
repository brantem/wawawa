import langs from 'langs';

import BaseField from '../Field';
import Select from 'components/Select';
import Slider from 'components/Slider';
import Preview from './Preview';

import * as constants from 'constants/settings';
import { useSettings } from 'lib/hooks';
import { useSubtitle } from './hooks';

export default function Subtitle() {
  const settings = useSettings();

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="-ml-0.5 flex items-center gap-3 md:h-8">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="size-7">
          <path
            d="M4.6661 6.66699C4.29791 6.66699 3.99943 6.96547 3.99943 7.33366V24.667C3.99943 25.0352 4.29791 25.3337 4.6661 25.3337H27.3328C27.701 25.3337 27.9994 25.0352 27.9994 24.667V7.33366C27.9994 6.96547 27.701 6.66699 27.3328 6.66699H4.6661ZM8.66667 21.3333C8.29848 21.3333 8 21.0349 8 20.6667V11.3333C8 10.9651 8.29848 10.6667 8.66667 10.6667H14C14.3682 10.6667 14.6667 10.9651 14.6667 11.3333V12.6667C14.6667 13.0349 14.3682 13.3333 14 13.3333H10.8C10.7264 13.3333 10.6667 13.393 10.6667 13.4667V18.5333C10.6667 18.607 10.7264 18.6667 10.8 18.6667H14C14.3682 18.6667 14.6667 18.9651 14.6667 19.3333V20.6667C14.6667 21.0349 14.3682 21.3333 14 21.3333H8.66667ZM18 21.3333C17.6318 21.3333 17.3333 21.0349 17.3333 20.6667V11.3333C17.3333 10.9651 17.6318 10.6667 18 10.6667H23.3333C23.7015 10.6667 24 10.9651 24 11.3333V12.6667C24 13.0349 23.7015 13.3333 23.3333 13.3333H20.1333C20.0597 13.3333 20 13.393 20 13.4667V18.5333C20 18.607 20.0597 18.6667 20.1333 18.6667H23.3333C23.7015 18.6667 24 18.9651 24 19.3333V20.6667C24 21.0349 23.7015 21.3333 23.3333 21.3333H18Z"
            fill="currentColor"
          />
        </svg>
        <h2 className="-ml-0.5 text-lg font-semibold">Subtitle</h2>
      </div>

      <div className="flex flex-col gap-8 md:pl-9">
        <BaseField label="Language">
          <Select
            className="w-full md:w-56"
            value={settings.language}
            onChange={(e) => settings.set('language', e.target.value)}
          >
            {langs.all().map((lang) => (
              <option key={lang[2]} value={lang[2]}>
                {lang.name}
              </option>
            ))}
          </Select>
        </BaseField>

        <Group name="Font">
          <SelectField label="Family" name="font-family">
            {constants.SUBTITLE_FONT_FAMILY.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
          <RangeField label="Size" name="font-size" {...constants.SUBTITLE_FONT_SIZE} />
        </Group>

        <Group name="Text">
          <ColorField label="Color" name="text-color" />
          <SelectField label="Shadow" name="text-shadow">
            {constants.SUBTITLE_TEXT_SHADOW.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </SelectField>
          <RangeField label="Opacity" name="text-opacity" {...constants.SUBTITLE_OPACITY} />
        </Group>

        <Group name="Text Background">
          <ColorField label="Color" name="text-bg" />
          <RangeField label="Opacity" name="text-bg-opacity" {...constants.SUBTITLE_OPACITY} />
        </Group>

        <Group name="Display Background">
          <ColorField label="Color" name="display-bg" />
          <RangeField label="Opacity" name="display-bg-opacity" {...constants.SUBTITLE_OPACITY} />
        </Group>
      </div>

      <Preview />
    </div>
  );
}

function Group({ name, children }: React.PropsWithChildren<{ name: string }>) {
  return (
    <div className="group/f flex flex-col gap-4 md:gap-2 max-md:[&>div>span:first-child]:text-sm max-md:[&>div>span:first-child]:text-neutral-400">
      <h3 className="font-medium md:text-sm md:text-neutral-500">{name}</h3>

      {children}
    </div>
  );
}

type BaseFieldProps = {
  label: string;
  name: keyof typeof constants.SUBTITLE;
};

type FieldProps = BaseFieldProps & {
  children: (props: { value: string; onChange(value: string): void }) => React.ReactNode;
};

function Field({ label, name, children }: FieldProps) {
  const props = useSubtitle((state) => ({
    value: state[name],
    onChange(value: string) {
      state.set(name, value);
    },
  }));

  return <BaseField label={label}>{children(props)}</BaseField>;
}

function SelectField({ children, ...props }: React.PropsWithChildren<BaseFieldProps>) {
  return (
    <Field {...props}>
      {({ onChange, ...field }) => (
        <Select className="w-full md:w-56" {...field} onChange={(e) => onChange(e.target.value)}>
          {children}
        </Select>
      )}
    </Field>
  );
}

type RangeFieldProps = BaseFieldProps & {
  min: number;
  max: number;
  step: number;
};

function RangeField({ label, name, ...props }: RangeFieldProps) {
  return (
    <Field label={label} name={name}>
      {({ value, onChange }) => (
        <div className="flex items-center gap-2 max-md:flex-row-reverse max-md:text-right">
          <span className="text-sm text-neutral-500 tabular-nums max-md:w-10.5">{value}</span>
          <Slider
            className="w-full md:w-56"
            value={[parseInt(value.replace('%', ''))]}
            onValueChange={([value]) => onChange(`${value}%`)}
            {...props}
          />
        </div>
      )}
    </Field>
  );
}

function ColorField(props: BaseFieldProps) {
  return (
    <Field {...props}>
      {({ value, onChange }) => (
        <label className="relative">
          <div
            className="flex w-full items-center justify-center rounded-full border border-neutral-800 px-4 py-1 font-mono uppercase md:w-56"
            style={{ backgroundColor: value, color: value }}
          >
            {/* https://miunau.com/posts/dynamic-text-contrast-in-css/ */}
            <span className="[filter:url(#bwFilter)]">{value}</span>
          </div>
          <input
            type="color"
            className="invisible absolute right-0 bottom-0 left-0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      )}
    </Field>
  );
}
