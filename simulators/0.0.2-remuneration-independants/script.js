import Engine,{ formatValue } from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/0.0.2-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/0.0.2-remuneration-independants/node_modules/modele-social/dist/index.js';

const engine = new Engine(rules);

document.getElementById('calcul-btn').addEventListener('click', () => {
    const turnover = parseFloat(document.getElementById('turnover').value);
    const cost = parseFloat(document.getElementById('cost').value);
    const situation = document.getElementById('personal-situation').value;
    const numberOfChild = parseInt(document.getElementById('child').value);
    const householdIncome = parseFloat(document.getElementById('household-income').value);

    const turnoverMinusCost = turnover - cost;

    eurlSituation(turnoverMinusCost, situation, cost, numberOfChild, householdIncome, 'IS', 'non');
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
    document.getElementById(pensionSchemeTag).textContent = pensionScheme.nodeValue * 12;

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