import { NavLink } from "react-router";

import { Accordion } from '@base-ui/react/accordion';

import ArrowIcon from './icons/arrow.svg';
import Pdf43Dter from './assets/20241212-43Dter-fr.pdf';

import './Theory.css';

export default function Theory() {
    return (<>
        <div className='container-header'>
            <NavLink to="/simulation-materiel-et-outillage-be/" className="return-button">
                <img alt="Arrow" className="Icon return" src={ArrowIcon} />
                <span>Retour</span>
            </NavLink>
        </div>

        <Accordion.Root className="Accordion">
            <Accordion.Item className="Item">
                <Accordion.Header className="Header">
                    <Accordion.Trigger className="Trigger">
                        <span>
                            43Dter 
                            (Explications relatives à la déclaration pour l'établissement du
                            revenu cadastral du matériel et de l'outillage utilisés pour une
                            exploitation industrielle, commerciale ou artisanale)
                        </span>
                        <a className="Icon"><img alt="Arrow" src={ArrowIcon} /></a>
                    </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Panel className="Panel">
                    <div className="Content">
                        <object data={Pdf43Dter} type="application/pdf" width="100%" height="600px">
                            <p>Erreur lors du chargement du pdf, veuillez vous référer à la documentation officielle : <a href="https://finances.belgium.be/fr/entreprises/donnees-patrimoniales/materiel-outillage#q8"></a></p>
                        </object>
                    </div>
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className="Item">
                <Accordion.Header className="Header">
                    <Accordion.Trigger className="Trigger">
                        Coefficients adaptant la valeur d'usage du matériel et de l'outillage acquis avant 1950 :
                        <a className="Icon"><img alt="Arrow" src={ArrowIcon} /></a>
                    </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Panel className="Panel">
                    <div className="Content">
                        <p>
                            Le revenu cadastral du matériel et de l'outillage est calculé sur la base de leur valeur d'usage
                            à un taux qui, établi comme le prévoient les dispositions légales applicables en la matière,
                            s'élève à 5,3%.
                        </p>
                        <p>
                            La valeur d'usage est présumée égale à 30% de la valeur d'investissement ou de revient à
                            l'état neuf, éventuellement augmentée du coût des transformations successives ; ladite valeur
                            d'usage est, le cas échéant, redressée par l'application des coefficients ci-dessous, prévus par
                            la loi, de manière à déterminer son montant à l'époque de référence au 1/1/1975.
                        </p>
                        <table>
                            <tr>
                                <th>Années</th>
                                <th>Coefficients</th>
                            </tr>
                            <tr>
                                <td>1918 et antérieures</td>
                                <td>16.33</td>
                            </tr>
                            <tr>
                                <td>1919</td>
                                <td>11.49</td>
                            </tr>
                            <tr>
                                <td>1920</td>
                                <td>6.15</td>
                            </tr>
                            <tr>
                                <td>1921</td>
                                <td>6.30</td>
                            </tr>
                            <tr>
                                <td>1922</td>
                                <td>6.43</td>
                            </tr>
                            <tr>
                                <td>1923</td>
                                <td>4.37</td>
                            </tr>
                            <tr>
                                <td>1924</td>
                                <td>3.89</td>
                            </tr>
                            <tr>
                                <td>1925</td>
                                <td>4.02</td>
                            </tr>
                            <tr>
                                <td>1926</td>
                                <td>2.72</td>
                            </tr>
                            <tr>
                                <td>1927 à 1934 incluse</td>
                                <td>2.35</td>
                            </tr>
                            <tr>
                                <td>1935</td>
                                <td>1.86</td>
                            </tr>
                            <tr>
                                <td>1936 à 1943 incluse</td>
                                <td>1.70</td>
                            </tr>
                            <tr>
                                <td>1944 à 1948 incluse</td>
                                <td>1.14</td>
                            </tr>
                            <tr>
                                <td>1949</td>
                                <td>1.10</td>
                            </tr>
                            <tr>
                                <td>1950 et suivantes</td>
                                <td>1</td>
                            </tr>
                        </table>
                    </div>
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item className="Item">
                <Accordion.Header className="Header">
                    <Accordion.Trigger className="Trigger">
                        Motifs et codes d'exemption pour proposer à l'Administration une exonération proportionnelle :
                        <a className="Icon"><img alt="Arrow" src={ArrowIcon} /></a>
                    </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Panel className="Panel">
                    <div className="Content">
                        <p>
                            Il est possible de proposer à l'Administration une exonération proportionnelle pour chaque ligne de
                            matériel et outillage pour les motifs indiqués dans le tableau ci-dessous.
                        </p> 
                        <p>
                            Cette proposition prend la forme d'un code à trois chiffres et d'un pourcentage de (1% à 100%) d'exonération proposé (ex : 80% SHE) 
                            à indiquer dans la colonne 6 «Remarques/informations supplémentaires».
                        </p>
                        <table>
                            <tr>
                                <th>CODE</th>
                                <th>SIGNIFICATION</th>
                                <th>JUSTIFICATION LEGALE</th>
                            </tr>
                            <tr>
                                <td>ADM</td>
                                <td>Matériel purement administratif</td>
                                <td>A.R.17/08/55 Art.9 § 1 al.3</td>
                            </tr>
                            <tr>
                                <td>BAT</td>
                                <td>Bâtiment</td>
                                <td>Art.471 § 1</td>
                            </tr>
                            <tr>
                                <td>BUR</td>
                                <td>Matériel de bureautique</td>
                                <td>A.R.17/08/55 Art.9 §1 al.3</td>
                            </tr>
                            <tr>
                                <td>DEP</td>
                                <td>Dépoussiérage - Electro-filtres - Filtres à manches</td>
                                <td>A.R.17/08/55 Art.9 § 1 al.2</td>
                            </tr>
                            <tr>
                                <td>ETP</td>
                                <td>Etudes préalables de faisabilité</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>HSI</td>
                                <td>Matériel non affecté sur le site</td>
                                <td>A.R.17/08/55 Art.9 § 2 b</td>
                            </tr>
                            <tr>
                                <td>HUS</td>
                                <td>Hors d'usage mais non désaffecté</td>
                                <td>Art.473 § 1 al.4</td>
                            </tr>
                            <tr>
                                <td>IMM</td>
                                <td>Investissements immatériels, recherche, ingénierie</td>
                                <td>A.R.17/08/55 Art.9 § 1 al.2</td>
                            </tr>
                            <tr>
                                <td>LES</td>
                                <td>Matériel en leasing repris en rubrique</td>
                                <td>25 Art.471 § 2</td>
                            </tr>
                            <tr>
                                <td>LOC</td>
                                <td>Immobilisé afférent à du matériel loué</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>MAC</td>
                                <td>Affectation comptable non valide</td>
                                <td></td>
                            </tr>   
                            <tr>
                                <td>MMM</td>
                                <td>Matériel mis à mitraille ou vendu (à sortir des immobilisations)</td>
                                <td>Art.473 § 1 al.4</td>
                            </tr>   
                            <tr>
                                <td>MOB</td>
                                <td>Mobilier</td>
                                <td>A.R.17/08/55 Art.9 § 1 al.3</td>
                            </tr> 
                            <tr>
                                <td>MPE</td>
                                <td>Matières premières ou consommables pour les essais</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>NEX</td>
                                <td>Matériel n'existant plus mais toujours repris dans les immobilisations</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>NIM</td>
                                <td>Matériel n'ayant pas le caractère d'immeuble par nature</td>
                                <td>A.R.17/08/55 Art.9 § 1 al.2</td>
                            </tr>
                            <tr>
                                <td>NUS</td>
                                <td>Matériel non encore mis en usage et porté en rubrique</td>
                                <td>Art.473 § 1al.4</td>
                            </tr>  
                            <tr>
                                <td>PES</td>
                                <td>Pistes, éclairage, signalisation</td>
                                <td>Art.471 § 1</td>
                            </tr>  
                            <tr>
                                <td>POM</td>
                                <td>Petit outillage à main</td>
                                <td>A.R.17/08/55 Art.9 § 2 b</td>
                            </tr> 
                            <tr>
                                <td>REP</td>
                                <td>Frais inhérent à une réparation ou un entretien</td>
                                <td>Art.483 § 3_1</td>
                            </tr>    
                            <tr>
                                <td>RES</td>
                                <td>Matériel de réserve et non affecté</td>
                                <td>Art.483 § 3_1</td>
                            </tr> 
                            <tr>
                                <td>RPL</td>
                                <td>Remplacement pur et simple</td>
                                <td>Art.483 § 3_1</td>
                            </tr>  
                            <tr>
                                <td>RPT</td>
                                <td>Remplacement avec amélioration technologique</td>
                                <td>Art.483 § 3_2</td>
                            </tr> 
                            <tr>
                                <td>SHE</td>
                                <td>Sécurité, hygiène, environnement, normes réglementaires</td>
                                <td>A.R.17/08/55 Art.9 § 1 al.2</td>
                            </tr>   
                            <tr>
                                <td>TRP</td>
                                <td>Engins de transport</td>
                                <td>A.R.17/08/55 Art.9 § 1 al.3</td>
                            </tr>    
                            <tr>
                                <td>VAN</td>
                                <td>Valeur à neuf</td>
                                <td></td>
                            </tr>                      
                        </table>
                    </div>
                </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item className="Item">
                <Accordion.Header className="Header">
                    <Accordion.Trigger className="Trigger">
                        <span>Motifs d'exonération</span>
                        <a className="Icon"><img alt="Arrow" src={ArrowIcon} /></a>
                    </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Panel className="Panel">
                    <div className="Content">
                        <table>
                            <tr>
                                <th>Année</th>
                                <th>Code</th>
                                <th>Détail</th>
                                <th>Justification légale</th>
                            </tr>
                            <tr>
                                <td><p>2006 - 2014</p> <p>&</p> <p>2017 - aujourd'hui</p></td>
                                <td>X4</td>
                                <td>Neuf</td>
                                <td>
                                    PLAN MARSHALL - Matériel et outillage neuf exonéré
                                    Art. 253 3°ter du CIR92 des nouveaux investissements en
                                    matériel et outillage visés à l'Article 471, § 3, acquis ou
                                    constitués à l'état neuf sur le territoire de la Région
                                    wallonne, à partir du 1er janvier 2006.
                                </td>
                            </tr>
                            <tr>
                                <td>2015 - 2016</td>
                                <td>X10</td>
                                <td>Neuf</td>
                                <td>DECRET Wallon du 12/12/2014</td>
                            </tr>
                            <tr>
                                <td>2005</td>
                                <td>X3</td>
                                <td><p>Neuf</p><p>-</p><p>Seuil au 01.01.2005</p></td>
                                <td>
                                    Seuil fixé au 1er janvier 2005 : RC qui existait ou qui aurait
                                    dû exister au 01.01.2005 imposé ou bénéficiant d'une
                                    exonération économique. Le 3° bis de l'article 253 C.I.R. 92
                                    n'exonère en effet que les augmentations de revenu cadastral
                                    par rapport à ce seuil.
                                </td>
                            </tr>
                            <tr>
                                <td>1830 - 2004</td>
                                <td>F</td>
                                <td>Neuf & Occasion</td>
                                <td>Matériel et outillage imposable au précompte immobilier</td>
                            </tr>
                            <tr>
                                <td>2005 - aujourd'hui</td>
                                <td>F</td>
                                <td>Occasion</td>
                                <td>
                                    <p>Matériel et outillage imposable au précompte immobilier</p>
                                    <p>Valeur à neuf de l'outillage d'occasion à déclarer :
                                    - de 5 ans : +50% de valeur du prix de l'occasion ;
                                    de 5 ans à 15 ans : +100 % de valeur du prix de l'occasion ;
                                    + de 15 ans : 200 % de valeur du prix de l'occasion.</p>
                                </td>
                            </tr>
                            <tr>
                                <td>1830 - aujourd'hui</td>
                                <td>X2</td>
                                <td><p>Neuf & Occasion</p><p>-</p><p>Moins de 795 € de RC (= Moins de 50.000 euros d'investissement)</p></td>
                                <td>
                                    Art. 253 4° - Exonération du matériel et de l'outillage visés à
                                    l'Article 471, § 3, lorsque ce revenu cadastral, établi
                                    conformément aux articles 483 et 484, après déduction du
                                    revenu cadastral exonéré en application du 3°bis et 3°ter,
                                    n'atteint pas 795 EUR par parcelle cadastrale.
                                </td>
                            </tr>
                        </table>
                    </div>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion.Root>
    </>);
}