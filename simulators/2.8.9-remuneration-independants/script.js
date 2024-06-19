import Engine,{ formatValue } from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/2.8.9-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/2.8.9-remuneration-independants/node_modules/modele-social/dist/index.js';

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
        microResult(turnoverMinusCost, situation, numberOfChild, householdIncome);

        fillRecapContainer(turnover);

        simulatorResults.classList.remove('hidden');
        simulatorResults.scrollIntoView({
            behavior: "smooth"
        });

        hideLoader();
    }, 100);
});


function microConditions(turnover) {
    const microRecap = document.querySelectorAll('.is_micro_recap');
    const microContributions = document.querySelector('.is_micro_contributions');

    document.querySelectorAll('.simulator_micro_hidden').forEach(element => {
        element.style.display = 'none';
    });
    microContributions.style.display = 'none';

    microRecap.forEach(element => {
        element.style.display = 'none';
    });

    if (turnover <= 50000) {
        document.querySelectorAll('.simulator_micro_hidden').forEach(element => {
            element.style.display = 'block';
        });

        microContributions.style.display = 'flex';
        microRecap.forEach(element => {
            element.style.display = 'block';
        });
    }   
}

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


/* COMMON EURL - EI */
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


/* EURL */
/*function eurlSituation(wage, situation, numberOfChild, householdIncome, tax, singleParent) {
    engine.setSituation({
        "dirigeant . rémunération . totale": wage,
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

function eurlSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, tax) {
    engine.setSituation({
        "entreprise . chiffre d'affaires": turnoverMinusCost,
        "impôt . foyer fiscal . situation de famille": `'${situation}'`,
        "impôt . foyer fiscal . enfants à charge": parseInt(numberOfChild),
        // "impôt . foyer fiscal . revenu imposable . autres revenus imposables": parseFloat(householdIncome),
        "impôt . foyer fiscal . parent isolé": `${singleParent}`,
        "entreprise . imposition": `'${tax}'`,
        "entreprise . activité . nature": "'libérale'",
        "situation personnelle . domiciliation fiscale à l'étranger": "non",
        "entreprise . catégorie juridique": "'EI'",
        "entreprise . catégorie juridique . EI . auto-entrepreneur": "non"
    });
}

function comparerRemunerations(maxWage, turnoverMinusCost, singleParent, numberOfChild, householdIncome, situation) {
    let meilleurResultat = {
        pourcentage: 0,
        cotisations: 0,
        remuneration: 0,
        remunerationAfterTax: 0,
        bestDividends: 0,
        grossDividends: 0,
        pfuDividends: 0,
        baremeDividends: 0,
        total: 0
    };

    for (let pourcentage = 5; pourcentage <= 100; pourcentage += 5) {
        let remuneration = maxWage * (pourcentage / 100);
        eurlContributionsSituation(remuneration);
        /*let remunerationAfterTaxText = document.querySelectorAll('.is_eurlis_after_tax');
        remunerationAfterTaxText.forEach(element => {
            element.textContent = remuneration.toLocaleString('fr-FR') + '€'; 
        });*/
        let remunerationAfterTaxUrssaf = engine.evaluate("dirigeant . rémunération . net . après impôt");
        let remunerationAfterTaxAmount = Math.round(remunerationAfterTaxUrssaf.nodeValue);
        /*let remunerationBeforeTaxText = document.querySelectorAll('.is_eurlis_before_tax');
        remunerationBeforeTaxText.forEach(element => {
            element.textContent = remunerationBeforeTaxAmount.toLocaleString('fr-FR') + '€';
        });*/

        let cotisationsUrssaf = engine.evaluate("dirigeant . indépendant . cotisations et contributions");
        let cotisationsAmount = Math.round(cotisationsUrssaf.nodeValue);

        let totalForIs = turnoverMinusCost - remuneration - cotisationsAmount;
        let eurlDividendsBrut;
        if (totalForIs <= 42500) {
            eurlDividendsBrut = Math.round(totalForIs - (totalForIs * 0.15));
        } else {
            eurlDividendsBrut = Math.round(totalForIs - ((42500 * 0.15) + ((totalForIs - 42500) * 0.25 )));
        }

        let shareCapital = document.getElementById('share-capital').value;
        let eurlDividendsPfu;
        if (eurlDividendsBrut < (shareCapital * 0.1)) {
            eurlDividendsPfu = eurlDividendsBrut - (eurlDividendsBrut * 0.3);
        } else {
            let cotisationsOnDividendsUrssaf = engine.setSituation({
                "dirigeant . rémunération . totale": eurlDividendsBrut,
                "entreprise . imposition": "'IS'",
                "entreprise . associés": "'unique'",
                "entreprise . catégorie juridique": "'SARL'"
            }).evaluate("dirigeant . indépendant . cotisations et contributions");
            let cotisationsOnDividendsAmount = Math.round(cotisationsOnDividendsUrssaf.nodeValue);
            cotisationsAmount = cotisationsAmount + cotisationsOnDividendsAmount;
            let tenPercentShareCapital = shareCapital * 0.1;
            eurlDividendsPfu = (tenPercentShareCapital * 0.3) + ((eurlDividendsBrut - tenPercentShareCapital) * 0.128);
        }

        /*let eurlContributionsTotalText = document.getElementById('eurl-contributions-total');
        eurlContributionsTotalText.textContent = cotisationsAmount.toLocaleString('fr-FR') + '€';
        let eurlGrossDividendsText = document.getElementById('eurl-gross-dividends');
        eurlGrossDividendsText.textContent = eurlDividendsBrut.toLocaleString('fr-FR') + '€';
        let eurlPfuDividendsText = document.getElementById('eurl-pfu-dividends');
        eurlPfuDividendsText.textContent = eurlDividendsPfu.toLocaleString('fr-FR') + '€';*/

        let eurlDividendsBaremeUrssaf = engine.setSituation({
            "impôt . foyer fiscal . parent isolé": singleParent,
            "impôt . foyer fiscal . enfants à charge": parseInt(numberOfChild),
            "impôt . foyer fiscal . revenu imposable . autres revenus imposables": householdIncome,
            "dirigeant . rémunération . net . imposable": "0 €/an",
            "impôt . foyer fiscal . situation de famille": `'${situation}'`,
            "impôt . méthode de calcul": "'barème standard'",
            "bénéficiaire . dividendes . bruts": eurlDividendsBrut,
            "bénéficiaire": "oui",
            "entreprise . catégorie juridique": "'SAS'"
        }).evaluate("bénéficiaire . dividendes . nets d'impôt");
        let eurlDividendsBaremeAmount = Math.round(eurlDividendsBaremeUrssaf.nodeValue);
        let eurlProgressiveDividendsText = document.getElementById('eurl-progressive-dividends');
        eurlProgressiveDividendsText.textContent = eurlDividendsBaremeAmount.toLocaleString('fr-FR') + '€';

        let bestDividends
        if (eurlDividendsPfu > eurlDividendsBaremeAmount) {
            bestDividends = eurlDividendsPfu;
        } else {
            bestDividends = eurlDividendsBaremeAmount;
        }

        let total = remuneration + bestDividends;

        console.log(`Pourcentage: ${pourcentage}% - Rémunération: ${remuneration.toFixed(2)}, Dividendes: ${bestDividends.toFixed(2)}, Total: ${total.toFixed(2)}`);

        if (total > meilleurResultat.total) {
            meilleurResultat = {
                pourcentage: pourcentage,
                cotisations: cotisationsAmount,
                remuneration: remuneration,
                remunerationAfterTax: remunerationAfterTaxAmount,
                bestDividends: bestDividends,
                grossDividends: eurlDividendsBrut,
                pfuDividends: eurlDividendsPfu,
                baremeDividends: eurlDividendsBaremeAmount,
                total: total
            };
        }
    }

    console.log('Meilleur résultat:', meilleurResultat);
    localStorage.setItem('eurlArray', JSON.stringify(meilleurResultat));
    return meilleurResultat;
}

function calculEurl(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    // remuneration max
    let maxWage;
    if(document.getElementById('single-parent').value === 'oui') {
        eurlSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, 'IS');
        const maxWageUrssaf = engine.evaluate("dirigeant . rémunération . net");
        maxWage = Math.round(maxWageUrssaf.nodeValue);
    } else {
        eurlSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, 'IS');
        const maxWageUrssaf = engine.evaluate("dirigeant . rémunération . net");
        maxWage = Math.round(maxWageUrssaf.nodeValue);
    }

    let resultat = comparerRemunerations(maxWage, turnoverMinusCost, singleParent, numberOfChild, householdIncome, situation);

    let eurlContributionsTotalText = document.getElementById('eurl-contributions-total');
    eurlContributionsTotalText.textContent = (resultat.cotisations).toLocaleString('fr-FR') + '€';
    let eurlGrossDividendsText = document.getElementById('eurl-gross-dividends');
    eurlGrossDividendsText.textContent = (resultat.grossDividends).toLocaleString('fr-FR') + '€';
    let eurlPfuDividendsText = document.getElementById('eurl-pfu-dividends');
    eurlPfuDividendsText.textContent = (resultat.pfuDividends).toLocaleString('fr-FR') + '€';

    let remunerationBeforeTaxText = document.querySelectorAll('.is_eurlis_before_tax');
    remunerationBeforeTaxText.forEach(element => {
        element.textContent = (resultat.remuneration).toLocaleString('fr-FR') + '€'; 
    });

    let remunerationAfterTaxText = document.querySelectorAll('.is_eurlis_after_tax');
    remunerationAfterTaxText.forEach(element => {
        element.textContent = (resultat.remunerationAfterTax).toLocaleString('fr-FR') + '€';
    });



    /*let eurlArray = [];
    let percentage = 0;
    const currentWage = turnoverMinusCost * (percentage / 100);
    let contributionsUrssaf = engine.setSituation({
        "dirigeant . rémunération . net": currentWage
    }).evaluate("dirigeant . indépendant . cotisations et contributions");
    let contributionsAmount = Math.round(contributionsUrssaf.nodeValue);
    eurlPushInArray(turnoverMinusCost, percentage, contributionsAmount, eurlArray, situation, numberOfChild, householdIncome);
    let wageAfter = parseInt(localStorage.getItem('wageAfter'));

    while (wageAfter < maxWage) {
        percentage += 5;
        let wage = turnoverMinusCost * (percentage / 100);
        wageAfter = wage + (turnoverMinusCost * (5 / 100));
        eurlPushInArray(turnoverMinusCost, percentage, contributionsAmount, eurlArray, situation, numberOfChild, householdIncome);
    }

    eurlCompareResults(eurlArray, situation, numberOfChild, householdIncome);
    localStorage.setItem('arrayEurl', eurlArray);*/
}

function eurlResult(turnoverMinusCost, situation, numberOfChild, householdIncome) {
    let afterIs;
    if (turnoverMinusCost <= 42500) {
        afterIs = turnoverMinusCost - (turnoverMinusCost * 0.15);
    } else {
        afterIs = turnoverMinusCost - ((42500 * 0.15) + ((turnoverMinusCost - 42500) * 0.25 ));
    }

    if(document.getElementById('single-parent').value === 'oui') {
        eurlCalculContributionsAndRetirement(afterIs, turnoverMinusCost, situation, numberOfChild, householdIncome, 'oui');
    } else {
        eurlCalculContributionsAndRetirement(afterIs, turnoverMinusCost, situation, numberOfChild, householdIncome, 'non');
    }

    let contributionsAmount = parseInt(localStorage.getItem('contributionsEurlAmount'));
    let beforeTaxAmount = parseInt(localStorage.getItem('beforeTaxEurlAmount'));

    let eurlArray = [];
    let percentage = 0;
    eurlPushInArray(turnoverMinusCost, percentage, contributionsAmount, eurlArray, situation, numberOfChild, householdIncome);
    let wageAfter = parseInt(localStorage.getItem('wageAfter'));
    
    while (wageAfter < beforeTaxAmount) {
        percentage += 5;
        let wage = turnoverMinusCost * (percentage / 100);
        wageAfter = wage + (turnoverMinusCost * (5 / 100));
        eurlPushInArray(turnoverMinusCost, percentage, contributionsAmount, eurlArray, situation, numberOfChild, householdIncome);
    }

    eurlCompareResults(eurlArray);
}

function eurlRetirement() {
    retirementText('eurl-gain-trimester', 'eurl-pension-scheme', 'eurl-retirement-points');
}

function eurlCalculContributionsAndRetirement(afterIs, turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    eiSituation(afterIs, situation, numberOfChild, householdIncome, singleParent, 'IS');
    let contributionsUrssaf = engine.evaluate("dirigeant . indépendant . cotisations et contributions");
    let contributionsAmount = Math.round(contributionsUrssaf.nodeValue);
    localStorage.setItem('contributionsEurlAmount', contributionsAmount);
    eiEurlContributions('eurl');
    eurlRetirement();

    eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, 'IS');
    let beforeTaxUrssaf = engine.evaluate("dirigeant . rémunération . net");
    let beforeTaxAmount = Math.round(beforeTaxUrssaf.nodeValue);
    localStorage.setItem('beforeTaxEurlAmount', beforeTaxAmount);
}

function eurlPushInArray(turnoverMinusCost, percentage, contributionsAmount, eurlArray, situation, numberOfChild, householdIncome) {
    let wage = turnoverMinusCost * (percentage / 100);
    let wageAfter = wage + (turnoverMinusCost * (5 / 100));
    localStorage.setItem('wageAfter', wageAfter);
    let totalForIs = turnoverMinusCost - contributionsAmount - wage;
    let maxDividends;
    if (totalForIs <= 42500) {
        maxDividends = Math.round(totalForIs - (totalForIs * 0.15));
    } else {
        maxDividends = Math.round(totalForIs - ((42500 * 0.15) + ((totalForIs - 42500) * 0.25 )));
    }

    eurlCalculBestDividends(maxDividends, situation, numberOfChild, householdIncome, wage);

    /*let eurlContributionsTotalAmount = parseInt(localStorage.getItem('contributionsEurlAmount'));
    const eurlContributionsTotalText = document.getElementById('eurl-contributions-total');
    const shareCapital = document.getElementById('share-capital');

    if (shareCapital >= (maxDividends * 0.1)) {
        let contributionsOnEurlDividends = (maxDividends * 0.9);
        eiSituation(contributionsOnEurlDividends, situation, numberOfChild, householdIncome, singleParent, 'IS');
        let calculContributionsUrssaf = engine.evaluate("dirigeant . indépendant . cotisations et contributions");
        let calculContributionsAmount = Math.round(calculContributionsUrssaf.nodeValue);
        eurlContributionsTotalAmount = eurlContributionsTotalAmount + calculContributionsAmount;
        eurlContributionsTotalText.textContent = eurlContributionsTotalAmount + '€';
    }*/

    const dividendsNetPfuAmount = parseInt(localStorage.getItem('dividendsNetPfuAmount'));
    const dividendsProgressiveAmount = parseInt(localStorage.getItem('dividendsProgressiveAmount'));
    const bestWagePlusDividends = parseInt(localStorage.getItem('bestWagePlusDividends'));

    eurlAddObjectInArray(percentage, wage, maxDividends, dividendsNetPfuAmount, dividendsProgressiveAmount, bestWagePlusDividends, eurlArray);
}

function eurlCalculBestDividends(maxDividends, situation, numberOfChild, householdIncome, wage) {
    let dividendsNetPfuAmount;
    
    const shareCapital = document.getElementById('share-capital');

    if (shareCapital < (maxDividends * 0.1)) {
        dividendsNetPfuAmount = Math.round(maxDividends - (maxDividends * 0.3));
    } else {
        dividendsNetPfuAmount = Math.round(maxDividends - (((maxDividends * 0.1) * 0.3) + (((maxDividends * 0.9) * 0.128))));
    }

    if(document.getElementById('single-parent').value === 'oui') {
        situationProgressiveDividends(maxDividends, situation, numberOfChild, householdIncome, 'oui', 'SARL');
    } else {
        situationProgressiveDividends(maxDividends, situation, numberOfChild, householdIncome, 'non', 'SARL');
    }

    const dividendsProgressiveUrssaf = engine.evaluate("bénéficiaire . dividendes . nets d'impôt");
    const dividendsProgressiveAmount = Math.round(dividendsProgressiveUrssaf.nodeValue);

    let dividendsProgressivePlusWage = Math.round(dividendsProgressiveAmount + wage);
    let dividendsPfuPlusWage = Math.round(dividendsNetPfuAmount + wage);
    let bestWagePlusDividends;

    if (dividendsProgressivePlusWage > dividendsPfuPlusWage) {
        bestWagePlusDividends = dividendsProgressivePlusWage;
    } else {
        bestWagePlusDividends = dividendsPfuPlusWage;
    }

    localStorage.setItem('dividendsNetPfuAmount', dividendsNetPfuAmount);
    localStorage.setItem('dividendsProgressiveAmount', dividendsProgressiveAmount);
    localStorage.setItem('bestWagePlusDividends', bestWagePlusDividends);
}

function eurlAddObjectInArray(percentage, wage, maxDividends, dividendsNetPfuAmount, dividendsProgressiveAmount, bestWagePlusDividends, eurlArray) {
    let myObject = {
        percentage: percentage,
        wage: wage,
        maxDividends: maxDividends,
        dividendsNetPfuAmount: dividendsNetPfuAmount,
        dividendsProgressiveAmount: dividendsProgressiveAmount,
        bestWagePlusDividends: bestWagePlusDividends
    }
    eurlArray.push(myObject);
}

/*function eurlCompareResults(eurlArray) {
    let remunerationPlusDividendsBestAmount = eurlArray[0].bestWagePlusDividends;
    let maxRemunerationObject = 0;
    let dividends = eurlArray[0].maxDividends;
    let wageEurl = eurlArray[0].wage;
    let bestDividendsPfu = eurlArray[0].dividendsNetPfuAmount;
    let bestDividendsProgressive = eurlArray[0].dividendsProgressiveAmount;

    for (let i = 1; i < eurlArray.length; i++) {
        const currentRemunerationPlusDividends = eurlArray[i].bestWagePlusDividends;

        if (currentRemunerationPlusDividends > remunerationPlusDividendsBestAmount) {
            remunerationPlusDividendsBestAmount = currentRemunerationPlusDividends;
            maxRemunerationObject = i;
            dividends = eurlArray[i].maxDividends;
            wageEurl = eurlArray[i].wage;
            bestDividendsPfu = eurlArray[i].dividendsNetPfuAmount;
            bestDividendsProgressive = eurlArray[i].dividendsProgressiveAmount;

            eurlFillDividendsText(dividends, bestDividendsPfu, bestDividendsProgressive, wageEurl);

            const afterTaxEurl = engine.setSituation({
                "entreprise . imposition": "'IS'",
                "entreprise . associés": "'unique'",
                "entreprise . catégorie juridique": "'SARL'",
                "dirigeant . rémunération . net": wageEurl
            }).evaluate("dirigeant . rémunération . net . après impôt");

            document.querySelectorAll('.is_eurlis_after_tax').forEach(element => {
                element.textContent = (Math.round(afterTaxEurl.nodeValue)).toLocaleString('fr-FR') + '€';
            });
        }
    }
}*/

function eurlContributionsSituation(wageEurl) {
    engine.setSituation({
        "entreprise . imposition": "'IS'",
        "entreprise . associés": "'unique'",
        "entreprise . catégorie juridique": "'SARL'",
        "dirigeant . rémunération . net": wageEurl
    });
}

function eurlCompareResults(eurlArray, situation, numberOfChild, householdIncome) {
    let remunerationPlusDividendsBestAmount = eurlArray[0].bestWagePlusDividends;
    let maxRemunerationObject = 0;
    let dividends = eurlArray[0].maxDividends;
    let wageEurl = eurlArray[0].wage;
    let bestDividendsPfu = eurlArray[0].dividendsNetPfuAmount;
    let bestDividendsProgressive = eurlArray[0].dividendsProgressiveAmount;

    for (let i = 1; i < eurlArray.length; i++) {
        const currentRemunerationPlusDividends = eurlArray[i].bestWagePlusDividends;

        if (currentRemunerationPlusDividends > remunerationPlusDividendsBestAmount) {
            remunerationPlusDividendsBestAmount = currentRemunerationPlusDividends;
            maxRemunerationObject = i;
            dividends = eurlArray[i].maxDividends;
            wageEurl = eurlArray[i].wage;
            bestDividendsPfu = eurlArray[i].dividendsNetPfuAmount;
            bestDividendsProgressive = eurlArray[i].dividendsProgressiveAmount;

            eurlFillDividendsText(dividends, bestDividendsPfu, bestDividendsProgressive, wageEurl);

            eurlContributionsSituation(wageEurl);

            fillText("dirigeant . indépendant . cotisations et contributions . cotisations", `#eurl-contributions`);
            fillText("dirigeant . indépendant . cotisations et contributions . maladie", `#eurl-disease`);
            fillText("dirigeant . indépendant . cotisations et contributions . retraite de base", `#eurl-base-retirement`);
            fillText("dirigeant . indépendant . cotisations et contributions . retraite complémentaire", `#eurl-additional-retirement`);
            fillText("dirigeant . indépendant . cotisations et contributions . indemnités journalières maladie", `#eurl-disease-allowance`);
            fillText("dirigeant . indépendant . cotisations et contributions . invalidité et décès", `#eurl-disability`);
            fillText("dirigeant . indépendant . cotisations et contributions . CSG-CRDS", `#eurl-csg`);
            fillText("dirigeant . indépendant . cotisations et contributions . formation professionnelle", `#eurl-formation`);
            
            document.querySelectorAll('.is_eurlis_before_tax').forEach(element => {
                element.textContent = (Math.round(wageEurl)).toLocaleString('fr-FR') + '€';
            });
            
            const afterTaxEurl = engine.evaluate("dirigeant . rémunération . net . après impôt");
            document.querySelectorAll('.is_eurlis_after_tax').forEach(element => {
                element.textContent = (Math.round(afterTaxEurl.nodeValue)).toLocaleString('fr-FR') + '€';
            });

            const shareCapital = document.getElementById('share-capital');
            let eurlContributionsOnDividends;
            let eurlContributionsOnWage;
            if (shareCapital >= (dividends * 0.1)) {
                let eurlDividendsForContributions = dividends * 0.9;
                if(document.getElementById('single-parent').value === 'oui') {
                    eurlSituation(wageEurl, situation, numberOfChild, householdIncome, 'oui', 'IS');
                    const eurlContributionsOnWageUrssaf = engine.evaluate("dirigeant . indépendant . cotisations et contributions");
                    eurlContributionsOnWage = Math.round(eurlContributionsOnWageUrssaf.nodeValue);
                    eurlSituation(eurlDividendsForContributions, situation, numberOfChild, householdIncome, 'oui', 'IS');
                    const eurlContributionsOnDividendsUrssaf = engine.evaluate("dirigeant . indépendant . cotisations et contributions");
                    eurlContributionsOnDividends = Math.round(eurlContributionsOnDividendsUrssaf.nodeValue);
                } else {
                    eurlSituation(wageEurl, situation, numberOfChild, householdIncome, 'non', 'IS');
                    const eurlContributionsOnWageUrssaf = engine.evaluate("dirigeant . indépendant . cotisations et contributions");
                    eurlContributionsOnWage = Math.round(eurlContributionsOnWageUrssaf.nodeValue);
                    eurlSituation(eurlDividendsForContributions, situation, numberOfChild, householdIncome, 'non', 'IS');
                    const eurlContributionsOnDividendsUrssaf = engine.evaluate("dirigeant . indépendant . cotisations et contributions");
                    eurlContributionsOnDividends = Math.round(eurlContributionsOnDividendsUrssaf.nodeValue);
                }
            }

            let eurlContributionsTotal = eurlContributionsOnWage + eurlContributionsOnDividends;
            const eurlContributionsTotalText = document.getElementById('eurl-contributions-total');
            eurlContributionsTotalText.textContent = eurlContributionsTotal.toLocaleString('fr-FR') + '€';
        }
    }
}

function eurlFillDividendsText(dividends, bestDividendsPfu, bestDividendsProgressive, wageEurl) {
    document.getElementById('eurl-gross-dividends').textContent = dividends.toLocaleString('fr-FR') + '€';
    document.getElementById('eurl-pfu-dividends').textContent = bestDividendsPfu.toLocaleString('fr-FR') + '€';
    localStorage.setItem('eurlPfuDividends', bestDividendsPfu);
    document.getElementById('eurl-progressive-dividends').textContent = bestDividendsProgressive.toLocaleString('fr-FR') + '€';
    localStorage.setItem('eurlProgressiveDividends', bestDividendsProgressive);

    document.querySelectorAll('.is_eurlis_before_tax').forEach(element => {
        element.textContent = wageEurl.toLocaleString('fr-FR') + '€';
    });

    const eurlDividendsRecap = document.getElementById('eurl-dividends-recap');

    if (bestDividendsProgressive > bestDividendsPfu) {
        eurlDividendsRecap.textContent = bestDividendsProgressive.toLocaleString('fr-FR') + '€';
        localStorage.setItem('eurlDividends', bestDividendsProgressive);
    } else {
        eurlDividendsRecap.textContent = bestDividendsPfu.toLocaleString('fr-FR') + '€';
        localStorage.setItem('eurlDividends', bestDividendsPfu);
    }
}


/* EI */
function eiResult(turnoverMinusCost, situation, numberOfChild, householdIncome) {
    eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non', 'IS');

    eiEurlRemuneration('.is_ei_before_tax', '.is_eiis_after_tax');
    // eiEurlRemuneration('.is_eurlis_after_tax');
    eiEurlContributions('ei');
    eiRetirement();

    eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non', 'IR');
    eiEurlRemuneration('.is_ei_before_tax', '.is_eiir_after_tax');
    eiEurlRemuneration('.is_eurlir_before_tax', '.is_eurlir_after_tax');

    if(document.getElementById('single-parent').value === 'oui') {
        eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'oui', 'IS');
        eiEurlRemuneration('.is_ei_before_tax', '.is_eiis_after_tax');
        // eiEurlRemuneration('.is_eurlis_after_tax');

        eiSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'oui', 'IR');
        eiEurlRemuneration('.is_ei_before_tax', '.is_eiir_after_tax');
        eiEurlRemuneration('.is_eurlir_before_tax', '.is_eurlir_after_tax');
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
    fillSameClassTexts("dirigeant . auto-entrepreneur . revenu net", '.is_micro_before_tax');
    fillSameClassTexts("dirigeant . auto-entrepreneur . revenu net . après impôt", '.is_micro_after_tax');
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