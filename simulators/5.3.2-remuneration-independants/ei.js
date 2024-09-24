import Engine from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/5.3.2-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/5.3.2-remuneration-independants/node_modules/modele-social/dist/index.js';

const engine = new Engine(rules);

function fillText(urssafData, htmlTag) {
    const dataUrssaf = engine.evaluate(urssafData);
    let data = Math.round(dataUrssaf.nodeValue);
    if (isNaN(data)) {
        data = 0;
    }
    document.querySelector(htmlTag).textContent = data.toLocaleString('fr-FR') + '€';
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

function eiRetirement() {
    const gainTrimester = engine.evaluate("protection sociale . retraite . trimestres");
    document.getElementById('gain-trimester').textContent = gainTrimester.nodeValue;

    const pensionScheme = engine.evaluate("protection sociale . retraite . base");
    let pensionSchemeAmount = Math.round(pensionScheme.nodeValue * 12);
    if (isNaN(pensionSchemeAmount)) {
        pensionSchemeAmount = 0;
    }
    document.getElementById('pension-scheme').textContent = `${pensionSchemeAmount.toLocaleString('fr-FR')}€`;

    const retirementPoints = engine.evaluate("protection sociale . retraite . complémentaire . RCI . points acquis");
    document.getElementById('retirement-points').textContent = retirementPoints.nodeValue;
}



function eiRemuneration() {
    fillSameClassTexts("dirigeant . rémunération . net", "#before-tax");
    fillSameClassTexts("dirigeant . rémunération . net . après impôt", "#after-tax");
}

function eiContributions() {
    fillText("dirigeant . indépendant . cotisations et contributions", `#contributions-total`);
    fillText("dirigeant . indépendant . cotisations et contributions . cotisations", `#contributions-eurl-ei-cotisations-total`);
    fillText("dirigeant . indépendant . cotisations et contributions . maladie", `#contributions-eurl-ei-disease`);
    fillText("dirigeant . indépendant . cotisations et contributions . retraite de base", `#contributions-eurl-ei-base-retirement`);
    fillText("dirigeant . indépendant . cotisations et contributions . retraite complémentaire", `#contributions-eurl-ei-additional-retirement`);
    fillText("dirigeant . indépendant . cotisations et contributions . indemnités journalières maladie", `#contributions-eurl-ei-disease-allowance`);
    fillText("dirigeant . indépendant . cotisations et contributions . invalidité et décès", `#contributions-eurl-ei-disability`);
    fillText("dirigeant . indépendant . cotisations et contributions . CSG-CRDS", `#contributions-eurl-ei-csg`);
    fillText("dirigeant . indépendant . cotisations et contributions . formation professionnelle", `#contributions-eurl-ei-formation`);
}

function storageEiTotal(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, 'IS');
    const eiAfterTaxIsUrssaf = engine.evaluate("dirigeant . rémunération . net . après impôt");
    const eiAfterTaxIsAmount = Math.round(eiAfterTaxIsUrssaf.nodeValue);

    eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, 'IR');
    const eiAfterTaxIrUrssaf = engine.evaluate("dirigeant . rémunération . net . après impôt");
    const eiAfterTaxIrAmount = Math.round(eiAfterTaxIrUrssaf.nodeValue);

    let bestEiResult;

    if (eiAfterTaxIsAmount > eiAfterTaxIrAmount) {
        bestEiResult = eiAfterTaxIsAmount;
    } else {
        bestEiResult = eiAfterTaxIrAmount;
    }

    localStorage.setItem('eiTotal', bestEiResult);
}

function eiResult(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, 'IS');
    const eiAfterTaxIsUrssaf = engine.evaluate("dirigeant . rémunération . net . après impôt");
    const eiAfterTaxIsAmount = Math.round(eiAfterTaxIsUrssaf.nodeValue);

    eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, 'IR');
    const eiAfterTaxIrUrssaf = engine.evaluate("dirigeant . rémunération . net . après impôt");
    const eiAfterTaxIrAmount = Math.round(eiAfterTaxIrUrssaf.nodeValue);

    if (eiAfterTaxIsAmount > eiAfterTaxIrAmount) {
        eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, 'IS');
        eiRemuneration();
        eiContributions();
        eiRetirement();
    } else {
        eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, 'IR');
        eiRemuneration();
        eiContributions();
        eiRetirement();
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


export { eiResult, eiCalculRetraite, storageEiTotal };