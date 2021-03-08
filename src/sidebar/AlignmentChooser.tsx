import * as React from 'react';

export type Alignment = 'left' | 'right' | 'center' | 'justify' | undefined;

const LEFT_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/>
  </svg>
);

const CENTER_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"/>
  </svg>
);

const RIGHT_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"/>
  </svg>
);

const JUSTIFY_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/>
  </svg>
);

const ALIGNMENT_OPTIONS: {label: React.ReactNode, value: Alignment}[] = [{
  label: LEFT_SVG,
  value: 'left',
}, {
  label: CENTER_SVG,
  value: 'center',
}, {
  label: RIGHT_SVG,
  value: 'right',
}, {
  label: JUSTIFY_SVG,
  value: 'justify'
}];

interface Props {
  disabled?: boolean;
  alignment?: Alignment;
  onChange(value: Alignment): void;
}

export default function AlignmentChooser(props: Props) {
  return (
    <div role="radiogroup" aria-label="Select alignment" className="mt-2.5 flex items-center border border-blueGray rounded" style={{color: '#aab2bb'}}>
      {ALIGNMENT_OPTIONS.map((item, index) => {
        const selected = item.value === props.alignment;
        const extraClass = (index === ALIGNMENT_OPTIONS.length - 1 ? '' : 'border-r') + (selected ? ' text-modo' : '');

        return (
          <button
            role="radio"
            aria-checked={selected}
            key={item.value}
            className={`w-1/4 py-2 flex justify-center ${extraClass} disabled:opacity-50`}
            aria-label={`Alignment ${item.value}`}
            disabled={props.disabled}
            onClick={() => props.onChange(item.value)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
