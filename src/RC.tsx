import { useState } from 'react';

import { type MaterialRow } from './utils/parseExcel';
import { type ResultRC, computeRC } from './utils/computeRC';

const coeffRC = 0.0159;

export default function RC({ materials }: { materials: MaterialRow[] }) {
    const [resultRC, setResultRC] = useState<ResultRC | null>(null);

    const handleComputeRC = async () => {
        const resultRC: ResultRC = await computeRC(materials);
        setResultRC(resultRC);
    };

    return (
        <>
            {materials.length > 0 && (
                <div className="container">
                    <h2>Calcul du revenu cadastral</h2>

                    {resultRC && (
                        <div className="rc-results">
                            <div>
                                <h3>6F pour les années avant 2005</h3>
                                <ul>
                                    {Array.from(resultRC.addYear6F.entries())
                                        .sort(([yearA], [yearB]) => yearA - yearB)
                                        .map(([year, value]) => (
                                        <li key={year}>{year} : {value.toFixed(2)}</li>
                                    ))}
                                </ul>
                                <p>Total 6F : {resultRC.total6F.toFixed(2)}</p>
                            </div>
                            
                            <div>
                                <h3>6X3 pour 2005</h3>
                                <ul><li key={2005}>2005 : {resultRC.sum6X3.toFixed(2)}</li></ul>

                                <h3>6X4 pour les années après 2005 (sauf 2015 et 2016)</h3>
                                <ul>
                                    {Array.from(resultRC.addYear6X4.entries())
                                        .sort(([yearA], [yearB]) => yearA - yearB)
                                        .map(([year, value]) => (
                                            <li key={year}>{year} : {value.toFixed(2)}</li>
                                    ))}
                                </ul>
                                <p>Total 6X4 : {resultRC.total6X4.toFixed(2)}</p>

                                <h3>6X10 pour les années 2015 et 2016</h3>
                                <ul>
                                    <li key="2015">2015 : {resultRC.addYear6X10_2015.toFixed(2)}</li>
                                    <li key="2016">2016 : {resultRC.addYear6X10_2016.toFixed(2)}</li>
                                </ul>
                            </div>

                            <div>
                                <p>Occasion après 2004 : {resultRC.occasion.toFixed(2)}</p>

                                <p>Seuil : {resultRC.seuil.toFixed(2)}</p>

                                <h3>Correction du seuil et occasion</h3>

                                <p>6F : {(resultRC.correction6F * coeffRC).toFixed(2)}</p>
                                <p>6X3 : {(resultRC.correction6X3 * coeffRC).toFixed(2)}</p>
                                <p>6X4 : {(resultRC.total6X4 * coeffRC).toFixed(2)}</p>
                                <p>6X10 : {((resultRC.addYear6X10_2015 + resultRC.addYear6X10_2016) * coeffRC).toFixed(2)}</p>
                            </div>
                        </div>
                    )}

                    <button onClick={handleComputeRC}>Calculer le revenu cadastral</button>
                </div>
            )}   
        </>
    );
}