import * as React from 'react';
import Select, { OptionsType, OptionProps, SingleValueProps, SelectComponentsConfig } from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';

import { queryFont } from '../api';
import {
  Menu,
  DropdownWithBorder,
  OptionFontFamily,
  SingleValueFontFamily,
  SingleValue,
  IOptionType,
  FontSearchInput,
} from './customSelect';
import { INITIAL_FONTS } from '../constants';

interface IQueryRespose {
  success: {
    [key: string]: {
      family: string;
      variants: string[];
    },
  },
}

const FONT_OPTIONS: IOptionType[] = INITIAL_FONTS.map(font => ({
  label: font,
  value: font,
}));

function loadFonts(input: string, callback: Function) {
  queryFont(input).then((resp: IQueryRespose) => {
    const fonts = Object.values(resp.success);
    const options = fonts.map(item => ({
      label: item.family,
      value: item.family,
    }));
    callback(options);
  });
}
const debouncedFn = debounce(loadFonts, 300);

interface Props {
  selected?: string,
  disabled: boolean;
  onChange: (option: IOptionType | null, action: any) => void;
}

export default function FontChooser({ selected, disabled, onChange }: Props) {
  const value = React.useMemo(() => {
    if (!selected) {
      return null;
    }

    return {
      label: selected,
      value: selected,
    };
  }, [selected]);

  const options = React.useMemo(() => {
    if (!selected || FONT_OPTIONS.find(item => item.value === selected)) {
      return FONT_OPTIONS;
    }

    return [{ label: selected, value: selected }].concat(FONT_OPTIONS);
  }, [selected]);

  // @ts-ignore -> Input is the error
  const components: SelectComponentsConfig<IOptionType, false> = React.useMemo(() => ({
    DropdownIndicator: DropdownWithBorder,
    IndicatorSeparator: null,
    Option: OptionFontFamily,
    SingleValue: SingleValueFontFamily,
    Menu,
    Input: FontSearchInput,
  }), []);

  return (
    <div className="mt-2.5">
      <AsyncSelect
        cacheOptions
        defaultOptions={options}
        loadOptions={debouncedFn}
        inputId="font-chooser"
        aria-label="Select fonts"
        className="rselect rselect--floating"
        classNamePrefix="rselect"
        components={components}
        value={value}
        onChange={onChange}
        isDisabled={disabled}
      />
    </div>
  );
}

