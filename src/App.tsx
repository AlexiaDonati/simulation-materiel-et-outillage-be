import { useState } from 'react';

import { parseMaterialExcel, type MaterialRow, } from './utils/parseExcel';

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

  const numberFormatter = new Intl.NumberFormat('de-DE', {
    useGrouping: false,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <>
      <section id="center">
        <div>
          <h1>Simulation du calcul du revenu cadastral du matériel et outillages en Wallonie</h1>
          <a href="https://finances.belgium.be/fr/entreprises/donnees-patrimoniales/materiel-outillage" target="_blank" rel="noopener noreferrer">
            Lien vers la documentation officielle
          </a>
        </div>
      </section>

      <div>
        <label htmlFor="excel-upload">Uploader le fichier Excel à calculer</label>

        <input 
          type="file" 
          accept=".xlsx,.xls" 
          onChange={handleFileUpload} 
        />

        {fileName && ( <p> Fichier sélectionné: <strong>{fileName}</strong> </p> )} 
          
        {error && ( <p role="alert"> {error} </p> )} 
        
        <p> Materials found: {materials.length} </p> 
        
        {materials.map((material, index) => ( 
          <div key={index}> 
            <h3> {material.orderNumber ?? index + 1}.{' '} {material.description ?? 'matériel sans désignation'} </h3> 

            <p> Affectation en: {material.add.year} </p> 
            <p> Investissement: {numberFormatter.format(material.add.value)} </p> 
            <p> Code: {material.add.code} 
            
            </p> {material.remove !== null && ( 
              <>
                <p> Désaffectation en: {material.remove.year} </p> 
                <p> Désinvestissement: {numberFormatter.format(material.remove.value)} </p>
              </> 
            )}

            <p> Remarks: {material.remarks ?? 'None'} </p>
          </div>
        ))}

      </div>
    </>
  )
}

export default App
