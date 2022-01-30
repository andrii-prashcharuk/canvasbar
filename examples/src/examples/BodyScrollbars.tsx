import { loremIpsum } from 'lorem-ipsum';

const TEXT = loremIpsum({ count: 1000 });

export function BodyScrollbars() {
  return (
    <div className="overflow-page">
      <h3>Large container with a lot of text</h3>
      <i>Body scrollbar customization is done with <b>useBodyCanvasBar</b> hook in the root component (see <b>App.tsx</b>). This page just displays a result when content is too large, so body scrollbars are shown.</i>
      <p>{TEXT}</p>
    </div>
  );
}
