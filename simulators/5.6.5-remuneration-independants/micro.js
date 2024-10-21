import Engine from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/5.6.5-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/5.6.5-remuneration-independants/node_modules/modele-social/dist/index.js';

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

function microRetirement() {
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

    // fillText("dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . retraite", "#retirement-amount");
}

function storageMicroTotal(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    microSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non', singleParent);

    const microAfterTaxIsUrssaf = engine.evaluate("dirigeant . auto-entrepreneur . revenu net . après impôt");
    const microAfterTaxIsAmount = Math.round(microAfterTaxIsUrssaf.nodeValue);
    localStorage.setItem('microTotal', microAfterTaxIsAmount);
}

function microResult(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    microSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non', singleParent);

    microRemuneration();
    microContributions();
    microRetirement();
}

function microSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, paymentInDischarge, singleParent) {
    engine.setSituation({
        "dirigeant . auto-entrepreneur . chiffre d'affaires": turnoverMinusCost,
        "impôt . foyer fiscal . situation de famille": `'${situation}'`,
        "impôt . foyer fiscal . enfants à charge": parseInt(numberOfChild),
        "impôt . foyer fiscal . revenu imposable . autres revenus imposables": parseFloat(householdIncome),
        "dirigeant . auto-entrepreneur . impôt . versement libératoire": `${paymentInDischarge}`,
        "impôt . foyer fiscal . parent isolé": `${singleParent}`,
        "entreprise . activité . nature": "'libérale'",
        "entreprise . activité . nature . libérale . réglementée": "non",
        "entreprise . catégorie juridique": "'EI'",
        "entreprise . catégorie juridique . EI . auto-entrepreneur": "oui",
        "dirigeant . auto-entrepreneur": "oui"
    });
}

function microRemuneration() {
    fillText("dirigeant . auto-entrepreneur . revenu net", '#before-tax');
    fillText("dirigeant . auto-entrepreneur . revenu net . après impôt", '#after-tax');
}

function microContributions() {
    yearFillText("dirigeant . auto-entrepreneur . cotisations et contributions", '#contributions-total');
    fillText("dirigeant . auto-entrepreneur . cotisations et contributions . cotisations", '#contributions-micro-contributions');
    yearFillText("dirigeant . auto-entrepreneur . cotisations et contributions . TFC", '#contributions-micro-room-tax');
    yearFillText("dirigeant . auto-entrepreneur . cotisations et contributions . CFP", '#contributions-micro-formation');
}

function microCalculRetraite(turnover) {
    engine.setSituation({
        "salarié": "non",
        "entreprise . activités . revenus mixtes": "non",
        "entreprise . catégorie juridique": "'EI'",
        "entreprise . chiffre d'affaires": turnover,
        "entreprise . catégorie juridique . EI . auto-entrepreneur": "oui"
    });

    let basicRetirementUrssaf = engine.evaluate("protection sociale . retraite . base");
    let basicRetirementAmount = Math.round(basicRetirementUrssaf.nodeValue * 12);
    let complementaryRetirementUrssaf = engine.evaluate("protection sociale . retraite . complémentaire");
    let complementaryRetirementAmount = Math.round(complementaryRetirementUrssaf.nodeValue);
    let totalRetirement = basicRetirementAmount + complementaryRetirementAmount;

    return totalRetirement;
}

function fillMicroComparison(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    microSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non', singleParent);

    yearFillText("dirigeant . auto-entrepreneur . cotisations et contributions", '#micro-comparison-contributions');
    fillText("dirigeant . auto-entrepreneur . revenu net . après impôt", '#micro-comparison-wage');
    fillText("dirigeant . rémunération . impôt", '#micro-comparison-tax');
    // fillText("dirigeant . auto-entrepreneur . cotisations et contributions . cotisations . répartition . retraite", "#micro-comparison-retirement");
}


export { microResult, microCalculRetraite, storageMicroTotal, fillMicroComparison };