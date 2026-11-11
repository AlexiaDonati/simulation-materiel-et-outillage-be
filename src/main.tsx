import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router';

import App from './App.tsx';
import Theory from './Theory.tsx';

import './index.css'

const root = document.getElementById("root");

createRoot(root!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/simulation-materiel-et-outillage-be/" element={<App />} />
      <Route path="/simulation-materiel-et-outillage-be/information" element={<Theory />} />
    </Routes>
  </BrowserRouter>
)