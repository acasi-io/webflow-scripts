import Engine,{ formatValue } from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/0.7.5-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/0.7.5-remuneration-independants/node_modules/modele-social/dist/index.js';

const engine = new Engine(rules);

const eurlBefore = document.querySelectorAll('.eurl-before');
const isEurlAfter = document.querySelectorAll('.is-eurl-after');
const irEurlAfter = document.querySelectorAll('.ir-eurl-after');
const sasuBefore = document.querySelectorAll('.sasu-before');
const sasuAfter = document.querySelectorAll('.sasu-after');
const eiBefore = document.querySelectorAll('.ei-before');
const isEiBefore = document.querySelectorAll('.is-ei-after');
const irEiBefore = document.querySelectorAll('.ir-ei-after');
const microBefore = document.querySelectorAll('.micro-before');
const microAfter = document.querySelectorAll('.micro-after');

const green = '#6FCF97';
const orange = '#FFB13C';
const red = '#FF2B44';


document.getElementById('calcul-btn').addEventListener('click', () => {
    const turnover = parseFloat(document.getElementById('turnover').value);
    const cost = parseFloat(document.getElementById('cost').value);
    const situation = document.getElementById('personal-situation').value;
    const numberOfChild = parseInt(document.getElementById('child').value);
    const householdIncome = parseFloat(document.getElementById('household-income').value);

    document.querySelectorAll('.simulator-micro').forEach(element => {
        element.style.display = 'none';
    });
    document.querySelector('.simulator-micro-contributions').style.display = 'none';
    document.getElementById('micro-grid-recap').style.display = 'none';

    if (turnover <= 50000) {
        document.querySelectorAll('.simulator-micro').forEach(element => {
            element.style.display = 'block';
        });

        document.querySelector('.simulator-micro-contributions').style.display = 'flex';
        document.getElementById('micro-grid-recap').style.display = 'block';
    }

    const turnoverMinusCost = turnover - cost;

    eurlResult(turnoverMinusCost, situation, cost, numberOfChild, householdIncome);
    sasuResult(turnoverMinusCost, situation, numberOfChild, householdIncome);
    eiResult(turnoverMinusCost, situation, numberOfChild, householdIncome);
    microResult(turnoverMinusCost, situation, numberOfChild, householdIncome);

    compareRemuneration(turnover);
});

function fillText(urssafData, htmlTag) {
    const dataUrssaf = engine.evaluate(urssafData);
    const data = dataUrssaf.nodeValue;
    document.querySelector(htmlTag).textContent = data.toLocaleString('fr-FR') + '€';
}

function yearFillText(urssafData, htmlTag) {
    const data = engine.evaluate(urssafData);
    const dataYear = Math.round(data.nodeValue * 12);
    document.querySelector(htmlTag).textContent = dataYear.toLocaleString('fr-FR') + '€';
}

function fillSameClassTexts(urssafData, htmlTag) {
    const dataUrssaf = engine.evaluate(urssafData);
    const data = dataUrssaf.nodeValue;
    document.querySelectorAll(htmlTag).forEach(element => {
        element.textContent = data.toLocaleString('fr-FR') + '€';
    });
}

function retirementText(gainTrimesterTag, pensionSchemeTag, retirementPointsTag) {
    const gainTrimester = engine.evaluate("protection sociale . retraite . trimestres");
    document.getElementById(gainTrimesterTag).textContent = gainTrimester.nodeValue;

    const pensionScheme = engine.evaluate("protection sociale . retraite . base");
    document.getElementById(pensionSchemeTag).textContent = `${(pensionScheme.nodeValue * 12).toLocaleString('fr-FR')}€`;

    const retirementPoints = engine.evaluate("protection sociale . retraite . complémentaire . RCI . points acquis");
    document.getElementById(retirementPointsTag).textContent = retirementPoints.nodeValue;
}

function compareRemuneration(turnover) {
    storeRemuneration(turnover);

    document.querySelectorAll('.heading-recap').forEach(element => {
        element.classList.remove('heading-best-choice');
    });

    document.querySelectorAll('.container-recap').forEach(element => {
        element.classList.remove('container-best-choice');
    });

    const eurlIs = parseInt(localStorage.getItem('eurlIs'));
    const eiIs = parseInt(localStorage.getItem('eiIs'));
    const sasu = parseInt(localStorage.getItem('sasu'));
    const micro = parseInt(localStorage.getItem('micro'));

    const eurlContainerRecap = document.getElementById('eurl-container-recap');
    const sasuContainerRecap = document.getElementById('sasu-container-recap');
    const eiContainerRecap = document.getElementById('ei-container-recap');
    const microContainerRecap = document.getElementById('micro-container-recap');

    const eurlHeadingRecap = document.getElementById('eurl-heading-recap');
    const sasuHeadingRecap = document.getElementById('sasu-heading-recap');
    const eiHeadingRecap = document.getElementById('ei-heading-recap');
    const microHeadingRecap = document.getElementById('micro-heading-recap');

    if (eurlIs >= eiIs && eurlIs > sasu && eurlIs > micro) {
        if (eurlIs > eiIs) {
            eurlContainerRecap.classList.add('container-best-choice');
            eurlHeadingRecap.classList.add('heading-best-choice');
        } else if (eurlIs === eiIs) {
            eurlContainerRecap.classList.add('container-best-choice');
            eurlHeadingRecap.classList.add('heading-best-choice');
            eiContainerRecap.classList.add('container-best-choice');
            eiHeadingRecap.classList.add('heading-best-choice');
        }
    } else if (sasu > eurlIs && sasu > eiIs && sasu > micro) {
        sasuContainerRecap.classList.add('container-best-choice');
        sasuHeadingRecap.classList.add('heading-best-choice');
    } else if (micro > eurlIs && micro > eiIs && micro > sasu) {
        microContainerRecap.classList.add('container-best-choice');
        microHeadingRecap.classList.add('heading-best-choice');
    } else if (eiIs >= eurlIs && eiIs > sasu && eiIs > micro) {
        if (eiIs > eurlIs) {
            eiContainerRecap.classList.add('container-best-choice');
            eiHeadingRecap.classList.add('heading-best-choice');
        } else if (eiIs === eurlIs) {
            eurlContainerRecap.classList.add('container-best-choice');
            eurlHeadingRecap.classList.add('heading-best-choice');
            eiContainerRecap.classList.add('container-best-choice');
            eiHeadingRecap.classList.add('heading-best-choice');
        }
    }
}

function storeRemuneration(turnover) {
    document.querySelectorAll('.is-eurl-after').forEach(element => {
        localStorage.setItem('eurlIs', ((element.textContent).replace(/\D/g, '')));
    });

    document.querySelectorAll('.is-ei-after').forEach(element => {
        localStorage.setItem('eiIs', ((element.textContent).replace(/\D/g, '')));
    });

    document.querySelectorAll('.sasu-after').forEach(element => {
        localStorage.setItem('sasu', ((element.textContent).replace(/\D/g, '')));
    });

    document.querySelectorAll('.micro-after').forEach(element => {
        if (turnover > 50000) {
            localStorage.setItem('micro', 0);
        } else {
            localStorage.setItem('micro', ((element.textContent).replace(/\D/g, '')));
        }
    });
}


/* SASU */
function sasuResult(turnoverMinusCost, situation, numberOfChild, householdIncome) {
    sasuSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non');

    sasuRemuneration();
    sasuContributions();
    sasuRetirement();

    calculWageAndDividends(turnoverMinusCost, numberOfChild, householdIncome, situation);

    if(document.getElementById('single-parent').value === 'oui') {
        sasuSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'oui');
        sasuRemuneration();
    }
}

function calculWageAndDividends(turnoverMinusCost, numberOfChild, householdIncome, situation) {
    // max du montant de rémunération si tout est versé en rémunération
    const maxWageIfAllWage = parseInt(localStorage.getItem('sasuMaxAmountWage'));
    const testAmount5P = Math.round(maxWageIfAllWage * 0.05); // 1310

    sasuSetSituation(testAmount5P, situation, numberOfChild, householdIncome, 'non');

    const contributionsUrssaf = engine.evaluate("dirigeant . assimilé salarié . cotisations"); 
    const contributionsAmount = Math.round(contributionsUrssaf.nodeValue); // 1073

    //const remunerationBrut = engine.evaluate("salarié . rémunération . brut");
    //console.log(remunerationBrut.nodeValue);

    const remunerationTotal = engine.evaluate("dirigeant . rémunération . totale");
    console.log(remunerationTotal.nodeValue);

    const totalForIs = turnoverMinusCost - contributionsAmount - testAmount5P;

    let maxDividends;

    if (totalForIs <= 42500) {
        maxDividends = totalForIs - (totalForIs * 0.15);
    } else {
        maxDividends = totalForIs - ((42500 * 0.15) + ((totalForIs - 42500) * 0.25));
    }

    

    console.log(maxDividends);

    /*let maxDividendsIfAllDividends;

    // max du montant de dividendes si tout est versé en dividendes
    if (turnoverMinusCost <= 42500) {
        maxDividendsIfAllDividends = turnoverMinusCost - (turnoverMinusCost * 0.15);
    } else {
        maxDividendsIfAllDividends = turnoverMinusCost - ((42500 * 0.15) + ((turnoverMinusCost - 42500) * 0.25));
    }

    console.log(maxWageIfAllWage);
    console.log(maxDividendsIfAllDividends);

    sasuCalculDividendsNets(maxDividendsIfAllDividends, 'non', numberOfChild, householdIncome, situation);*/
}

function sasuSetSituation(wage, situation, numberOfChild, householdIncome, singleParent) {
    const total = engine.setSituation({
        "salarié . rémunération . net . payé après impôt": wage,
        "salarié . rémunération . brut": 1991,
        "entreprise . catégorie juridique": "'SAS'",
        "impôt . foyer fiscal . situation de famille": `'${situation}'`,
        "impôt . foyer fiscal . enfants à charge": parseInt(numberOfChild),
        "impôt . foyer fiscal . revenu imposable . autres revenus imposables": parseFloat(householdIncome),
        "impôt . foyer fiscal . parent isolé": `${singleParent}`,
        "salarié . régimes spécifiques . DFS": "non",
        "impôt . méthode de calcul": "'barème standard'",
    });
}

function sasuCalculDividendsNets(dividends, singleParent, numberOfChild, householdIncome, situation) {
    /* Dividendes Barème Progressif */
    engine.setSituation({
        "bénéficiaire . dividendes . bruts": parseInt(dividends),
        "impôt . foyer fiscal . parent isolé": `${singleParent}`,
        "impôt . foyer fiscal . enfants à charge": parseInt(numberOfChild),
        "impôt . foyer fiscal . revenu imposable . autres revenus imposables": parseFloat(householdIncome),
        "dirigeant . rémunération . net . imposable": "0 €/an",
        "impôt . foyer fiscal . situation de famille": `'${situation}'`,
        "impôt . méthode de calcul": "'barème standard'",
        "bénéficiaire": "oui",
        "entreprise . catégorie juridique": "'SAS'"
    });

    const dividendsNetsBareme = engine.evaluate("bénéficiaire . dividendes . nets d'impôt");
    console.log((Math.round(dividendsNetsBareme.nodeValue)).toLocaleString('fr-FR'));
    

    /* Dividendes PFU */
    engine.setSituation({
        "impôt . méthode de calcul": "'PFU'",
        "bénéficiaire . dividendes . bruts": parseInt(dividends),
        "bénéficiaire": "oui",
        "entreprise . catégorie juridique": "'SAS'"
    });

    const dividendsNetsPFU = engine.evaluate("bénéficiaire . dividendes . nets d'impôt");
    console.log((Math.round(dividendsNetsPFU.nodeValue)).toLocaleString('fr-FR'));
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
        element.textContent = `${Math.round(net.nodeValue * 12)}€`;
    });

    const afterTax = engine.evaluate("salarié . rémunération . net . payé après impôt");
    const afterTaxAmount = Math.round(afterTax.nodeValue * 12);
    localStorage.setItem('sasuMaxAmountWage', afterTaxAmount);
    document.querySelectorAll('.sasu-after').forEach(element => {
        element.textContent = `${afterTaxAmount}€`;
    });
}

function sasuContributions() {
    yearFillText("dirigeant . assimilé salarié . cotisations", '#sasu-contributions-total');

    /* EMPLOYER */
    yearFillText("salarié . cotisations . maladie . employeur", '#sasu-disease');
    yearFillText("salarié . cotisations . CSA", '#sasu-solidarity-autonomy');
    yearFillText("salarié . cotisations . ATMP", '#sasu-work-accident');
    yearFillText("salarié . cotisations . vieillesse . employeur", '.sasu-employer-old-age');
    yearFillText("salarié . cotisations . retraite complémentaire . employeur", '#sasu-employer-additional-retirement');
    yearFillText("salarié . cotisations . CEG . employeur", '#sasu-employer-general-balance');
    yearFillText("salarié . cotisations . allocations familiales", '#sasu-family-allowance');
    yearFillText("salarié . cotisations . FNAL", '#sasu-fnal');
    yearFillText("salarié . cotisations . formation professionnelle", '#sasu-formation');
    yearFillText("salarié . cotisations . taxe d'apprentissage", '#sasu-learning-tax');
    yearFillText("salarié . cotisations . prévoyances . employeur", '#sasu-additional-planning');

    /* EMPLOYEE */
    yearFillText("salarié . cotisations . vieillesse . salarié", '#sasu-employee-old-age');
    yearFillText("salarié . cotisations . retraite complémentaire . salarié", '#sasu-employee-additional-retirement');
    yearFillText("salarié . cotisations . CEG . salarié", '#sasu-employee-general-balance');
    yearFillText("salarié . cotisations . CSG-CRDS", '#sasu-csg');
    yearFillText("salarié . cotisations . prévoyances . salarié", '#sasu-employee-additional-planning');
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
function eurlResult(turnoverMinusCost, situation, numberOfChild, householdIncome) {
    eurlSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'IS', 'non');

    eiEurlRemuneration('.is-eurl-after');
    eurlContributions();
    eurlRetirement();

    eurlSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'IR', 'non');
    eiEurlRemuneration('.ir-eurl-after');

    if(document.getElementById('single-parent').value === 'oui') {
        eurlSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'IS', 'oui');
        eiEurlRemuneration('.is-eurl-after');

        eurlSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'IR', 'oui');
        eiEurlRemuneration('.ir-eurl-after');
    }
}

function eurlSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, tax, singleParent) {
    engine.setSituation({
        "dirigeant . rémunération . totale": turnoverMinusCost,
        "impôt . foyer fiscal . situation de famille": `'${situation}'`,
        "impôt . foyer fiscal . enfants à charge": numberOfChild,
        "impôt . foyer fiscal . revenu imposable . autres revenus imposables": parseFloat(householdIncome),
        "entreprise . activité . nature": "'libérale'",
        "entreprise . imposition": `'${tax}'`,
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

    if(document.getElementById('single-parent').value === 'oui') {
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

    if(document.getElementById('single-parent').value === 'oui') {
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