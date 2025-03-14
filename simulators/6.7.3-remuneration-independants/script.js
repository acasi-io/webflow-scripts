import Engine,{ formatValue } from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/6.7.3-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/6.7.3-remuneration-independants/node_modules/modele-social/dist/index.js';

import { calculEurl, storageEurlTotal, fillEurlComparison } from './eurl.js';
import { microResult, microCalculRetraite, storageMicroTotal, fillMicroComparison } from './micro.js';
import { eiResult, eiCalculRetraite, storageEiTotal, fillEiComparison } from './ei.js';
import { sasuResult, fillSasuComparison } from './sasu.js';

const engine = new Engine(rules);

const calculBtn = document.getElementById('calcul-btn');
const numberOfChildSelect = document.getElementById('child');
const simulatorResults = document.getElementById('simulator-results');
let PASS = 46368;
export let halfPass = 0.5 * PASS;
export let fifthPass = 0.2 * PASS;

const isUnemployment = document.getElementById('unemployment_boolean');
const unemploymentDuration = document.getElementById('unemployment_duration');
let resultRecapTitle = document.querySelectorAll('.simulator_best_result_title');
const explanationText = document.getElementById('explanation-text');
const attentionText = document.getElementById('attention-text');
const comparisonTitle = document.getElementById('simulator_comparison_title');


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
    const loader = document.getElementById('loader')
    loader.style.display = 'flex';
    loader.style.alignItems = 'center';
    loader.style.gap = '1rem';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

const situationField = document.getElementById('personal-situation');
const childrenField = document.getElementById('child');
const singleParentWrapper = document.getElementById('single-parent-wrapper');

function checkConditions() {
  const situation = situationField.value;
  const numberOfChildren = parseInt(childrenField.value);

  if (situation === 'célibataire' && numberOfChildren > 0) {
    singleParentWrapper.style.display = 'flex';
  } else {
    singleParentWrapper.style.display = 'none';
  }
}

situationField.addEventListener('change', checkConditions);
childrenField.addEventListener('input', checkConditions);



calculBtn.addEventListener('click', () => {
    showLoader();

    setTimeout(() => {
        const turnover = parseFloat(document.getElementById('turnover').value);
        const cost = parseFloat(document.getElementById('cost').value);
        const householdIncome = parseFloat(document.getElementById('household-income').value);
        const singleParent = document.getElementById('single-parent').value;
        const numberOfChildValue = parseInt(document.getElementById('child').value);
        const situationValue = document.getElementById('personal-situation').value;

        const turnoverMinusCost = turnover - cost;

        document.querySelectorAll('.comparison_ca').forEach((text) => {
            text.textContent = turnover + '€';
        });

        storageMicroTotal(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        fillMicroComparison(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        microResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        fillComparisonRetirementText('micro');

        storageEiTotal(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        fillEiComparison(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        eiResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        fillComparisonRetirementText('ei');

        storageEurlTotal(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        fillEurlComparison(turnover, cost);
        calculEurl(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        fillComparisonRetirementText('eurl');

        sasuResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        fillSasuComparison(turnover, cost);
        fillComparisonRetirementText('sasu');

        checkUnemployment(turnoverMinusCost, turnover, cost, numberOfChildValue, situationValue, householdIncome, singleParent);

        microConditions(turnover);

        if (document.getElementById('retirement-points').textContent = 'NaN') {
            document.getElementById('retirement-points').textContent = '0';
        }

        checkUnemploymentAndSocialSecurityProtection();

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

function fillComparisonRetirementText(socialForm) {
    const retirementGainTrimester = document.getElementById('gain-trimester').textContent;
    document.querySelectorAll(`.${socialForm}_comparison_gain-trimester`).forEach((element) => {
        element.textContent = retirementGainTrimester;
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

function compareResults(sasuTotal, eurlTotal, eiTotal, microTotal, turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent) {
    const options = [
        { key: 'eurl', total: eurlTotal, component: 'eurl_ei', title: "l'EURL à l'Impôt sur les Sociétés", func: calculEurl },
        { key: 'sasu', total: sasuTotal, component: 'sasu', title: "la SASU à l'Impôt sur les Sociétés", func: null },
        { key: 'micro', total: microTotal, component: 'micro', title: "la MICRO", func: microResult },
        { key: 'ei', total: eiTotal, component: 'eurl_ei', title: "l'EI", func: eiResult },
    ];

    const bestOption = options.reduce((best, current) => {
        return current.total > best.total ? current : best;
    });

    localStorage.setItem('bestSocialForm', bestOption.key);
    localStorage.setItem('bestSocialFormForComponent', bestOption.component);

    if (bestOption.func) {
        bestOption.func(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
    }

    resultRecapTitle.forEach((title) => {
        title.textContent = bestOption.title;
    });
}

function fillRetireRecap(turnoverMinusCost, turnover) {
    let microRetirement = microCalculRetraite(turnover);
    document.getElementById('micro-retire-recap').textContent = microRetirement.toLocaleString('fr-FR') + '€';

    let eiRetirement = eiCalculRetraite(turnover);
    document.getElementById('ei-retire-recap').textContent = eiRetirement.toLocaleString('fr-FR') + '€';
}

function configureDividendsDisplay() {
    const dividendsDiv = document.getElementById('best-choice-dividends');
    dividendsDiv.style.display = 'flex';
    dividendsDiv.style.justifyContent = 'space-between';
    dividendsDiv.style.width = '18rem';
}

function getSocialFormAmounts() {
    return {
        micro: parseInt(localStorage.getItem('microTotal')),
        eurl: {
            total: parseInt(localStorage.getItem('eurlTotal')),
            dividends: parseInt(localStorage.getItem('bestEurlDividends')),
            remuneration: parseInt(localStorage.getItem('eurlAfterTax')),
        },
        ei: parseInt(localStorage.getItem('eiTotal')),
        sasu: (() => {
            const sasuArray = JSON.parse(localStorage.getItem('arraySasu'));
            const bestSasuTotal = Math.max(...sasuArray.map(obj => obj.remunerationPlusDividendsBestAmount));
            const bestSasuObject = sasuArray.find(obj => obj.remunerationPlusDividendsBestAmount === bestSasuTotal);
            return {
                total: parseInt(bestSasuObject.remunerationPlusDividendsBestAmount),
                dividends: Math.max(
                    parseInt(bestSasuObject.dividendsNetsPfuAmount),
                    parseInt(bestSasuObject.dividendsNetsProgressiveAmount)
                ),
                remuneration: parseInt(bestSasuObject.afterTaxAmount),
            };
        })(),
    };
}

function updateComparisonTexts(bestSocialForm, comparisonTitle, explanationText, attentionText) {
    const texts = {
        eurl: {
            title: 'EURL',
            explanation: `L'EURL est une SARL à associé unique, offrant une protection du patrimoine personnel et une grande flexibilité. Les principaux avantages incluent la <strong>protection du patrimoine personnel</strong>, la <strong>flexibilité dans l'organisation</strong>, la <strong>liberté de fixation du capital</strong>, et la <strong>transition automatique vers une SARL</strong> en cas d'arrivée de nouveaux associés.`,
            attention: `L’EURL à l’IS offre une fiscalité avantageuse, mais attention à la <strong>gestion des dividendes</strong>, soumis à cotisations sociales. Le calcul du montant des dividendes nettes a été fait sur la base d'un capital social de 1.500€, ce montant peut donc légèrement différent.<br>En tant que gérant TNS, vous bénéficiez de charges sociales réduites, mais d'une <strong>couverture sociale et retraite moins favorable</strong> par rapport à la SASU. La responsabilité est limitée sauf en cas de garanties personnelles, et des <strong>formalités comptables rigoureuses</strong> sont nécessaires pour rester conforme.`,
        },
        sasu: {
            title: 'SASU',
            explanation: `La SASU est une forme juridique de société par actions simplifiée avec un seul associé. Les principaux avantages incluent la <strong>protection du patrimoine personnel</strong>, la <strong>flexibilité dans l'organisation</strong>, la <strong>liberté de fixation du capital</strong>, la <strong>possibilité de transition</strong> vers une structure pluripersonnelle sans formalités complexes et l’absences de cotisations sociales sur les dividendes.`,
            attention: `La SASU offre souplesse et l'absence de cotisations sociales sur les dividendes, mais certains aspects sont à surveiller. En tant que président assimilé salarié, vous relevez du régime général, avec des <strong>charges sociales plus élevées</strong> mais une meilleure couverture sociale et retraite.<br>Vous pouvez choisir de vous verser plus de dividendes pour réduire ces charges, mais cela <strong>diminue votre protection sociale</strong>, notamment en matière de retraite. Enfin, la <strong>gestion administrative reste rigoureuse</strong> et la responsabilité limitée, sauf en cas de garanties personnelles.`,
        },
        micro: {
            title: 'Micro',
            explanation: `La micro-entreprise est <strong>simple à créer et à gérer</strong>, avec un régime fiscal et social allégé. Les cotisations sont calculées sur le chiffre d’affaires, et la <strongTVA peut être exonérée></strong> sous certains seuils. De plus, les formalités comptables sont réduites, ce qui en fait un statut idéal pour démarrer une activité sans lourdes contraintes administratives.`,
            attention: `Les <strong>plafonds de chiffre d’affaires</strong> limitent la croissance et obligent à changer de statut en cas de dépassement. La <strong>couverture sociale et retraite est moindre</strong>, et l’absence de séparation entre patrimoine personnel et professionnel expose l'entrepreneur à un risque financier en cas de difficultés.`,
        },
        ei: {
            title: 'EI',
            explanation: `L'entreprise individuelle permet à un entrepreneur de démarrer une activité sans créer une entité juridique distincte. La responsabilité est limitée au patrimoine professionnel, offrant une protection des biens personnels sans formalités. L'entrepreneur peut librement apporter des fonds et gérer la trésorerie.<br>L'imposition est basée sur le bénéfice réalisé, avec des cotisations sociales en fonction des rémunérations.`,
            attention: `Bien que l'EI simplifie la gestion, la responsabilité de l'entrepreneur peut être engagée en cas de dettes si le patrimoine professionnel n'est pas bien séparé. De plus, les cotisations sociales sont calculées sur le bénéfice, même si celui-ci est réinvesti dans l'activité, ce qui peut affecter la trésorerie. Enfin, la couverture sociale et retraite peut être moins avantageuse que dans d'autres statuts plus protecteurs.`,
        },
    };

    comparisonTitle.textContent = texts[bestSocialForm].title;
    explanationText.innerHTML = texts[bestSocialForm].explanation;
    attentionText.innerHTML = texts[bestSocialForm].attention;

    if (bestSocialForm === 'micro' || bestSocialForm === 'ei') {
        document.getElementById('best-choice-dividends').style.display = 'none';
    }
}

function calculateContributions(turnover, cost, bestWage, bestDividends) {
    const contributionsTotal = parseInt(document.getElementById('contributions-total').textContent.replace(/\s+/g, ""));
    const taxAmount = turnover - cost - bestWage - bestDividends - contributionsTotal;
    const contributionsPlusTax = contributionsTotal + taxAmount;

    document.getElementById('best-contributions').textContent = `${contributionsPlusTax}€`;
}

function updateSimulatorResults(turnover, bestTotalWage, bestWage, bestDividends) {
    document.querySelector('.simulator_result_ca').textContent = turnover.toLocaleString('fr-FR');
    document.querySelector('.simulator_result_revenu').textContent = `${bestTotalWage.toLocaleString('fr-FR')}€`;
    document.getElementById('best-remuneration').textContent = `${bestWage.toLocaleString('fr-FR')}€`;
    document.getElementById('best-dividends').textContent = `${bestDividends.toLocaleString('fr-FR')}€`;
}

function fillBestChoiceText(turnover, cost, situationValue, bestSocialForm) {
    configureDividendsDisplay();
    microConditions(turnover);

    const { micro, eurl, ei, sasu } = getSocialFormAmounts();

    let bestTotalWage, bestWage, bestDividends;
    if (bestSocialForm === 'eurl') {
        bestTotalWage = eurl.total;
        bestWage = eurl.remuneration;
        bestDividends = eurl.dividends;
    } else if (bestSocialForm === 'sasu') {
        bestTotalWage = sasu.total;
        bestWage = sasu.remuneration;
        bestDividends = sasu.dividends;
    } else if (bestSocialForm === 'micro') {
        bestTotalWage = bestWage = micro;
        bestDividends = 0;
    } else {
        bestTotalWage = bestWage = ei;
        bestDividends = 0;
    }

    updateComparisonTexts(bestSocialForm, comparisonTitle, explanationText, attentionText);
    orderBestRemuneration(sasu.total, eurl.total, ei, micro, turnover);
    updateAndSortDivs(sasu.total, eurl.total, ei, micro, false);
    calculateContributions(turnover, cost, bestWage, bestDividends);
    updateSimulatorResults(turnover, bestTotalWage, bestWage, bestDividends);
}


function resetSimulation() {
    // Réinitialiser les éléments clonés (les rendre invisibles au début de chaque simulation)
    document.querySelectorAll('.comparison_result_block').forEach(el => {
        el.style.display = 'none'; // Masquer les blocs
        el.innerHTML = ''; // Nettoyer leur contenu
    });

    // Réafficher tous les éléments d'origine
    document.querySelectorAll('[data-socialform]').forEach(el => {
        el.style.display = 'block'; // Rendre visible
    });
}

function resetAndPrepareValues(sasu, eurl, ei, micro, chiffreAffaires) {
    return [
        { 
            value: eurl, 
            displayValue: eurl, 
            socialForm: 'EURL', 
            elementId: 'eurl-comparison-component' 
        },
        { 
            value: sasu, 
            displayValue: sasu, 
            socialForm: 'SASU', 
            elementId: 'sasu-comparison-component' 
        },
        { 
            value: ei, 
            displayValue: ei, 
            socialForm: 'EI', 
            elementId: 'ei-comparison-component' 
        },
        { 
            value: chiffreAffaires > 50000 ? 0 : micro, 
            displayValue: micro, 
            socialForm: 'MICRO', 
            elementId: 'micro-comparison-component' 
        }
    ];
}

function prioritizeSASU(remunerationValues) {
    if (isUnemployment.value === "true" && unemploymentDuration.value === "more_six_months") {
        const sasuIndex = remunerationValues.findIndex(item => item.socialForm === 'SASU');
        if (sasuIndex !== -1) {
            const [sasuItem] = remunerationValues.splice(sasuIndex, 1);
            remunerationValues.unshift(sasuItem);
        }
    }
    return remunerationValues;
}

function sortAndFilterRemunerations(remunerationValues) {
    return remunerationValues.filter(item => item.value !== null).sort((a, b) => b.value - a.value);
}

function rearrangeDivs(filteredRemunerationValues) {
    const parentTop = document.querySelector('.simulator_comparison_grid_top');
    filteredRemunerationValues.forEach(item => {
        const div = document.getElementById(item.elementId);
        if (div) parentTop.appendChild(div);
    });
}

function updateResultBlocks(filteredRemunerationValues) {
    const rectangles = document.querySelectorAll('.comparison_result_block');
    filteredRemunerationValues.forEach((item, index) => {
        const targetRectangle = rectangles[index];
        const valueFormatted = `${item.displayValue.toLocaleString('fr-FR')}€`;
        if (targetRectangle) {
            targetRectangle.style.display = 'block';
            targetRectangle.innerHTML = `<p class="comparison_grid_remuneration_text">${valueFormatted}</p>`;
        }
    });
}

function orderBestRemuneration(sasuFinalAmount, eurlFinalAmount, eiFinalAmount, microFinalAmount, chiffreAffaires) {
    resetSimulation();

    let remunerationValues = resetAndPrepareValues(sasuFinalAmount, eurlFinalAmount, eiFinalAmount, microFinalAmount, chiffreAffaires);
    remunerationValues = prioritizeSASU(remunerationValues);

    const filteredRemunerationValues = sortAndFilterRemunerations(remunerationValues);

    rearrangeDivs(filteredRemunerationValues);
    updateResultBlocks(filteredRemunerationValues);
}

function getMicroDisplayAmount(microFinalAmount) {
    return parseFloat(localStorage.getItem('microTotalRealAmount')) || (microFinalAmount > 50000 ? 0 : microFinalAmount);
}

function updateDivValues(dynamicDivs, dynamicValues) {
    dynamicDivs.forEach(div => {
        const socialForm = div.getAttribute('data-socialformmobile');
        if (dynamicValues[socialForm] !== undefined) {
            div.setAttribute('data-value', dynamicValues[socialForm]);
        }
    });
}

function sortDivs(dynamicDivs, forceSasuFirst) {
    return dynamicDivs.sort((a, b) => {
        const aValue = parseFloat(a.getAttribute('data-value'));
        const bValue = parseFloat(b.getAttribute('data-value'));

        if (forceSasuFirst) {
            if (a.getAttribute('data-socialformmobile') === "SASU") return -1;
            if (b.getAttribute('data-socialformmobile') === "SASU") return 1;
        }

        return bValue - aValue;
    });
}

function updateStaticDivs(dynamicDivs, staticDivs, microDisplayAmount) {
    staticDivs.forEach((staticDiv, index) => {
        const dynamicDiv = dynamicDivs[index];
        const socialForm = dynamicDiv.getAttribute('data-socialformmobile');
        const value = (socialForm === "MICRO") ? microDisplayAmount : dynamicDiv.getAttribute('data-value');
        staticDiv.textContent = `${value}€`;
    });
}

function updateAndSortDivs(sasuFinalAmount, eurlFinalAmount, eiFinalAmount, microFinalAmount, forceSasuFirst = false) {
    const microDisplayAmount = getMicroDisplayAmount(microFinalAmount);

    const dynamicValues = {
        EURL: eurlFinalAmount,
        SASU: sasuFinalAmount,
        EI: eiFinalAmount,
        MICRO: microFinalAmount
    };

    const dynamicDivs = Array.from(document.querySelectorAll('.dynamic'));

    updateDivValues(dynamicDivs, dynamicValues);

    const sortedDivs = sortDivs(dynamicDivs, forceSasuFirst);

    const gridContainer = document.querySelector('.grid-container');
    const staticDivs = Array.from(document.querySelectorAll('.static'));

    gridContainer.innerHTML = '';

    sortedDivs.forEach((div, index) => {
        gridContainer.appendChild(div);
        gridContainer.appendChild(staticDivs[index]);
    });

    updateStaticDivs(sortedDivs, staticDivs, microDisplayAmount);
}

function microConditions(turnover) {
    document.querySelector('.comparison_micro_text').style.display = 'none';
    if (turnover > 50000) {
        localStorage.setItem('microTotal', 0);
        document.querySelector('.comparison_micro_text').style.display = 'block';
    }
}

function checkUnemployment(turnoverMinusCost, turnover, cost, numberOfChildValue, situationValue, householdIncome, singleParent) {
    if (isUnemployment.value === "true" && unemploymentDuration.value === "more_six_months") {    
        document.querySelectorAll('.is_ca_recap').forEach(element => {
            element.textContent = turnover.toLocaleString('fr-FR') + '€';
        });

        microConditions(turnover);

        const sasuDividends = parseInt(localStorage.getItem('bestSasuDividends')).toLocaleString('fr-FR');
        const sasuRemuneration = parseInt(localStorage.getItem('sasuAfterTax')).toLocaleString('fr-FR');
        const sasuFinalAmount = parseInt(localStorage.getItem('sasuTotal')).toLocaleString('fr-FR');

        document.querySelector('.simulator_result_ca').textContent = turnover.toLocaleString('fr-FR');
        document.querySelector('.simulator_result_revenu').textContent = sasuFinalAmount + '€';

        document.getElementById('best-remuneration').textContent = sasuRemuneration.toLocaleString('fr-FR') + '€';
        document.getElementById('best-dividends').textContent = sasuDividends.toLocaleString('fr-FR') + '€';

        resultRecapTitle.forEach((title) => {
            title.textContent = "SASU à l'Impôt sur les Sociétés";
        });

        comparisonTitle.textContent = 'SASU';

        const microFinalAmount = parseInt(localStorage.getItem('microTotal'));
        const eurlFinalAmount = parseInt(localStorage.getItem('eurlTotal'));
        const eiFinalAmount = parseInt(localStorage.getItem('eiTotal'));
        updateAndSortDivs(sasuFinalAmount, eurlFinalAmount, eiFinalAmount, microFinalAmount, true);

        showBestSocialForm('sasu', 'sasu');
        fillBestChoiceText(turnover, cost, situationValue, 'sasu');
        explanationText.innerHTML = `La SASU est une forme juridique de société par actions simplifiée avec un seul associé. Les principaux avantages incluent la <strong>protection du patrimoine personnel</strong>, la <strong>flexibilité dans l'organisation</strong>, la <strong>liberté de fixation du capital</strong>, la <strong>possibilité de transition</strong> vers une structure pluripersonnelle sans formalités complexes et l’absences de cotisations sociales sur les dividendes.`;
        attentionText.innerHTML = `La SASU offre souplesse et l'absence de cotisations sociales sur les dividendes, mais certains aspects sont à surveiller. En tant que président assimilé salarié, vous relevez du régime général, avec des <strong>charges sociales plus élevées</strong> mais une meilleure couverture sociale et retraite.<br>Vous pouvez choisir de vous verser plus de dividendes pour réduire ces charges, mais cela <strong>diminue votre protection sociale</strong>, notamment en matière de retraite. Enfin, la <strong>gestion administrative reste rigoureuse</strong> et la responsabilité limitée, sauf en cas de garanties personnelles.`;
    } else {
        microConditions(turnover);
        
        let eurlTotal = parseInt(localStorage.getItem('eurlTotal'));
        let eiTotal = parseInt(localStorage.getItem('eiTotal'));
        let sasuTotal = parseInt(localStorage.getItem('sasuTotal'));
        let microTotal = parseInt(localStorage.getItem('microTotal'));
        
        compareResults(sasuTotal, eurlTotal, eiTotal, microTotal, turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        let bestSocialForm = localStorage.getItem('bestSocialForm');
        fillBestChoiceText(turnover, cost, situationValue, bestSocialForm);
        let bestSocialFormForComponent = localStorage.getItem('bestSocialFormForComponent');
        showBestSocialForm(bestSocialForm, bestSocialFormForComponent);
    };
}

function showBestSocialForm(bestSocialForm, bestSocialFormForComponent) {
    document.querySelector('.details_dividends_component').classList.add('hidden');

    document.querySelector(`.contributions_micro_grid`).classList.add('hidden');

    document.querySelector(`.contributions_eurl_ei_grid`).classList.add('hidden');

    document.querySelector(`.contributions_sasu_grid`).classList.add('hidden');

    document.querySelector(`.contributions_${bestSocialFormForComponent}_grid`).classList.remove('hidden');
    
    if (bestSocialForm === 'sasu' || bestSocialForm === 'eurl') {
        document.querySelector('.details_dividends_component').classList.remove('hidden');
    }
}

function fillSameClassTextRecapProtection(className, textToShow, colorText) {
    document.querySelectorAll(`.${className}`).forEach((element) => {
        element.textContent = textToShow;
        element.style.color = `${colorText}`;
    });
}

function checkUnemploymentAndSocialSecurityProtection() {
    const eurlWageElement = document.getElementById('eurl-comparison-wage');
    const sasuWageElement = document.getElementById('sasu-comparison-wage');
    const eiWageElement = document.getElementById('ei-comparison-wages');
    const microWageElement = document.getElementById('micro-comparison-wage');

    const eurlRemuneration = parseInt(eurlWageElement.textContent.replace(/\s+/g, ""));
    const sasuRemuneration = parseInt(sasuWageElement.textContent.replace(/\s+/g, ""));
    const eiRemuneration = parseInt(eiWageElement.textContent.replace(/\s+/g, ""));
    const microRemuneration = parseInt(microWageElement.textContent.replace(/\s+/g, ""));

    const remunerationCategories = [
        { id: 'eurl', wage: eurlRemuneration, thresholds: [
            { min: 0, max: 20000, social: 'Mauvaise', retirement: 'Mauvaise', color: '#ff2b44' },
            { min: 20000, max: 50000, social: 'Moyenne', retirement: 'Moyenne', color: '#ffb13c' },
            { min: 50000, max: Infinity, social: 'Bonne', retirement: 'Bonne', color: '#6fcf97' }
        ]},
        { id: 'sasu', wage: sasuRemuneration, thresholds: [
            { min: 0, max: 25000, social: 'Moyenne', retirement: 'Mauvaise', color: '#ffb13c' },
            { min: 25000, max: 50000, social: 'Bonne', retirement: 'Moyenne', color: '#6fcf97' },
            { min: 50000, max: Infinity, social: 'Bonne', retirement: 'Bonne', color: '#6fcf97' }
        ], additionalUnemployment: { min: 20000, status: 'Moyenne', color: '#ffb13c' }},
        { id: 'ei', wage: eiRemuneration, thresholds: [
            { min: 0, max: 20000, social: 'Mauvaise', retirement: 'Mauvaise', color: '#ff2b44' },
            { min: 20000, max: 40000, social: 'Moyenne', retirement: 'Moyenne', color: '#ffb13c' },
            { min: 40000, max: Infinity, social: 'Bonne', retirement: 'Bonne', color: '#6fcf97' }
        ]},
        { id: 'micro', wage: microRemuneration, thresholds: [
            { min: 0, max: 15000, social: 'Mauvaise', retirement: 'Mauvaise', color: '#ff2b44' },
            { min: 15000, max: Infinity, social: 'Moyenne', retirement: 'Moyenne', color: '#ffb13c' }
        ]}
    ];

    remunerationCategories.forEach(category => {
        const matchedThreshold = category.thresholds.find(threshold => category.wage >= threshold.min && category.wage < threshold.max);
        if (matchedThreshold) {
            fillSameClassTextRecapProtection(`${category.id}_social_security`, matchedThreshold.social, matchedThreshold.color);
            fillSameClassTextRecapProtection(`${category.id}_comparison_retirement`, matchedThreshold.retirement, matchedThreshold.color);
        }

        if (category.id === 'sasu') {
            const unemploymentStatus = category.wage < category.additionalUnemployment.min ? 'Mauvaise' : category.additionalUnemployment.status;
            const unemploymentColor = category.wage < category.additionalUnemployment.min ? '#ff2b44' : category.additionalUnemployment.color;
            fillSameClassTextRecapProtection('sasu_unemployment', unemploymentStatus, unemploymentColor);
        }
    });
}


export { retirementText, fillText, fillSameClassTexts, yearFillText };