import * as React from 'react';
import Select from 'react-select';

import { IOptionType, Option, SingleValueSpacing, DropdownIndicatorSpacing} from './customSelect';

export type LineHeight = '75' | '100' | '125' | '150' | '175' | '200';
export type LetterSpacing = number | undefined;

export type SpacingChange = (key: 'lineHeight' | 'letterSpacing', value: LineHeight | LetterSpacing) => void;

interface Props {
  disabled: boolean;
  lineHeight?: LineHeight;
  letterSpacing: LetterSpacing;
  onChange: SpacingChange;
}

const LINE_HEIGHT_OPTIONS: IOptionType[] = [75, 100, 125, 150, 175, 200].map(l => ({
  label: l.toString(),
  value: l.toString(),
}));

export default function SpacingChooser(props: Props) {
  const value = React.useMemo(() => LINE_HEIGHT_OPTIONS.find(f => f.value === props.lineHeight), [props.lineHeight]);

  return (
    <div className="flex mt-2.5 w-full border boder-blueGray-200 rounded">
      <Select
        isDisabled={props.disabled}
        aria-label="Select line height"
        className="w-1/2 rselect rselect__font-weight"
        classNamePrefix="rselect"
        value={value}
        options={LINE_HEIGHT_OPTIONS}
        components={{
          DropdownIndicator: DropdownIndicatorSpacing,
          IndicatorSeparator: null,
          Option,
          SingleValue: SingleValueSpacing,
        }}
        onChange={(opt) => {
          if (!opt) {
            return;
          }
          props.onChange('lineHeight', opt.value as LineHeight)
        }}
      />
      <div className="w-1/2 border-l">
        <div className="h-full flex items-center pl-2 border-2 border-transparent focus-within:border-modo">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0)">
              <path d="M8 0L8.92164 -0.388057C8.7655 -0.758871 8.40234 -1 8 -1C7.59766 -1 7.2345 -0.758871 7.07836 -0.388057L8 0ZM10.8 8C11.3523 8 11.8 7.55228 11.8 7C11.8 6.44772 11.3523 6 10.8 6V8ZM4.92164 9.88806L8.92164 0.388057L7.07836 -0.388057L3.07836 9.11194L4.92164 9.88806ZM7.07836 0.388057L11.0784 9.88806L12.9216 9.11194L8.92164 -0.388057L7.07836 0.388057ZM5.2 8H10.8V6H5.2V8Z" fill="#AAB2BB"/>
              <path d="M1.5 13L2 13.5L2 12.5L1.5 13ZM1.5 13L14.5 13M14.5 13L14 12.5L14 13.5L14.5 13Z" stroke="#AAB2BB" strokeWidth="2" strokeLinecap="round"/>
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="16" height="16" fill="white" transform="translate(0 16) rotate(-90)"/>
              </clipPath>
            </defs>
          </svg>
          <input
            disabled={props.disabled}
            aria-label="Letter Spacing"
            placeholder="..."
            type="number"
            className="block w-full h-full outline-none text-center text-xs focus:border focus:border-modo disabled:opacity-50"
            value={props.letterSpacing || ''}
            step="0.1"
            onChange={ev => {
              const { value } = ev.target;
              const num = parseFloat(value);
              if (Number.isNaN(num)) {
                return;
              }
              props.onChange('letterSpacing', num)
            }}
          />
          <span className="mx-1 text-xs text-blueGray-400">px</span>
        </div>
      </div>
    </div>
  );
}
