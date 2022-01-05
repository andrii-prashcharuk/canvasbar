import { loremIpsum } from 'lorem-ipsum';
import { CanvasBar, useBodyCanvasBar, CanvasBarConfigContext } from  'canvasbar-react';

import './App.css';

const TEXT = loremIpsum({ count: 100 });
const TEXT_SMALL = loremIpsum({ count: 7 });
const IMAGES_IDS = Array.from(Array(10).keys());

function App() {
  useBodyCanvasBar();

  return (
    <div className="app">
        <CanvasBar className="my-scrollable-container">
            <div style={{ width: 600 }}>
                <h3>Container with both scrollbars</h3>
                <p>{TEXT}</p>
            </div>
        </CanvasBar>
        <CanvasBar className="my-scrollable-container">
            <h3>Container with 10 large images (3000x3000 resized to 600x600) and both scrollbars</h3>
            {IMAGES_IDS.map(id => (
                <img key={id} src={`https://picsum.photos/id/${id}/3000/3000`} alt="test" />
            ))}
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
      <CanvasBar className="my-scrollable-container" config={{ thumbColor: 'rgba(166, 56, 220, .8)' }}>
        <div style={{ width: 600 }}>
          <h3>Container with customized scrollbars via config props</h3>
          <p>{TEXT}</p>
        </div>
      </CanvasBar>
      <CanvasBarConfigContext.Provider value={{ thumbColor: 'rgba(47, 226, 158, .8)' }}>
        <CanvasBar className="my-scrollable-container">
          <div style={{ width: 600 }}>
            <h3>Container with customized scrollbars via context</h3>
            <b>It's better to use it for customization all (or multiple) scrollbars on the page.</b>
            <p>{TEXT}</p>
          </div>
        </CanvasBar>
      </CanvasBarConfigContext.Provider>
        <CanvasBar className="my-scrollable-container">
            <h3>Container without scrollbar</h3>
            <p>{TEXT_SMALL}</p>
        </CanvasBar>
    </div>
  );
}

export default App;
