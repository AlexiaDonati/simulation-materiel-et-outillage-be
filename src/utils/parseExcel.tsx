// list of possible exoneration codes
const EXONERATION_CODES = [
    'ADM',
    'BAT',
    'BUR',
    'DEP',
    'ETP',
    'HSI',
    'HUS',
    'IMM',
    'LES',
    'LOC',
    'MAC',
    'MMM',
    'MOB',
    'MPE',
    'NEX',
    'NIM',
    'NUS',
    'PES',
    'POM',
    'REP',
    'RES',
    'RPL',
    'RPT',
    'SHE',
    'TRP',
    'VAN'
];

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

    exoneration: {
        code: string;
        value: number;
    } | null;
}

function toNumber(value: unknown, separator: string): number | null {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === 'string') {
        let number = 0;

        if(separator === ','){
            // remove any non-numeric characters except for the decimal separator (comma)
            let normalized = value.trim().replace(/[^0-9,-]/g, '')

            // Handle cases where the string might contain multiple commas
            const commaCount = (normalized.match(/,/g) || []).length;
            if (commaCount > 1) {
                throw new Error(`Invalid number format: ${value}`);
            }

            normalized = normalized.replace(/,/g, '.'); // Replace comma with dot for decimal numbers
            number = Number(normalized); 
        }
        else if (separator === '.') {
            // Remove any non-numeric characters except for the decimal separator (dot)
            let normalized = value.trim().replace(/[^0-9.-]/g, '');

            // Handle cases where the string might contain multiple dots
            const dotCount = (normalized.match(/\./g) || []).length;
            if (dotCount > 1) {
                throw new Error(`Invalid number format: ${value}`);
            }

            number = Number(normalized);
        }

        return Number.isFinite(number) ? number : null;
    }
    return null;
}

function toString(value: unknown): string {
    return value == null ? '' : String(value).trim();
}

export function getExonerationFromRemarks(remarks: string): { code: string; value: number } | null {
    let exoneration: { code: string; value: number } | null = null;

    for (const code of EXONERATION_CODES) {
        if (remarks.includes(code)) { // case-sensitive match with the code in the remarks

            // if a code is found, extract the percentage too
            const match = remarks.match(/(\d{1,3})/); // match a number with 1 to 3 digits
            if (match) {
                const value = parseInt(match[1], 10);
                if (value < 0 || value > 100) {
                    throw new Error(
                        `Exoneration value must be between 0 and 100.`
                    );
                }

                exoneration = { code, value };
            } else {
                throw new Error(
                    `Exoneration code found but no valid percentage value provided.`
                );
            }

            break;
        }
    }

    return exoneration;
}

function checkAdd(add : { year: number, value: number, code: 3 | 4}){
    if(add.year < 1900 || add.year > 2100) {
        throw new Error(
            `Year must be between 1900 and 2100.`
        );
    }

    if(add.year === null || add.value === null) {
        throw new Error(
            `Both year and value must be provided for the add operation.`
        );
    }
}

function checkRemove(remove : { year: number, value: number }, add : { year: number, value: number, code: 3 | 4}){
    if(remove.year < 1900 || remove.year > 2100) {
        throw new Error(
            `Year must be between 1900 and 2100.`
        );
    }
    if (remove.year === null || remove.value === null) {
        throw new Error(
            `Both year and value must be provided for the remove operation.`
        );
    }

    // ---

    if (remove.year < add.year) {
        throw new Error(
            `Remove year cannot be earlier than add year.`
        );
    }
    if (remove.value > add.value) {
        throw new Error(
            `Remove value cannot be greater than add value.`
        );
    }
}

function parse43DRow(row : unknown[]): MaterialRow | undefined {
    const orderNumber = toString(row[0]); // 1
    const description = toString(row[1]); // 2
    
    const newYear = toNumber(row[7], ','); // 3a
    const newValue = toNumber(row[8], ','); // 3b 
    
    const acquisitionYear = toNumber(row[9], ','); // 4a
    const acquisitionValue = toNumber(row[10], ','); //4b
    
    const fraisYear = toNumber(row[11], ','); // 5a -> currently ignored
    // TODO: What to do if fraisYear != add.year?

    const fraisValue = toNumber(row[12], ','); // 5b

    const removeYear = toNumber(row[13], ','); // 5c
    const removeValue = toNumber(row[14], ','); // 5d
    
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
        return undefined; 
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

    try{
        checkAdd(add);
    }
    catch(e){
        throw new Error(
            `Row ${row[0]} : ${e}`
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

    const remove = hasRemove 
        ? { year: removeYear!, value: removeValue! } 
        : null;

    if (remove) {
        try{
            checkRemove(remove, add);
        }
        catch(e){
            throw new Error(
                `Row ${row[0]} : ${e}`
            );
        }
    }

    // exoneration
    
    let exoneration: { code: string; value: number } | null = null;
    try {
        exoneration = getExonerationFromRemarks(remarks);
    } catch (error) {
        throw new Error(
            `Row ${row[0]}: ${error instanceof Error ? error.message : 'Error parsing exoneration from remarks.'}`
        );
    }
    
    // --- 

    return{
        orderNumber,
        description,
        add,
        remove,
        remarks,
        exoneration,
    };
}

function parseListingRow(row : unknown[], imposition : boolean): MaterialRow | undefined {
    const separator = imposition ? '.' : ',';

    const orderNumber = toString(row[1]); // 1
    const description = toString(row[2]); // 2
    
    const newYear = toNumber(row[0], separator); // 3a
    const newValue = toNumber(row[3], separator); // 3b 
    
    // column 4 is from an old legacy form so it is ignored

    const ref = toString(row[5]);
    
    let exonerationValue = toNumber(row[6], separator);
    if(imposition){
        exonerationValue = 100 - exonerationValue!;
    }

    const exonerationCode = toString(row[7]);
    
    const remarks = exonerationValue + " " + exonerationCode;

    const removeYear = toNumber(row[8], separator); // 5c
    const removeValue = toNumber(row[10], separator); // 5d

    // ---

    const isEmpty = 
        newYear === null && 
        newValue === null && 
        removeYear === null && 
        removeValue === null 
        
    if (isEmpty) { 
        return undefined; 
    }

    // add

    const isOccassion = ref.includes("OCCASION");
    const add = isOccassion
        ? { year: newYear!, value: newValue!, code: 4 as const }
        : { year: newYear!, value: newValue!, code: 3 as const };

    try{
        checkAdd(add);
    }
    catch(e){
        console.log(row)
        throw new Error(
            `Row ${row[1]} : ${e}`
        );
    }

    // remove

    const hasRemove = removeYear !== null || removeValue !== null

    const remove = hasRemove 
        ? { year: removeYear!, value: removeValue! } 
        : null;

    if (remove) {
        try{
            checkRemove(remove, add);
        }
        catch(e){
            console.log(row)
            throw new Error(
                `Row ${row[1]} : ${e}`
            );
        }
    }

    // exoneration
    
    let exoneration: { code: string; value: number } | null = null;
    try {
        exoneration = getExonerationFromRemarks(remarks);
    } catch (error) {
        throw new Error(
            `Row ${row[1]}: ${error instanceof Error ? error.message : 'Error parsing exoneration from remarks.'}`
        );
    }
    
    // ---

    return{
        orderNumber,
        description,
        add,
        remove,
        remarks,
        exoneration,
    };
}

export function parseMaterials(rows: unknown[][], formType: string): MaterialRow[] {
  
    const materials: MaterialRow[] = [];
    
    for (const row of rows) { 
        if(formType === 'default'){
            if (row[0] === '3. Déclarant'){ // We reached the end of the material list, stop parsing
                break; 
            }

            const material = parse43DRow(row);
            if(!material){
                continue;
            }

            materials.push(material);
        }
        else if(formType === 'alt'){
            const material = parseListingRow(row, false);
            if(!material){
                continue;
            }

            materials.push(material);
        }
        else if(formType === 'easyval'){
            const material = parseListingRow(row, true);
            if(!material){
                continue;
            }

            materials.push(material);
        }
        else{
            throw new Error(`Unknown form name: ${formType}`);
        } 
    }

    return materials;
}