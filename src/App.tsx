import './App.css';

import { useEffect, useState } from 'react';

import LanguageExample from './components/LanguageExample';
import logo from './logo.svg';

function App() {
    const [clicks, setClicks] = useState(0);

    useEffect(() => {
        window.addEventListener('click', () => setClicks((clicks) => clicks + 0.5));
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <div style={{ display: 'flex' }}>
                    <LanguageExample type="prefetch" />
                    <LanguageExample type="search" />
                </div>
                <img
                    className="App-logo"
                    src={logo}
                    alt="logo"
                    style={{ animationDuration: `${100 / (5 + clicks)}s` }}
                />
                <p style={{ opacity: Math.min(1, Math.pow(clicks / 10, 2)) }}>
                    {clicks < 10 ? 'Больше кликов!' : clicks < 20 ? 'Еще!' : 'Теперь тон крутится быстро!'}
                </p>
            </header>
        </div>
    );
}

export default App;
