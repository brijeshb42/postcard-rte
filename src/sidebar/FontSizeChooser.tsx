import * as React from 'react';
import Select from 'react-select';

import { IOptionType, DropdownNoBorder, Option, SingleValue } from './customSelect';
import { getVariantsForFont } from '../api';
import { loadFontWithVariants } from '../fontStore';

export type FontWeight = string;

export type FontSizeChange = (key: 'weight' | 'size', value: FontWeight) => void;

interface Props {
  disabled: boolean;
  weight?: FontWeight;
  size?: number;
  onChange: FontSizeChange;
  fontFamily?: string;
};

export default function FontSizeChooser(props: Props) {
  const { fontFamily, weight } = props;
  const [ options, setOptions ] = React.useState<IOptionType[]>(weight ? [{ label: weight, value: weight }] : []);
  const value = React.useMemo<IOptionType>(() => ({
    label: props.weight,
    value: props.weight as string,
  }), [props.weight]);

  React.useEffect(() => {
    if (!fontFamily || options.length <= 1) {
      return;
    }

    loadFontWithVariants(fontFamily, options.map(opt => opt.value!))
  }, [fontFamily, options]);

  React.useEffect(() => {
    let mounted = true;

    if (!fontFamily) {
      return;
    }

    getVariantsForFont(fontFamily)
      .then((resp: {result: {[key: string]: string}}) => {
        if (!mounted) {
          return;
        }

        const result = Object.values(resp.result);
        setOptions(result.map(item => ({
          label: item[0].toUpperCase() + item.substr(1),
          value: item,
        })));
      });

    return () => {
      mounted = false;
    };
  }, [fontFamily]);

  React.useEffect(() => {

  }, [options]);

  return (
    <div className="flex mt-2.5 w-full border boder-blueGray-200 rounded">
      <Select
        isDisabled={props.disabled}
        aria-label="Select font variant"
        className="w-2/3 rselect rselect__font-weight rselect--floating"
        classNamePrefix="rselect"
        value={value}
        options={options}
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

          props.onChange('weight', opt.value as FontWeight)
        }}
      />
      <div className="w-1/3 border-l">
        <div className="h-full flex items-center pl-2 border-2 border-transparent focus-within:border-modo">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#AAB2BB">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z" />
          </svg>
          <input
            disabled={props.disabled}
            type="number"
            aria-label="Font size"
            className="block w-full h-full outline-none text-center text-xs focus:border focus:border-modo disabled:opacity-50"
            value={props.size || 18}
            step="1"
            onChange={ev => {
              const { value } = ev.target;
              if (/\d+/g.exec(value)) {
                props.onChange('size', ev.target.value as FontWeight); // @TODO - this is not desired
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

