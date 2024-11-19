import Engine from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/6.3.7-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/6.3.7-remuneration-independants/node_modules/modele-social/dist/index.js';

import { halfPass, fifthPass } from './script.js';

const engine = new Engine(rules);


function fillText(urssafData, htmlTag) {
    const dataUrssaf = engine.evaluate(urssafData);
    let data = Math.round(dataUrssaf.nodeValue);
    if (isNaN(data)) {
        data = 0;
    }
    document.querySelector(htmlTag).textContent = data.toLocaleString('fr-FR') + '€';
}

function retirementText() {
    const gainTrimester = engine.evaluate("protection sociale . retraite . trimestres");
    document.getElementById('gain-trimester').textContent = gainTrimester.nodeValue;

    const pensionScheme = engine.evaluate("protection sociale . retraite . base");
    let pensionSchemeAmount = Math.round(pensionScheme.nodeValue * 12);
    if (isNaN(pensionSchemeAmount)) {
        pensionSchemeAmount = 0;
    }
    document.getElementById('pension-scheme').textContent = `${pensionSchemeAmount.toLocaleString('fr-FR')}€`;

    const retirementPoints = engine.evaluate("protection sociale . retraite . complémentaire . RCI . points acquis");
    document.getElementById('retirement-points').textContent = retirementPoints.nodeValue;

    // eurl-comparison-wagfillText("protection sociale . retraite", "#retirement-amount");
}



function eurlContributionsSituation(wageEurl) {
    engine.setSituation({
        "entreprise . imposition": "'IS'",
        "entreprise . associés": "'unique'",
        "entreprise . catégorie juridique": "'SARL'",
        "dirigeant . rémunération . net": wageEurl
    });
}

function eurlSituation(turnoverMinusCost, situation, numberOfChild, singleParent, tax) {
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

    let shareCapital = 1500;
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

    localStorage.setItem('eurlPfuDividends', eurlDividendsPfu);

    return {
        cotisationsTotalAmount: cotisationsAmount,
        eurlDividendsPfu: eurlDividendsPfu
    };
}

function calculDividendsBareme(numberOfChild, householdIncome, situation, eurlDividendsBrut, singleParent) {
    let eurlDividendsBaremeUrssaf = engine.setSituation({
        "impôt . foyer fiscal . parent isolé": `${singleParent}`,
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
    localStorage.setItem('eurlProgressiveDividends', eurlDividendsBaremeAmount);

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
        // retirementAmount: retirementAmount,
        total: total
    };

    return bestResult;
}

function comparerRemunerations(maxWage, turnoverMinusCost, numberOfChild, householdIncome, situation, singleParent) {
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

        // let retirementAmountUrssaf = engine.evaluate("protection sociale . retraite");
        // let retirementAmount = Math.round(retirementAmountUrssaf.nodeValue);

        let eurlDividendsBrut = calculIs(turnoverMinusCost, remuneration, cotisationsAmount);
        let { cotisationsTotalAmount, eurlDividendsPfu } = calculDividendsPfu(turnoverMinusCost, remuneration, cotisationsAmount);
        localStorage.setItem('eurlCotisationsTotal', cotisationsTotalAmount);
        let eurlDividendsBaremeAmount = calculDividendsBareme(numberOfChild, householdIncome, situation, eurlDividendsBrut, singleParent);
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
    fillText("dirigeant . indépendant . cotisations et contributions . cotisations", "#contributions-eurl-ei-cotisations-total")
    fillText("dirigeant . indépendant . cotisations et contributions . maladie", `#contributions-eurl-ei-disease`);
    fillText("dirigeant . indépendant . cotisations et contributions . retraite de base", `#contributions-eurl-ei-base-retirement`);
    fillText("dirigeant . indépendant . cotisations et contributions . retraite complémentaire", `#contributions-eurl-ei-additional-retirement`);
    fillText("dirigeant . indépendant . cotisations et contributions . indemnités journalières maladie", `#contributions-eurl-ei-disease-allowance`);
    fillText("dirigeant . indépendant . cotisations et contributions . invalidité et décès", `#contributions-eurl-ei-disability`);
    fillText("dirigeant . indépendant . cotisations et contributions . CSG-CRDS", `#contributions-eurl-ei-csg`);
    fillText("dirigeant . indépendant . cotisations et contributions . formation professionnelle", `#contributions-eurl-ei-formation`);
}

function calculMaxWage(turnoverMinusCost, situation, numberOfChild, singleParent) {
    eurlSituation(turnoverMinusCost, situation, numberOfChild, singleParent, 'IS');
    const maxWageUrssaf = engine.evaluate("dirigeant . rémunération . net");
    let maxWage = Math.round(maxWageUrssaf.nodeValue);

    return maxWage;
}

function fillTextEurl(resultat) {
    let eurlContributionsTotalText = document.getElementById('contributions-total');
    eurlContributionsTotalText.textContent = (resultat.cotisations).toLocaleString('fr-FR') + '€';

    let eurlGrossDividendsText = document.getElementById('gross-dividends');
    eurlGrossDividendsText.textContent = (resultat.grossDividends).toLocaleString('fr-FR') + '€';
    localStorage.setItem('eurlGrossDividends', resultat.grossDividends);

    let eurlPfuDividendsText = document.getElementById('pfu-dividends');
    eurlPfuDividendsText.textContent = (resultat.pfuDividends).toLocaleString('fr-FR') + '€';

    let eurlProgressiveDividendsText = document.getElementById('progressive-dividends');
    eurlProgressiveDividendsText.textContent = (resultat.baremeDividends).toLocaleString('fr-FR') + '€';

    document.getElementById('before-tax').textContent = (resultat.remuneration).toLocaleString('fr-FR') + '€';
    document.getElementById('after-tax').textContent = (resultat.remunerationAfterTax).toLocaleString('fr-FR') + '€';

    localStorage.setItem('eurlAfterTax', resultat.remunerationAfterTax);
}

function eurlRetirement(remuneration) {
    eurlContributionsSituation(remuneration);
    retirementText();
}

/*function calculPumaTax() {
    let eurlAfterTax = parseInt(localStorage.getItem('eurlAfterTax'));
    let grossDividends = parseInt(localStorage.getItem('eurlGrossDividends'));

    let pumaTaxAmount = (0.065 * (grossDividends - halfPass) * (1 - (eurlAfterTax / fifthPass)));

    if (pumaTaxAmount <= 0) {
        document.getElementById('eurl-puma').textContent = '0€';
    } else {
        document.getElementById('eurl-puma').textContent = pumaTaxAmount.toLocaleString('fr-FR') + '€';
    }
}*/

function storageEurlTotal(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    let maxWage = calculMaxWage(turnoverMinusCost, situation, numberOfChild, singleParent);

    let resultat = comparerRemunerations(maxWage, turnoverMinusCost, numberOfChild, householdIncome, situation, singleParent);

    localStorage.setItem('eurlTotal', resultat.total);
    localStorage.setItem('bestEurlDividends', resultat.bestDividends);
    localStorage.setItem('eurlAfterTax', resultat.remunerationAfterTax);
    localStorage.setItem('eurlContributionsTotal', resultat.cotisations);
    // localStorage.setItem('eurlRetirementAmount', resultat.retirementAmount);
}

function calculEurl(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    let maxWage = calculMaxWage(turnoverMinusCost, situation, numberOfChild, singleParent);

    let resultat = comparerRemunerations(maxWage, turnoverMinusCost, numberOfChild, householdIncome, situation, singleParent);

    fillTextEurl(resultat);
    eurlRetirement(resultat.remuneration);
    // calculPumaTax();
}

function fillEurlComparison() {
    const dividends = parseInt(localStorage.getItem('bestEurlDividends'));
    const remuneration = parseInt(localStorage.getItem('eurlAfterTax'));
    const contributions = parseInt(localStorage.getItem('eurlContributionsTotal'));
    // const retirementAmount = parseInt(localStorage.getItem('eurlRetirementAmount'));

    // document.getElementById('eurl-comparison-wage').textContent = remuneration.toLocaleString('fr-FR');
    document.querySelectorAll('.eurl_comparison_wage').forEach((element) => {
        element.textContent = remuneration.toLocaleString('fr-FR');
    });
    document.querySelectorAll('.eurl_comparison_dividends').forEach((element) => {
        element.textContent = dividends.toLocaleString('fr-FR');
    });
    document.querySelectorAll('.eurl_comparison_contributions').forEach((element) => {
        element.textContent = contributions.toLocaleString('fr-FR');
    });
    // document.getElementById('eurl-comparison-dividends').textContent = dividends.toLocaleString('fr-FR');
    // document.getElementById('eurl-comparison-contributions').textContent = contributions.toLocaleString('fr-FR');
    // document.getElementById('eurl-comparison-retirement').textContent = retirementAmount.toLocaleString('fr-FR');
}


export { calculEurl, storageEurlTotal, fillEurlComparison };