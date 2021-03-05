import * as React from 'react';
import TextArea from 'react-autosize-textarea';

import { ISidebarOptions } from '../sidebar/SideBar';

interface Props {
  options: ISidebarOptions;
  text: string;
  onChange(newText: string): void;
}

export default function PlainEditor(props: Props) {
  const { options } = props;
  const className = 'block h-full w-full focus:outline-none';
  const style = React.useMemo(() => {
    const letterSpacing = options.letterSpacing || 'initial';
    return {
      fontSize: options.fontSize,
      fontWeight: options.fontWeight,
      fontFamily: options.fontFamily,
      lineHeight: `${options.lineHeight}%`,
      letterSpacing,
      textAlign: options.align,
      color: options.textColor,
    };
  }, [options]);

  return (
    <TextArea
      className={className}
      placeholder="Write your text here..."
      value={props.text}
      onChange={(ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.onChange(ev.target.value);
      }}
      style={style}
    />
  );
}

