const socialForm = document.getElementById('social-form');
const socialFormAdvantages = document.getElementById('social-form-advantages');
const socialFormTaxLawOptimisation = document.getElementById('social-form-tax-law-optimisation');
const shareholderCurrentAccount = document.getElementById('current-shareholder-account');
const shareholderAccountInterests = document.getElementById('shareholder-account-interest');
const shareholderAccountCompatible = document.getElementById('shareholder-account-compatible');

const kilometerCompensationScale = document.getElementById('kilometer-compensation-scale');
const kilometerCompensationCost = document.getElementById('kilometer-compensation-cost');
const kilometerCompensationMonitoring = document.getElementById('kilometer-compensation-monitoring');
const holidaysCheque = document.getElementById('holidays-cheque');
const holidaysChequeOpitmisation = document.getElementById('holidays-cheque-optimisation');
const workerMoneyVoucher = document.getElementById('worker-money-voucher');
const workerMoneyVouchereOpitmisation = document.getElementById('worker-money-voucher-optimisation');

const sharingWageDividends = document.getElementById('sharing-wage-dividends');
const rentProfessionalDomicile = document.getElementById('rent-professional-domicile');
const suitableWage = document.getElementById('suitable-wage');

const hasPer = document.getElementById('has-per');
const perDeductibleLimit = document.getElementById('per-deductible-limit');

const hasSci = document.getElementById('has-sci');
const hasHolding = document.getElementById('has-holding');

addInputListener(socialForm, calculLegal);
addInputListener(socialFormAdvantages, calculLegal);
addInputListener(socialFormTaxLawOptimisation, calculLegal);
addInputListener(shareholderCurrentAccount, calculLegal);
addInputListener(shareholderAccountInterests, calculLegal);
addInputListener(shareholderAccountCompatible, calculLegal);

addInputListener(kilometerCompensationScale, calculCost);
addInputListener(kilometerCompensationCost, calculCost);
addInputListener(kilometerCompensationMonitoring, calculCost);
addInputListener(holidaysCheque, calculCost);
addInputListener(holidaysChequeOpitmisation, calculCost);
addInputListener(workerMoneyVoucher, calculCost);
addInputListener(workerMoneyVouchereOpitmisation, calculCost);

addInputListener(sharingWageDividends, calculWage);
addInputListener(rentProfessionalDomicile, calculWage);
addInputListener(suitableWage, calculWage);

addInputListener(hasPer, calculTaxation);
addInputListener(perDeductibleLimit, calculTaxation);

addInputListener(hasSci, calculInvestment);
addInputListener(hasHolding, calculInvestment);


function addInputListener(input, calculFunction) {
    input.addEventListener('input', () => calculFunction());
}

function calculThreeAnswers(question, result) {
    if (question === 'oui') {
        return result + 5;
    } else if (question === 'bof') {
        return result + 3;
    } else if (question === 'non') {
        return result + 0;
    }
    return result;
}

function calculTwoAnswers(question, result) {
    if (question === 'oui') {
        return result + 5;
    } else if (question === 'non') {
        return result + 0;
    }
    return result;
}

/* LEGAL */

function calculLegal() {
    let numberOfQuestion = 6;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    const socialForm = document.getElementById('social-form')?.value || '';
    const socialFormAdvantages = document.getElementById('social-form-advantages')?.value || '';
    const socialFormTaxLawOptimisation = document.getElementById('social-form-tax-law-optimisation')?.value || '';
    const shareholderCurrentAccount = document.getElementById('current-shareholder-account')?.value || '';
    const shareholderAccountInterests = document.getElementById('shareholder-account-interest')?.value || '';
    const shareholderAccountCompatible = document.getElementById('shareholder-account-compatible')?.value || '';

    if (socialForm === 'eurl' || socialForm === 'sasu') {
        result = 5;
    } else if (socialForm === 'ei' || socialForm === 'micro') {
        result = 3;
    }

    result = result;
    result = calculThreeAnswers(socialFormAdvantages, result);
    result = calculThreeAnswers(socialFormTaxLawOptimisation, result);
    result = calculThreeAnswers(shareholderCurrentAccount, result);
    result = calculThreeAnswers(shareholderAccountInterests, result);
    result = calculThreeAnswers(shareholderAccountCompatible, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('legal-result').textContent = Math.round(resultOptimisation) + '%';
}


/* COST */

function calculCost() {
    let numberOfQuestion = 7;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    const kilometerCompensationScale = document.getElementById('kilometer-compensation-scale')?.value || '';
    const kilometerCompensationCost = document.getElementById('kilometer-compensation-cost')?.value || '';
    const kilometerCompensationMonitoring = document.getElementById('kilometer-compensation-monitoring')?.value || '';
    const holidaysCheque = document.getElementById('holidays-cheque')?.value || '';
    const holidaysChequeOpitmisation = document.getElementById('holidays-cheque-optimisation')?.value || '';
    const workerMoneyVoucher = document.getElementById('worker-money-voucher')?.value || '';
    const workerMoneyVouchereOpitmisation = document.getElementById('worker-money-voucher-optimisation')?.value || '';

    result = calculThreeAnswers(kilometerCompensationScale, result);
    result = calculThreeAnswers(kilometerCompensationCost, result);
    result = calculThreeAnswers(kilometerCompensationMonitoring, result);
    result = calculThreeAnswers(holidaysCheque, result);
    result = calculTwoAnswers(holidaysChequeOpitmisation, result);
    result = calculThreeAnswers(workerMoneyVoucher, result);
    result = calculTwoAnswers(workerMoneyVouchereOpitmisation, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('cost-result').textContent = Math.round(resultOptimisation) + '%';
}


/* WAGE */

function calculWage() {
    let numberOfQuestion = 3;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    const sharingWageDividends = document.getElementById('sharing-wage-dividends')?.value || '';
    const rentProfessionalDomicile = document.getElementById('rent-professional-domicile')?.value || '';
    const suitableWage = document.getElementById('suitable-wage')?.value || '';

    result = calculThreeAnswers(sharingWageDividends, result);
    result = calculThreeAnswers(rentProfessionalDomicile, result);
    result = calculThreeAnswers(suitableWage, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('wage-result').textContent = Math.round(resultOptimisation) + '%';
}


/* TAXATION */

function calculTaxation() {
    let numberOfQuestion = 2;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    const hasPer = document.getElementById('has-per')?.value || '';
    const perDeductibleLimit = document.getElementById('per-deductible-limit')?.value || '';

    result = calculThreeAnswers(hasPer, result);
    result = calculThreeAnswers(perDeductibleLimit, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('taxation-result').textContent = Math.round(resultOptimisation) + '%';
}

/* INVESTMENT */

function calculInvestment() {
    let numberOfQuestion = 2;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    const hasSci = document.getElementById('has-sci')?.value || '';
    const hasHolding = document.getElementById('has-holding')?.value || '';

    result = calculThreeAnswers(hasSci, result);
    result = calculThreeAnswers(hasHolding, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('investment-result').textContent = Math.round(resultOptimisation) + '%';
}


document.getElementById('next-btn').addEventListener('click', () => {
    const steps = Array.from(document.querySelectorAll('.form_step'));
    const activeStep = steps.find(step => !step.classList.contains('hide'));
    const currentStep = parseInt(activeStep.dataset.step);
    const nextStep = currentStep + 1;

    const nextStepElement = steps.find(step => parseInt(step.dataset.step) === nextStep);
    
    if (nextStepElement) {
        activeStep.classList.add('hide');
        nextStepElement.classList.remove('hide');
    }

    const categorySteps = Array.from(document.querySelectorAll('.simulator-optimisation_subject-wrapper'));
    const categoryActiveStep = categorySteps.find(step => step.classList.contains('is-current'));
    const categoryCurrentStep = parseInt(categoryActiveStep.dataset.step);
    const categoryNextStep = categoryCurrentStep + 1;

    const categoryNextStepElement = categorySteps.find(step => parseInt(step.dataset.step) === categoryNextStep);
    
    if (categoryNextStepElement) {
        categoryActiveStep.classList.remove('is-current');
        categoryNextStepElement.classList.add('is-current');
    }
});