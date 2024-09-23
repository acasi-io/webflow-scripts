import Engine,{ formatValue } from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/5.1.1-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/5.1.1-remuneration-independants/node_modules/modele-social/dist/index.js';

import { calculEurl, storageEurlTotal } from './eurl.js';
import { microConditions, microResult, fillTextForMicro, microCalculRetraite, storageMicroTotal } from './micro.js';
import { eiResult, eiCalculRetraite, storageEiTotal } from './ei.js';
import { sasuResult, fillSasuDividendsRecap, sasuCalculRetraite, findSasuBestRemunerationAndDividends } from './sasu.js';

const engine = new Engine(rules);

const calculBtn = document.getElementById('calcul-btn');
const numberOfChildSelect = document.getElementById('child');
const simulatorResults = document.getElementById('simulator-results');
let PASS = 46368;
export let halfPass = 0.5 * PASS;
export let fifthPass = 0.2 * PASS;

const isUnemployment = document.getElementById('unemployment_boolean');
const unemploymentDuration = document.getElementById('unemployment_duration');


window.addEventListener('load', () => {
    isUnemployment.addEventListener('change', () => {
        if (isUnemployment.value === "true") {
            unemploymentDuration.style.display = "block";
        } else {
            unemploymentDuration.style.display = "none";
        }
    });
});


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
        const householdIncome = parseFloat(document.getElementById('household-income').value);
        const singleParent = document.getElementById('single-parent').value;
        const numberOfChildValue = parseInt(document.getElementById('child').value);
        const situationValue = document.getElementById('personal-situation').value;

        microConditions(turnover);

        const turnoverMinusCost = turnover - cost;

        storageMicroTotal(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        storageEiTotal(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        storageEurlTotal(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, 'non');
        // findSasuBestRemunerationAndDividends();

        // calculEurl(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        sasuResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        // eiResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        // microResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);

        // fillRecapContainer(turnoverMinusCost, turnover);

        checkUnemployment(turnoverMinusCost, turnover, numberOfChildValue, situationValue, cost);

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

/*function fillEurlRecap() {
    const eurlWageRecap = document.getElementById('eurl-wage-recap');
    const eurlDividendsRecap = document.getElementById('eurl-dividends-recap');
    const eurlCotisationsRecap = document.getElementById('eurl-contributions-recap');

    let eurlIrResult = parseInt((document.getElementById('is-eurlir-after-tax').textContent).replace(/\D/g, ''));
    let eurlIsTotal = parseInt(localStorage.getItem('eurlTotal'));

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

    localStorage.setItem('bestSasuDividends', bestSasuDividends);

    document.getElementById('sasu-wage-recap').textContent = sasuAfterTax.toLocaleString('fr-FR') + '€';
    document.getElementById('sasu-dividends-recap').textContent = bestSasuDividends.toLocaleString('fr-FR') + '€';
    document.getElementById('sasu-contributions-recap').textContent = sasuContributions;

    let sasuTotal = sasuAfterTax + bestSasuDividends;
    localStorage.setItem('sasuTotal', sasuTotal);
}*/

function fillRecapContainer(turnoverMinusCost, turnover) {
    fillEurlRecap();
    fillMicroRecap(turnover);
    fillEiRecap();
    fillSasuRecap();
    fillRetireRecap(turnoverMinusCost, turnover);

    document.querySelectorAll('.is_ca_recap').forEach(element => {
        element.textContent = turnover.toLocaleString('fr-FR') + '€';
    });

    if (turnover > 50000) {
        localStorage.setItem('microTotal', 0);
        let contributionsRecap = document.getElementById('micro-contributions-recap');
        let retireRecap = document.getElementById('micro-retire-recap');

        contributionsRecap.textContent = '-';
        retireRecap.textContent = '-';
    }

    /*document.querySelectorAll('.simulator_heading_recap').forEach(element => {
        element.classList.remove('heading-best-choice');
    });*/

    /*document.querySelectorAll('.simulator_recap_item').forEach(element => {
        element.classList.remove('container-best-choice');
    });*/

    let eurlTotal = parseInt(localStorage.getItem('eurlTotal'));
    let eiTotal = parseInt(localStorage.getItem('eiTotal'));
    let sasuTotal = parseInt(localStorage.getItem('sasuTotal'));
    let microTotal = parseInt(localStorage.getItem('microTotal'));

    // orderResults(sasuTotal, eurlTotal, eiTotal, microTotal);
    // compareResultsAndAddStyle(sasuTotal, eurlTotal, eiTotal, microTotal);

    compareResults(sasuTotal, eurlTotal, eiTotal, microTotal);
}

/*function orderResults(sasuTotal, eurlTotal, eiTotal, microTotal) {
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
}*/

/*function compareResultsAndAddStyle(sasuTotal, eurlTotal, eiTotal, microTotal) {
    const eurlContainerRecap = document.querySelectorAll('.simulator_recap_item.is-eurl');
    const sasuContainerRecap = document.querySelectorAll('.simulator_recap_item.is-sasu');
    const eiContainerRecap = document.querySelectorAll('.simulator_recap_item.is-ei');
    const microContainerRecap = document.querySelectorAll('.simulator_recap_item.is-micro');

    const eurlHeadingRecap = document.getElementById('eurl-heading-recap');
    const sasuHeadingRecap = document.getElementById('sasu-heading-recap');
    const eiHeadingRecap = document.getElementById('ei-heading-recap');
    const microHeadingRecap = document.getElementById('micro-heading-recap');

    compareResults(sasuTotal, eurlTotal, eiTotal, microTotal, eurlContainerRecap, sasuContainerRecap, eiContainerRecap, microContainerRecap, eurlHeadingRecap, sasuHeadingRecap, eiHeadingRecap, microHeadingRecap);
}*/

function showBestChoiceText(socialForm) {
    document.querySelectorAll('.simulator_recap_explication_result.is-bestchoice-text').forEach((text) => {
        text.style.display = 'none';
    });

    document.getElementById(`${socialForm}-bestchoice-text`).style.display = 'block';
}

function showBestChoice(socialForm) {
    let otherRecapContainer = document.getElementById('simulator_recap_other_container');
    let allRecap = document.querySelectorAll('.simulator_recap_item');
    let bestChoiceContainer = document.querySelector('.simulator_best_result_container');
    let bestChoiceRecap = document.getElementById(`${socialForm}-container-recap`);
    let gridHeadingContainer = document.getElementById(`${socialForm}_simulator_grid_heading_container`);
    let resultRecapHeading = document.getElementById(`${socialForm}-heading-recap`);
    let resultRecapTitle = document.getElementById('simulator-result-title');

    document.querySelectorAll('.simulator_grid_heading_container').forEach((container) => {
        container.style.display = 'block';
    });


    allRecap.forEach((recap) => {
        otherRecapContainer.appendChild(recap);
    });

    resultRecapTitle.textContent = resultRecapHeading.textContent;

    gridHeadingContainer.style.display = 'none';    

    bestChoiceContainer.appendChild(bestChoiceRecap);
}

function compareResults(sasuTotal, eurlTotal, eiTotal, microTotal, turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent) {
    // let resultRecapTitle = document.getElementById('simulator-result-title');

    // removeStyleToResults();


    if (eurlTotal > eiTotal && eurlTotal > sasuTotal && eurlTotal > microTotal) {
        // addStyleToResults(eurlContainerRecap, eurlHeadingRecap, resultRecapTitle, 'eurl');
        showBestChoice('eurl');
        showBestChoiceText('eurl');
        localStorage.setItem('bestSocialForm', 'eurl');
        localStorage.setItem('bestSocialFormForComponent', 'eurl_ei');
        calculEurl(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, 'non');
    } else if (sasuTotal > eurlTotal && sasuTotal > eiTotal && sasuTotal > microTotal) {
        // addStyleToResults(sasuContainerRecap, sasuHeadingRecap, resultRecapTitle, 'sasu');
        showBestChoice('sasu');
        showBestChoiceText('sasu');
        localStorage.setItem('bestSocialForm', 'sasu');
        localStorage.setItem('bestSocialFormForComponent', 'sasu');
        // sasuResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
    } else if (microTotal > eurlTotal && microTotal > eiTotal && microTotal > sasuTotal) {
        // addStyleToResults(microContainerRecap, microHeadingRecap, resultRecapTitle, 'micro');
        showBestChoice('micro');
        showBestChoiceText('micro');
        localStorage.setItem('bestSocialForm', 'micro');
        localStorage.setItem('bestSocialFormForComponent', 'micro');
        microResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
    } else if (eiTotal > eurlTotal && eiTotal > sasuTotal && eiTotal > microTotal) {
        // addStyleToResults(eiContainerRecap, eiHeadingRecap, resultRecapTitle, 'ei');
        showBestChoice('ei');
        showBestChoiceText('ei');
        localStorage.setItem('bestSocialForm', 'ei');
        localStorage.setItem('bestSocialFormForComponent', 'eurl_ei');
        eiResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
    }
}

/*function removeStyleToResults() {
    document.querySelectorAll('.simulator_recap_item').forEach((item) => {
        item.classList.remove('is-bestchoice');
    });

    document.querySelectorAll('.simulator_heading_recap').forEach((heading) => {
        heading.classList.remove('is-bestchoice');
    });
}*/

/*function addStyleToResults(containerRecap, headingRecap, resultRecapTitle, socialForm) {
    containerRecap.forEach((item) => {
        item.classList.add('is-bestchoice');
    });
    headingRecap.classList.add('is-bestchoice');
    resultRecapTitle.textContent = document.getElementById(`${socialForm}-heading-recap`).textContent;
}*/

function fillRetireRecap(turnoverMinusCost, turnover) {
    let microRetirement = microCalculRetraite(turnover);
    document.getElementById('micro-retire-recap').textContent = microRetirement.toLocaleString('fr-FR') + '€';

    let eiRetirement = eiCalculRetraite(turnover);
    document.getElementById('ei-retire-recap').textContent = eiRetirement.toLocaleString('fr-FR') + '€';

    // let sasuRetirement = sasuCalculRetraite(turnoverMinusCost);
    //document.getElementById('sasu-retire-recap').textContent = sasuRetirement.toLocaleString('fr-FR') + '€';
}

function fillBestChoiceText(turnover, situationValue, bestSocialForm) {
    let unemploymentText;
    if (isUnemployment === 'true' && unemploymentDuration === 'less_six_months') {
        unemploymentText = 'touchez le chômage depuis moins de six mois';
    } else {
        unemploymentText = 'ne touchez pas le chômage';
    }

    if (situationValue === 'couple') {
        situationValue = 'en couple';
    }

    let bestTotalWage;
    let bestWage;
    let bestDividends;
    // let bestContributions;

    const microFinalAmount = parseInt(localStorage.getItem('microTotal'));
    // const microContributions = (document.getElementById('micro-contributions-total')).textContent;
    // const microContributions = parseInt(localStorage.getItem('microContributions')).toLocaleString('fr-FR');

    const eurlFinalAmount = parseInt(localStorage.getItem('eurlTotal'));
    const eurlDividends = parseInt(localStorage.getItem('bestEurlDividends'));
    const eurlRemuneration = parseInt(localStorage.getItem('remunerationAfterTax'));
    // const eurlContributions = parseInt(localStorage.getItem('eurlContributionsTotal')).toLocaleString('fr-FR');

    const eiFinalAmount = parseInt(localStorage.getItem('eiTotal'));
    // const eiContributions = (document.getElementById('ei-contributions-total')).textContent;


    const sasuArray = JSON.parse(localStorage.getItem('arraySasu'));
    const bestSasuTotal = Math.max(...array.map(obj => obj.remunerationPlusDividendsBestAmount));
    const bestSasuObject = array.find(obj => obj.remunerationPlusDividendsBestAmount === bestSasuTotal);

    const sasuFinalAmount = parseInt(bestSasuObject.remunerationPlusDividendsBestAmount);
    const sasuPfuDividends = parseInt(bestSasuObject.dividendsNetsPfuAmount);
    const sasuProgressiveDividends = parseInt(bestSasuObject.dividendsNetsProgressiveAmount);
    let sasuDividends;
    if (sasuPfuDividends > sasuProgressiveDividends) {
        sasuDividends = sasuPfuDividends;
    } else {
        sasuDividends = sasuProgressiveDividends;
    }
    const sasuRemuneration = parseInt(bestSasuObject.afterTaxAmount);
    // const sasuContributions = (document.getElementById('sasu-contributions-total')).textContent;

    if (bestSocialForm === 'eurl') {
        bestTotalWage = eurlFinalAmount;
        bestWage = eurlRemuneration;
        bestDividends = eurlDividends;
        // bestContributions = eurlContributions;
    } else if (bestSocialForm === 'sasu') {
        bestTotalWage = sasuFinalAmount;
        bestWage = sasuRemuneration;
        bestDividends = sasuDividends;
        // bestContributions = sasuContributions;
    } else if (bestSocialForm === 'micro') {
        bestTotalWage = microFinalAmount;
        bestWage = microFinalAmount;
        bestDividends = '0';
        // bestContributions = microContributions;
    } else {
        bestTotalWage = eiFinalAmount;
        bestWage = eiFinalAmount;
        bestDividends = '0';
        // bestContributions = eiContributions;
    }


    const contributionsTotal = document.getElementById('contributions-total');
    document.getElementById('best-contributions').textContent = contributionsTotal.textContent;

    document.querySelector('.simulator_result_ca').textContent = turnover.toLocaleString('fr-FR');

    document.querySelector('.simulator_result_revenu').textContent = bestTotalWage.toLocaleString('fr-FR') + '€';
    document.getElementById('best-remuneration').textContent = bestWage.toLocaleString('fr-FR') + '€';

    document.getElementById('best-dividends').textContent = bestDividends.toLocaleString('fr-FR') + '€';

    // const eurlDividends = parseInt(localStorage.getItem('bestEurlDividends')).toLocaleString('fr-FR');
    // const eurlRemuneration = parseInt(localStorage.getItem('eurlAfterTax')).toLocaleString('fr-FR');
    // const eurlFinalAmount = parseInt(localStorage.getItem('eurlTotal')).toLocaleString('fr-FR');
    // const eurlContributions = (document.getElementById('eurl-contributions-total')).textContent;

    // document.getElementById(`eurl-bestchoice-text`).innerHTML = `Si votre chiffre d'affaire est de <span class="simulator-recap-text-number">${turnover}€</span> et vos charges, c’est à dire ce que vous dépensez pour faire fonctionner votre entreprise, sont de ${cost}€, alors en vous versant <span class="simulator-recap-text-number">${eurlDividends}€</span> de dividendes et en vous rémunérant <span class="simulator-recap-text-number">${eurlRemuneration}€</span>, l'EURL est la meilleure optimisation pour vous.<br>Vos cotisations à devoir à l'Etat s'élèveront à <span class="simulator-recap-text-number">${eurlContributions}</span>.<br>En résumé, le montant qui vous reviendra à la fin sera de <span class="simulator-recap-text-total-amount">${eurlFinalAmount}€</span>.`;

    // document.getElementById('eurl-bestchoice-text').textContent = `L’EURL est le meilleur choix pour plusieurs raisons. Puisque votre votre chiffre d'affaires est de ${turnover}€, que vous ${unemploymentText}, et que vous êtes ${situationValue} avec ${numberOfChildValue} enfants à charges, vous pouvez profiter des avantages de l’EURL en optimisant votre rémunération entre rémunération réelle, applicant des charges sociales moins élevées que la SASU, et dividendes.`;

    // document.getElementById('micro-bestchoice-text').textContent = `La micro-entreprise est le meilleur choix pour vous car votre chiffre d’affaires est inférieur à 50 000€. Cette forme sociale vous permettra donc de diminuer vos charges sociales pour une meilleure rémunération finale.`;

    // const microFinalAmount = parseInt(localStorage.getItem('microTotal')).toLocaleString('fr-FR');
    // const microContributions = (document.getElementById('micro-contributions-total')).textContent;

    // document.getElementById('micro-bestchoice-text').innerHTML = `Si votre chiffre d'affaire est de <span class="simulator-recap-text-number">${turnover}€</span> et vos charges, c’est à dire ce que vous dépensez pour faire fonctionner votre entreprise, sont de ${cost}€, alors la micro-entreprise est la meilleure optimisation pour vous.<br>Vos cotisations à devoir à l'Etat s'élèveront à <span class="simulator-recap-text-number">${microContributions}</span>.<br>En résumé, le montant qui vous reviendra à la fin sera de <span class="simulator-recap-text-total-amount">${microFinalAmount}€</span>.`;

    // document.getElementById('ei-bestchoice-text').textContent = `Puisque votre rémunération est de ${turnover}, que vous ${unemploymentText} et que vous êtes ${situationValue} avec ${numberOfChildValue} enfants à charges, l'EI est le meilleur choix pour vous.`;

    // const eiFinalAmount = parseInt(localStorage.getItem('eiTotal')).toLocaleString('fr-FR');
    // const eiContributions = (document.getElementById('ei-contributions-total')).textContent;

    // document.getElementById('ei-bestchoice-text').innerHTML = `Si votre chiffre d'affaire est de <span class="simulator-recap-text-number">${turnover}€</span> et vos charges, c’est à dire ce que vous dépensez pour faire fonctionner votre entreprise, sont de ${cost}€, alors l'EI est la meilleure optimisation pour vous.<br>Vos cotisations à devoir à l'Etat s'élèveront à <span class="simulator-recap-text-number">${eiContributions}€</span>.<br>En résumé, le montant qui vous reviendra à la fin sera de <span class="simulator-recap-text-total-amount">${eiFinalAmount}€</span>.`;

    // document.getElementById('sasu-bestchoice-text').textContent = `La SASU est le meilleur choix pour vous puisque votre chiffre d'affaires étant de ${turnover}€, vous pourrez bénéficier des meilleures coitisations si vous choisissez de vous versez des salaires, ou vous pourrez aussi faire le choix de vous versez des dividendes pour optimiser votre rémunération.`;

    // const sasuDividends = parseInt(localStorage.getItem('bestSasuDividends')).toLocaleString('fr-FR');
    // const sasuRemuneration = parseInt(localStorage.getItem('sasuAfterTax')).toLocaleString('fr-FR');
    // const sasuFinalAmount = parseInt(localStorage.getItem('sasuTotal')).toLocaleString('fr-FR');
    // const sasuContributions = (document.getElementById('sasu-contributions-total')).textContent;

    // document.getElementById('sasu-bestchoice-text').innerHTML = `Si votre chiffre d'affaire est de <span class="simulator-recap-text-number">${turnover}€</span> et vos charges, c’est à dire ce que vous dépensez pour faire fonctionner votre entreprise, sont de ${cost}€ et que vous touchez le chômage, alors en vous versant <span class="simulator-recap-text-number">${sasuDividends}€</span> de dividendes et en vous rémunérant <span class="simulator-recap-text-number">${sasuRemuneration}€</span>, la SASU est la meilleure optimisation pour vous.<br>Vos cotisations à devoir à l'Etat s'élèveront à <span class="simulator-recap-text-number">${sasuContributions}</span>.<br>En résumé, le montant qui vous reviendra à la fin sera de <span class="simulator-recap-text-total-amount">${sasuFinalAmount}€</span>.`;
}

function checkUnemployment(turnoverMinusCost, turnover, numberOfChildValue, situationValue, householdIncome, singleParent) {
    if (isUnemployment.value === "true" && unemploymentDuration.value === "more_six_months") {
        // fillEurlRecap();
        // fillMicroRecap(turnover);
        // fillEiRecap();
        // fillSasuRecap();
        // fillRetireRecap(turnoverMinusCost, turnover);
    
        document.querySelectorAll('.is_ca_recap').forEach(element => {
            element.textContent = turnover.toLocaleString('fr-FR') + '€';
        });

        if (turnover > 50000) {
            localStorage.setItem('microTotal', 0);
            let contributionsRecap = document.getElementById('micro-contributions-recap');
            let retireRecap = document.getElementById('micro-retire-recap');
    
            contributionsRecap.textContent = '-';
            retireRecap.textContent = '-';
        }
    
        /*document.querySelectorAll('.simulator_heading_recap').forEach(element => {
            element.classList.remove('heading-best-choice');
        });

        document.querySelectorAll('.simulator_recap_item').forEach(element => {
            element.classList.remove('container-best-choice');
        });*/
    
        // const sasuContainerRecap = document.querySelectorAll('.simulator_recap_item.is-sasu');
        // const sasuHeadingRecap = document.getElementById('sasu-heading-recap');
        // let resultRecapTitle = document.getElementById('simulator-result-title');

        // resultRecapTitle.textContent = document.getElementById(`sasu-heading-recap`).textContent;

        // removeStyleToResults();

        // addStyleToResults(sasuContainerRecap, sasuHeadingRecap, resultRecapTitle, 'sasu');

        // sasuBestChoiceText.textContent = 'La SASU est le meilleur choix pour vous car vous pouvez cumuler votre allocation chômage avec votre rémunération. Cela permet de cotiser (retraite, sécurité sociale, etc) et d’optimiser sa rémunération, notamment en se versant des dividendes.';

        const sasuDividends = parseInt(localStorage.getItem('bestSasuDividends')).toLocaleString('fr-FR');
        const sasuRemuneration = parseInt(localStorage.getItem('sasuAfterTax')).toLocaleString('fr-FR');
        const sasuFinalAmount = parseInt(localStorage.getItem('sasuTotal')).toLocaleString('fr-FR');
        const sasuContributions = (document.getElementById('sasu-contributions-total')).textContent;

        document.querySelector('.simulator_result_ca').textContent = turnover.toLocaleString('fr-FR');
        document.querySelector('.simulator_result_revenu').textContent = sasuFinalAmount + '€';

        document.getElementById('best-remuneration').textContent = sasuRemuneration.toLocaleString('fr-FR') + '€';
        document.getElementById('best-dividends').textContent = sasuDividends.toLocaleString('fr-FR') + '€';
        document.getElementById('best-contributions').textContent = sasuContributions.toLocaleString('fr-FR') + '€';

        // document.getElementById('sasu-bestchoice-text').innerHTML = `Si votre chiffre d'affaire est de <span class="simulator-recap-text-number">${turnover}€</span> et vos charges, c’est à dire ce que vous dépensez pour faire fonctionner votre entreprise, sont de ${cost}€ et que vous touchez le chômage, alors en vous versant <span class="simulator-recap-text-number">${sasuDividends}€</span> de dividendes et en vous rémunérant <span class="simulator-recap-text-number">${sasuRemuneration}€</span>, la SASU est la meilleure optimisation pour vous.<br>Vos cotisations à devoir à l'Etat s'élèveront à <span class="simulator-recap-text-number">${sasuContributions}</span>.<br>En résumé, le montant qui vous reviendra à la fin sera de <span class="simulator-recap-text-total-amount">${sasuFinalAmount}€</span>.`;

        showBestChoice('sasu');
        showBestChoiceText('sasu');
        showBestSocialForm('sasu');
    } else {
        // fillRecapContainer(turnoverMinusCost, turnover);
        let eurlTotal = parseInt(localStorage.getItem('eurlTotal'));
        let eiTotal = parseInt(localStorage.getItem('eiTotal'));
        let sasuTotal = parseInt(localStorage.getItem('sasuTotal'));
        let microTotal = parseInt(localStorage.getItem('microTotal'));

        compareResults(sasuTotal, eurlTotal, eiTotal, microTotal, turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        let bestSocialForm = localStorage.getItem('bestSocialForm');
        fillBestChoiceText(turnover, situationValue, bestSocialForm);
        let bestSocialFormForComponent = localStorage.getItem('bestSocialFormForComponent');
        showBestSocialForm(bestSocialForm, bestSocialFormForComponent);
    };
}


function showBestSocialForm(bestSocialForm, bestSocialFormForComponent) {
    document.querySelectorAll('.details_dividends_component').forEach((component) => {
        component.classList.add('hidden');
    });

    document.querySelectorAll(`.details_micro_contributions_component`).forEach((component) => {
        component.classList.add('hidden');
    });

    document.querySelectorAll(`.details_eurl_ei_contributions_component`).forEach((component) => {
        component.classList.add('hidden');
    });

    document.querySelectorAll(`.details_sasu_contributions_component`).forEach((component) => {
        component.classList.add('hidden');
    });

    document.querySelectorAll(`.details_${bestSocialFormForComponent}_contributions_component`).forEach((component) => {
        component.classList.remove('hidden');
    });

    /*document.querySelectorAll('.simulator_contributions_grid').forEach((grid) => {
        grid.classList.add('hidden');
    });

    document.querySelectorAll('.simulator_dividends_grid').forEach((grid) => {
        grid.classList.add('hidden');
    });

    document.querySelectorAll('.simulator_remuneration_grid').forEach((grid) => {
        grid.classList.add('hidden');
    });

    document.querySelectorAll('.simulator_retire_grid').forEach((grid) => {
        grid.classList.add('hidden');
    });

    document.querySelectorAll('.simulator_separator').forEach((grid) => {
        grid.classList.add('hidden');
    });*/

    // document.getElementById('dividends-container').style.display = 'none';
    
    if (bestSocialForm === 'sasu' || bestSocialForm === 'eurl') {
        document.querySelectorAll('.details_dividends_component').forEach((component) => {
            component.classList.remove('hidden');
        });
    }

    // document.getElementById(`${bestSocialForm}-contributions-grid`).classList.remove('hidden');
    // document.getElementById(`${bestSocialForm}-remuneration-grid`).classList.remove('hidden');
    // document.getElementById(`${bestSocialForm}-retire-grid`).classList.remove('hidden');
}


export { retirementText, fillText, fillSameClassTexts, yearFillText };