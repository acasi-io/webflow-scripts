import Engine,{ formatValue } from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/3.1.2-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/3.1.2-remuneration-independants/node_modules/modele-social/dist/index.js';

import { calculEurl } from './eurl.js';
import { microConditions, microResult } from './micro.js';
import { eiResult } from './ei.js';

const engine = new Engine(rules);

const calculBtn = document.getElementById('calcul-btn');
const numberOfChildSelect = document.getElementById('child');
const sasuDividendsPfu = document.getElementById('sasu-pfu-dividends');
const sasuDividendsProgressive = document.getElementById('sasu-progressive-dividends');
const sasuBeforeTax = document.querySelectorAll('.is_sasu_before_tax');
const sasuAfterTax = document.querySelectorAll('.is_sasu_after_tax');
const simulatorResults = document.getElementById('simulator-results');


numberOfChildSelect.addEventListener('change', (input) => {
    const singleParentElements = document.querySelectorAll('.is_single_parent');
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
        const singleParent = document.getElementById('single-parent').value;

        microConditions(turnover);

        const turnoverMinusCost = turnover - cost;

        // eurlResult(turnoverMinusCost, situation, cost, numberOfChild, householdIncome);
        calculEurl(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent);
        sasuResult(turnoverMinusCost, situation, numberOfChild, householdIncome);
        eiResult(turnoverMinusCost, situation, numberOfChild, householdIncome);
        microResult(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent);

        fillRecapContainer(turnover);

        simulatorResults.classList.remove('hidden');
        simulatorResults.scrollIntoView({
            behavior: "smooth"
        });

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

function fillRecapContainer(turnover) {
    fillWageRecap(turnover);
    fillContributionsRecap();
    fillSasuDividendsRecap();
    fillTextForMicro(turnover);

    document.querySelectorAll('.simulator_heading_recap').forEach(element => {
        element.classList.remove('heading-best-choice');
    });

    document.querySelectorAll('.simulator_recap_item').forEach(element => {
        element.classList.remove('container-best-choice');
    });

    const eurlBestResult = parseInt(localStorage.getItem('eurlBestResult'));
    const eurlDividends = parseInt(localStorage.getItem('eurlDividends'));
    const eurlTotal = eurlBestResult + eurlDividends;

    const eiBestResult = parseInt(localStorage.getItem('eiBestResult'));
    const sasu = parseInt(localStorage.getItem('sasu'));
    const micro = parseInt(localStorage.getItem('micro'));

    const sasuDividends = parseInt(localStorage.getItem('sasuDividends'));
    const sasuTotal = sasu + sasuDividends;

    orderResults(sasuTotal, eurlTotal, eiBestResult, micro);
    compareResultsAndAddStyle(sasuTotal, eurlTotal, eiBestResult, micro);
}

function orderResults(sasuTotal, eurlTotal, eiBestResult, micro) {
    let results = [
        { id: "sasu-container-recap", remuneration: sasuTotal },
        { id: "eurl-container-recap", remuneration: eurlTotal },
        { id: "ei-container-recap", remuneration: eiBestResult },
        { id: "micro-container-recap", remuneration: micro }
    ];
    
    results.sort(function(a, b) {
        return b.remuneration - a.remuneration;
    });

    let isMobile = window.matchMedia("(max-width: 768px)").matches;

    for (let i = 0; i < results.length; i++) {
        let result = document.getElementById(results[i].id);
        if (isMobile) {
            result.style.gridRow = i + 1;
        } else {
            result.style.gridColumn = i + 1;
        }

        if (i > 0 && results[i].remuneration === results[i - 1].remuneration) {
            if (isMobile) {
                result.style.gridRow = i + 1;
            } else {
                result.style.gridColumn = i + 1;
            }
        }
    }
}

function compareResultsAndAddStyle(sasuTotal, eurlTotal, eiBestResult, micro) {
    const eurlContainerRecap = document.getElementById('eurl-container-recap');
    const sasuContainerRecap = document.getElementById('sasu-container-recap');
    const eiContainerRecap = document.getElementById('ei-container-recap');
    const microContainerRecap = document.getElementById('micro-container-recap');

    const eurlHeadingRecap = document.getElementById('eurl-heading-recap');
    const sasuHeadingRecap = document.getElementById('sasu-heading-recap');
    const eiHeadingRecap = document.getElementById('ei-heading-recap');
    const microHeadingRecap = document.getElementById('micro-heading-recap');

    compareResults(sasuTotal, eurlTotal, eiBestResult, micro, eurlContainerRecap, sasuContainerRecap, eiContainerRecap, microContainerRecap, eurlHeadingRecap, sasuHeadingRecap, eiHeadingRecap, microHeadingRecap);
}

function compareResults(sasuTotal, eurlTotal, eiBestResult, micro, eurlContainerRecap, sasuContainerRecap, eiContainerRecap, microContainerRecap, eurlHeadingRecap, sasuHeadingRecap, eiHeadingRecap, microHeadingRecap) {
    let resultRecapTitle = document.getElementById('simulator-result-title');
    if (eurlTotal > eiBestResult && eurlTotal > sasuTotal && eurlTotal > micro) {
        addStyleToResults(eurlContainerRecap, eurlHeadingRecap, resultRecapTitle, 'eurl');
    } else if (sasuTotal > eurlTotal && sasuTotal > eiBestResult && sasuTotal > micro) {
        addStyleToResults(sasuContainerRecap, sasuHeadingRecap, resultRecapTitle, 'sasu');
    } else if (micro > eurlTotal && micro > eiBestResult && micro > sasuTotal) {
        addStyleToResults(microContainerRecap, microHeadingRecap, resultRecapTitle, 'micro');
    } else if (eiBestResult > eurlTotal && eiBestResult > sasuTotal && eiBestResult > micro) {
        addStyleToResults(eiContainerRecap, eiHeadingRecap, resultRecapTitle, 'ei');
    }
}

function addStyleToResults(containerRecap, headingRecap, resultRecapTitle, socialForm) {
    containerRecap.classList.add('container-best-choice');
    headingRecap.classList.add('heading-best-choice');
    resultRecapTitle.textContent = document.getElementById(`${socialForm}-heading-recap`).textContent;
}

function compareIsAndIr(isHtmlTag, irHtmlTag, resultStorage, hasDividends, socialForm) {
    let isResult = parseInt((document.getElementById(isHtmlTag).textContent).replace(/\D/g, ''));
    let irResult = parseInt((document.getElementById(irHtmlTag).textContent).replace(/\D/g, ''));

    if (hasDividends) {
        const pfuDividends = parseInt(localStorage.getItem('eurlPfuDividends'));
        const progressiveDividends = parseInt(localStorage.getItem('eurlProgressiveDividends'));
        const pfuIsResult = pfuDividends + isResult;
        const progressiveIsResult = progressiveDividends + isResult;

        if (pfuIsResult > irResult || progressiveIsResult > irResult) {
            compareIsAndIrFillWageRecap(resultStorage, isResult, socialForm);
        } else {
            compareIsAndIrFillWageRecap(resultStorage, irResult, socialForm);
        }
    } else {
        if (isResult > irResult) {
            compareIsAndIrFillWageRecap(resultStorage, isResult, socialForm);
        } else {
            compareIsAndIrFillWageRecap(resultStorage, irResult, socialForm);
        }
    }
}

function compareIsAndIrFillWageRecap(resultStorage, taxResult, socialForm) {
    localStorage.setItem(resultStorage, taxResult);
    document.getElementById(`simulator-${socialForm}-recap-title`).textContent = "à l'IS";
    document.getElementById(`${socialForm}-wage-recap`).textContent = taxResult.toLocaleString('fr-FR') + '€';
}

function fillWageRecap(turnover) {
    compareIsAndIr('is-eurlis-after-tax', 'is-eurlir-after-tax', 'eurlBestResult', true, 'eurl');
    compareIsAndIr('is-eiis-after-tax', 'is-eiir-after-tax', 'eiBestResult', false, 'ei');

    sasuAfterTax.forEach(element => {
        const sasuAmount = (element.textContent).replace(/\D/g, '');
        document.getElementById('sasu-wage-recap').textContent = sasuAmount.toLocaleString('fr-FR') + '€';
        localStorage.setItem('sasu', sasuAmount);
    });

    document.querySelectorAll('.is_micro_after_tax').forEach(element => {
        if (turnover > 50000) {
            localStorage.setItem('micro', 0);
        } else {
            const microAmount = (element.textContent).replace(/\D/g, '');
            localStorage.setItem('micro', microAmount);
            document.getElementById('micro-wage-recap').textContent = microAmount.toLocaleString('fr-FR') + '€';
        }
    });

    document.querySelectorAll('.is_ca_recap').forEach(element => {
        element.textContent = turnover.toLocaleString('fr-FR') + '€';
    });
}

function fillSasuDividendsRecap() {
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
}

function fillContributionsRecap() {
    const sasuContributions = document.getElementById('sasu-contributions-total').textContent;
    document.getElementById('sasu-contributions-recap').textContent = sasuContributions;

    const eurlContributions = document.getElementById('eurl-contributions-total').textContent;
    document.getElementById('eurl-contributions-recap').textContent = eurlContributions;

    const eiContributions = document.getElementById('ei-contributions-total').textContent;
    document.getElementById('ei-contributions-recap').textContent = eiContributions;

    const microContributions = document.getElementById('micro-contributions-total').textContent;
    document.getElementById('micro-contributions-recap').textContent = microContributions;
}

function fillTextForMicro(turnover) {
    const microTextRecap = document.getElementById('micro-text-recap');
    if (turnover > 50000) {
        microTextRecap.textContent = "Le plafond à ne pas dépasser est de 77 700€. Si vous dépassez ce plafond, sachez que vous pouvez conserver ce statut pendant deux années supplémentaires à la suite desquelles vous basculerez automatiquement en EI si votre chiffre d'affaires est toujours supérieur au plafond. Notre simulateur propose la micro-entreprise pour tout chiffre d'affaires ne dépassant pas 50 000€ pour anticiper la limite et offrir une marge de sécurité."
    }
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

function sasuCalculAll(turnoverMinusCost, situation, numberOfChild, householdIncome, percentage, arraySasu) {
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

    situationProgressiveDividends(maxDividends, situation, numberOfChild, householdIncome, 'non', 'SAS');
    const dividendsNetsProgressive = engine.evaluate("bénéficiaire . dividendes . nets d'impôt");
    const dividendsNetsProgressiveAmount = (Math.round(dividendsNetsProgressive.nodeValue));

    sasuSituationPfuDividends(maxDividends);
    const dividendsNetsPfu = engine.evaluate("bénéficiaire . dividendes . nets d'impôt");
    const dividendsNetsPfuAmount = (Math.round(dividendsNetsPfu.nodeValue));

    sasuPushInArray(afterTax, dividendsNetsProgressiveAmount, dividendsNetsPfuAmount, maxDividends, percentage, arraySasu);
}

function sasuResult(turnoverMinusCost, situation, numberOfChild, householdIncome) {
    let arraySasu = [];

    findSasuBestRemunerationAndDividends(turnoverMinusCost, situation, numberOfChild, householdIncome, arraySasu);

    let bestWage = parseInt(localStorage.getItem('bestWage'));
    let maxDividends = parseInt(localStorage.getItem('maxDividends'));

    if(document.getElementById('single-parent').value === 'oui') {
        sasuSituation(bestWage, situation, numberOfChild, householdIncome, 'oui');
        sasuRemuneration();
    }

    sasuSituation(bestWage, situation, numberOfChild, householdIncome, 'non');
    sasuRemuneration();
    sasuContributions();
    sasuRetirement();

    sasuCalculDividendsNets(maxDividends, situation, numberOfChild, householdIncome);
    const sasuGrossDividends = document.getElementById('sasu-gross-dividends');
    sasuGrossDividends.textContent = maxDividends.toLocaleString('fr-FR') + '€';
}

function findSasuBestRemunerationAndDividends(turnoverMinusCost, situation, numberOfChild, householdIncome, arraySasu) {
    for (let percentage = 0; percentage <= 100; percentage += 10) {
        sasuCalculAll(turnoverMinusCost, situation, numberOfChild, householdIncome, percentage, arraySasu);
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
    document.querySelectorAll('.is_sasu_remuneration').forEach(element => {
        element.style.display = 'block';
    });

    const net = engine.evaluate("salarié . rémunération . net . à payer avant impôt");
    let netAmount = Math.round(net.nodeValue * 12);
    if (isNaN(netAmount)) {
        netAmount = 0;
    }
    sasuBeforeTax.forEach(element => {
        element.textContent = `${netAmount}€`;
    });

    const afterTax = engine.evaluate("salarié . rémunération . net . payé après impôt");
    let afterTaxAmount = Math.round(afterTax.nodeValue * 12);
    if (isNaN(afterTaxAmount)) {
        afterTaxAmount = 0;
    }
    sasuAfterTax.forEach(element => {
        element.textContent = `${afterTaxAmount}€`;
    });

    if (netAmount === 0 && afterTaxAmount === 0) {
        document.querySelectorAll('.is_sasu_remuneration').forEach(element => {
            element.style.display = 'none';
        });
    }
}

function sasuContributions() {
    yearFillText("dirigeant . assimilé salarié . cotisations", '#sasu-contributions-total');

    /* EMPLOYER */
    yearFillText("salarié . cotisations . maladie . employeur", '#sasu-disease');
    yearFillText("salarié . cotisations . CSA", '#sasu-solidarity-autonomy');
    yearFillText("salarié . cotisations . ATMP", '#sasu-work-accident');
    yearFillText("salarié . cotisations . vieillesse . employeur", '#sasu-employer-old-age');
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

    document.getElementById('sasu-retirement-points').textContent = pointsAcquired;
}


export { retirementText, fillText, fillSameClassTexts, yearFillText };