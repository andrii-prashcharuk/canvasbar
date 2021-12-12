import { loremIpsum } from 'lorem-ipsum';
import { CanvasBar } from  'canvasbar-react';

import './App.css';

const TEXT = loremIpsum({ count: 100 });
const TEXT_SMALL = loremIpsum({ count: 7 });

function App() {
  return (
    <div className="app">
        <CanvasBar className="my-scrollable-container">
            <div style={{ width: 600 }}>
                <h3>Container with both scrollbars</h3>
                <p>{TEXT}</p>
            </div>
        </CanvasBar>
        <CanvasBar className="my-scrollable-container">
            <h3>Container with vertical scrollbar only</h3>
            <p>{TEXT}</p>
        </CanvasBar>
        <CanvasBar className="my-scrollable-container">
            <div style={{ width: 600 }}>
                <h3>Container with horizontal scrollbar only</h3>
                <p>{TEXT_SMALL}</p>
            </div>
        </CanvasBar>
        <CanvasBar className="my-scrollable-container">
            <h3>Container without scrollbar</h3>
            <p>{TEXT_SMALL}</p>
        </CanvasBar>
    </div>
  );
}

export default App;
