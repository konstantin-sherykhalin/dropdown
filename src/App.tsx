import './App.css';

import { useState } from 'react';

import Language from './components/Language';
import logo from './logo.svg';

function App() {
    const [value, setValue] = useState<number[]>([]);
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <Language value={value} onChange={setValue} />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
