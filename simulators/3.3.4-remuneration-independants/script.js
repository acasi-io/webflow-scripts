import Engine,{ formatValue } from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/3.3.4-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/3.3.4-remuneration-independants/node_modules/modele-social/dist/index.js';

import { calculEurl } from './eurl.js';
import { microConditions, microResult, fillTextForMicro, microCalculRetraite } from './micro.js';
import { eiResult, eiCalculRetraite } from './ei.js';
import { sasuResult, fillSasuDividendsRecap, sasuCalculRetraite } from './sasu.js';

const engine = new Engine(rules);

const calculBtn = document.getElementById('calcul-btn');
const numberOfChildSelect = document.getElementById('child');
let sasuAfterTax = document.querySelectorAll('.is_sasu_after_tax');
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

        calculEurl(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent);
        sasuResult(turnoverMinusCost, situation, numberOfChild, householdIncome);
        eiResult(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent);
        microResult(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent);

        fillRecapContainer(turnoverMinusCost, turnover);

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

function fillEurlRecap() {
    const eurlWageRecap = document.getElementById('eurl-wage-recap');
    const eurlDividendsRecap = document.getElementById('eurl-dividends-recap');
    const eurlCotisationsRecap = document.getElementById('eurl-contributions-recap');

    let eurlIrResult = parseInt((document.getElementById('is-eurlir-after-tax').textContent).replace(/\D/g, ''));
    let eurlIsTotal = parseInt(localStorage.getItem('eurlIsTotal'));

    if (eurlIsTotal > eurlIrResult) {
        let bestDividends = parseInt(localStorage.getItem('bestEurlDividends'));
        let eurlIsAfterTax = parseInt(localStorage.getItem('eurlAfterTax'));
        let cotisationsTotal = parseInt(localStorage.getItem('eurlCotisationsTotal'));

        eurlWageRecap.textContent = eurlIsAfterTax.toLocaleString('fr-FR') + '€';
        eurlDividendsRecap.textContent = bestDividends.toLocaleString('fr-FR') + '€';
        eurlCotisationsRecap.textContent = cotisationsTotal.toLocaleString('fr-FR') + '€';
        localStorage.setItem('eurlTotal', eurlIsTotal);
    } else {
        eurlDividendsRecap.textContent = '0€';
        eurlWageRecap.textContent = eurlIrResult.toLocaleString('fr-FR') + '€';
        localStorage.setItem('eurlTotal', eurlIrResult);
    }
}

function fillMicroRecap(turnover) {
    document.querySelectorAll('.is_micro_after_tax').forEach(element => {
        if (turnover > 50000) {
            localStorage.setItem('micro', 0);
        } else {
            const microAmount = (element.textContent).replace(/\D/g, '');
            localStorage.setItem('micro', microAmount);
            document.getElementById('micro-wage-recap').textContent = microAmount.toLocaleString('fr-FR') + '€';
            localStorage.setItem('microTotal', microAmount);
        }
    });

    const microContributions = document.getElementById('micro-contributions-total').textContent;
    document.getElementById('micro-contributions-recap').textContent = microContributions;
}

function fillEiRecap() {
    let cotisationsTotal = parseInt((document.getElementById('ei-contributions-total').textContent).replace(/\D/g, ''));
    let eiIsResult = parseInt((document.getElementById('is-eiis-after-tax').textContent).replace(/\D/g, ''));
    let eiIrResult = parseInt((document.getElementById('is-eiir-after-tax').textContent).replace(/\D/g, ''));
    let bestResult;
    if (eiIsResult > eiIrResult) {
        bestResult = eiIsResult;
    } else {
        bestResult = eiIrResult;
    }

    document.getElementById('ei-contributions-recap').textContent = cotisationsTotal.toLocaleString('fr-FR') + '€';
    document.getElementById('ei-wage-recap').textContent = bestResult.toLocaleString('fr-FR') + '€';

    localStorage.setItem('eiTotal', bestResult);
}

function fillSasuRecap() {
    let sasuAfterTax = parseInt((document.getElementById('is_sasu_after_tax').textContent).replace(/\D/g, ''));
    let sasuPfuDividends = parseInt((document.getElementById('sasu-pfu-dividends').textContent).replace(/\D/g, '')); 
    let sasuBaremeDividends = parseInt((document.getElementById('sasu-progressive-dividends').textContent).replace(/\D/g, ''));
    const sasuContributions = document.getElementById('sasu-contributions-total').textContent;
    
    let bestSasuDividends;
    if (sasuPfuDividends > sasuBaremeDividends) {
        bestSasuDividends = sasuPfuDividends;
    } else {
        bestSasuDividends = sasuBaremeDividends; 
    }

    document.getElementById('sasu-wage-recap').textContent = sasuAfterTax.toLocaleString('fr-FR') + '€';
    document.getElementById('sasu-dividends-recap').textContent = bestSasuDividends.toLocaleString('fr-FR') + '€';
    document.getElementById('sasu-contributions-recap').textContent = sasuContributions;

    let sasuTotal = sasuAfterTax + bestSasuDividends;
    localStorage.setItem('sasuTotal', sasuTotal);
}

function fillRecapContainer(turnoverMinusCost, turnover) {
    fillEurlRecap();
    fillMicroRecap(turnover);
    fillEiRecap();
    fillSasuRecap();
    fillRetireRecap(turnoverMinusCost, turnover);

    document.querySelectorAll('.is_ca_recap').forEach(element => {
        element.textContent = turnover.toLocaleString('fr-FR') + '€';
    });

    document.querySelectorAll('.simulator_heading_recap').forEach(element => {
        element.classList.remove('heading-best-choice');
    });

    document.querySelectorAll('.simulator_recap_item').forEach(element => {
        element.classList.remove('container-best-choice');
    });

    let eurlTotal = parseInt(localStorage.getItem('eurlTotal'));
    let eiTotal = parseInt(localStorage.getItem('eiTotal'));
    let sasuTotal = parseInt(localStorage.getItem('sasuTotal'));
    let microTotal = parseInt(localStorage.getItem('microTotal'));

    orderResults(sasuTotal, eurlTotal, eiTotal, microTotal);
    compareResultsAndAddStyle(sasuTotal, eurlTotal, eiTotal, microTotal);
}

function orderResults(sasuTotal, eurlTotal, eiTotal, microTotal) {
    let results = [
        { id: "sasu-container-recap", remuneration: sasuTotal },
        { id: "eurl-container-recap", remuneration: eurlTotal },
        { id: "ei-container-recap", remuneration: eiTotal },
        { id: "micro-container-recap", remuneration: microTotal }
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

function compareResultsAndAddStyle(sasuTotal, eurlTotal, eiTotal, microTotal) {
    const eurlContainerRecap = document.getElementById('eurl-container-recap');
    const sasuContainerRecap = document.getElementById('sasu-container-recap');
    const eiContainerRecap = document.getElementById('ei-container-recap');
    const microContainerRecap = document.getElementById('micro-container-recap');

    const eurlHeadingRecap = document.getElementById('eurl-heading-recap');
    const sasuHeadingRecap = document.getElementById('sasu-heading-recap');
    const eiHeadingRecap = document.getElementById('ei-heading-recap');
    const microHeadingRecap = document.getElementById('micro-heading-recap');

    compareResults(sasuTotal, eurlTotal, eiTotal, microTotal, eurlContainerRecap, sasuContainerRecap, eiContainerRecap, microContainerRecap, eurlHeadingRecap, sasuHeadingRecap, eiHeadingRecap, microHeadingRecap);
}

function compareResults(sasuTotal, eurlTotal, eiTotal, microTotal, eurlContainerRecap, sasuContainerRecap, eiContainerRecap, microContainerRecap, eurlHeadingRecap, sasuHeadingRecap, eiHeadingRecap, microHeadingRecap) {
    let resultRecapTitle = document.getElementById('simulator-result-title');
    if (eurlTotal > eiTotal && eurlTotal > sasuTotal && eurlTotal > microTotal) {
        addStyleToResults(eurlContainerRecap, eurlHeadingRecap, resultRecapTitle, 'eurl');
    } else if (sasuTotal > eurlTotal && sasuTotal > eiTotal && sasuTotal > microTotal) {
        addStyleToResults(sasuContainerRecap, sasuHeadingRecap, resultRecapTitle, 'sasu');
    } else if (microTotal > eurlTotal && microTotal > eiTotal && microTotal > sasuTotal) {
        addStyleToResults(microContainerRecap, microHeadingRecap, resultRecapTitle, 'micro');
    } else if (eiTotal > eurlTotal && eiTotal > sasuTotal && eiTotal > microTotal) {
        addStyleToResults(eiContainerRecap, eiHeadingRecap, resultRecapTitle, 'ei');
    }
}

function addStyleToResults(containerRecap, headingRecap, resultRecapTitle, socialForm) {
    containerRecap.classList.add('container-best-choice');
    headingRecap.classList.add('heading-best-choice');
    resultRecapTitle.textContent = document.getElementById(`${socialForm}-heading-recap`).textContent;
}

function fillRetireRecap(turnoverMinusCost, turnover) {
    let microRetirement = microCalculRetraite(turnover);
    document.getElementById('micro-retire-recap').textContent = microRetirement.toLocaleString('fr-FR') + '€';

    let eiRetirement = eiCalculRetraite(turnover);
    document.getElementById('ei-retire-recap').textContent = eiRetirement.toLocaleString('fr-FR') + '€';

    //let sasuRetirement = sasuCalculRetraite(turnoverMinusCost);
    //document.getElementById('sasu-retire-recap').textContent = sasuRetirement.toLocaleString('fr-FR') + '€';
}


export { retirementText, fillText, fillSameClassTexts, yearFillText };