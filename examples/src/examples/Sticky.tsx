import { loremIpsum } from 'lorem-ipsum';
import { CanvasBar } from 'canvasbar-react';

const WORDS = loremIpsum({ count: 1000 }).split(' ');
const COLUMNS_COUNT = 20;
const COLUMNS_IDS = Array.from(Array(COLUMNS_COUNT).keys());
const ROWS_COUNT = Math.floor(WORDS.length / COLUMNS_COUNT);
const ROWS_IDS = Array.from(Array(ROWS_COUNT).keys());

export function Sticky() {
  return (
    <>
      <h3>Large table with sticky first column and first row (with both scrollbars)</h3>
      <CanvasBar className="my-scrollable-table-sticky">
        <table>
          <thead>
          <tr>
            {COLUMNS_IDS.map(id => <th key={id}>Column #{id + 1}</th>)}
          </tr>
          </thead>
          <tbody>
          {ROWS_IDS.map(rowId => (
            <tr key={rowId}>
              {COLUMNS_IDS.map(colId => (
                <td key={colId}>
                  {colId ? WORDS[rowId * COLUMNS_COUNT + colId] : `Row #${rowId + 1}`}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </CanvasBar>
    </>
  );
}
