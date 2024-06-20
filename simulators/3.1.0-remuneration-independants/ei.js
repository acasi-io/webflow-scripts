import Engine from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/3.1.0-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/3.1.0-remuneration-independants/node_modules/modele-social/dist/index.js';

import { retirementText, fillText, fillSameClassTexts } from './script.js';

const engine = new Engine(rules);

function eiEurlRemuneration(taxRemunerationBefore, taxRemunerationAfter) {
    fillSameClassTexts("dirigeant . rémunération . net", taxRemunerationBefore);
    fillSameClassTexts("dirigeant . rémunération . net . après impôt", taxRemunerationAfter);
}

function eiEurlContributions(form) {
    fillText("dirigeant . indépendant . cotisations et contributions", `#${form}-contributions-total`);
    fillText("dirigeant . indépendant . cotisations et contributions . cotisations", `#${form}-contributions`);
    fillText("dirigeant . indépendant . cotisations et contributions . maladie", `#${form}-disease`);
    fillText("dirigeant . indépendant . cotisations et contributions . retraite de base", `#${form}-base-retirement`);
    fillText("dirigeant . indépendant . cotisations et contributions . retraite complémentaire", `#${form}-additional-retirement`);
    fillText("dirigeant . indépendant . cotisations et contributions . indemnités journalières maladie", `#${form}-disease-allowance`);
    fillText("dirigeant . indépendant . cotisations et contributions . invalidité et décès", `#${form}-disability`);
    fillText("dirigeant . indépendant . cotisations et contributions . CSG-CRDS", `#${form}-csg`);
    fillText("dirigeant . indépendant . cotisations et contributions . formation professionnelle", `#${form}-formation`);
}

function eiResult(turnoverMinusCost, situation, numberOfChild, householdIncome) {
    eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non', 'IS');

    eiEurlRemuneration('.is_ei_before_tax', '.is_eiis_after_tax');
    // eiEurlRemuneration('.is_eurlis_after_tax');
    eiEurlContributions('ei');
    eiRetirement();

    eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non', 'IR');
    eiEurlRemuneration('.is_ei_before_tax', '.is_eiir_after_tax');
    eiEurlRemuneration('.is_eurlir_before_tax', '.is_eurlir_after_tax');

    if(document.getElementById('single-parent').value === 'oui') {
        eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'oui', 'IS');
        eiEurlRemuneration('.is_ei_before_tax', '.is_eiis_after_tax');
        // eiEurlRemuneration('.is_eurlis_after_tax');

        eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'oui', 'IR');
        eiEurlRemuneration('.is_ei_before_tax', '.is_eiir_after_tax');
        eiEurlRemuneration('.is_eurlir_before_tax', '.is_eurlir_after_tax');
    }
}

function eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, tax) {
    engine.setSituation({
        "entreprise . chiffre d'affaires": turnoverMinusCost,
        "impôt . foyer fiscal . situation de famille": `'${situation}'`,
        "impôt . foyer fiscal . enfants à charge": parseInt(numberOfChild),
        "impôt . foyer fiscal . revenu imposable . autres revenus imposables": parseFloat(householdIncome),
        "impôt . foyer fiscal . parent isolé": `${singleParent}`,
        "entreprise . imposition": `'${tax}'`,
        "entreprise . activité . nature": "'libérale'",
        "situation personnelle . domiciliation fiscale à l'étranger": "non",
        "entreprise . catégorie juridique": "'EI'",
        "entreprise . catégorie juridique . EI . auto-entrepreneur": "non"
    });
}

function eiRetirement() {
    retirementText('ei-gain-trimester', 'ei-pension-scheme', 'ei-retirement-points');
}


export { eiResult };