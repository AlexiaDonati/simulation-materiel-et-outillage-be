import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

import uploadIcon from './icons/upload.svg';

import './form.css';

export default function ExcelUpload({ handleFileUpload }: { handleFileUpload: (file: File) => void }) {
    const [fileName, setFileName] = useState("");

    const processFile = function(file: File) {
        if (!file) {
            return;
        }

        const validExtensions = [".xlsx", ".xls"];
        const isValid = validExtensions.some((extension) =>
            file.name.toLowerCase().endsWith(extension)
        );
        
        if (!isValid) {
            toast.error("Veuillez sélectionner un fichier Excel (.xlsx ou .xls).");
            return;
        }

        setFileName(file.name);

        handleFileUpload(file);
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
            processFile(event.dataTransfer.files[0]);
        }
    };

    // handle file selection
    const handleChange = function(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        if (event.target.files && event.target.files[0]) {
            processFile(event.target.files[0]);
        }
    };
    
    // triggers the input when the button is clicked
    const onButtonClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <form id="form-file-upload" 
            onDragEnter={handleDrag} 
            onClick={onButtonClick}
            onSubmit={(e) => e.preventDefault()} 
        >
            <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />

            <div className="icon-container">
                <img alt="upload" src={uploadIcon} />
            </div>

            <p className={`drag-text ${isDragging ? "drag-active" : ""}`}>Déposer ou cliquer pour choisir votre fichier</p>

            <p className="file-info">Formulaire 43D au format Excel (.xlsx ou .xls)</p>

            {fileName && ( <p className="file-info"> Fichier sélectionné: <strong>{fileName}</strong> </p> )}

            {isDragging && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
        </form>
    );
}