import Engine from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/3.4.6-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/3.4.6-remuneration-independants/node_modules/modele-social/dist/index.js';

const engine = new Engine(rules);

function fillText(urssafData, htmlTag) {
    const dataUrssaf = engine.evaluate(urssafData);
    let data = Math.round(dataUrssaf.nodeValue);
    if (isNaN(data)) {
        data = 0;
    }
    document.querySelector(htmlTag).textContent = data.toLocaleString('fr-FR') + '€';
}

function yearFillText(urssafData, htmlTag) {
    const data = engine.evaluate(urssafData);
    let dataYear = Math.round(data.nodeValue * 12);
    if (isNaN(dataYear)) {
        dataYear = 0;
    }
    document.querySelector(htmlTag).textContent = dataYear.toLocaleString('fr-FR') + '€';
}

function fillSameClassTexts(urssafData, htmlTag) {
    const dataUrssaf = engine.evaluate(urssafData);
    let data = dataUrssaf.nodeValue;
    if (isNaN(data)) {
        data = 0;
    }
    document.querySelectorAll(htmlTag).forEach(element => {
        element.textContent = data.toLocaleString('fr-FR') + '€';
    });
}

function retirementText(gainTrimesterTag, pensionSchemeTag, retirementPointsTag) {
    const gainTrimester = engine.evaluate("protection sociale . retraite . trimestres");
    document.getElementById(gainTrimesterTag).textContent = gainTrimester.nodeValue;

    const pensionScheme = engine.evaluate("protection sociale . retraite . base");
    let pensionSchemeAmount = Math.round(pensionScheme.nodeValue * 12);
    if (isNaN(pensionSchemeAmount)) {
        pensionSchemeAmount = 0;
    }
    document.getElementById(pensionSchemeTag).textContent = `${pensionSchemeAmount.toLocaleString('fr-FR')}€`;

    const retirementPoints = engine.evaluate("protection sociale . retraite . complémentaire . RCI . points acquis");
    document.getElementById(retirementPointsTag).textContent = retirementPoints.nodeValue;
}



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

function eiResult(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, 'IS');

    eiEurlRemuneration('.is_ei_before_tax', '.is_eiis_after_tax');
    eiEurlContributions('ei');
    eiRetirement();

    eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, 'IR');
    eiEurlRemuneration('.is_ei_before_tax', '.is_eiir_after_tax');
    eiEurlRemuneration('.is_eurlir_before_tax', '.is_eurlir_after_tax');
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

function eiCalculRetraite(turnover) {
    engine.setSituation({
        "salarié": "non",
        "entreprise . date de création": "période . début d'année",
        "dirigeant . exonérations . ACRE": "non",
        "entreprise . imposition": "'IS'",
        "entreprise . catégorie juridique": "'EI'",
        "entreprise . chiffre d'affaires": turnover,
        "entreprise . catégorie juridique . EI . auto-entrepreneur": "non"
    });

    let basicRetirementUrssaf = engine.evaluate("protection sociale . retraite . base");
    let basicRetirementAmount = Math.round(basicRetirementUrssaf.nodeValue * 12);
    let complementaryRetirementUrssaf = engine.evaluate("protection sociale . retraite . complémentaire");
    let complementaryRetirementAmount = Math.round(complementaryRetirementUrssaf.nodeValue);
    let totalRetirement = basicRetirementAmount + complementaryRetirementAmount;

    return totalRetirement;
}


export { eiResult, eiCalculRetraite };