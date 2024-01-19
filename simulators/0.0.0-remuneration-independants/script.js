import Engine,{ formatValue } from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/0.0.0-remuneration-independants/node_modules/publicodes/dist/index.js';
import rules from 'https://cdn.jsdelivr.net/gh/acasi-io/webflow-scripts/simulators/0.0.0-remuneration-independants/node_modules/modele-social/dist/index.js';

const engine = new Engine(rules);

document.getElementById('calcul-btn').addEventListener('click', () => {
    const turnover = parseFloat(document.getElementById('turnover').value);
    const cost = parseFloat(document.getElementById('cost').value);
    const situation = document.getElementById('personal-situation').value;
    const numberOfChild = parseInt(document.getElementById('child').value);
    const householdIncome = parseFloat(document.getElementById('household-income').value);

    const turnoverMinusCost = turnover - cost;
    console.log(turnoverMinusCost);

    eurlSituation(turnoverMinusCost, situation, cost, numberOfChild, householdIncome, 'IS', 'non');
});


function eurlSituation(turnoverMinusCost, situation, cost, numberOfChild, householdIncome, tax, singleParent) {
    engine.setSituation({
        "dirigeant . rémunération . totale": turnoverMinusCost,
        "impôt . foyer fiscal . situation de famille": `'${situation}'`,
        "impôt . foyer fiscal . enfants à charge": parseInt(numberOfChild),
        "impôt . foyer fiscal . revenu imposable . autres revenus imposables": parseFloat(householdIncome),
        "entreprise . activité . nature": "'libérale'",
        "entreprise . imposition": `'${tax}'`,
        "entreprise . charges": cost,
        "impôt . foyer fiscal . parent isolé": `${singleParent}`,
        "entreprise . associés": "'unique'",
        "entreprise . catégorie juridique": "'SARL'",
        "impôt . méthode de calcul": "'barème standard'"
    });

    const net = engine.evaluate("dirigeant . rémunération . net");
    const eurlIsBefore = document.querySelectorAll('.is-eurl-before');
    eurlIsBefore.forEach(element => {
    	element.textContent = `${formatValue(net)}`;
    });
    
    const afterTax = engine.evaluate("dirigeant . rémunération . net . après impôt");
    const eurlIsAfter = document.querySelectorAll('.is-eurl-after');
    eurlIsAfter.forEach(element => {
    	element.textContent = `${formatValue(afterTax)}`;
    });
    
    const contributionsTotal = engine.evaluate("dirigeant . indépendant . cotisations et contributions");
    const eurlContributions = document.getElementById('eurl-contributions');
    eurlContributions.textContent = `${formatValue(contributionsTotal)}`;
}