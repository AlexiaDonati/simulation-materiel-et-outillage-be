import { useState } from 'react';

import { parseMaterialExcel, type MaterialRow, } from './utils/parseExcel';

import MaterialsTable from './MaterialsTable';
import RC from './RC.js';

import './App.css'

function App() {
  const [fileName, setFileName] = useState('')

  const [materials, setMaterials] = useState<MaterialRow[]>([]); 
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async ( 
    event: React.ChangeEvent<HTMLInputElement>, 
  ) => { 
    const file = event.target.files?.[0]; 
    if (!file) { 
      return; 
    } 

    setFileName(file.name);

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
      <section id="center">
        <div>
          <h1>Simulation du calcul du revenu cadastral du matériel et outillage en Wallonie</h1>
          <a href="https://finances.belgium.be/fr/entreprises/donnees-patrimoniales/materiel-outillage" target="_blank" rel="noopener noreferrer">
            Lien vers la documentation officielle
          </a>
        </div>

        <div>
          <label htmlFor="excel-upload">Uploader le fichier Excel à calculer</label>

          <input 
            type="file" 
            accept=".xlsx,.xls" 
            onChange={handleFileUpload} 
          />

          {fileName && ( <p> Fichier sélectionné: <strong>{fileName}</strong> </p> )} 
           
        </div>

        {error && ( <p role="alert"> {error} </p> )} 
          
        <p> Materials found: {materials.length} </p> 
          
        <MaterialsTable materials={materials} />

        <hr />

        <RC materials={materials} />
      </section>
    </>
  )
}

export default App
