import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router';

import App from './App.tsx';
import Theory from './Theory.tsx';

import './index.css'

const root = document.getElementById("root");

createRoot(root!).render(
  <BrowserRouter basename="/simulation-materiel-et-outillage-be" >
    <Routes>
      <Route path="" element={<App />} />
      <Route path="/information" element={<Theory />} />
    </Routes>
  </BrowserRouter>
)