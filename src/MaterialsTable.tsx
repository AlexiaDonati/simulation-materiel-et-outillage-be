import { HotTable } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';

import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';

registerAllModules();

import type { MaterialRow } from './utils/parseExcel';

export default function MaterialsTable({ materials }: { materials: MaterialRow[] }) {
    const numberFormatter = new Intl.NumberFormat('de-DE', {
        useGrouping: false,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <HotTable className="table"
            data={[
                ...materials.map((material) => [
                    material.orderNumber ?? '',
                    material.description ?? '',

                    material.add.year,
                    numberFormatter.format(material.add.value),
                    material.add.code === 3 ? 'Neuf' : 'Occasion',

                    material.remove?.year ?? '',
                    material.remove?.value ? numberFormatter.format(material.remove.value) : '',

                    material.remarks ?? '',
                ]),
            ]}

            colHeaders={["Numéro d'ordre", "Description", "Année d'investissement", "Valeur d'investissement", "Type d'investissement", "Année de désinvestissement", "Valeur de désinvestissement", "Remarques"]}
            rowHeaders={true}
            
            height='auto'
            width='100%'
            stretchH='all'

            autoWrapRow={true}
            autoWrapCol={true}

            licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        />
    );
}