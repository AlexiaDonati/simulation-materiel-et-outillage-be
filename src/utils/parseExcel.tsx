import * as XLSX from 'xlsx';

export interface MaterialRow {
  orderNumber: string | null; // not used in the calculation
  description: string | null; // not used in the calculation

  add: {
    year: number;
    value: number;
    code: 3 | 4; // 3 = new, 4 = acquisition
  };

  remove: {
    year: number;
    value: number;
  } | null;

  remarks: string | null; // not used in the calculation 

  // TODO: code d'exonération
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    // remove any non-numeric characters except for the decimal separator (comma)
    let normalized = value.trim().replace(/[^0-9,-]/g, '')

    // Handle cases where the string might contain multiple commas
    const commaCount = (normalized.match(/,/g) || []).length;
    if (commaCount > 1) {
      throw new Error(`Invalid number format: ${value}`);
    }

    normalized = normalized.replace(/,/g, '.'); // Replace comma with dot for decimal numbers
    const number = Number(normalized); 

    return Number.isFinite(number) ? number : null;
  }
  return null;
}

function toString(value: unknown): string {
  return value == null ? '' : String(value).trim();
}

export async function parseMaterialExcel(file: File): Promise<MaterialRow[]> {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: 'array',
  });

  // Take the first worksheet
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error('The Excel file contains no worksheets.');
  }

  const worksheet = workbook.Sheets[sheetName];

  // Read the worksheet as arrays, preserving column positions.
  const rows: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: '',
    range: 19, // Excel row 20; zero-based internally
  });
  
  const materials: MaterialRow[] = [];
  
  for (const row of rows) { 
    if (row[0] === '3. Déclarant'){ // We reached the end of the material list, stop parsing
        break; 
    }

    const orderNumber = toString(row[0]); // 1
    const description = toString(row[1]); // 2
    
    const newYear = toNumber(row[7]); // 3a
    const newValue = toNumber(row[8]); // 3b 
    
    const acquisitionYear = toNumber(row[9]); // 4a
    const acquisitionValue = toNumber(row[10]); //4b
    
    const fraisYear = toNumber(row[11]); // 5a -> currently ignored
    // TODO: What to do if fraisYear != add.year?

    const fraisValue = toNumber(row[12]); // 5b

    const removeYear = toNumber(row[13]); // 5c
    const removeValue = toNumber(row[14]); // 5d
    
    const remarks = toString(row[15]);

    const isEmpty = 
        newYear === null && 
        newValue === null && 
        acquisitionYear === null && 
        acquisitionValue === null && 
        fraisYear === null && 
        fraisValue === null && 
        removeYear === null && 
        removeValue === null 
    if (isEmpty) { 
        continue; 
    }

    // add

    const hasNew = newYear !== null || newValue !== null;
    const hasAcquisition = acquisitionYear !== null || acquisitionValue !== null;

    if(!hasNew && !hasAcquisition) {
        throw new Error(
            `Row ${row[0]}: Must have either a new condition or an acquisition.`
        );
    }

    if (hasNew && hasAcquisition) {
        throw new Error(
            `Row ${row[0]}: Cannot have both a new condition and an acquisition.`
        );
    }
    
    const add = hasNew
        ? { year: newYear!, value: newValue!, code: 3 as const }
        : { year: acquisitionYear!, value: acquisitionValue!, code: 4 as const };
    
    if(add.year < 1900 || add.year > 2100) {
        throw new Error(
            `Row ${row[0]}: Year must be between 1900 and 2100.`
        );
    }

    if(add.year === null || add.value === null) {
        throw new Error(
            `Row ${row[0]}: Both year and value must be provided for the add operation.`
        );
    }

    // frais
    const hasFrais = fraisYear !== null || fraisValue !== null;

    if (hasFrais && (fraisValue === null)) { // If fraisYear is provided but fraisValue is not, we throw an error.
        throw new Error(
            `Row ${row[0]}: Value must be provided for the frais operation.`
        );
    }

    add.value = hasFrais ? add.value + fraisValue! : add.value;

    // remove

    const hasRemove = removeYear !== null || removeValue !== null

    if (hasRemove) {
        if (removeYear === null || removeValue === null) { // If either removeYear or removeValue is provided but the other is not, we throw an error.
            throw new Error(
                `Row ${row[0]}: Both year and value must be provided for the remove operation.`
            );
        }

        if(removeYear! < 1900 || removeYear! > 2100) {
            throw new Error(
                `Row ${row[0]}: Year must be between 1900 and 2100.`
            );
        }

        if (removeYear! < add.year) {
            throw new Error(
                `Row ${row[0]}: Remove year cannot be earlier than add year.`
            );
        }
        if (removeValue! > add.value) {
            throw new Error(
                `Row ${row[0]}: Remove value cannot be greater than add value + frais value.`
            );
        }
    }

    const remove = hasRemove 
        ? { year: removeYear!, value: removeValue! } 
        : null;
    
    materials.push({
        orderNumber,
        description,
        add,
        remove,
        remarks,
    });
  }

  return materials;
}