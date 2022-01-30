import {
  Route,
  Routes,
} from 'react-router-dom';
import { useBodyCanvasBar } from  'canvasbar-react';

import { Nav } from './Nav';
import { Basic } from './examples/Basic';
import { Heavy } from './examples/Heavy';
import { Customization } from './examples/Customization';
import { BodyScrollbars } from './examples/BodyScrollbars';
import { Table } from './examples/Table';
import { Sticky } from './examples/Sticky';

import './App.css';

export default function App() {
  useBodyCanvasBar();

  return (
    <div>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Basic />} />
          <Route path="/heavy" element={<Heavy />} />
          <Route path="/customization" element={<Customization />} />
          <Route path="/body-scrollbars" element={<BodyScrollbars />} />
          <Route path="/table" element={<Table />} />
          <Route path="/sticky" element={<Sticky />} />
          <Route path="*" element={<Basic />} />
        </Routes>
      </main>
    </div>
  );
}
