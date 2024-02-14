import Engine,{ formatValue } from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/1.4.8-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/1.4.8-remuneration-independants/node_modules/modele-social/dist/index.js';

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

const calculBtn = document.getElementById('calcul-btn');
const numberOfChildSelect = document.getElementById('child');

numberOfChildSelect.addEventListener('change', (input) => {
    const singleParentElements = document.querySelectorAll('.single-parent');
    if (parseInt(input.target.value) > 0) {
        singleParentElements.forEach(element => {
            element.classList.remove('hidden');
        });
    } else {
        singleParentElements.forEach(element => {
            element.classList.add('hidden');
        });
    }
});

function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}


calculBtn.addEventListener('click', () => {
    showLoader();

    setTimeout(() => {
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

        hideLoader();
    }, 100);
});

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

function compareRemuneration(turnover) {
    storeRemuneration(turnover);

    document.querySelectorAll('.heading-recap').forEach(element => {
        element.classList.remove('heading-best-choice');
    });

    document.querySelectorAll('.container-recap').forEach(element => {
        element.classList.remove('container-best-choice');
    });

    const eurlIr = parseInt(localStorage.getItem('eurlIr'));
    const eiIr = parseInt(localStorage.getItem('eiIr'));
    const sasu = parseInt(localStorage.getItem('sasu'));
    const micro = parseInt(localStorage.getItem('micro'));

    const sasuDividends = parseInt(localStorage.getItem('sasuDividends'));

    const sasuTotal = sasu + sasuDividends;

    const eurlContainerRecap = document.getElementById('eurl-container-recap');
    const sasuContainerRecap = document.getElementById('sasu-container-recap');
    const eiContainerRecap = document.getElementById('ei-container-recap');
    const microContainerRecap = document.getElementById('micro-container-recap');

    const eurlHeadingRecap = document.getElementById('eurl-heading-recap');
    const sasuHeadingRecap = document.getElementById('sasu-heading-recap');
    const eiHeadingRecap = document.getElementById('ei-heading-recap');
    const microHeadingRecap = document.getElementById('micro-heading-recap');

    if (eurlIr >= eiIr && eurlIr > sasuTotal && eurlIr > micro) {
        if (eurlIr > eiIr) {
            eurlContainerRecap.classList.add('container-best-choice');
            eurlHeadingRecap.classList.add('heading-best-choice');
        } else if (eurlIr === eiIr) {
            eurlContainerRecap.classList.add('container-best-choice');
            eurlHeadingRecap.classList.add('heading-best-choice');
            eiContainerRecap.classList.add('container-best-choice');
            eiHeadingRecap.classList.add('heading-best-choice');
        }
    } else if (sasuTotal > eurlIr && sasuTotal > eiIr && sasuTotal > micro) {
        sasuContainerRecap.classList.add('container-best-choice');
        sasuHeadingRecap.classList.add('heading-best-choice');
    } else if (micro > eurlIr && micro > eiIr && micro > sasuTotal) {
        microContainerRecap.classList.add('container-best-choice');
        microHeadingRecap.classList.add('heading-best-choice');
    } else if (eiIr >= eurlIr && eiIr > sasuTotal && eiIr > micro) {
        if (eiIr > eurlIr) {
            eiContainerRecap.classList.add('container-best-choice');
            eiHeadingRecap.classList.add('heading-best-choice');
        } else if (eiIr === eurlIr) {
            eurlContainerRecap.classList.add('container-best-choice');
            eurlHeadingRecap.classList.add('heading-best-choice');
            eiContainerRecap.classList.add('container-best-choice');
            eiHeadingRecap.classList.add('heading-best-choice');
        }
    }
}

function storeRemuneration(turnover) {
    document.querySelectorAll('.ir-eurl-after').forEach(element => {
        const eurllIrAmount = (element.textContent).replace(/\D/g, '');
        localStorage.setItem('eurlIr', eurllIrAmount);
        document.getElementById('eurl-wage-recap').textContent = eurllIrAmount + '€';
    });

    document.querySelectorAll('.ir-ei-after').forEach(element => {
        const eilIrAmount = (element.textContent).replace(/\D/g, '');
        localStorage.setItem('eiIr', eilIrAmount);
        document.getElementById('ei-wage-recap').textContent = eilIrAmount + '€';
    });

    document.querySelectorAll('.sasu-after').forEach(element => {
        const sasuAmount = (element.textContent).replace(/\D/g, '');
        document.getElementById('sasu-wage-recap').textContent = sasuAmount + '€';
        localStorage.setItem('sasu', sasuAmount);
    });

    document.querySelectorAll('.micro-after').forEach(element => {
        if (turnover > 50000) {
            localStorage.setItem('micro', 0);
        } else {
            const microAmount = (element.textContent).replace(/\D/g, '');
            localStorage.setItem('micro', microAmount);
            document.getElementById('micro-wage-recap').textContent = microAmount + '€';
        }
    });

    document.querySelectorAll('.ca-recap').forEach(element => {
        element.textContent = turnover.toLocaleString('fr-FR') + '€';
    });

    const sasuContributions = document.getElementById('sasu-contributions-total').textContent;
    document.getElementById('sasu-contributions-recap').textContent = sasuContributions;
    const sasuDividends = document.getElementById('sasu-progressive-dividends').textContent;
    document.getElementById('sasu-dividends-recap').textContent = sasuDividends;
    localStorage.setItem('sasuDividends', sasuDividends.replace(/\D/g, ''));

    const eurlContributions = document.getElementById('eurl-contributions-total').textContent;
    document.getElementById('eurl-contributions-recap').textContent = eurlContributions;

    const eiContributions = document.getElementById('ei-contributions-total').textContent;
    document.getElementById('ei-contributions-recap').textContent = eiContributions;

    const microContributions = document.getElementById('micro-contributions-total').textContent;
    document.getElementById('micro-contributions-recap').textContent = microContributions;
}

function situationProgressiveDividends(dividends, situation, numberOfChild, householdIncome, singleParent, socialForm) {
    engine.setSituation({
        "bénéficiaire . dividendes . bruts": parseInt(dividends),
        "impôt . foyer fiscal . parent isolé": `${singleParent}`,
        "impôt . foyer fiscal . enfants à charge": parseInt(numberOfChild),
        "impôt . foyer fiscal . revenu imposable . autres revenus imposables": parseFloat(householdIncome),
        "dirigeant . rémunération . net . imposable": "0 €/an",
        "impôt . foyer fiscal . situation de famille": `'${situation}'`,
        "impôt . méthode de calcul": "'barème standard'",
        "bénéficiaire": "oui",
        "entreprise . catégorie juridique": `${socialForm}`
    });
}


/* SASU */
function sasuCalculAll(turnoverMinusCost, situation, numberOfChild, householdIncome, percentage, myArray) {
    const wage = Math.round(turnoverMinusCost * (percentage / 100));

    sasuSituation(wage, situation, numberOfChild, householdIncome, 'non');

    let afterTax = engine.evaluate("salarié . rémunération . net . payé après impôt");
    if (isNaN(afterTax.nodeValue)) {
        afterTax = 0;
    } else {
        afterTax = Math.round(afterTax.nodeValue * 12);
    }

    let beforeTax = engine.evaluate("salarié . rémunération . net . à payer avant impôt");
    if (isNaN(beforeTax.nodeValue)) {
        beforeTax = 0;
    } else {
        beforeTax = Math.round(beforeTax.nodeValue * 12);
    }

    let contributionsTotal = engine.evaluate("dirigeant . assimilé salarié . cotisations");
    if (isNaN(contributionsTotal.nodeValue)) {
        contributionsTotal = 0;
    } else {
        contributionsTotal = Math.round(contributionsTotal.nodeValue * 12);
    }

    const totalForIs = turnoverMinusCost - contributionsTotal - beforeTax;

    let maxDividends;

    if (totalForIs <= 42500) {
        maxDividends = Math.round(totalForIs - (totalForIs * 0.15));
    } else {
        maxDividends = Math.round(totalForIs - ((42500 * 0.15) + ((totalForIs - 42500) * 0.25)));
    }

    situationProgressiveDividends(maxDividends, situation, numberOfChild, householdIncome, 'non', 'SAS');
    const dividendsNetsProgressive = engine.evaluate("bénéficiaire . dividendes . nets d'impôt");
    const dividendsNetsProgressiveAmount = (Math.round(dividendsNetsProgressive.nodeValue));

    sasuSituationPfuDividends(maxDividends);
    const dividendsNetsPfu = engine.evaluate("bénéficiaire . dividendes . nets d'impôt");
    const dividendsNetsPfuAmount = (Math.round(dividendsNetsPfu.nodeValue));

    sasuPushInArray(afterTax, dividendsNetsProgressiveAmount, dividendsNetsPfuAmount, maxDividends, percentage, myArray);
}

function sasuResult(turnoverMinusCost, situation, numberOfChild, householdIncome) {
    let myArray = [];

    for (let percentage = 0; percentage <= 100; percentage += 10) {
        sasuCalculAll(turnoverMinusCost, situation, numberOfChild, householdIncome, percentage, myArray);
    }

    myArray = JSON.parse(localStorage.getItem('myArray')); 

    let remunerationPlusDividendsBestAmount = myArray[0].remunerationPlusDividendsBestAmount;
    let maxRemunerationObject = 0;
    let maxRemunerationPercentage = myArray[0].percentage;
    let maxDividends = myArray[0].maxDividends;

    for (let i = 1; i < myArray.length; i++) {
        const currentRemunerationPlusDividends = myArray[i].remunerationPlusDividendsBestAmount;

        if (currentRemunerationPlusDividends > remunerationPlusDividendsBestAmount) {
            remunerationPlusDividendsBestAmount = currentRemunerationPlusDividends;
            maxRemunerationObject = i;
            maxRemunerationPercentage = myArray[i].percentage;
            maxDividends = myArray[i].maxDividends;
        }
    }

    let bestWage = Math.round(turnoverMinusCost * (maxRemunerationPercentage / 100));

    sasuSituation(bestWage, situation, numberOfChild, householdIncome, 'non');
    sasuRemuneration();
    sasuContributions();
    sasuRetirement();

    sasuCalculDividendsNets(maxDividends, situation, numberOfChild, householdIncome);
    const sasuGrossDividends = document.getElementById('sasu-gross-dividends');
    sasuGrossDividends.textContent = maxDividends.toLocaleString('fr-FR') + '€';
}

function sasuSituationPfuDividends(dividends) {
    engine.setSituation({
        "impôt . méthode de calcul": "'PFU'",
        "bénéficiaire . dividendes . bruts": parseInt(dividends),
        "bénéficiaire": "oui",
        "entreprise . catégorie juridique": "'SAS'"
    });
}

function sasuCalculDividendsNets(dividends, situation, numberOfChild, householdIncome) {
    /* Dividendes Barème Progressif */
    situationProgressiveDividends(dividends, situation, numberOfChild, householdIncome, 'non', 'SAS');
    const dividendsNetsBareme = engine.evaluate("bénéficiaire . dividendes . nets d'impôt");
    const dividendsNetsBaremeAmount = (Math.round(dividendsNetsBareme.nodeValue));
    document.getElementById('sasu-progressive-dividends').textContent = dividendsNetsBaremeAmount.toLocaleString('fr-FR') + '€';

    if(document.getElementById('single-parent').value === 'oui') {
        situationProgressiveDividends(dividends, situation, numberOfChild, householdIncome, 'oui', 'SAS');
    }
    

    /* Dividendes PFU */
    sasuSituationPfuDividends(dividends);
    const dividendsNetsPFU = engine.evaluate("bénéficiaire . dividendes . nets d'impôt");
    const dividendsNetsPFUAmount = (Math.round(dividendsNetsPFU.nodeValue));
    document.getElementById('sasu-pfu-dividends').textContent = dividendsNetsPFUAmount.toLocaleString('fr-FR') + '€';
}

function sasuPushInArray(afterTax, dividendsNetsProgressiveAmount, dividendsNetsPfuAmount, dividends, percentage, myArray) {
    const remunerationPlusDividendsPregressiveAmount = afterTax + dividendsNetsProgressiveAmount;
    const remunerationPlusDividendsPfuAmount = afterTax + dividendsNetsPfuAmount;

    let remunerationPlusDividendsBestAmount;

    if (remunerationPlusDividendsPregressiveAmount > remunerationPlusDividendsPfuAmount) {
        remunerationPlusDividendsBestAmount = remunerationPlusDividendsPregressiveAmount;
    } else if (remunerationPlusDividendsPfuAmount > remunerationPlusDividendsPregressiveAmount) {
        remunerationPlusDividendsBestAmount = remunerationPlusDividendsPfuAmount;
    }

    let myObject = {
        maxDividends: parseInt(dividends),
        afterTaxAmount: parseInt(afterTax),
        percentage: parseInt(percentage),
        remunerationPlusDividendsBestAmount: parseInt(remunerationPlusDividendsBestAmount)
    }

    myArray.push(myObject);
    localStorage.setItem('myArray', JSON.stringify(myArray));
}

function sasuSituation(wage, situation, numberOfChild, householdIncome, singleParent) {
    engine.setSituation({
        "dirigeant . rémunération . totale": parseInt(wage),
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
    let netAmount = Math.round(net.nodeValue * 12);
    if (isNaN(netAmount)) {
        netAmount = 0;
    }
    document.querySelectorAll('.sasu-before').forEach(element => {
        element.textContent = `${netAmount}€`;
    });

    const afterTax = engine.evaluate("salarié . rémunération . net . payé après impôt");
    let afterTaxAmount = Math.round(afterTax.nodeValue * 12);
    if (isNaN(afterTaxAmount)) {
        afterTaxAmount = 0;
    }
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


function eurlCalculAll(turnoverMinusCost, situation, numberOfChild, householdIncome, percentage, myArray) {
    const wage = Math.round(turnoverMinusCost * (percentage / 100));

    eurlSituation(wage, situation, numberOfChild, householdIncome, 'IS', 'non');

    let afterTax = engine.evaluate("dirigeant . rémunération . net . après impôt");
    if (isNaN(afterTax.nodeValue)) {
        afterTax = 0;
    } else {
        afterTax = Math.round(afterTax.nodeValue * 12);
    }

    let beforeTax = engine.evaluate("dirigeant . rémunération . net");
    if (isNaN(beforeTax.nodeValue)) {
        beforeTax = 0;
    } else {
        beforeTax = Math.round(beforeTax.nodeValue * 12);
    }

    let contributionsTotal = engine.evaluate("dirigeant . indépendant . cotisations et contributions");
    if (isNaN(contributionsTotal.nodeValue)) {
        contributionsTotal = 0;
    } else {
        contributionsTotal = Math.round(contributionsTotal.nodeValue * 12);
    }

    const totalForIs = turnoverMinusCost - contributionsTotal - beforeTax;

    let maxDividends;

    if (totalForIs <= 42500) {
        maxDividends = Math.round(totalForIs - (totalForIs * 0.15));
    } else {
        maxDividends = Math.round(totalForIs - ((42500 * 0.15) + ((totalForIs - 42500) * 0.25)));
    }

    situationProgressiveDividends(maxDividends, situation, numberOfChild, householdIncome, 'non', 'SARL');
    const dividendsNetsProgressive = engine.evaluate("bénéficiaire . dividendes . nets d'impôt");
    const dividendsNetsProgressiveAmount = Math.round(dividendsNetsProgressive.nodeValue);

    const dividendsNetsPfu = maxDividends - (maxDividends * 0.128);
    const dividendsNetsPfuAmount = Math.round(dividendsNetsPfu);

    eurlPushInArray(afterTax, dividendsNetsProgressiveAmount, dividendsNetsPfuAmount, maxDividends, percentage, myArray);
}

function eurlPushInArray(afterTax, dividendsNetsProgressiveAmount, dividendsNetsPfuAmount, dividends, percentage, myArray) {
    const remunerationPlusDividendsPregressiveAmount = afterTax + dividendsNetsProgressiveAmount;
    const remunerationPlusDividendsPfuAmount = afterTax + dividendsNetsPfuAmount;

    let remunerationPlusDividendsBestAmount;

    if (remunerationPlusDividendsPregressiveAmount > remunerationPlusDividendsPfuAmount) {
        remunerationPlusDividendsBestAmount = remunerationPlusDividendsPregressiveAmount;
    } else if (remunerationPlusDividendsPfuAmount > remunerationPlusDividendsPregressiveAmount) {
        remunerationPlusDividendsBestAmount = remunerationPlusDividendsPfuAmount;
    }

    let myObject = {
        maxDividends: parseInt(dividends),
        afterTaxAmount: parseInt(afterTax),
        percentage: parseInt(percentage),
        remunerationPlusDividendsBestAmount: parseInt(remunerationPlusDividendsBestAmount)
    }

    myArray.push(myObject);
    localStorage.setItem('myArrayEurl', JSON.stringify(myArray));
}


function eurlResult(turnoverMinusCost, situation, numberOfChild, householdIncome) {
    let myArray = [];

    for (let percentage = 0; percentage <= 100; percentage += 10) {
        eurlCalculAll(turnoverMinusCost, situation, numberOfChild, householdIncome, percentage, myArray);
    }

    myArray = JSON.parse(localStorage.getItem('myArrayEurl'));

    let remunerationPlusDividendsBestAmount = myArray[0].remunerationPlusDividendsBestAmount;
    let maxRemunerationObject = 0;
    let maxRemunerationPercentage = myArray[0].percentage;
    let maxDividends = myArray[0].maxDividends;

    for (let i = 1; i < myArray.length; i++) {
        const currentRemunerationPlusDividends = myArray[i].remunerationPlusDividendsBestAmount;

        if (currentRemunerationPlusDividends > remunerationPlusDividendsBestAmount) {
            remunerationPlusDividendsBestAmount = currentRemunerationPlusDividends;
            maxRemunerationObject = i;
            maxRemunerationPercentage = myArray[i].percentage;
            maxDividends = myArray[i].maxDividends;
        }
    }

    let bestWage = Math.round(turnoverMinusCost * (maxRemunerationPercentage / 100));

    eurlSituation(bestWage, situation, numberOfChild, householdIncome, 'IS', 'non');
    fillSameClassTexts("dirigeant . rémunération . net", '.eurl-is-before-tax');
    fillSameClassTexts("dirigeant . rémunération . net . après impôt", 'is-eurl-after');
    eurlContributions();
    eurlRetirement();

    eurlCalculDividendsNets(maxDividends, situation, numberOfChild, householdIncome);
    const eurlGrossDividends = document.getElementById('eurl-gross-dividends');
    eurlGrossDividends.textContent = maxDividends.toLocaleString('fr-FR') + '€';
}

function eurlCalculDividendsNets(dividends, situation, numberOfChild, householdIncome) {
    /* Dividendes Barème Progressif */
    situationProgressiveDividends(dividends, situation, numberOfChild, householdIncome, 'non', 'SARL');
    const dividendsNetsBareme = engine.evaluate("bénéficiaire . dividendes . nets d'impôt");
    const dividendsNetsBaremeAmount = (Math.round(dividendsNetsBareme.nodeValue));
    document.getElementById('eurl-progressive-dividends').textContent = dividendsNetsBaremeAmount.toLocaleString('fr-FR') + '€';

    if(document.getElementById('single-parent').value === 'oui') {
        situationProgressiveDividends(dividends, situation, numberOfChild, householdIncome, 'oui', 'SARL');
    }
    

    /* Dividendes PFU */
    const dividendsNetsPFU = dividends - (dividends * 0.128);
    const dividendsNetsPFUAmount = Math.round(dividendsNetsPFU);
    document.getElementById('eurl-pfu-dividends').textContent = dividendsNetsPFUAmount.toLocaleString('fr-FR') + '€';
}

/*function eurlResult(turnoverMinusCost, situation, numberOfChild, householdIncome) {
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
}*/

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