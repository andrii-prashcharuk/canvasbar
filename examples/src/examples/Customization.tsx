import { loremIpsum } from 'lorem-ipsum';
import { CanvasBar, CanvasBarConfigContext } from  'canvasbar-react';

const TEXT = loremIpsum({ count: 100 });

export function Customization() {
  return (
    <div className="grid-page">
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
    </div>
  );
}
