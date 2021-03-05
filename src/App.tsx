import * as React from 'react'
import { useHistory } from 'react-router-dom';

import PlainEditor from './plaineditor';
import SideBar, { ISidebarOptions } from './sidebar/SideBar';
import './App.css'

const defaultOptions: ISidebarOptions = {
  fontFamily: 'Inter',
  fontSize: 16,
  fontWeight: 400,
  textColor: '#000000',
  lineHeight: 125,
  letterSpacing: undefined,
  align: 'left',
};

function App() {
  const [opts, setOpts] = React.useState(defaultOptions);
  const [text, setText] = React.useState('');
  const isMacRef = React.useRef<boolean | null>(null);

  function setOption(key: keyof ISidebarOptions, newValue: any) {
    setOpts(oldOpts => ({
      ...oldOpts,
      [key]: newValue,
    }));
  }

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
        />
      </aside>
    </div>
  )
}

export default App
