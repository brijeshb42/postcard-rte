import * as React from 'react';
import { OptionProps, SingleValueProps } from 'react-select';

export interface IOptionType {
  label: string | number;
  value: string | number;
}

export function DropdownIndicator({ hasBorder }: { hasBorder: boolean }) {
  const className = `p-1.5 mr-2${hasBorder ? ' border rounded' : ''}`;
  return (
    <span className={className}>
      <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1.00006L4 4.00006L7 1.00006" stroke="#AAB2BB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

export function DropdownWithBorder() {
  return <DropdownIndicator hasBorder />;
}

export function DropdownNoBorder() {
  return <DropdownIndicator hasBorder={false} />;
}

export function OptionFontFamily(props: OptionProps<IOptionType, false>) {
  const {
    isFocused,
    isSelected,
    label,
    innerProps,
  } = props;
  const className = `rselect__option ${isSelected ? 'rselect__option--is-selected' : (isFocused ? 'rselect__option--is-focused' : '')}`;

  return (
    <div className={className} style={{ fontFamily: label }} {...innerProps}>
      {label}
    </div>
  );
}

export function Option(props: OptionProps<IOptionType, false>) {
  const {
    isFocused,
    isSelected,
    label,
    innerProps,
  } = props;
  const className = `rselect__option text-xs ${isSelected ? 'rselect__option--is-selected' : (isFocused ? 'rselect__option--is-focused' : '')}`;

  return (
    <div className={className} {...innerProps}>
      {label}
    </div>
  );
}

export function SingleValueFontFamily(props: SingleValueProps<IOptionType>) {
  const { children, data } = props;

  return (
    <div className="rselect__value-container text-xs" style={{ fontFamily: data.label as string }}>
      {children}
    </div>
  );
}

export function SingleValue(props: SingleValueProps<IOptionType>) {
  const { children, data } = props;

  return (
    <div className="rselect__value-container text-xs">
      {children}
    </div>
  );
}

export function SingleValueSpacing(props: SingleValueProps<IOptionType>) {
  const { children, data } = props;

  return (
    <div className="rselect__value-container flex items-center text-xs">
      <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#aab2bb">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M6 7h2.5L5 3.5 1.5 7H4v10H1.5L5 20.5 8.5 17H6V7zm4-2v2h12V5H10zm0 14h12v-2H10v2zm0-6h12v-2H10v2z"/>
      </svg>
      {children}
    </div>
  );
}

export function DropdownIndicatorSpacing() {
  return (
    <span className="p-1.5 mr-2 text-sm text-modoGray">
      %
    </span>
  );
}
