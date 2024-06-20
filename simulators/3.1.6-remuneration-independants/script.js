import Engine,{ formatValue } from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/3.1.6-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/3.1.6-remuneration-independants/node_modules/modele-social/dist/index.js';

import { calculEurl } from './eurl.js';
import { microConditions, microResult, fillTextForMicro } from './micro.js';
import { eiResult } from './ei.js';
import { sasuResult, fillSasuDividendsRecap } from './sasu.js';

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


export { retirementText, fillText, fillSameClassTexts, yearFillText };