import * as React from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SelectionChangeHandler } from 'quill/core';

import PlainEditor from './plaineditor';
import { IEditorProxy } from './rte/RichTextEditor';
import { ISidebarOptions } from './sidebar/SideBar';
import { saveText as saveTextApi, getText as getTextApi } from './api';

import './App.css'

const RichTextEditor = React.lazy(() => import('./rte/RichTextEditor'));
const SideBar = React.lazy(() => import('./sidebar/SideBar'));

function Loading({ text }: { text: string }) {
  return <p>Loading {text}...</p>;
}

function App() {
  const [opts, setOpts] = React.useState<ISidebarOptions>({});
  const [content, setContent] = React.useState<any>({ ops: [] });
  const [isSaving, setSaving] = React.useState(false);
  const [isSidebarDisabled, setSidebarDisabled] = React.useState(true);
  const editor = React.useRef<IEditorProxy>();

  const isMacRef = React.useRef<boolean | null>(null);
  const params = useParams<{id: string | undefined}>();
  const history = useHistory();
  const { id } = params;

  function setOption(key: keyof ISidebarOptions, newValue: any) {
    if (editor.current) {
      if (key === 'align') {
        editor.current.setAlign(key, newValue);
      } else {
        editor.current.setFormat(key, newValue);
      }
      setOpts(opts => ({
        ...opts,
        [key]: newValue,
      }));
    }
  }

  const onSelChange: SelectionChangeHandler = React.useCallback((sel) => {
    if (sel === null) {
      return;
    }
    if (sel.length === 0) {
      setSidebarDisabled(true);
      setOpts(editor.current!.getFormat());
    } else {
      setSidebarDisabled(false);
      setOpts(editor.current!.getFormat(sel) as ISidebarOptions);
    }
  }, []);

  function saveText() {
    const content = editor.current?.getContents();

    if (!content) {
      toast.info('Please add some text to save.');
      return;
    }

    setSaving(true);

    const data = {
      text: JSON.stringify(content),
    };

    saveTextApi(data, id)
      .then(resp => {
        let message = 'Text updated.';
        if (resp.id) {
          history.replace(`/text/${resp.id}`);
          message = `New text created: Copy the link from browser address bar. ^`;
        }
        toast.success(message);
      })
      .catch(err => {
        console.error(err);
        toast.error('Error while trying to save');
      })
      .finally(() => setSaving(false));
  }

  React.useEffect(() => {
    // fetch new data when id changes
    if (!id) {
      return;
    }

    getTextApi(id).then(resp => {
      try {
        setContent(JSON.parse(resp.text));
      } catch (ex) {
        setContent({ ops: [] });
      }
    }).catch(e => {
      const errCode = Number.parseInt(e.message);
      if (!Number.isNaN(errCode)) {
        history.replace('/');
        toast.error('This text does not exist.');
        setContent({ ops: [] });
        return;
      }

      toast.error('Error while fetching text.');
    });
  }, [id]);

  React.useEffect(() => {
    // key handler to save data on CMD+S press
    if (isMacRef.current === null) {
      isMacRef.current = /Mac/g.test(window.navigator.userAgent);
    }

    function handler(ev: KeyboardEvent) {
      const mainKey = isMacRef.current ? 'metaKey' : 'ctrlKey';

      if (ev[mainKey] && ev.key === 's') {
        ev.preventDefault();
        saveText();
      }
    }

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [id]);

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen bg-gray-200">
      <div className="max-w-2xl mx-auto w-full my-8 p-7 overflow-auto font-inter bg-white text-lg">
        <React.Suspense fallback={<Loading text="editor" />}>
          <RichTextEditor
            content={content}
            onCreate={(ed: IEditorProxy) => {
              editor.current = ed;
            }}
            onSelectionChange={onSelChange}
          />
        </React.Suspense>
      </div>
      <aside className="bg-white p-4" style={{width: 300}}>
        <React.Suspense fallback={<Loading text="sidebar" />}>
          <SideBar
            disabled={isSidebarDisabled}
            options={opts}
            setOption={setOption}
            isSaving={isSaving}
            onSave={saveText}
          />
        </React.Suspense>
      </aside>
    </div>
  )
}

export default App
