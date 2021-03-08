import * as React from 'react';
import Select, { OptionsType, OptionProps, SingleValueProps } from 'react-select';

import { IOptionType } from './customSelect';
import FontChooser from './FontChooser';
import FontSizeChooser, { FontWeight, FontSizeChange } from './FontSizeChooser';
import SpacingChooser, { LineHeight, LetterSpacing } from './SpacingChooser';
import AlignmentChooser, { Alignment } from './AlignmentChooser';
import ColorChooser from './ColorChooser';

import './SideBar.css';

export interface ISidebarOptions {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: FontWeight;
  textColor?: string;
  lineHeight?: LineHeight;
  letterSpacing?: LetterSpacing;
  align?: Alignment;
} 

export interface ISidebarProps {
  options: ISidebarOptions;
  disabled: boolean;
  setOption(key: keyof ISidebarOptions, value: any): void;
  isSaving: boolean;
  onSave(): void;
}

export default function SideBar(props: ISidebarProps) {
  const { options, setOption, isSaving, onSave, disabled } = props;

  function onFontChange(opt: IOptionType | null) {
    if (!opt) {
      return;
    }

    setOption('fontFamily', opt.label);
  }

  const onFontDimensionChange: FontSizeChange = (key, value) => {
    setOption(key === 'weight' ? 'fontWeight' : 'fontSize', value);
  };

  return (
    <div className="font-firasans">
      <p className="block text-xs text-gray-500 uppercase">Text</p>
      <FontChooser
        disabled={disabled}
        selected={options.fontFamily}
        onChange={onFontChange}
      />
      <FontSizeChooser
        disabled={disabled}
        fontFamily={options.fontFamily}
        weight={options.fontWeight}
        size={options.fontSize}
        onChange={onFontDimensionChange}
      />
      <ColorChooser
        disabled={disabled}
        color={options.textColor}
        onChange={setOption}
      />
      <SpacingChooser
        disabled={disabled}
        lineHeight={options.lineHeight}
        letterSpacing={options.letterSpacing}
        onChange={(key, value) => {
          setOption(key, value);
        }}
      />
      <AlignmentChooser
        disabled={!disabled}
        alignment={options.align}
        onChange={(newVal) =>
          setOption('align', newVal === options.align ? undefined : newVal)
        }
      />
      <div className="mt-2.5">
        <button
          className="block w-full py-2.5 bg-modoGreen text-white text-center disabled:opacity-50"
          disabled={isSaving}
          onClick={onSave}
        >
          {isSaving ? 'Saving' : 'Save'} Changes
        </button>
      </div>
    </div>
  );
}

