import Engine from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/5.1.2-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/5.1.2-remuneration-independants/node_modules/modele-social/dist/index.js';

const engine = new Engine(rules);


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

function microRetirement() {
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
}



function microConditions(turnover) {
    // const microRecap = document.querySelectorAll('.is_micro_recap');
    const microContributions = document.querySelector('.is_micro_contributions');
    // const microRecapContainer = document.querySelectorAll('.simulator_recap_item.is-micro');

    /*microRecapContainer.forEach((item) => {
        item.style.display = 'none';
    });*/

    document.querySelectorAll('.simulator_micro_hidden').forEach(element => {
        element.style.display = 'none';
    });
    microContributions.style.display = 'none';

    /*microRecap.forEach(element => {
        element.style.display = 'none';
    });*/

    if (turnover <= 50000) {
        /*microRecapContainer.forEach((item) => {
            item.style.display = 'block';
        });*/

        document.querySelectorAll('.simulator_micro_hidden').forEach(element => {
            element.style.display = 'block';
        });

        microContributions.style.display = 'flex';
        /*microRecap.forEach(element => {
            element.style.display = 'block';
        });*/
    }
}

function storageMicroTotal(turnoverMinusCost, situation, numberOfChild, householdIncome, singleParent) {
    microSituation(turnoverMinusCost, situation, numberOfChild, householdIncome, 'non', singleParent);

    const microAfterTaxIsUrssaf = engine.evaluate("dirigeant . auto-entrepreneur . revenu net . après impôt");
    const microAfterTaxIsAmount = Math.round(microAfterTaxIsUrssaf.nodeValue);
    localStorage.setItem('microTotal', microAfterTaxIsAmount);
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
    fillText("dirigeant . auto-entrepreneur . revenu net", '#before-tax');
    fillText("dirigeant . auto-entrepreneur . revenu net . après impôt", '#after-tax');
}

function microContributions() {
    yearFillText("dirigeant . auto-entrepreneur . cotisations et contributions", '#contributions-total');
    fillText("dirigeant . auto-entrepreneur . cotisations et contributions . cotisations", '#contributions-micro-contributions');
    yearFillText("dirigeant . auto-entrepreneur . cotisations et contributions . TFC", '#contributions-micro-room-tax');
    yearFillText("dirigeant . auto-entrepreneur . cotisations et contributions . CFP", '#contributions-micro-formation');
}

function fillTextForMicro(turnover) {
    const microTextRecap = document.getElementById('micro-text-recap');
    if (turnover > 50000) {
        microTextRecap.textContent = "Le plafond à ne pas dépasser est de 77 700€. Si vous dépassez ce plafond, sachez que vous pouvez conserver ce statut pendant deux années supplémentaires à la suite desquelles vous basculerez automatiquement en EI si votre chiffre d'affaires est toujours supérieur au plafond. Notre simulateur propose la micro-entreprise pour tout chiffre d'affaires ne dépassant pas 50 000€ pour anticiper la limite et offrir une marge de sécurité."
    }
}

function microCalculRetraite(turnover) {
    engine.setSituation({
        "salarié": "non",
        "entreprise . activités . revenus mixtes": "non",
        "entreprise . catégorie juridique": "'EI'",
        "entreprise . chiffre d'affaires": turnover,
        "entreprise . catégorie juridique . EI . auto-entrepreneur": "oui"
    });

    let basicRetirementUrssaf = engine.evaluate("protection sociale . retraite . base");
    let basicRetirementAmount = Math.round(basicRetirementUrssaf.nodeValue * 12);
    let complementaryRetirementUrssaf = engine.evaluate("protection sociale . retraite . complémentaire");
    let complementaryRetirementAmount = Math.round(complementaryRetirementUrssaf.nodeValue);
    let totalRetirement = basicRetirementAmount + complementaryRetirementAmount;

    return totalRetirement;
}


export { microConditions, microResult, fillTextForMicro, microCalculRetraite, storageMicroTotal };