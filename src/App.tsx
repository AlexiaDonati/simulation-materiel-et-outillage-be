import { useState } from 'react';
import { NavLink, Link } from "react-router";

import { toast, Toaster, ToastBar } from 'react-hot-toast';

import { parseMaterialExcel, type MaterialRow, } from './utils/parseExcel';

import ExcelUpload from './ExcelUpload.js';
import MaterialsTable from './MaterialsTable';
import RC from './RC.js';

import './App.css'

import CloseIcon from './icons/close.svg';
import ErrorIcon from './icons/error.svg';

function App() {
  const [materials, setMaterials] = useState<MaterialRow[]>([]); 
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => { 
    if (!file) { 
      return; 
    } 

    setError(null); 

    setMaterials([]); 
    
    try { 
      const rows = await parseMaterialExcel(file); 
      setMaterials(rows); 
    } catch (error) { 
      setError( 
        error instanceof Error 
        ? error.message 
        : 'Unable to read the Excel file.', 
      ); 
    } 
  };

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}

        toastOptions={{
          duration: 10000,
          className: 'toast',

          error: {
            className: 'toast error',
            icon: <img alt="error" src={ErrorIcon} />,
          }
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                <div className="toast-icon"> 
                  {icon}
                </div>

                <div className="toast-message">
                  {message}
                </div>

                <div className="toast-icon" onClick={() => toast.dismiss(t.id)}> 
                  <img alt="close" src={CloseIcon} /> 
                </div>
              </>
            )}
          </ToastBar>
        )}
      </Toaster>

      <section id="center">
        <div className="header">
          <h1>Simulation du calcul du revenu cadastral du matériel et outillage en Wallonie</h1>

          <p>Cet outil n'est pas un service officiel de l'administration belge. Il est développé indépendamment et n'est ni affilié à, ni approuvé par, ni géré par une autorité publique.</p>

          <a href="https://finances.belgium.be/fr/entreprises/donnees-patrimoniales/materiel-outillage" target="_blank" rel="noopener noreferrer">
            Lien vers la documentation officielle
          </a>
        </div>

        <ExcelUpload handleFileUpload={handleFileUpload} />

        {error && ( <p role="alert"> {error} </p> )} 
          
        <RC materials={materials} />
        
        <MaterialsTable materials={materials} onChange={setMaterials}/>
      </section>

      <footer>
        
      </footer>
    </>
  );
}

export default App
