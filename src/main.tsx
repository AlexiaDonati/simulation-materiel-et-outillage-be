import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router';

import App from './App.tsx';
import Theory from './Theory.tsx';

import './index.css'

const root = document.getElementById("root");

createRoot(root!).render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/information" element={<Theory />} />
    </Routes>
  </HashRouter>
)