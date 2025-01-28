const socialForm = document.getElementById('social-form');
const socialFormAdvantages = document.getElementById('social-form-advantages');
const socialFormTaxLawOptimisation = document.getElementById('social-form-tax-law-optimisation');
const shareholderCurrentAccount = document.getElementById('current-shareholder-account');
const shareholderAccountInterests = document.getElementById('shareholder-account-interest');
const shareholderAccountCompatible = document.getElementById('shareholder-account-compatible');

addInputListener(socialForm, calculLegal);
addInputListener(socialFormAdvantages, calculLegal);
addInputListener(socialFormTaxLawOptimisation, calculLegal);
addInputListener(shareholderCurrentAccount, calculLegal);
addInputListener(shareholderAccountInterests, calculLegal);
addInputListener(shareholderAccountCompatible, calculLegal);

function addInputListener(input, calculFunction) {
    input.addEventListener('input', () => calculFunction());
}

function calculThreeAnswers(question, legalResult) {
    if (question === 'oui') {
        return legalResult + 5;
    } else if (question === 'bof') {
        return legalResult + 3;
    } else if (question === 'non') {
        return legalResult + 0;
    }
    return legalResult;
}

/* LEGAL */
function calculLegal() {
    let numberOfQuestion = 6;
    let maxResultPossible = numberOfQuestion * 5;
    let legalResult = 0;

    const socialForm = document.getElementById('social-form')?.value || '';
    const socialFormAdvantages = document.getElementById('social-form-advantages')?.value || '';
    const socialFormTaxLawOptimisation = document.getElementById('social-form-tax-law-optimisation')?.value || '';

    const shareholderCurrentAccount = document.getElementById('current-shareholder-account')?.value || '';
    const shareholderAccountInterests = document.getElementById('shareholder-account-interest')?.value || '';
    const shareholderAccountCompatible = document.getElementById('shareholder-account-compatible')?.value || '';

    if (socialForm === 'eurl' || socialForm === 'sasu') {
        legalResult = 5;
    } else if (socialForm === 'ei' || socialForm === 'micro') {
        legalResult = 3;
    }

    legalResult = legalResult;
    legalResult = calculThreeAnswers(socialFormAdvantages, legalResult);
    legalResult = calculThreeAnswers(socialFormTaxLawOptimisation, legalResult);
    legalResult = calculThreeAnswers(shareholderCurrentAccount, legalResult);
    legalResult = calculThreeAnswers(shareholderAccountInterests, legalResult);
    legalResult = calculThreeAnswers(shareholderAccountCompatible, legalResult);

    const legalOptimisation = (legalResult / maxResultPossible) * 100;

    document.getElementById('legal-result').textContent = Math.round(legalOptimisation) + '%';
}

document.getElementById('next-btn').addEventListener('click', () => {
    document.getElementById('legal-form').classList.add('hide');
    document.getElementById('cost-form').classList.remove('hide');
});