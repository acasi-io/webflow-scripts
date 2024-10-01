import Engine from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/5.4.9-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/5.4.9-remuneration-independants/node_modules/modele-social/dist/index.js';

import { calculEurl } from './eurl.js';
import { microConditions, microResult, fillTextForMicro, microCalculRetraite } from './micro.js';
import { eiResult, eiCalculRetraite } from './ei.js';
import { sasuResult, fillSasuDividendsRecap, sasuCalculRetraite } from './sasu.js';

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

        calculEurl(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        sasuResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome);
        eiResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);
        microResult(turnoverMinusCost, situationValue, numberOfChildValue, householdIncome, singleParent);

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