import * as React from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import PlainEditor from './plaineditor';
import SideBar, { ISidebarOptions } from './sidebar/SideBar';
import { saveText as saveTextApi, getText as getTextApi } from './api';

import './App.css'

function getDefaultOptions(): ISidebarOptions {
  return {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    textColor: '#000000',
    lineHeight: '125',
    letterSpacing: undefined,
    align: 'left',
  };
}

function App() {
  const [opts, setOpts] = React.useState(getDefaultOptions());
  const [text, setText] = React.useState('');
  const [isSaving, setSaving] = React.useState(false);

  const isMacRef = React.useRef<boolean | null>(null);
  const params = useParams<{id: string | undefined}>();
  const history = useHistory();
  const { id } = params;

  function setOption(key: keyof ISidebarOptions, newValue: any) {
    setOpts(oldOpts => {
      // reset weight when font changes as it might not support
      // that particular weight.
      const resetWeight = key === 'fontFamily';
      const extraObj = resetWeight ? { 'fontWeight': '400' } : {};

      return {
        ...oldOpts,
        ...extraObj,
        [key]: newValue,
      };
    });
  }

  function saveText() {
    if (!text) {
      toast.info('Please add some text to save.');
      return;
    }

    setSaving(true);

    const data = {
      text,
      config: JSON.stringify(opts),
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
      if (text) {
        setText('');
        setOpts(getDefaultOptions());
      }
      return;
    }

    getTextApi(id).then(resp => {
      setText(resp.text);
      let opts = getDefaultOptions();
      try {
        opts = JSON.parse(resp.config);
      } catch (ex) {}
      setOpts(opts);
    }).catch(e => {
      const errCode = Number.parseInt(e.message);
      if (!Number.isNaN(errCode)) {
        history.replace('/');
        toast.error('This text does not exist.');
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
  }, [text, opts, id]);

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen bg-gray-200">
      <div className="max-w-2xl mx-auto w-full my-8 p-7 overflow-auto font-inter bg-white text-lg">
        <PlainEditor
          options={opts}
          text={text}
          onChange={setText}
        />
      </div>
      <aside className="bg-white p-4" style={{width: 300}}>
        <SideBar
          options={opts}
          setOption={setOption}
          isSaving={isSaving}
          onSave={saveText}
        />
      </aside>
    </div>
  )
}

export default App
