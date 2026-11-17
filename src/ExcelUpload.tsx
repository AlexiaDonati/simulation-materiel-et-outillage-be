import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

import * as XLSX from 'xlsx';

import uploadIcon from './icons/upload.svg';

import './form.css';

export default function ExcelUpload({ handleFileUpload }: { handleFileUpload: (rows: unknown[][], formType: string) => void }) {
    const [formulaireType, setFormulaireType] = useState('default');

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const processFile = async (file: File, formType: string) => {
        if (!file) return;

        const fileExtension = file.name.toLowerCase().split('.').pop();
        const validExtensions = ["xlsx", "xls", "txt"];

        const isValid = validExtensions.includes(fileExtension || '');
        if (!isValid) {
            toast.error("Veuillez sélectionner un fichier Excel (.xlsx ou .xls) ou texte (.txt).");
            return;
        }

        try{
            let rows: unknown[][] = [];

            if (fileExtension === 'txt') {
                const content = await file.text();

                rows = content.split(/\r?\n/) // split the content into rows
                    .slice(1) // skip column headers row
                    .filter(row => row.trim() !== '') // filter out empty row
                    .map(row => row.split('\t')); // split the rows into values
            } 
            else {
                const buffer = await file.arrayBuffer();

                const workbook = XLSX.read(buffer, {
                    type: 'array',
                });
                
                // Take the first worksheet
                const sheetName = workbook.SheetNames[0];
                
                if (!sheetName) {
                    toast.error('Le fichier Excel ne contient pas de feuille de calcul.');
                    return;
                }
                
                const worksheet = workbook.Sheets[sheetName];

                rows = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    defval: '',
                    range: formType === 'default' ? 19 : 1,
                });
            }
            
            handleFileUpload(rows, formType);
        }
        catch (error) {
            toast.error("Erreur lors de la lecture du fichier.");
        }           
    };

    // ref for the file input element
    const inputRef = useRef<HTMLInputElement>(null);

    // drag state
    const [isDragging, setIsDragging] = useState(false);

    // handle drag events
    const handleDrag = function(event: React.DragEvent<HTMLElement>) {
        event.preventDefault();
        event.stopPropagation();

        if (event.type === "dragenter" || event.type === "dragover") {
            setIsDragging(true);
        } 
        else if (event.type === "dragleave") {
            setIsDragging(false);
        }
    };

    // handle drop event
    const handleDrop = function(event: React.DragEvent<HTMLElement>) {
        event.preventDefault();
        event.stopPropagation();

        setIsDragging(false);

        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            setSelectedFile(event.dataTransfer.files[0]);
        }
    };

    // handle file selection
    const handleChange = function(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };
    
    // triggers the input when the button is clicked
    const onButtonClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedFile) {
            toast.error("Veuillez sélectionner un fichier.");
            return;
        }

        processFile(selectedFile, formulaireType);
    };

    return (<>
        <div>
            <label>
                <input 
                    type="radio" 
                    value="default" 
                    checked={formulaireType === 'default'} 
                    onChange={() => {setFormulaireType("default")}} 
                /> 
                Formulaire légal (43D)
            </label>
            <br />
            <label>
                <input 
                    type="radio" 
                    value="alt" 
                    checked={formulaireType === 'alt'} 
                    onChange={() => {setFormulaireType("alt")}} 
                /> 
                Formulaire alternatif (Listing)
            </label>
            <br />
            <label>
                <input 
                    type="radio" 
                    value="easyval" 
                    checked={formulaireType === 'easyval'} 
                    onChange={() => {setFormulaireType("easyval")}} 
                /> 
                Formulaire alternatif (EasyVal)
            </label>
        </div>

        <form id="form-file-upload" onDragEnter={handleDrag} onClick={onButtonClick} onSubmit={handleSubmit}>
            <input ref={inputRef} type="file" id="input-file-upload" multiple={false} accept=".xlsx,.xls,.txt" onChange={handleChange} />

            <div className="icon-container">
                <img alt="upload" src={uploadIcon} />
            </div>

            <p className={`drag-text ${isDragging ? "drag-active" : ""}`}>Déposer ou cliquer pour choisir votre fichier</p>

            <p className="file-info">Formulaire au format Excel (.xlsx ou .xls) ou texte (.txt)</p>

            {selectedFile && ( <p className="file-info"> Fichier sélectionné: <strong>{selectedFile.name}</strong> </p> )}

            {isDragging && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
        </form>

        <button type="submit" form="form-file-upload" disabled={!selectedFile}>
            Importer
        </button>
    </>);
}