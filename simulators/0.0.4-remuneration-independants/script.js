import Engine,{ formatValue } from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/0.0.4-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/0.0.4-remuneration-independants/node_modules/modele-social/dist/index.js';

const engine = new Engine(rules);

document.getElementById('calcul-btn').addEventListener('click', () => {
    const turnover = parseFloat(document.getElementById('turnover').value);
    const cost = parseFloat(document.getElementById('cost').value);
    const situation = document.getElementById('personal-situation').value;
    const numberOfChild = parseInt(document.getElementById('child').value);
    const householdIncome = parseFloat(document.getElementById('household-income').value);

    const turnoverMinusCost = turnover - cost;

    eurlResult(turnoverMinusCost, situation, cost, numberOfChild, householdIncome);
    sasuResult(turnoverMinusCost, situation, numberOfChild, householdIncome);
});


function fillText(urssafData, htmlTag) {
    const data = engine.evaluate(urssafData);
    document.querySelector(htmlTag).textContent = `${formatValue(data)}`;
}

function yearFillText(htmlTag, data) {
    const dataYear = data.nodeValue * 12;
    document.querySelector(htmlTag).textContent = `${Math.round(dataYear)} € / an`;
}

function fillSameClassTexts(urssafData, htmlTag) {
    const data = engine.evaluate(urssafData);
    document.querySelectorAll(htmlTag).forEach(element => {
        element.textContent = `${formatValue(data)}`;
    });
}

function retirementText(gainTrimesterTag, pensionSchemeTag, retirementPointsTag) {
    const gainTrimester = engine.evaluate("protection sociale . retraite . trimestres");
    document.getElementById(gainTrimesterTag).textContent = gainTrimester.nodeValue;

    const pensionScheme = engine.evaluate("protection sociale . retraite . base");
    document.getElementById(pensionSchemeTag).textContent = `${pensionScheme.nodeValue * 12} €/an`;

    const retirementPoints = engine.evaluate("protection sociale . retraite . complémentaire . RCI . points acquis");
    document.getElementById(retirementPointsTag).textContent = retirementPoints.nodeValue;
}


/* EURL */
function eurlResult(turnoverMinusCost, situation, cost, numberOfChild, householdIncome) {
    eurlSituation(turnoverMinusCost, situation, cost, numberOfChild, householdIncome, 'IS', 'non');

    eurlRemuneration('.is-eurl-before', '.is-eurl-after');
    eurlContributions();
    eurlRetirement();

    eurlSituation(turnoverMinusCost, situation, cost, numberOfChild, householdIncome, 'IR', 'non');
    eurlRemuneration('.ir-eurl-before', '.ir-eurl-after');

    if(document.getElementById('checkbox-single-parent').checked) {
        eurlSituation(turnoverMinusCost, situation, cost, numberOfChild, householdIncome, 'IS', 'oui');
        eurlRemuneration('.is-eurl-before', '.is-eurl-after');

        eurlSituation(turnoverMinusCost, situation, cost, numberOfChild, householdIncome, 'IR', 'oui');
        eurlRemuneration('.ir-eurl-before', '.ir-eurl-after');
    }
}

function eurlSituation(turnoverMinusCost, situation, cost, numberOfChild, householdIncome, tax, singleParent) {
    engine.setSituation({
        "dirigeant . rémunération . totale": turnoverMinusCost,
        "impôt . foyer fiscal . situation de famille": `'${situation}'`,
        "impôt . foyer fiscal . enfants à charge": parseInt(numberOfChild),
        "impôt . foyer fiscal . revenu imposable . autres revenus imposables": parseFloat(householdIncome),
        "entreprise . activité . nature": "'libérale'",
        "entreprise . imposition": `'${tax}'`,
        "entreprise . charges": cost,
        "impôt . foyer fiscal . parent isolé": `${singleParent}`,
        "entreprise . associés": "'unique'",
        "entreprise . catégorie juridique": "'SARL'",
        "impôt . méthode de calcul": "'barème standard'"
    });
}

function eurlRemuneration(taxRemunerationBefore, taxRemunerationAfter) {
    fillSameClassTexts("dirigeant . rémunération . net", taxRemunerationBefore);
    fillSameClassTexts("dirigeant . rémunération . net . après impôt", taxRemunerationAfter);
}

function eurlContributions() {
    fillText("dirigeant . indépendant . cotisations et contributions", '#eurl-contributions-total');
    fillText("dirigeant . indépendant . cotisations et contributions . cotisations", '#eurl-contributions');
    fillText("dirigeant . indépendant . cotisations et contributions . maladie", '#eurl-disease');
    fillText("dirigeant . indépendant . cotisations et contributions . retraite de base", '#eurl-base-retirement');
    fillText("dirigeant . indépendant . cotisations et contributions . retraite complémentaire", '#eurl-additional-retirement');
    fillText("dirigeant . indépendant . cotisations et contributions . indemnités journalières maladie", '#eurl-disease-allowance');
    fillText("dirigeant . indépendant . cotisations et contributions . invalidité et décès", '#eurl-disability');
    fillText("dirigeant . indépendant . cotisations et contributions . CSG-CRDS", '#eurl-csg');
    fillText("dirigeant . indépendant . cotisations et contributions . formation professionnelle", '#eurl-formation');
}

function eurlRetirement() {
    retirementText('eurl-gain-trimester', 'eurl-pension-scheme', 'eurl-retirement-points');
}


/* SASU */

function sasuResult(turnoverMinusCost, situation, numberOfChild, householdIncome) {
    sasuSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non');

    sasuRemuneration();
    sasuContributions();

    if(document.getElementById('checkbox-single-parent').checked) {
        sasuSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'oui');
        sasuRemuneration('.is-eurl-before', '.is-eurl-after');
    }
}

function sasuSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    engine.setSituation({
        "dirigeant . rémunération . totale": parseInt(turnoverMinusCost),
        "impôt . foyer fiscal . situation de famille": `'${situation}'`,
        "impôt . foyer fiscal . enfants à charge": parseInt(numberOfChild),
        "impôt . foyer fiscal . revenu imposable . autres revenus imposables": parseFloat(householdIncome),
        "impôt . foyer fiscal . parent isolé": `${singleParent}`,
        "salarié . régimes spécifiques . DFS": "non",
        "impôt . méthode de calcul": "'barème standard'",
        "entreprise . catégorie juridique": "'SAS'",
    });
}

function sasuRemuneration() {
    fillSameClassTexts("salarié . rémunération . net . à payer avant impôt", '.sasu-before');
    fillSameClassTexts("salarié . rémunération . net . payé après impôt", '.sasu-after');
}

function sasuContributions() {
    fillText("dirigeant . assimilé salarié . cotisations", '#sasu-contributions-total');

    /* EMPLOYER */
    fillText("salarié . cotisations . maladie . employeur", '#sasu-disease');
    fillText("salarié . cotisations . CSA", '#sasu-solidarity-autonomy');
    fillText("salarié . cotisations . ATMP", '#sasu-work-accident');
    fillText("salarié . cotisations . vieillesse . employeur", '#sasu-employer-old-age');
    fillText("salarié . cotisations . retraite complémentaire . employeur", '#sasu-employer-additional-retirement');
    fillText("salarié . cotisations . CEG . employeur", '#sasu-employer-general-balance');
    fillText("salarié . cotisations . allocations familiales", '#sasu-family-allowance');
    fillText("salarié . cotisations . FNAL", '#sasu-fnal');
    fillText("salarié . cotisations . formation professionnelle", '#sasu-formation');
    fillText("salarié . cotisations . taxe d'apprentissage", '#sasu-learning-tax');
    fillText("salarié . cotisations . prévoyances . employeur", '#sasu-additional-planning');

    /* EMPLOYEE */
    fillText("salarié . cotisations . vieillesse . salarié", '#sasu-employee-old-age');
    fillText("salarié . cotisations . retraite complémentaire . salarié", '#sasu-employee-additional-retirement');
    fillText("salarié . cotisations . CEG . salarié", '#sasu-employee-general-balance');
    fillText("salarié . cotisations . CSG-CRDS", '#sasu-csg');
    fillText("salarié . cotisations . prévoyances . salarié", '#sasu-employee-additional-planning');
}
