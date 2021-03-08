import * as React from 'react';
import { createPortal } from 'react-dom';
import Parchment from 'parchment';
import Quill, { SelectionChangeHandler, RangeStatic } from 'quill/core';
import Link from 'quill/formats/link';
import Bold from 'quill/formats/bold';
import Italic from 'quill/formats/italic';
import { AlignClass } from 'quill/formats/align';

import { ISidebarOptions } from '../sidebar/SideBar';
import { FontWeight } from '../sidebar/FontSizeChooser';
import { LetterSpacing, LineHeight } from '../sidebar/SpacingChooser';
import { Alignment } from '../sidebar/AlignmentChooser';

import 'quill/dist/quill.core.css';
import './RichTextEditor.css';


function stringDQ(val: string) {
  return val.replaceAll('"', '');
}

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function reverseColor(color: string) {
  if (color[0] === '#') {
    return color;
  }
  const regex = /rgb\((\d+)\s?,\s?(\d+)\s?,\s?(\d+)\)/g;
  const match = regex.exec(color);
  if (!match) {
    return color;
  }
  return rgbToHex(Number(match[1]), Number(match[2]), Number(match[3]));
}

const INLINE_STYLES = [{
  attribute: 'textColor',
  key: 'color',
  reverse: reverseColor,
}, {
  attribute: 'fontFamily',
  key: 'font-family',
  reverse: stringDQ,
}, {
  attribute: 'fontWeight',
  key: 'font-weight',
  reverse: stringDQ,
}, {
  attribute: 'fontSize',
  key: 'font-size',
  converter: (val: number) => `${val}px`,
  reverse: (val: string) => parseInt(val.substring(0, val.length - 2), 10)
}, {
  attribute: 'lineHeight',
  key: 'line-height',
  converter: (val: number) => `${val}%`,
  reverse: (val: string) => parseInt(val.substring(0, val.length - 1), 10)
}, {
  attribute: 'letterSpacing',
  key: 'letter-spacing',
  converter: (val: number) => `${val}px`,
  reverse: (val: string) => parseInt(val.substring(0, val.length - 2), 10)
}];

function camelize(name: string): string {
  let parts = name.split('-');
  let rest = parts
    .slice(1)
    .map(function(part: string) {
      return part[0].toUpperCase() + part.slice(1);
    })
    .join('');
  return parts[0] + rest;
}

class RStyleAttributor extends Parchment.Attributor.Style {
  private converter?: Function;
  private reverse?: Function;

  constructor(attrName: string, key: string, options: any, converter?: Function, reverse?: Function) {
    super(attrName, key, options);
    this.converter = converter;
    this.reverse = reverse;
  }

  add(node: HTMLElement, value: string): boolean {
    if (!this.canAdd(node, value)) return false;
    // @ts-ignore
    node.style[camelize(this.keyName)] = this.converter ? this.converter(value) : value;
    return true;
  }

  value(node: HTMLElement): string {
    // @ts-ignore
    let value = node.style[camelize(this.keyName)];
    return this.canAdd(node, value) ? (this.reverse ? this.reverse(value) : value) : '';
  }
}

INLINE_STYLES.forEach(item => {
  const style = new RStyleAttributor(item.attribute, item.key, {
    scope: Parchment.Scope.INLINE,
  }, item.converter, item.reverse);
  Quill.register(style);
});
Quill.register(Link);
Quill.register(Bold);
Quill.register(Italic);
Quill.register(AlignClass);

interface Props {
  content: any;
  onTextChange?(): void;
  onSelectionChange?: SelectionChangeHandler;
  onCreate?(editor: IEditorProxy): any;
}

export interface IEditorProxy {
  setFormat(key: keyof ISidebarOptions, value: any): void;
  getFormat(range?: RangeStatic): {[key: string]: any};
  setAlign(key: 'align', value: Alignment): void;
  getContents(): any;
}

interface ILinkProps {
  value?: string;
  onInputToggle?(value: boolean): void;
  onLinkEnter?(link: string): void;
}

function LinkInput(props: ILinkProps) {
  const [showInput, setShowInput] = React.useState(false);
  const linkInput = React.useRef<HTMLInputElement>(null);

  function handleKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
    if (ev.keyCode !== 13 && ev.keyCode !== 27) {
      return;
    }

    ev.preventDefault();

    if (ev.keyCode === 13) {

      if (!props.onLinkEnter) {
        return;
      }

      props.onLinkEnter((ev.target as HTMLInputElement).value);
    }

    setShowInput(false);
  }

  React.useEffect(() => {
    if (props.onInputToggle) {
      props.onInputToggle(showInput);
    }
    if (showInput && linkInput.current) {
      linkInput.current.focus();

      if (props.value) {
        linkInput.current.value = props.value;
      }
    }
  }, [showInput]);

  React.useEffect(() => {
    if (props.value && linkInput.current) {
      linkInput.current!.value = props.value;
    }
  }, [props.value]);

  return (
    <div className={`transform ${!showInput ? '-rotate-45' : ''}`} style={{lineHeight: 0}}>
      <button className={`${showInput ? 'hidden' : 'initial'} focus:outline-none`} onClick={() => setShowInput(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#ffffff">
          <path d="M0 0h24v24H0V0z" fill="none"/>
          <path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/>
        </svg>
      </button>
      {showInput && (
        <input
          ref={linkInput}
          style={{minWidth: 250}}
          placeholder="Paste or type a link..."
          className="bg-gray-700 text-white focus:outline-none"
          type="text"
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
}

function Portal({ children }: { children: React.ReactNode }) {
  const dom = React.useRef(document.getElementById('portal'));
  return createPortal(children, dom.current!);
}

export default function RichTextEditor(props: Props) {
  const [toolbarPos, setToolbarPos] = React.useState<{x: number, y: number} | null>(null);
  const [link, setLink] = React.useState('');
  const node = React.useRef<HTMLDivElement>(null);
  const toolbar = React.useRef<HTMLDivElement>(null);
  const q = React.useRef<Quill>();
  const lastRange = React.useRef<RangeStatic>();

  function onInputToggle(newVal: boolean) {
    if (!toolbarPos || !q.current) {
      return;
    }

    const sel = q.current.getSelection() || lastRange.current;
    if (!sel) {
      return;
    }

    const bounds = q.current.getBounds(sel!.index, sel.length);
    const rect = node.current!.getBoundingClientRect();
    setToolbarPos({
      x: rect.left + bounds.left + bounds.width / 2 - toolbar.current!.offsetWidth / 2,
      y: rect.top + bounds.top - bounds.height / 2 - toolbar.current!.offsetHeight / 2 - 20,
    });
  }

  function onLink(link: string) {
    const quill = q.current;
    if (!quill) {
      return;
    }
    quill.format('link', link);
    setLink(link);
  }

  React.useEffect(() => {
    let quill: Quill | null = new Quill(node.current!, {
      placeholder: 'Write your text here',
    });

    q.current = quill;

    if (props.onCreate) {
      const editor: IEditorProxy = {
        setFormat(key: keyof ISidebarOptions, value: any) {
          const sel = quill!.getSelection();
          if (sel?.length === 0) {
            return;
          }
          quill!.format(key, value);
        },
        getFormat(range?: RangeStatic) {
          return quill!.getFormat(range);
        },
        setAlign(key: 'align', value: Alignment) {
          quill!.format('align', value);
        },
        getContents() {
          const len = quill!.getLength();
          if (len <= 1) {
            return null;
          }
          return quill!.getContents();
        },
      };
      props.onCreate(editor);
    }

    return () => {
      q.current = undefined;
      quill = null;

      if (node.current) {
        node.current.innerHTML = '';
        node.current.className = 'rte';
      }
    };
  }, []);

  React.useEffect(() => {
    const ed = q.current;

    if (!ed) {
      return;
    }
    ed.setContents(props.content);
  }, [props.content]);

  React.useEffect(() => {
    const quill = q.current;
    if (!quill || !props.onSelectionChange) {
      return;
    }

    const handler: SelectionChangeHandler = (range, oldRange, source) => {
      try {props.onSelectionChange!(range, oldRange, source);} catch (ex) {}

      if (range && range.length === 0) {
        setToolbarPos(null);
        lastRange.current = undefined;
      } else if (range && range.length) {
        const bounds = quill.getBounds(range.index, range.length);
        const rect = node.current!.getBoundingClientRect();

        const format = quill.getFormat(range);
        setToolbarPos({
          x: rect.left + bounds.left + bounds.width / 2 - toolbar.current!.offsetWidth / 2,
          y: rect.top + bounds.top - bounds.height / 2 - toolbar.current!.offsetHeight / 2 - 20,
        });
        lastRange.current = range;
        setLink(format.link || '');
      }
    };

    quill.on('selection-change', handler);

    return () => {
      quill.off('selection-change', handler);
    };
  }, [props.onSelectionChange]);

  const style = !!toolbarPos ? {
    left: toolbarPos.x,
    top: toolbarPos.y
  } : {
    left: -1000,
    top: -1000
  };

  return (
    <div className="relative">
      <div ref={node} className="rte" />
      <Portal>
        <div
          ref={toolbar}
          className={`toolbar bg-gray-700 absolute p-2 rounded ${!!toolbarPos ? 'visible' : 'invisible'}`}
          style={style}
        >
          {!!toolbarPos ? (
            <LinkInput
              value={link}
              onInputToggle={onInputToggle}
              onLinkEnter={onLink}
            />
          ): null}
        </div>
      </Portal>
    </div>
  );
}

