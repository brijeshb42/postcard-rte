import * as React from 'react';
import Select, { OptionsType, OptionProps, SingleValueProps } from 'react-select';

import { DropdownWithBorder, OptionFontFamily, SingleValueFontFamily, SingleValue, IOptionType } from './customSelect';
import { INITIAL_FONTS } from '../constants';

const FONT_OPTIONS: OptionsType<IOptionType> = INITIAL_FONTS.map(font => ({
  label: font,
  value: font,
}));

export default function FontChooser({ selected, onChange }: { selected: string, onChange: (option: IOptionType | null, action: any) => void }) {
  const value = React.useMemo(() => FONT_OPTIONS.find(opt => opt.label === selected), [selected]);

  return (
    <div className="mt-2.5">
      <Select
        inputId="font-chooser"
        aria-label="Select fonts"
        className="rselect rselect--floating"
        classNamePrefix="rselect"
        components={{
          DropdownIndicator: DropdownWithBorder,
          IndicatorSeparator: null,
          Option: OptionFontFamily,
          SingleValue: SingleValueFontFamily,
        }}
        value={value}
        options={FONT_OPTIONS}
        onChange={onChange}
      />
    </div>
  );
}

