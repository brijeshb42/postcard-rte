import * as React from 'react';
import Select from 'react-select';

import { IOptionType, DropdownNoBorder, Option, SingleValue } from './customSelect';

export type FontWeight = number | undefined;
export type FontSizeChange = (key: 'weight' | 'size', value: FontWeight) => void;

const FONT_WEIGHTS: IOptionType[] = [300, 400, 500, 600, 700].map(weight => ({
  label: weight === 500 ? 'Bold' : weight,
  value: weight,
}));

export default function FontSizeChooser(props: { weight: FontWeight; size: number; onChange: FontSizeChange }) {
  const value = React.useMemo(() => FONT_WEIGHTS.find(f => f.value === props.weight), [props.weight]);
  return (
    <div className="flex mt-2.5 w-full border boder-blueGray-200 rounded">
      <Select
        aria-label="Select font variant"
        className="w-2/3 rselect rselect__font-weight"
        classNamePrefix="rselect"
        value={value}
        options={FONT_WEIGHTS}
        components={{
          DropdownIndicator: DropdownNoBorder,
          IndicatorSeparator: null,
          Option,
          SingleValue,
        }}
        onChange={(opt) => {
          if (!opt) {
            return;
          }
          props.onChange('weight', opt.value as number)
        }}
      />
      <div className="w-1/3 border-l">
        <div className="h-full flex items-center pl-2 border-2 border-transparent focus-within:border-modo">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#AAB2BB">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z" />
          </svg>
          <input
            type="number"
            aria-label="Font size"
            className="block w-full h-full outline-none text-center text-xs focus:border focus:border-modo"
            value={props.size}
            step="1"
            onChange={ev => {
              const { value } = ev.target;
              if (/\d+/g.exec(value)) {
                props.onChange('size', parseInt(ev.target.value, 10))
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

