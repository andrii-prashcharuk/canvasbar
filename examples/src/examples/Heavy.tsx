import { CanvasBar } from  'canvasbar-react';

const IMAGES_IDS = Array.from(Array(10).keys());

export function Heavy() {
  return (
    <CanvasBar className="my-scrollable-container">
      <h3>Container with 10 large images (3000x3000 resized to 600x600) and both scrollbars</h3>
      {IMAGES_IDS.map(id => (
        <img key={id} src={`https://picsum.photos/id/${id}/3000/3000`} alt="test" />
      ))}
    </CanvasBar>
  );
}
