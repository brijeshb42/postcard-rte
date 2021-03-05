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
  const className = 'block h-full w-full resize-none focus:outline-none';
  const style = React.useMemo(() => {
    const letterSpacing = options.letterSpacing || 'initial';
    const fontWeight = typeof options.fontWeight === 'string' ? options.fontWeight : 'initial';

    return {
      fontSize: `${options.fontSize}px`,
      fontWeight,
      fontFamily: options.fontFamily,
      lineHeight: `${options.lineHeight}%`,
      letterSpacing,
      textAlign: options.align,
      color: options.textColor,
    } as React.CSSProperties;
  }, [options]);

  return (
    <TextArea
      autoFocus
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

