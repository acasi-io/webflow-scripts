import Engine from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/5.5.2-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/5.5.2-remuneration-independants/node_modules/modele-social/dist/index.js';

import { halfPass, fifthPass } from './script.js';

const engine = new Engine(rules);

const sasuDividendsPfu = document.getElementById('pfu-dividends');
const sasuDividendsProgressive = document.getElementById('progressive-dividends');


function yearFillText(urssafData, htmlTag) {
    const data = engine.evaluate(urssafData);
    let dataYear = Math.round(data.nodeValue * 12);
    if (isNaN(dataYear)) {
        dataYear = 0;
    }
    document.querySelector(htmlTag).textContent = dataYear.toLocaleString('fr-FR') + '€';
}

function retirementText() {
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



/*function fillSasuDividendsRecap() {
    const sasuDividendsRecap = document.getElementById('sasu-dividends-recap');
    const sasuDividendsProgressiveAmount = parseInt((sasuDividendsProgressive.textContent).replace(/\D/g, ''));
    const sasuDividendsPfuAmount = parseInt((sasuDividendsPfu.textContent).replace(/\D/g, ''));
    let bestDividends;
    if (sasuDividendsProgressiveAmount > sasuDividendsPfuAmount) {
        bestDividends = sasuDividendsProgressiveAmount;
        sasuDividendsRecap.textContent = sasuDividendsProgressiveAmount.toLocaleString('fr-FR') + '€';
    } else {
        bestDividends = sasuDividendsPfuAmount;
        sasuDividendsRecap.textContent = sasuDividendsPfuAmount.toLocaleString('fr-FR') + '€';
    }
    localStorage.setItem('sasuDividends', bestDividends);
}*/

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

function calculEssentialsValueForDividends(wage, situation, numberOfChild, householdIncome, turnoverMinusCost) {
    sasuSituation(wage, situation, numberOfChild, householdIncome, 'non');

    let afterTax = engine.evaluate("salarié . rémunération . net . payé après impôt");
    if (isNaN(afterTax.nodeValue)) {
        afterTax = 0;
    } else {
        afterTax = Math.round(afterTax.nodeValue * 12);
    }
    localStorage.setItem('afterTaxSasu', afterTax);

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

    let totalForIs = turnoverMinusCost - contributionsTotal - beforeTax;
    localStorage.setItem('totalForIs', totalForIs);
}

function sasuCalculAll(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, percentage, arraySasu) {
    const wage = Math.round(turnoverMinusCost * (percentage / 100));

    calculEssentialsValueForDividends(wage, situation, numberOfChild, householdIncome, turnoverMinusCost)

    let afterTax = parseInt(localStorage.getItem('afterTaxSasu'));
    let totalForIs = parseInt(localStorage.getItem('totalForIs'));
    let maxDividends;

    if (totalForIs <= 42500) {
        maxDividends = Math.round(totalForIs - (totalForIs * 0.15));
    } else {
        maxDividends = Math.round(totalForIs - ((42500 * 0.15) + ((totalForIs - 42500) * 0.25)));
    }

    situationProgressiveDividends(maxDividends, situation, numberOfChild, householdIncome, singleParent, 'SAS');
    const dividendsNetsProgressive = engine.evaluate("bénéficiaire . dividendes . nets d'impôt");
    const dividendsNetsProgressiveAmount = (Math.round(dividendsNetsProgressive.nodeValue));

    sasuSituationPfuDividends(maxDividends);
    const dividendsNetsPfu = engine.evaluate("bénéficiaire . dividendes . nets d'impôt");
    const dividendsNetsPfuAmount = (Math.round(dividendsNetsPfu.nodeValue));

    sasuPushInArray(afterTax, dividendsNetsProgressiveAmount, dividendsNetsPfuAmount, maxDividends, percentage, arraySasu);
}

function sasuResult(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    let arraySasu = [];

    findSasuBestRemunerationAndDividends(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, arraySasu);

    let bestWage = parseInt(localStorage.getItem('bestWage'));
    let maxDividends = parseInt(localStorage.getItem('maxDividends'));

    sasuSituation(bestWage, situation, numberOfChild, householdIncome, singleParent);
    sasuRemuneration();
    sasuContributions();
    sasuRetirement();

    yearFillText("dirigeant . assimilé salarié . cotisations", '#contributions-total');
    const contributionsUrssaf = engine.evaluate("dirigeant . assimilé salarié . cotisations");
    const contributionsAmount = Math.round(contributionsUrssaf.nodeValue * 12);

    localStorage.setItem('sasuContributions', contributionsAmount);

    // let pumaTaxAmount = calculPumaTax(maxDividends);

    // let grossDividends = maxDividends - pumaTaxAmount;

    sasuCalculDividendsNets(maxDividends, situation, numberOfChild, householdIncome);
    const sasuGrossDividends = document.getElementById('gross-dividends');
    sasuGrossDividends.textContent = maxDividends.toLocaleString('fr-FR') + '€';
}

/*function calculPumaTax(maxDividends) {
    const sasuAfterTaxForDividends = parseInt(localStorage.getItem('sasuAfterTax'));

    let pumaTaxAmount = (0.065 * (maxDividends - halfPass) * (1 - (sasuAfterTaxForDividends / fifthPass)));

    if (pumaTaxAmount <= 0) {
        document.getElementById('sasu-puma').textContent = '0€';
    } else {
        document.getElementById('sasu-puma').textContent = pumaTaxAmount.toLocaleString('fr-FR') + '€';
    }

    return pumaTaxAmount;
}*/

function findSasuBestRemunerationAndDividends(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, arraySasu) {
    for (let percentage = 0; percentage <= 100; percentage += 10) {
        sasuCalculAll(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, percentage, arraySasu);
    }

    arraySasu = JSON.parse(localStorage.getItem('arraySasu')); 

    let remunerationPlusDividendsBestAmount = arraySasu[0].remunerationPlusDividendsBestAmount;
    let maxRemunerationObject = 0;
    let maxRemunerationPercentage = arraySasu[0].percentage;
    let maxDividends = arraySasu[0].maxDividends;

    for (let i = 1; i < arraySasu.length; i++) {
        const currentRemunerationPlusDividends = arraySasu[i].remunerationPlusDividendsBestAmount;

        if (currentRemunerationPlusDividends > remunerationPlusDividendsBestAmount) {
            remunerationPlusDividendsBestAmount = currentRemunerationPlusDividends;
            maxRemunerationObject = i;
            maxRemunerationPercentage = arraySasu[i].percentage;
            maxDividends = arraySasu[i].maxDividends;
        }
    }

    let bestWage = Math.round(turnoverMinusCost * (maxRemunerationPercentage / 100));
    localStorage.setItem('bestWage', bestWage);
    localStorage.setItem('maxDividends', maxDividends);
    localStorage.setItem('sasuTotal', remunerationPlusDividendsBestAmount);
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
    sasuDividendsProgressive.textContent = dividendsNetsBaremeAmount.toLocaleString('fr-FR') + '€';

    if(document.getElementById('single-parent').value === 'oui') {
        situationProgressiveDividends(dividends, situation, numberOfChild, householdIncome, 'oui', 'SAS');
    }
    

    /* Dividendes PFU */
    sasuSituationPfuDividends(dividends);
    const dividendsNetsPFU = engine.evaluate("bénéficiaire . dividendes . nets d'impôt");
    const dividendsNetsPFUAmount = (Math.round(dividendsNetsPFU.nodeValue));
    sasuDividendsPfu.textContent = dividendsNetsPFUAmount.toLocaleString('fr-FR') + '€';
}

function sasuPushInArray(afterTax, dividendsNetsProgressiveAmount, dividendsNetsPfuAmount, dividends, percentage, arraySasu) {
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
        dividendsNetsPfuAmount: parseInt(dividendsNetsPfuAmount),
        dividendsNetsProgressiveAmount: parseInt(dividendsNetsProgressiveAmount),
        remunerationPlusDividendsBestAmount: parseInt(remunerationPlusDividendsBestAmount)
    }

    arraySasu.push(myObject);
    localStorage.setItem('arraySasu', JSON.stringify(arraySasu));
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
    document.getElementById('before-tax').textContent = `${netAmount}€`;

    const afterTax = engine.evaluate("salarié . rémunération . net . payé après impôt");
    let afterTaxAmount = Math.round(afterTax.nodeValue * 12);
    if (isNaN(afterTaxAmount)) {
        afterTaxAmount = 0;
    }
    document.getElementById('after-tax').textContent = `${afterTaxAmount}€`;

    localStorage.setItem('sasuAfterTax', afterTaxAmount);

    if (netAmount === 0 && afterTaxAmount === 0) {
        document.getElementById('before-tax').textContent = `0€`;
        document.getElementById('after-tax').textContent = `0€`;
    }
}

function sasuContributions() {
    yearFillText("dirigeant . assimilé salarié . cotisations", '#contributions-total');

    /* EMPLOYER */
    yearFillText("salarié . cotisations . maladie . employeur", '#contributions-sasu-disease');
    yearFillText("salarié . cotisations . CSA", '#contributions-sasu-solidarity-autonomy');
    yearFillText("salarié . cotisations . ATMP", '#contributions-sasu-work-accident');
    yearFillText("salarié . cotisations . vieillesse . employeur", '#contributions-sasu-employer-old-age');
    yearFillText("salarié . cotisations . retraite complémentaire . employeur", '#contributions-sasu-employer-additional-retirement');
    yearFillText("salarié . cotisations . CEG . employeur", '#contributions-sasu-employer-general-balance');
    yearFillText("salarié . cotisations . allocations familiales", '#contributions-sasu-family-allowance');
    yearFillText("salarié . cotisations . FNAL", '#contributions-sasu-fnal');
    yearFillText("salarié . cotisations . formation professionnelle", '#contributions-sasu-formation');
    yearFillText("salarié . cotisations . taxe d'apprentissage", '#contributions-sasu-learning-tax');
    yearFillText("salarié . cotisations . prévoyances . employeur", '#contributions-sasu-employer-additional-planning');

    /* EMPLOYEE */
    yearFillText("salarié . cotisations . vieillesse . salarié", '#contributions-sasu-employee-old-age');
    yearFillText("salarié . cotisations . retraite complémentaire . salarié", '#contributions-sasu-employee-additional-retirement');
    yearFillText("salarié . cotisations . CEG . salarié", '#contributions-sasu-employee-general-balance');
    yearFillText("salarié . cotisations . CSG-CRDS", '#contributions-sasu-csg');
    yearFillText("salarié . cotisations . prévoyances . salarié", '#contributions-sasu-employee-additional-planning');
}

function sasuRetirement() {
    retirementText();

    const grossWage = Math.round((engine.evaluate("salarié . rémunération . brut")).nodeValue) * 12;
    let stageOnePercentage = 0.062;
    let stageTwoPercentage = 0.17;
    let pointPrice = 19.6321;
    let pointsAcquired;
    let maxStageOne = 43992;
    let maxStageTwo = 351936;

    if (grossWage <= maxStageOne) {
        pointsAcquired = Math.round((grossWage * stageOnePercentage) / pointPrice);
    } else {
        pointsAcquired = Math.round((((grossWage - maxStageOne) * stageTwoPercentage) + (maxStageOne * stageOnePercentage)) / pointPrice);
    }

    document.getElementById('retirement-points').textContent = pointsAcquired;
}

/*function sasuCalculRetraite(turnoverMinusCost) {
    engine.setSituation({
        "entreprise . date de création": "période . début d'année",
        "dirigeant . exonérations . ACRE": "non",
        "salarié . cotisations . ATMP . taux fonctions support": "oui",
        "entreprise . chiffre d'affaires": turnoverMinusCost,
        "entreprise . catégorie juridique": "'SAS'"
      })

    let basicRetirementUrssaf = engine.evaluate("protection sociale . retraite . base");
    let basicRetirementAmount = Math.round(basicRetirementUrssaf.nodeValue * 12);
    let complementaryRetirementUrssaf = engine.evaluate("protection sociale . retraite . complémentaire");
    let complementaryRetirementAmount = Math.round(complementaryRetirementUrssaf.nodeValue * 12);
    let totalRetirement = basicRetirementAmount + complementaryRetirementAmount;

    return totalRetirement;
}*/

function fillSasuComparison() {
    const sasuArray = JSON.parse(localStorage.getItem('arraySasu'));
    const bestSasuTotal = Math.max(...sasuArray.map(obj => obj.remunerationPlusDividendsBestAmount));
    const bestSasuObject = sasuArray.find(obj => obj.remunerationPlusDividendsBestAmount === bestSasuTotal);

    const sasuPfuDividends = parseInt(bestSasuObject.dividendsNetsPfuAmount);
    const sasuProgressiveDividends = parseInt(bestSasuObject.dividendsNetsProgressiveAmount);
    let sasuDividends;
    if (sasuPfuDividends > sasuProgressiveDividends) {
        sasuDividends = sasuPfuDividends;
    } else {
        sasuDividends = sasuProgressiveDividends;
    }

    const sasuRemuneration = parseInt(bestSasuObject.afterTaxAmount);
    const sasuContributions = parseInt(localStorage.getItem('sasuContributions'));

    document.getElementById('sasu-comparison-wage').textContent = sasuRemuneration.toLocaleString('fr-FR');
    document.getElementById('sasu-comparison-dividends').textContent = sasuDividends.toLocaleString('fr-FR');
    document.getElementById('sasu-comparison-contributions').textContent = sasuContributions.toLocaleString('fr-FR');
}


export { sasuResult, fillSasuComparison };