import Engine,{ formatValue } from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/6.1.3-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/6.1.3-remuneration-independants/node_modules/modele-social/dist/index.js';

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

        const turnoverMinusCost = turnover - cost;

        document.querySelectorAll('.comparison_ca').forEach((text) => {
            text.textContent = turnover + '€';
        });

        storageMicroTotal(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        fillMicroComparison(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);

        storageEiTotal(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        fillEiComparison(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);

        storageEurlTotal(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        fillEurlComparison();

        sasuResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        fillSasuComparison();

        checkUnemployment(turnoverMinusCost, turnover, numberOfChildValue, situationValue, householdIncome, singleParent);

        microConditions(turnover);

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

function compareResults(sasuTotal, eurlTotal, eiTotal, microTotal, turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent) {
    if (eurlTotal > eiTotal && eurlTotal > sasuTotal && eurlTotal > microTotal) {
        localStorage.setItem('bestSocialForm', 'eurl');
        localStorage.setItem('bestSocialFormForComponent', 'eurl_ei');
        calculEurl(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        resultRecapTitle.forEach((title) => {
            title.textContent = "EURL à l'Impôt sur les Sociétés";
        });
    } else if (sasuTotal > eurlTotal && sasuTotal > eiTotal && sasuTotal > microTotal) {
        localStorage.setItem('bestSocialForm', 'sasu');
        localStorage.setItem('bestSocialFormForComponent', 'sasu');
        resultRecapTitle.forEach((title) => {
            title.textContent = "SASU à l'Impôt sur les Sociétés";
        });
    } else if (microTotal > eurlTotal && microTotal > eiTotal && microTotal > sasuTotal) {
        localStorage.setItem('bestSocialForm', 'micro');
        localStorage.setItem('bestSocialFormForComponent', 'micro');
        microResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        resultRecapTitle.forEach((title) => {
            title.textContent = "MICRO";
        });
    } else if (eiTotal > eurlTotal && eiTotal > sasuTotal && eiTotal > microTotal) {
        localStorage.setItem('bestSocialForm', 'ei');
        localStorage.setItem('bestSocialFormForComponent', 'eurl_ei');
        eiResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        resultRecapTitle.forEach((title) => {
            title.textContent = "EI";
        });
    }
}

function fillRetireRecap(turnoverMinusCost, turnover) {
    let microRetirement = microCalculRetraite(turnover);
    document.getElementById('micro-retire-recap').textContent = microRetirement.toLocaleString('fr-FR') + '€';

    let eiRetirement = eiCalculRetraite(turnover);
    document.getElementById('ei-retire-recap').textContent = eiRetirement.toLocaleString('fr-FR') + '€';
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

    microConditions(turnover);

    const microFinalAmount = parseInt(localStorage.getItem('microTotal'));

    const eurlFinalAmount = parseInt(localStorage.getItem('eurlTotal'));
    const eurlDividends = parseInt(localStorage.getItem('bestEurlDividends'));
    const eurlRemuneration = parseInt(localStorage.getItem('eurlAfterTax'));

    const eiFinalAmount = parseInt(localStorage.getItem('eiTotal'));

    const sasuArray = JSON.parse(localStorage.getItem('arraySasu'));
    const bestSasuTotal = Math.max(...sasuArray.map(obj => obj.remunerationPlusDividendsBestAmount));
    const bestSasuObject = sasuArray.find(obj => obj.remunerationPlusDividendsBestAmount === bestSasuTotal);

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

    if (bestSocialForm === 'eurl') {
        bestTotalWage = eurlFinalAmount;
        bestWage = eurlRemuneration;
        bestDividends = eurlDividends;
        comparisonTitle.textContent = 'EURL';
        explanationText.textContent = "L'EURL est une SARL à associé unique, offrant une protection du patrimoine personnel et une grande flexibilité. Les principaux avantages incluent la protection du patrimoine personnel, la flexibilité dans l'organisation, la liberté de fixation du capital, et la transition automatique vers une SARL en cas d'arrivée de nouveaux associés.";
        attentionText.textContent = "L’EURL à l’IS offre une fiscalité avantageuse, mais attention à la gestion des dividendes, soumis à cotisations sociales. En tant que gérant TNS, vous bénéficiez de charges sociales réduites, mais d'une couverture sociale et retraite moins favorable. La responsabilité est limitée sauf en cas de garanties personnelles, et des formalités comptables rigoureuses sont nécessaires pour rester conforme.";
    } else if (bestSocialForm === 'sasu') {
        bestTotalWage = sasuFinalAmount;
        bestWage = sasuRemuneration;
        bestDividends = sasuDividends;
        comparisonTitle.textContent = 'SASU';
        explanationText.textContent = "La SASU est une forme juridique de société par actions simplifiée avec un seul associé. Les principaux avantages incluent la protection du patrimoine personnel, la flexibilité dans l'organisation, la liberté de fixation du capital, la possibilité de transition vers une structure pluripersonnelle sans formalités complexes et l’absences de cotisations sociales sur les dividendes.";
        attentionText.textContent = "La SASU offre souplesse et l'absence de cotisations sociales sur les dividendes, mais certains aspects sont à surveiller. En tant que président assimilé salarié, vous relevez du régime général, avec des charges sociales plus élevées mais une meilleure couverture sociale et retraite. Vous pouvez choisir de vous verser plus de dividendes pour réduire ces charges, mais cela diminue votre protection sociale, notamment en matière de retraite. Enfin, la gestion administrative reste rigoureuse et la responsabilité limitée, sauf en cas de garanties personnelles.";
    } else if (bestSocialForm === 'micro') {
        bestTotalWage = microFinalAmount;
        bestWage = microFinalAmount;
        bestDividends = '0';
        comparisonTitle.textContent = 'Micro';
        explanationText.textContent = "La micro-entreprise est simple à créer et à gérer, avec un régime fiscal et social allégé. Les cotisations sont calculées sur le chiffre d’affaires, et la TVA peut être exonérée sous certains seuils. De plus, les formalités comptables sont réduites, ce qui en fait un statut idéal pour démarrer une activité sans lourdes contraintes administratives.";
        attentionText.textContent = "Les plafonds de chiffre d’affaires limitent la croissance et obligent à changer de statut en cas de dépassement. La couverture sociale et retraite est moindre, et l’absence de séparation entre patrimoine personnel et professionnel expose l'entrepreneur à un risque financier en cas de difficultés.";
    } else {
        bestTotalWage = eiFinalAmount;
        bestWage = eiFinalAmount;
        bestDividends = '0';
        comparisonTitle.textContent = 'EI';
        explanationText.textContent = "L'entreprise individuelle permet à un entrepreneur de démarrer une activité sans créer une entité juridique distincte. La responsabilité est limitée au patrimoine professionnel, offrant une protection des biens personnels sans formalités. L'entrepreneur peut librement apporter des fonds et gérer la trésorerie. L'imposition est basée sur le bénéfice réalisé, avec des cotisations sociales en fonction des rémunérations.";
        attentionText.textContent = "Bien que l'EI simplifie la gestion, la responsabilité de l'entrepreneur peut être engagée en cas de dettes si le patrimoine professionnel n'est pas bien séparé. De plus, les cotisations sociales sont calculées sur le bénéfice, même si celui-ci est réinvesti dans l'activité, ce qui peut affecter la trésorerie. Enfin, la couverture sociale et retraite peut être moins avantageuse que dans d'autres statuts plus protecteurs.";
    }

    //orderResults(sasuFinalAmount, eurlFinalAmount, eiFinalAmount, microFinalAmount);
    orderBestRemuneration(sasuFinalAmount, eurlFinalAmount, eiFinalAmount, microFinalAmount);

    updateTextOrder(eurlFinalAmount, sasuFinalAmount, eiFinalAmount, microFinalAmount);

    console.log(sasuFinalAmount);
    console.log(eurlFinalAmount);
    console.log(eiFinalAmount);
    console.log(microFinalAmount);

    const contributionsTotal = document.getElementById('contributions-total');
    document.getElementById('best-contributions').textContent = contributionsTotal.textContent;

    document.querySelector('.simulator_result_ca').textContent = turnover.toLocaleString('fr-FR');

    document.querySelector('.simulator_result_revenu').textContent = bestTotalWage.toLocaleString('fr-FR') + '€';
    document.getElementById('best-remuneration').textContent = bestWage.toLocaleString('fr-FR') + '€';

    document.getElementById('best-dividends').textContent = bestDividends.toLocaleString('fr-FR') + '€';
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

function orderBestRemuneration(sasuFinalAmount, eurlFinalAmount, eiFinalAmount, microFinalAmount, chiffreAffaires) {
    // Réinitialiser la simulation
    resetSimulation();

    // Étape 1 : Créer une liste des montants par forme sociale
    const remunerationValues = [
        { value: eurlFinalAmount, socialForm: 'EURL', elementId: 'eurl-comparison-component' },
        { value: sasuFinalAmount, socialForm: 'SASU', elementId: 'sasu-comparison-component' },
        { value: eiFinalAmount, socialForm: 'EI', elementId: 'ei-comparison-component' },
        { value: microFinalAmount, socialForm: 'MICRO', elementId: 'micro-comparison-component' }
    ];

    // Étape 2 : Masquer EURL et EI si le chiffre d'affaires est inférieur à 50 000 €
    if (chiffreAffaires < 50000) {
        remunerationValues.forEach(item => {
            if (item.socialForm === 'EURL' || item.socialForm === 'EI') {
                item.value = null; // On ne montre pas ces valeurs
                const elementToHide = document.querySelector(`[data-socialform="${item.socialForm}"]`);
                if (elementToHide) {
                    elementToHide.style.display = 'none'; // Masquer l'élément
                }
            }
        });
    }

    // Étape 3 : Filtrer les montants non nulles
    const filteredRemunerationValues = remunerationValues.filter(item => item.value !== null);

    // Étape 4 : Trier les montants par ordre décroissant
    filteredRemunerationValues.sort((a, b) => b.value - a.value);

    // Étape 5 : Réorganiser les divs du haut selon les montants triés
    const parentTop = document.querySelector('.simulator_comparison_grid_top');
    filteredRemunerationValues.forEach(item => {
        const div = document.getElementById(item.elementId);
        if (div) {
            parentTop.appendChild(div); // Réorganiser les divs
        }
    });

    // Étape 6 : Mettre à jour les montants directement dans les rectangles
    const rectangles = document.querySelectorAll('.comparison_result_block');
    filteredRemunerationValues.forEach((item, index) => {
        const targetRectangle = rectangles[index];
        const valueFormatted = item.value.toLocaleString('fr-FR') + '€';

        if (targetRectangle) {
            targetRectangle.style.display = 'block'; // S'assurer que le rectangle est visible
            targetRectangle.innerHTML = `<p class="comparison_grid_remuneration_text">${valueFormatted}</p>`; // Mettre à jour le contenu avec le texte formaté
        } else {
            console.warn(`Target rectangle not found for index ${index}`);
        }
    });
}

function updateTextOrder(eurlFinalAmount, sasuFinalAmount, eiFinalAmount, microFinalAmount) {
    // Liste des montants avec leurs éléments de texte associés
   /* const textBlocks = [
        { amount: eurlFinalAmount, id: 'text-green' },
        { amount: sasuFinalAmount, id: 'text-orange-large' },
        { amount: eiFinalAmount, id: 'text-orange-small' },
        { amount: microFinalAmount, id: 'text-red' }
    ];

    // Trier les textes par montant décroissant
    textBlocks.sort((a, b) => b.amount - a.amount);

    // Sélectionner le parent pour les blocs de texte
    const parentGrid = document.querySelector('.simulator_comparison_grid_mobile');

    // Réorganiser les blocs de texte en fonction des montants
    textBlocks.forEach((block, index) => {
        const textElement = document.getElementById(block.id);

        if (textElement) {
            // Déplacer chaque bloc de texte au bon endroit
            const correspondingBlock = textElement.closest('.comparison_block_mobile');
            parentGrid.appendChild(correspondingBlock);
        }
    });*/

    // Tableau pour gérer les montants avec les classes associées aux rectangles
    const comparisonData = [
    { id: 'eurl-rectangle', value: eurlFinalAmount, colorClass: 'rectangle-green' },
    { id: 'sasu-rectangle', value: sasuFinalAmount, colorClass: 'rectangle-orange' },
    { id: 'ei-rectangle', value: eiFinalAmount, colorClass: 'rectangle-blue' },
    { id: 'micro-rectangle', value: microFinalAmount, colorClass: 'rectangle-yellow' }
    ];

    // Mise à jour des montants dans le DOM pour chaque rectangle
    comparisonData.forEach(item => {
    const rectangle = document.getElementById(item.id);
    if (rectangle) {
        rectangle.textContent = item.value + '€';  // Mettre le montant dans le rectangle
    }
    });

    // Optionnel: si tu veux trier les rectangles en fonction des montants
    comparisonData.sort((a, b) => b.value - a.value); // Tri par montant décroissant

    comparisonData.forEach((item, index) => {
    const rectangle = document.getElementById(item.id);
    if (rectangle) {
        rectangle.style.order = index;  // Changer l'ordre si nécessaire
    }
    });
}




/*function orderResults(sasuFinalAmount, eurlFinalAmount, eiFinalAmount, microFinalAmount) {
    let results = [
        { id: "sasu-comparison-component", remuneration: sasuFinalAmount },
        { id: "eurl-comparison-component", remuneration: eurlFinalAmount },
        { id: "ei-comparison-component", remuneration: eiFinalAmount },
        { id: "micro-comparison-component", remuneration: microFinalAmount }
    ];

    results.sort((a, b) => b.remuneration - a.remuneration);

    for (let i = 0; i < results.length; i++) {
        let result = document.getElementById(results[i].id);
        result.style.gridColumn = i + 1; // Garder la colonne correcte

        // Mettre à jour le contenu de rémunération en fonction de l'ordre
        document.getElementById(`comparison_${i + 1}_best_remuneration`).textContent = results[i].remuneration;
    }
}*/

function microConditions(turnover) {
    if (turnover > 50000) {
        localStorage.setItem('microTotal', 0);
        document.querySelectorAll('.micro_comparison_wage').forEach((element) => {
            element.textContent = '0€';
        });
        document.querySelectorAll('.micro_comparison_tax').forEach((element) => {
            element.textContent = '0€';
        });
        document.querySelectorAll('.micro_comparison_contributions').forEach((element) => {
            element.textContent = '0€';
        });
        // document.getElementById('micro-comparison-wage').textContent = '0€';
        // document.getElementById('micro-comparison-contributions').textContent = '0€';
        // document.getElementById('micro-comparison-tax').textContent = '0€';
    }
}

function checkUnemployment(turnoverMinusCost, turnover, numberOfChildValue, situationValue, householdIncome, singleParent) {
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

        showBestSocialForm('sasu', 'sasu');
        fillBestChoiceText(turnover, situationValue, 'sasu');
        explanationText.textContent = "La SASU est une forme juridique de société par actions simplifiée avec un seul associé. Les principaux avantages incluent la protection du patrimoine personnel, la flexibilité dans l'organisation, la liberté de fixation du capital, la possibilité de transition vers une structure pluripersonnelle sans formalités complexes et l’absences de cotisations sociales sur les dividendes.";
        attentionText.textContent = "La SASU offre souplesse et l'absence de cotisations sociales sur les dividendes, mais certains aspects sont à surveiller. En tant que président assimilé salarié, vous relevez du régime général, avec des charges sociales plus élevées mais une meilleure couverture sociale et retraite. Vous pouvez choisir de vous verser plus de dividendes pour réduire ces charges, mais cela diminue votre protection sociale, notamment en matière de retraite. Enfin, la gestion administrative reste rigoureuse et la responsabilité limitée, sauf en cas de garanties personnelles.";
    } else {
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
    document.querySelector('.details_dividends_component').classList.add('hidden');

    document.querySelector(`.contributions_micro_grid`).classList.add('hidden');

    document.querySelector(`.contributions_eurl_ei_grid`).classList.add('hidden');

    document.querySelector(`.contributions_sasu_grid`).classList.add('hidden');

    document.querySelector(`.contributions_${bestSocialFormForComponent}_grid`).classList.remove('hidden');
    
    if (bestSocialForm === 'sasu' || bestSocialForm === 'eurl') {
        document.querySelector('.details_dividends_component').classList.remove('hidden');
    }
}


export { retirementText, fillText, fillSameClassTexts, yearFillText };