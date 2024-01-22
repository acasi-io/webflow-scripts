import Engine,{ formatValue } from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/0.3.0-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/0.3.0-remuneration-independants/node_modules/modele-social/dist/index.js';

const engine = new Engine(rules);

const situation = document.getElementById('personal-situation').value;
const numberOfChild = parseInt(document.getElementById('child').value);

// singleParentConditions();

document.getElementById('calcul-btn').addEventListener('click', () => {
    const turnover = parseFloat(document.getElementById('turnover').value);
    const cost = parseFloat(document.getElementById('cost').value);
    const householdIncome = parseFloat(document.getElementById('household-income').value);

    document.querySelectorAll('.simulator-micro').forEach(element => {
        element.style.display = 'none';
    });

    if (turnover <= 50000) {
        document.querySelectorAll('.simulator-micro').forEach(element => {
            element.style.display = 'block';
        });
    }

    const turnoverMinusCost = turnover - cost;

    eurlResult(turnoverMinusCost, situation, cost, numberOfChild, householdIncome);
    sasuResult(turnoverMinusCost, situation, numberOfChild, householdIncome);
    eiResult(turnoverMinusCost, situation, numberOfChild, householdIncome);
    microResult(turnoverMinusCost, situation, numberOfChild, householdIncome);
});

/*function singleParentConditions() {
    const containerCheckbox = document.getElementById('container-single-parent-checkbox');
    const situationInput = document.getElementById('personal-situation');
    const childInput = document.getElementById('child');

    containerCheckbox.style.display = 'none';

    childInput.addEventListener('input', () => {
        if ((situation === 'célibataire' || situation === 'veuf') && parseInt(numberOfChild) > 0) {
            containerCheckbox.style.display = 'block';
        } 
    });

    situationInput.addEventListener('change', () => {
        if ((situation === 'célibataire' || situation === 'veuf') && parseInt(numberOfChild) > 0) {
            containerCheckbox.style.display = 'block';
        }
    });
} */


function fillText(urssafData, htmlTag) {
    const data = engine.evaluate(urssafData);
    document.querySelector(htmlTag).textContent = `${formatValue(data)}`;
}

/* function formateNumber(number) {
    const roundedNumber = Math.round(number);
    const formattedNumber = roundedNumber.toLocaleString('fr-FR');

    return formattedNumber;
} */

function yearFillText(urssafData, htmlTag) {
    const data = engine.evaluate(urssafData);
    const dataYear = Math.round(data.nodeValue * 12);
    document.querySelector(htmlTag).textContent = dataYear.toLocaleString('fr-FR') + '€/an';
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
    document.getElementById(pensionSchemeTag).textContent = `${(pensionScheme.nodeValue * 12).toLocaleString('fr-FR')} €/an`;

    const retirementPoints = engine.evaluate("protection sociale . retraite . complémentaire . RCI . points acquis");
    document.getElementById(retirementPointsTag).textContent = retirementPoints.nodeValue;
}


/* SASU */
function sasuResult(turnoverMinusCost, situation, numberOfChild, householdIncome) {
    sasuSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non');

    sasuRemuneration();
    sasuContributions();
    sasuRetirement();

    if(document.getElementById('checkbox-single-parent').checked) {
        sasuSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'oui');
        sasuRemuneration();
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
    const net = engine.evaluate("salarié . rémunération . net . à payer avant impôt");
    document.querySelectorAll('.sasu-before').forEach(element => {
        element.textContent = `${Math.round(net.nodeValue * 12)} €/an`;
    });

    const afterTax = engine.evaluate("salarié . rémunération . net . payé après impôt");
    document.querySelectorAll('.sasu-after').forEach(element => {
        element.textContent = `${Math.round(afterTax.nodeValue * 12)} €/an`;
    });
}

function sasuContributions() {
    yearFillText("dirigeant . assimilé salarié . cotisations", '#sasu-contributions-total');

    /* EMPLOYER */
    yearFillText("salarié . cotisations . maladie . employeur", '#sasu-disease');
    yearFillText("salarié . cotisations . CSA", '#sasu-solidarity-autonomy');
    yearFillText("salarié . cotisations . ATMP", '#sasu-work-accident');
    /*fillText("salarié . cotisations . vieillesse . employeur", '.sasu-employer-old-age');
    fillText("salarié . cotisations . retraite complémentaire . employeur", '#sasu-employer-additional-retirement');
    yearFillText("salarié . cotisations . CEG . employeur", '#sasu-employer-general-balance');
    yearFillText("salarié . cotisations . allocations familiales", '#sasu-family-allowance');
    yearFillText("salarié . cotisations . FNAL", '#sasu-fnal');
    yearFillText("salarié . cotisations . formation professionnelle", '#sasu-formation');
    yearFillText("salarié . cotisations . taxe d'apprentissage", '#sasu-learning-tax');
    yearFillText("salarié . cotisations . prévoyances . employeur", '#sasu-additional-planning');*/

    /* EMPLOYEE */
    /*yearFillText("salarié . cotisations . vieillesse . salarié", '#sasu-employee-old-age');
    yearFillText("salarié . cotisations . retraite complémentaire . salarié", '#sasu-employee-additional-retirement');
    yearFillText("salarié . cotisations . CEG . salarié", '#sasu-employee-general-balance');
    yearFillText("salarié . cotisations . CSG-CRDS", '#sasu-csg');
    yearFillText("salarié . cotisations . prévoyances . salarié", '#sasu-employee-additional-planning');*/
}

function sasuRetirement() {
    retirementText('sasu-gain-trimester', 'sasu-pension-scheme', 'sasu-retirement-points');
}


/* COMMON EURL - EI */
function eiEurlRemuneration(taxRemunerationAfter) {
    fillSameClassTexts("dirigeant . rémunération . net", '.eurl-ei-before-tax');
    fillSameClassTexts("dirigeant . rémunération . net . après impôt", taxRemunerationAfter);
}


/* EURL */
function eurlResult(turnoverMinusCost, situation, cost, numberOfChild, householdIncome) {
    eurlSituation(turnoverMinusCost, situation, cost, numberOfChild, householdIncome, 'IS', 'non');

    eiEurlRemuneration('.is-eurl-after');
    eurlContributions();
    eurlRetirement();

    eurlSituation(turnoverMinusCost, situation, cost, numberOfChild, householdIncome, 'IR', 'non');
    eiEurlRemuneration('.ir-eurl-after');

    if(document.getElementById('checkbox-single-parent').checked) {
        eurlSituation(turnoverMinusCost, situation, cost, numberOfChild, householdIncome, 'IS', 'oui');
        eiEurlRemuneration('.is-eurl-after');

        eurlSituation(turnoverMinusCost, situation, cost, numberOfChild, householdIncome, 'IR', 'oui');
        eiEurlRemuneration('.ir-eurl-after');
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


/* EI */
function eiResult(turnoverMinusCost, situation, numberOfChild, householdIncome) {
    eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non', 'IS');

    eiEurlRemuneration('.is-ei-after');
    eiContributions();
    eiRetirement();

    eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non', 'IR');
    eiEurlRemuneration('.ir-ei-after');

    if(document.getElementById('checkbox-single-parent').checked) {
        eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'oui', 'IS');
        eiEurlRemuneration('.is-ei-after');

        eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'oui', 'IR');
        eiEurlRemuneration('.ir-ei-after');
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

function eiContributions() {
    fillText("dirigeant . indépendant . cotisations et contributions", '#ei-contributions-total');
    fillText("dirigeant . indépendant . cotisations et contributions . cotisations", '#ei-contributions');
    fillText("dirigeant . indépendant . cotisations et contributions . maladie", '#ei-disease');
    fillText("dirigeant . indépendant . cotisations et contributions . retraite de base", '#ei-base-retirement');
    fillText("dirigeant . indépendant . cotisations et contributions . retraite complémentaire", '#ei-additional-retirement');
    fillText("dirigeant . indépendant . cotisations et contributions . indemnités journalières maladie", '#ei-disease-allowance');
    fillText("dirigeant . indépendant . cotisations et contributions . invalidité et décès", '#ei-disability');
    fillText("dirigeant . indépendant . cotisations et contributions . CSG-CRDS", '#ei-csg');
    fillText("dirigeant . indépendant . cotisations et contributions . formation professionnelle", '#ei-formation');
}

function eiRetirement() {
    retirementText('ei-gain-trimester', 'ei-pension-scheme', 'ei-retirement-points');
}


/* MICRO */
function microResult(turnoverMinusCost, situation, numberOfChild, householdIncome) {
    microSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non', 'non');

    microRemuneration();
    microContributions();
    microRetirement();

    if(document.getElementById('checkbox-single-parent').checked) {
        microSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non', 'oui');
        microRemuneration();
    }
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
        "entreprise . catégorie juridique": "'EI'",
        "entreprise . catégorie juridique . EI . auto-entrepreneur": "oui"
    });
}

function microRemuneration() {
    fillSameClassTexts("dirigeant . auto-entrepreneur . revenu net", '.micro-before');
    fillSameClassTexts("dirigeant . auto-entrepreneur . revenu net . après impôt", '.micro-after');
}

function microContributions() {
    yearFillText("dirigeant . auto-entrepreneur . cotisations et contributions", '#micro-contributions-total');
    fillText("dirigeant . auto-entrepreneur . cotisations et contributions . cotisations", '#micro-contributions');
    yearFillText("dirigeant . auto-entrepreneur . cotisations et contributions . TFC", '#micro-room-tax');
    yearFillText("dirigeant . auto-entrepreneur . cotisations et contributions . CFP", '#micro-formation');
}

function microRetirement() {
    retirementText('micro-gain-trimester', 'micro-pension-scheme', 'micro-retirement-points');
}