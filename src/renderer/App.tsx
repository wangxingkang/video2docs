import React, { useState } from 'react';
// @ts-ignore
import logo from './logo.svg';
import { useElectron } from '@/hooks';
import './App.css';

const App: React.FC = () => {
  const electron= useElectron();
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button
            onClick={() => {
              console.log(window);
              electron.ipcRenderer.send('open-directory-dialog', 'openDirectory');

              electron.onResponse('selectedItem', result => {
                console.log(result);
              });
            }}
          >
            count is: {count}
          </button>
        </p>
      </header>
    </div>
  );
};

export default App;
