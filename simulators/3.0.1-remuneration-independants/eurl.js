import Engine from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/3.0.1-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/3.0.1-remuneration-independants/node_modules/modele-social/dist/index.js';

import { retirementText, fillText } from './script.js';

const engine = new Engine(rules);

function eurlContributionsSituation(wageEurl) {
    engine.setSituation({
        "entreprise . imposition": "'IS'",
        "entreprise . associés": "'unique'",
        "entreprise . catégorie juridique": "'SARL'",
        "dirigeant . rémunération . net": wageEurl
    });
}

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

function calculIs(turnoverMinusCost, remuneration, cotisationsAmount) {
    let totalForIs = turnoverMinusCost - remuneration - cotisationsAmount;
    let eurlDividendsBrut;
    if (totalForIs <= 42500) {
        eurlDividendsBrut = Math.round(totalForIs - (totalForIs * 0.15));
    } else {
        eurlDividendsBrut = Math.round(totalForIs - ((42500 * 0.15) + ((totalForIs - 42500) * 0.25 )));
    }
    
    return eurlDividendsBrut;
}

function calculDividendsPfu(turnoverMinusCost, remuneration, cotisationsAmount) {
    let eurlDividendsBrut = calculIs(turnoverMinusCost, remuneration, cotisationsAmount);

    let shareCapital = parseInt(document.getElementById('share-capital').value);
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
        eurlDividendsPfu = Math.round(eurlDividendsBrut - ((tenPercentShareCapital * 0.3) + ((eurlDividendsBrut - tenPercentShareCapital) * 0.128)));
    }

    return {
        cotisationsTotalAmount: cotisationsAmount,
        eurlDividendsPfu: eurlDividendsPfu
    };
}

function calculDividendsBareme(singleParent, numberOfChild, householdIncome, situation, eurlDividendsBrut) {
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

    return eurlDividendsBaremeAmount
}

function compareBestDividends(eurlDividendsPfu, eurlDividendsBaremeAmount) {
    let bestDividends
    if (eurlDividendsPfu > eurlDividendsBaremeAmount) {
        bestDividends = eurlDividendsPfu;
    } else {
        bestDividends = eurlDividendsBaremeAmount;
    }

    return bestDividends;
}

function createObjectForResult(pourcentage, cotisationsTotalAmount, remuneration, remunerationAfterTaxAmount, bestDividends, eurlDividendsBrut, eurlDividendsPfu, eurlDividendsBaremeAmount, total) {
    let bestResult = {
        pourcentage: pourcentage,
        cotisations: cotisationsTotalAmount,
        remuneration: remuneration,
        remunerationAfterTax: remunerationAfterTaxAmount,
        bestDividends: bestDividends,
        grossDividends: eurlDividendsBrut,
        pfuDividends: eurlDividendsPfu,
        baremeDividends: eurlDividendsBaremeAmount,
        total: total
    };

    return bestResult;
}

function comparerRemunerations(maxWage, turnoverMinusCost, singleParent, numberOfChild, householdIncome, situation) {
    let bestResult = createObjectForResult(0, 0, 0, 0, 0, 0, 0, 0, 0);

    let eurlArray = [];

    for (let pourcentage = 5; pourcentage <= 100; pourcentage += 5) {
        let remuneration = Math.round(maxWage * (pourcentage / 100));
        eurlContributionsSituation(remuneration);
        fillCotisationsText();

        let remunerationAfterTaxUrssaf = engine.evaluate("dirigeant . rémunération . net . après impôt");
        let remunerationAfterTaxAmount = Math.round(remunerationAfterTaxUrssaf.nodeValue);
        let cotisationsUrssaf = engine.evaluate("dirigeant . indépendant . cotisations et contributions");
        let cotisationsAmount = Math.round(cotisationsUrssaf.nodeValue);

        let eurlDividendsBrut = calculIs(turnoverMinusCost, remuneration, cotisationsAmount);
        let { cotisationsTotalAmount, eurlDividendsPfu } = calculDividendsPfu(turnoverMinusCost, remuneration, cotisationsAmount);
        let eurlDividendsBaremeAmount = calculDividendsBareme(singleParent, numberOfChild, householdIncome, situation, eurlDividendsBrut);
        let bestDividends = compareBestDividends(eurlDividendsPfu, eurlDividendsBaremeAmount);

        let total = remunerationAfterTaxAmount + bestDividends;

        let resultArray = createObjectForResult(pourcentage, cotisationsTotalAmount, remuneration, remunerationAfterTaxAmount, bestDividends, eurlDividendsBrut, eurlDividendsPfu, eurlDividendsBaremeAmount, total);
        eurlArray.push(resultArray);

        if (total > bestResult.total) {
            bestResult = createObjectForResult(pourcentage, cotisationsTotalAmount, remuneration, remunerationAfterTaxAmount, bestDividends, eurlDividendsBrut, eurlDividendsPfu, eurlDividendsBaremeAmount, total);
        }
    }

    localStorage.setItem('eurlArray', JSON.stringify(eurlArray));
    return bestResult;
}

function fillCotisationsText() {
    fillText("dirigeant . indépendant . cotisations et contributions . maladie", `#eurl-disease`);
    fillText("dirigeant . indépendant . cotisations et contributions . retraite de base", `#eurl-base-retirement`);
    fillText("dirigeant . indépendant . cotisations et contributions . retraite complémentaire", `#eurl-additional-retirement`);
    fillText("dirigeant . indépendant . cotisations et contributions . indemnités journalières maladie", `#eurl-disease-allowance`);
    fillText("dirigeant . indépendant . cotisations et contributions . invalidité et décès", `#eurl-disability`);
    fillText("dirigeant . indépendant . cotisations et contributions . CSG-CRDS", `#eurl-csg`);
    fillText("dirigeant . indépendant . cotisations et contributions . formation professionnelle", `#eurl-formation`);
}

function calculMaxWage(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    eurlSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent, 'IS');
    const maxWageUrssaf = engine.evaluate("dirigeant . rémunération . net");
    let maxWage = Math.round(maxWageUrssaf.nodeValue);

    return maxWage;
}

function fillTextEurl(resultat) {
    let eurlContributionsTotalText = document.getElementById('eurl-contributions-total');
    eurlContributionsTotalText.textContent = (resultat.cotisations).toLocaleString('fr-FR') + '€';
    let eurlGrossDividendsText = document.getElementById('eurl-gross-dividends');
    eurlGrossDividendsText.textContent = (resultat.grossDividends).toLocaleString('fr-FR') + '€';
    let eurlPfuDividendsText = document.getElementById('eurl-pfu-dividends');
    eurlPfuDividendsText.textContent = (resultat.pfuDividends).toLocaleString('fr-FR') + '€';
    let eurlProgressiveDividendsText = document.getElementById('eurl-progressive-dividends');
    eurlProgressiveDividendsText.textContent = (resultat.baremeDividends).toLocaleString('fr-FR') + '€';

    let remunerationBeforeTaxText = document.querySelectorAll('.is_eurlis_before_tax');
    remunerationBeforeTaxText.forEach(element => {
        element.textContent = (resultat.remuneration).toLocaleString('fr-FR') + '€'; 
    });

    let remunerationAfterTaxText = document.querySelectorAll('.is_eurlis_after_tax');
    remunerationAfterTaxText.forEach(element => {
        element.textContent = (resultat.remunerationAfterTax).toLocaleString('fr-FR') + '€';
    });
}

function eurlRetirement() {
    retirementText('eurl-gain-trimester', 'eurl-pension-scheme', 'eurl-retirement-points');
}

function calculEurl(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    let maxWage = calculMaxWage(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent);

    let resultat = comparerRemunerations(maxWage, turnoverMinusCost, singleParent, numberOfChild, householdIncome, situation);

    fillTextEurl(resultat);
    eurlRetirement();
}

export { calculEurl };
