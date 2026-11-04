import { useState, useEffect, useRef} from 'react';

import { HotTable } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';

import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';

registerAllModules();

import type { MaterialRow } from './utils/parseExcel';
import { getExonerationFromRemarks } from './utils/parseExcel';

type TableRows = (MaterialRow | null)[];

const materialToTableData = (material: MaterialRow | null) : any[] => { 
    if (!material) { 
        return [ '', '', '', '', '', '', '', '', ]; 
    } 
    
    return [ 
        material.orderNumber ?? '', 
        material.description ?? '', 
        
        material.add?.year ?? '', 
        material.add?.value ?? '', 
        material.add?.code === 3 
            ? 'Neuf' 
            : material.add?.code === 4 
                ? 'Occasion' 
                : '', 
        
        material.remove?.year ?? '', 
        material.remove?.value ?? '', 
        material.remarks ?? '', 
    ]; 
};

type Props = { 
    materials: MaterialRow[]; 
    onChange: (materials: MaterialRow[]) => void; 
};

export default function MaterialsTable({ materials, onChange } : Props) {

    const [tableRows, setTableRows] = useState<TableRows>(() => {
        const rows: TableRows = [...materials];

        while (rows.length < 15) {
            rows.push(null);
        }

        return rows;
    });
    
    const tableRowsRef = useRef<TableRows>(tableRows);

    useEffect(() => {
        tableRowsRef.current = tableRows;
    }, [tableRows]);

    // --- synchronize external changes ---

    const lastEmittedMaterialsRef = useRef<string>(JSON.stringify(materials));

    useEffect(() => { 
        const incomingSignature = JSON.stringify(materials); 
        
        // do not update the table if the data received is the same as the last data sent/received
        if (incomingSignature === lastEmittedMaterialsRef.current) { 
            return; 
        } 
        
        const rows: TableRows = [...materials];
        
        while (rows.length < 15) { 
            rows.push(null); 
        } 
        
        tableRowsRef.current = rows; 
        setTableRows(rows); 

        lastEmittedMaterialsRef.current = incomingSignature; 
    }, [materials]);

    const emitMaterials = (rows: TableRows) => {
        const actualMaterials = rows.filter(
            (row): row is MaterialRow => row !== null
        );

        lastEmittedMaterialsRef.current = JSON.stringify(actualMaterials);

        onChange(actualMaterials);
    };

    return (
        <HotTable className="table"
            data={tableRows.map((material) =>
                materialToTableData(material)
            )}

            nestedHeaders={[
                ['', '', { label: 'Investissement', colspan: 3 }, { label: 'Désinvestissement', colspan: 2 }, ''],
                ["Numéro d'ordre", "Description", "Année", "Valeur", "Type", "Année", "Valeur", "Remarques"],
            ]}
            
            columns={[
                {},                     // orderNumber
                {},                     // description
                { type: 'numeric' },    // add.year
                {                       // add.value
                    type: 'numeric',
                    locale: 'de-DE',
                    numericFormat: {
                        style: 'currency',
                        currency: 'EUR',
                        minimumFractionDigits: 2
                    }
                },
                {                       // add.code
                    type: 'dropdown',
                    source: ['Neuf', 'Occasion'],
                },
                { type: 'numeric' },    // remove.year
                {                       // remove.value
                    type: 'numeric',
                    locale: 'de-DE',
                    numericFormat: {
                        style: 'currency',
                        currency: 'EUR',
                        minimumFractionDigits: 2
                    }
                },
                {}                      // remarks
            ]}
            
            rowHeaders={true}

            minRows={15} 
            minSpareRows={1} // Adds 1 empty row at the end automatically
            
            // --- dimensions ---

            height='auto'
            width='100%'
            stretchH='all'

            autoWrapRow={true}
            autoWrapCol={true}

            // --- contextMenu ---

            contextMenu={true}

            allowInsertColumn={false}
            allowRemoveColumn={false}

            allowInsertRow={true}
            allowRemoveRow={true}

            // --- after data change ---

            afterCreateRow={(index, amount) => { 
                setTableRows(current => {
                    const updated = [...current];

                    updated.splice(
                        index,
                        0,
                        ...Array<MaterialRow | null>(amount).fill(null)
                    );

                    return updated;
                });
            }}

            afterRemoveRow={(index, amount) => {
                setTableRows(current => {
                    const updated = [...current];

                    updated.splice(index, amount);

                    while (updated.length < 15) {
                        updated.push(null);
                    }

                    return updated;
                });
            }}

            afterChange={(changes, source) => {
                if (!changes || source === 'loadData') { 
                    return; 
                } 
                
                const currentRows = tableRowsRef.current; 

                const updatedRows: TableRows = currentRows.map((row) =>
                    row 
                        ? {...row,
                            add: {...row.add},
                            remove: row.remove
                                ? { ...row.remove } 
                                : null,
                        } : null
                );
                
                changes.forEach(([row, prop, oldValue, newValue]) => { 
                    if (oldValue === newValue) { 
                        return; 
                    } 

                    // --- row ---
                    
                    let material = updatedRows[row];

                    if (!material) { // empty row -> create empty MaterialRow
                        material = { 
                            orderNumber: null, 
                            description: null, 

                            add: { year: 1900, value: 0, code: 3, }, 
                            remove: null, 

                            remarks: '', 
                            exoneration: null,
                        }
                    }

                    // --- column ---
                
                    let error = false

                    switch (prop) {
                        case 0: // order number
                            if(newValue !== null && newValue !== undefined && String(newValue).trim() !== ''){
                                material.orderNumber = String(newValue);
                            }
                            else {
                                material.orderNumber = null
                            }

                            break; 

                        case 1: // description
                            if(newValue !== null && newValue !== undefined && String(newValue).trim() !== ''){
                                material.description = String(newValue);
                            }
                            else {
                                material.description = null
                            }

                            break;

                        case 2: // add year
                            if (newValue === '' || newValue === null || newValue === undefined) { 
                                break; 
                            } 

                            if (!Number.isFinite(Number(newValue)) || Number(newValue) < 1900 || Number(newValue) > 2100) { 
                                console.error(`Row ${row}: Year must be between 1900 and 2100.`); 
                                error = true;
                                break; 
                            } 

                            if(material.remove && Number(newValue) > material.remove.year){
                                console.error(`Row ${row}: Remove year must be greater or equal than add year`); 
                                error = true;
                                break; 
                            }
                            
                            material.add.year = Number(newValue); 
                            break;

                        case 3: // add value
                            if (newValue === '' || newValue === null || newValue === undefined) { 
                                material.add.value = 0; 
                                break; 
                            } 

                            if(material.remove && Number(newValue) < material.remove.value){
                                console.error(`Row ${row}: Remove value must be smaller or equal than add year`); 
                                error = true;
                                break; 
                            }

                            material.add.value = Number.isFinite(Number(newValue)) ? Number(newValue) : 0;

                            break; 

                        case 4: // add code
                            if (newValue === 'Neuf') { 
                                material.add.code = 3; 
                            } 
                            else if (newValue === 'Occasion') {
                                material.add.code = 4;
                            } 
                            else {
                                console.error(`Row ${row}: Type must be "Neuf" or "Occasion".`); 
                                error = true;
                            }

                            break; 

                        case 5: // remove year
                            if (newValue === '' || newValue === null || newValue === undefined) { 
                                break; 
                            } 

                            if (!Number.isFinite(Number(newValue)) || Number(newValue) < 1900 || Number(newValue) > 2100) { 
                                console.error(`Row ${row}: Year must be between 1900 and 2100.`); 
                                error = true;
                                break; 
                            } 

                            if(Number(newValue) < material.add.year){
                                console.error(`Row ${row}: Remove year must be greater or equal than add year`); 
                                error = true;
                                break; 
                            }

                            material.remove = material.remove ?? {
                                year: material.add.year,
                                value: 0,
                            };

                            material.remove.year = Number(newValue); 
                            break;

                        case 6: // remove value
                            if (newValue === '' || newValue === null || newValue === undefined) { 
                                break;
                            } 

                            if(Number(newValue) > material.add.value){
                                console.error(`Row ${row}: Remove value must be smaller or equal than add value`); 
                                error = true;
                                break; 
                            }

                            material.remove = material.remove ?? {
                                year: material.add.year,
                                value: 0,
                            };

                            material.remove.value = Number.isFinite(Number(newValue)) ? Number(newValue) : 0; 
                            break;

                        case 7: // remarks
                            if(newValue !== null && newValue !== undefined && String(newValue).trim() !== ''){
                                material.remarks = String(newValue);

                                // Check if the remarks contain an exoneration code and percentage
                                let exoneration: { code: string; value: number } | null = null;
                                
                                try {
                                    exoneration = getExonerationFromRemarks(material.remarks);
                                } catch (error) {
                                    console.error(`Row ${row}: ${error instanceof Error ? error.message : 'Invalid exoneration format.'}`);
                                    error = true;
                                    break;
                                }

                                material.exoneration = exoneration;
                            }
                            else {
                                material.remarks = null
                            }

                            break; 
                    }

                    if(!error){
                        updatedRows[row] = material;
                    }
                }); 
        
                tableRowsRef.current = updatedRows; 
                setTableRows(updatedRows); // update the fake visual table rows in the state

                emitMaterials(updatedRows); // send only real MaterialRows to the parent component
            }}

            // --- css classList ---

            afterGetColHeader={(col, TH) => {
                const borderAfterColumns = [0, 1, 4, 6];

                const colSpan = Number(TH.getAttribute('colspan') || 1);
                const lastColumn = col + colSpan - 1;

                if (borderAfterColumns.includes(lastColumn)) {
                    TH.classList.add('section-border');
                }
            }}

            cells={(_row, col) => {
                const borderAfterColumns = [0, 1, 4, 6];

                const cellProperties: any = {};

                if (borderAfterColumns.includes(col)){
                    cellProperties.className = 'section-border';
                }

                return cellProperties;
            }}

            // --- license ---

            licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        />
    );
}