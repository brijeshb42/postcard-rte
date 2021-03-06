import * as React from 'react';
import { SketchPicker } from 'react-color';

import { DropdownNoBorder } from './customSelect';

interface Props {
  color: string;
  onChange(key: 'textColor', newValue: string): void;
}

export default function ColorChooser(props: Props) {
  const [showPicker, setShowPicker] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const { color, onChange } = props;

  React.useEffect(() => {
    function handlerOutClick(ev: MouseEvent) {
      const wrapperEl = wrapperRef.current;

      if (!wrapperEl) {
        return;
      }

      if (wrapperEl.contains(ev.target as Node)) {
        return;
      }

      setShowPicker(false);
    }

    document.addEventListener('click', handlerOutClick, true);

    return () => {
      document.removeEventListener('click', handlerOutClick, true);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="mt-2.5">
      <button
        className="block flex items-center w-full text-xs text-center border rounded focus:outline-none focus:border-modo"
        onClick={() => setShowPicker(v => !v)}
        aria-label={`Pick text color (Current -> ${color})`}
      >
        <div className="flex w-10/12 pl-2 py-2">
          {color ? (
            <div className="flex">
              <span className="rounded rounded-xs border border-modoGray" style={{width: 18, height: 18, backgroundColor: color}} />
              <span className="pl-2">{color}</span>
            </div>
          ) : 'Pick Color'}
        </div>
        <div className="flex w-2/12 py-2 justify-end">
          <DropdownNoBorder />
        </div>
      </button>
      {showPicker && (
        <div className="absolute z-10">
          <SketchPicker color={color} onChange={(newColor) => onChange('textColor', newColor.hex)}/>
        </div>
      )}
    </div>
  );
}
