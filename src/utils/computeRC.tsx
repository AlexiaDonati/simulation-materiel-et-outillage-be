import { type MaterialRow } from './parseExcel';

export interface ResultRC {
    addYear6F: Map<number, number>; // compute the 6F for each year before 2005
    total6F: number; // total for 6F

    sum6X3: number; // sum of 6X3 for 2005

    addYear6X4: Map<number, number>; // compute the 6X4 for each year after 2005 (without 2015 and 2016))
    total6X4: number; // total for 6X4
    
    addYear6X10_2015: number; // compute the 6X10 for 2015
    addYear6X10_2016: number; // compute the 6X10 for 2016

    occasion: number; // occasion after 2004

    // TODO: Seuil
}

const coefficients = new Map<number, number>([
    [1919, 11.49],
    [1920, 6.15],
    [1921, 6.30],
    [1922, 6.43],
    [1923, 4.37],
    [1924, 3.89],
    [1925, 4.02],
    [1926, 2.72],
    [1927, 2.35],
    [1928, 2.35],
    [1929, 2.35],
    [1930, 2.35],
    [1931, 2.35],
    [1932, 2.35],
    [1933, 2.35],
    [1934, 2.35],
    [1935, 1.86],
    [1936, 1.70],
    [1937, 1.70],
    [1938, 1.70],
    [1939, 1.70],
    [1940, 1.70],
    [1941, 1.70],
    [1942, 1.70],
    [1943, 1.70],
    [1944, 1.14],
    [1945, 1.14],
    [1946, 1.14],
    [1947, 1.14],
    [1948, 1.14],
    [1949, 1.10],
]);

function getCoefficient(year: number): number {
    if (year <= 1918) {
        return 16.33;
    }

    if (year >= 1950) {
        return 1;
    }

    return coefficients.get(year) ?? 1;
}

function getSum(materials: MaterialRow[], code: number | null): number {
    if (!materials) {
        return 0;
    }

    let sum = 0;
    for (const material of materials) {
        if(code !== null && material.add.code !== code) {
            continue;
        }

        let sumi = material.add.value;
        if(material.remove !== null) {
            sumi -= material.remove.value;
        }
        
        const coeff = getCoefficient(material.add.year);
        sum += sumi * coeff;
    }

    return sum;
}

export async function computeRC(materials: MaterialRow[]): Promise<ResultRC> {
    let addYearMap = new Map();

    // store the materials by their add year
    for (const material of materials) {
        const addYear = material.add.year;
        if (!addYearMap.has(addYear)) {
            addYearMap.set(addYear, []);
        }

        addYearMap.get(addYear).push(material);
    }

    let addYear6F = new Map<number, number>(); // compute the 6F for each year before 2005
    let total6F = 0; // total for 6F

    for (const [year, materials] of addYearMap.entries()) {
        if(year >= 2005) {
            continue;
        }

        const sum = getSum(materials, null);

        addYear6F.set(year, sum);
        total6F += sum
    }

    const sum6X3 = addYearMap.has(2005) ? getSum(addYearMap.get(2005), 3) : 0; // compute the 6X3 for 2005

    let addYear6X4 = new Map<number, number>(); // compute the 6X4 for each year after 2005 (without 2015 and 2016))
    let total6X4 = 0;

    let addYear6X10_2015 = 0;
    let addYear6X10_2016 = 0;

    let occasion = 0; // occasion after 2004

    for (const [year, materials] of addYearMap.entries()) {
        if(year < 2005) {
            continue;
        }

        occasion += getSum(materials, 4);

        if(year === 2005) {
            continue; // skip 2005 as it is already handled
        }

        if(year === 2015) {
            addYear6X10_2015 = getSum(materials, 3);
        }
        else if(year === 2016) {
            addYear6X10_2016 = getSum(materials, 3);
        }
        else {
            const sum = getSum(materials, 3);

            addYear6X4.set(year, sum);
            total6X4 += sum;
        }
    }

    return {
        addYear6F,
        total6F,
        sum6X3,
        addYear6X4,
        total6X4,
        addYear6X10_2015,
        addYear6X10_2016,
        occasion
    };
}