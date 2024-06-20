import Engine from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/3.0.9-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/3.0.9-remuneration-independants/node_modules/modele-social/dist/index.js';

import { retirementText, fillText, fillSameClassTexts, yearFillText } from './script.js';

const engine = new Engine(rules);

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

function microResult(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    microSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non', singleParent);

    microRemuneration();
    microContributions();
    microRetirement();
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
    const netBeforeTaxUrssaf = engine.evaluate("dirigeant . auto-entrepreneur . revenu net");
    let netBeforeTax = netBeforeTaxUrssaf.nodeValue;
    if (isNaN(netBeforeTax)) {
        netBeforeTax = 0;
    }
    document.querySelectorAll(".is_micro_before_tax").forEach(element => {
        element.textContent = netBeforeTax.toLocaleString('fr-FR') + '€';
    });

    const netAfterTaxUrssaf = engine.evaluate("dirigeant . auto-entrepreneur . revenu net . après impôt");
    let netAfterTax = netAfterTaxUrssaf.nodeValue;
    if (isNaN(netAfterTax)) {
        netAfterTax = 0;
    }
    document.querySelectorAll(".is_micro_after_tax").forEach(element => {
        element.textContent = netAfterTax.toLocaleString('fr-FR') + '€';
    });
    // fillSameClassTexts("dirigeant . auto-entrepreneur . revenu net", '.is_micro_before_tax');
    // fillSameClassTexts("dirigeant . auto-entrepreneur . revenu net . après impôt", '.is_micro_after_tax');
}

function microContributions() {
    let contributionsTotalUrssaf = engine.evaluate("dirigeant . auto-entrepreneur . cotisations et contributions");
    document.getElementById("micro-contributions-total").textContent = (Math.round((contributionsTotalUrssaf.nodeValue) * 12)).toLocaleString('fr-FR') + '€';
    let contributionsUrssaf = engine.evaluate("dirigeant . auto-entrepreneur . cotisations et contributions . cotisations");
    document.getElementById("micro-contributions").textContent = (Math.round(contributionsUrssaf.nodeValue)).toLocaleString('fr-FR') + '€';
    let tfcUrssaf = engine.evaluate("dirigeant . auto-entrepreneur . cotisations et contributions . TFC");
    document.getElementById("micro-room-tax").textContent = (Math.round((tfcUrssaf.nodeValue) * 12)).toLocaleString('fr-FR') + '€';
    let cfpUrssaf = engine.evaluate("dirigeant . auto-entrepreneur . cotisations et contributions . CFP");
    document.getElementById("micro-formation").textContent = (Math.round((cfpUrssaf.nodeValue) * 12)).toLocaleString('fr-FR') + '€';
    // yearFillText("dirigeant . auto-entrepreneur . cotisations et contributions", '#micro-contributions-total');
    // fillText("dirigeant . auto-entrepreneur . cotisations et contributions . cotisations", '#micro-contributions');
    // yearFillText("dirigeant . auto-entrepreneur . cotisations et contributions . TFC", '#micro-room-tax');
    // yearFillText("dirigeant . auto-entrepreneur . cotisations et contributions . CFP", '#micro-formation');
}

function microRetirement() {
    retirementText('micro-gain-trimester', 'micro-pension-scheme', 'micro-retirement-points');
}


export { microConditions, microResult };