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

const kilometerCompensationScale = document.getElementById('kilometer-compensation-scale');
const kilometerCompensationCost = document.getElementById('kilometer-compensation-cost');
const kilometerCompensationMonitoring = document.getElementById('kilometer-compensation-monitoring');
const holidaysCheque = document.getElementById('holidays-cheque');
const holidaysChequeOpitmisation = document.getElementById('holidays-cheque-optimisation');
const workerMoneyVoucher = document.getElementById('worker-money-voucher');
const workerMoneyVouchereOpitmisation = document.getElementById('worker-money-voucher-optimisation');

addInputListener(kilometerCompensationScale, calculCost);
addInputListener(kilometerCompensationCost, calculCost);
addInputListener(kilometerCompensationMonitoring, calculCost);
addInputListener(holidaysCheque, calculCost);
addInputListener(holidaysChequeOpitmisation, calculCost);
addInputListener(workerMoneyVoucher, calculCost);
addInputListener(workerMoneyVouchereOpitmisation, calculCost);

const sharingWageDividends = document.getElementById('sharing-wage-dividends');
const rentProfessionalDomicile = document.getElementById('rent-professional-domicile');
const suitableWage = document.getElementById('suitable-wage');

addInputListener(sharingWageDividends, calculWage);
addInputListener(rentProfessionalDomicile, calculWage);
addInputListener(suitableWage, calculWage);

const hasPer = document.getElementById('has-per');
const perDeductibleLimit = document.getElementById('per-deductible-limit');

addInputListener(hasPer, calculTaxation);
addInputListener(perDeductibleLimit, calculTaxation);

const hasSci = document.getElementById('has-sci');
const hasHolding = document.getElementById('has-holding');

addInputListener(hasSci, calculInvestment);
addInputListener(hasHolding, calculInvestment);

const retirementRights = document.getElementById('retirement-rights');
const retirementComplementary = document.getElementById('retirement-complementary');
const hasInsurance = document.getElementById('has-insurance');
const insuranceComplete = document.getElementById('insurance-complete');
const insuranceRevaluation = document.getElementById('insurance-revaluation');
const hasUnemploymentCovering = document.getElementById('has-unemployment-covering');
const unemploymentCoveringPrevoyance = document.getElementById('unemployment-covering-prevoyance');
const unemploymentCoveringOptimised = document.getElementById('unemployment-covering-optimised');

addInputListener(retirementRights, calculProtection);
addInputListener(retirementComplementary, calculProtection);
addInputListener(hasInsurance, calculProtection);
addInputListener(insuranceComplete, calculProtection);
addInputListener(insuranceRevaluation, calculProtection);
addInputListener(hasUnemploymentCovering, calculProtection);
addInputListener(unemploymentCoveringPrevoyance, calculProtection);
addInputListener(unemploymentCoveringOptimised, calculProtection);

const workingDays = document.getElementById('working-days');
const holidays = document.getElementById('holidays');
const daysSchedule = document.getElementById('days-schedule');
const prospectingSystem = document.getElementById('prospecting-system');
const prospectingCrm = document.getElementById('prospecting-crm');
const delegation = document.getElementById('delegation');
const delegationProcessus = document.getElementById('delegation-processus');

addInputListener(workingDays, calculOrganisation);
addInputListener(holidays, calculOrganisation);
addInputListener(daysSchedule, calculOrganisation);
addInputListener(prospectingSystem, calculOrganisation);
addInputListener(prospectingCrm, calculOrganisation);
addInputListener(delegation, calculOrganisation);
addInputListener(delegationProcessus, calculOrganisation);

const billingTool = document.getElementById('billing-tool');
const billingConformity = document.getElementById('billing-conformity');
const reminderProcessus = document.getElementById('reminder-processus');
const reminderMonitoring = document.getElementById('reminder-monitoring');
const accountingSoftware = document.getElementById('accounting-software');
const accountingMonitoring = document.getElementById('accounting-monitoring');
const bankPro = document.getElementById('bank-pro');
const bankAdvisor = document.getElementById('bank-advisor');

addInputListener(billingTool, calculAdministrative);
addInputListener(billingConformity, calculAdministrative);
addInputListener(reminderProcessus, calculAdministrative);
addInputListener(reminderMonitoring, calculAdministrative);
addInputListener(accountingSoftware, calculAdministrative);
addInputListener(accountingMonitoring, calculAdministrative);
addInputListener(bankPro, calculAdministrative);
addInputListener(bankAdvisor, calculAdministrative);

const positioningStrategy = document.getElementById('positioning-strategy');
const positioningVisiblePlatform = document.getElementById('positioning-visible-platform');
const networkEvent = document.getElementById('network-event');
const networkStrategy = document.getElementById('network-strategy');

addInputListener(positioningStrategy, calculDevelopment);
addInputListener(positioningVisiblePlatform, calculDevelopment);
addInputListener(networkEvent, calculDevelopment);
addInputListener(networkStrategy, calculDevelopment);

const toolsAutomate = document.getElementById('tools-automate');
const toolsOptimiseProductivity = document.getElementById('tools-optimise-productivity');
const subcontracting = document.getElementById('subcontracting');
const subcontractingChoice = document.getElementById('subcontracting-choice');
const hasRoutine = document.getElementById('has-routine');
const routineWeekPlanify = document.getElementById('routine-week-planify');

addInputListener(toolsAutomate, calculDevelopment);
addInputListener(toolsOptimiseProductivity, calculDevelopment);
addInputListener(subcontracting, calculDevelopment);
addInputListener(subcontractingChoice, calculDevelopment);
addInputListener(hasRoutine, calculDevelopment);
addInputListener(routineWeekPlanify, calculDevelopment);


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

    if (socialForm.value === 'eurl' || socialForm.value === 'sasu') {
        result = 5;
    } else if (socialForm.value === 'ei' || socialForm.value === 'micro') {
        result = 3;
    }

    result = result;
    result = calculThreeAnswers(socialFormAdvantages.value, result);
    result = calculThreeAnswers(socialFormTaxLawOptimisation.value, result);
    result = calculThreeAnswers(shareholderCurrentAccount.value, result);
    result = calculThreeAnswers(shareholderAccountInterests.value, result);
    result = calculThreeAnswers(shareholderAccountCompatible.value, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('legal-result').textContent = Math.round(resultOptimisation) + '%';
}


/* COST */

function calculCost() {
    let numberOfQuestion = 7;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    result = calculThreeAnswers(kilometerCompensationScale.value, result);
    result = calculThreeAnswers(kilometerCompensationCost.value, result);
    result = calculThreeAnswers(kilometerCompensationMonitoring.value, result);
    result = calculThreeAnswers(holidaysCheque.value, result);
    result = calculTwoAnswers(holidaysChequeOpitmisation.value, result);
    result = calculThreeAnswers(workerMoneyVoucher.value, result);
    result = calculTwoAnswers(workerMoneyVouchereOpitmisation.value, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('cost-result').textContent = Math.round(resultOptimisation) + '%';
}


/* WAGE */

function calculWage() {
    let numberOfQuestion = 3;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    result = calculThreeAnswers(sharingWageDividends.value, result);
    result = calculThreeAnswers(rentProfessionalDomicile.value, result);
    result = calculThreeAnswers(suitableWage.value, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('wage-result').textContent = Math.round(resultOptimisation) + '%';
}


/* TAXATION */

function calculTaxation() {
    let numberOfQuestion = 2;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    result = calculThreeAnswers(hasPer.value, result);
    result = calculThreeAnswers(perDeductibleLimit.value, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('taxation-result').textContent = Math.round(resultOptimisation) + '%';
}


/* INVESTMENT */

function calculInvestment() {
    let numberOfQuestion = 2;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    result = calculThreeAnswers(hasSci.value, result);
    result = calculThreeAnswers(hasHolding.value, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('investment-result').textContent = Math.round(resultOptimisation) + '%';
}


/* PROTECTION */

function calculProtection() {
    let numberOfQuestion = 8;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    result = calculThreeAnswers(retirementRights.value, result);
    result = calculThreeAnswers(retirementComplementary.value, result);
    result = calculThreeAnswers(hasInsurance.value, result);
    result = calculTwoAnswers(insuranceComplete.value, result);
    result = calculTwoAnswers(insuranceRevaluation.value, result);
    result = calculTwoAnswers(hasUnemploymentCovering.value, result);
    result = calculTwoAnswers(unemploymentCoveringPrevoyance.value, result);
    result = calculTwoAnswers(unemploymentCoveringOptimised.value, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('protection-result').textContent = Math.round(resultOptimisation) + '%';
}


/* ORGANISATION */

function calculOrganisation() {
    let numberOfQuestion = 7;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    result = calculThreeAnswers(workingDays.value, result);
    result = calculThreeAnswers(holidays.value, result);
    result = calculTwoAnswers(daysSchedule.value, result);
    result = calculThreeAnswers(prospectingSystem.value, result);
    result = calculThreeAnswers(prospectingCrm.value, result);
    result = calculThreeAnswers(delegation.value, result);
    result = calculThreeAnswers(delegationProcessus.value, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('organisation-result').textContent = Math.round(resultOptimisation) + '%';
}


/* ADMINISTRATIVE */

function calculAdministrative() {
    let numberOfQuestion = 8;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    result = calculTwoAnswers(billingTool.value, result);
    result = calculTwoAnswers(billingConformity.value, result);
    result = calculTwoAnswers(reminderProcessus.value, result);
    result = calculTwoAnswers(reminderMonitoring.value, result);
    result = calculTwoAnswers(accountingSoftware.value, result);
    result = calculTwoAnswers(accountingMonitoring.value, result);
    result = calculTwoAnswers(bankPro.value, result);
    result = calculTwoAnswers(bankAdvisor.value, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('admin-result').textContent = Math.round(resultOptimisation) + '%';
}


/* DEVELOPMENT */

function calculDevelopment() {
    let numberOfQuestion = 4;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    result = calculThreeAnswers(positioningStrategy.value, result);
    result = calculTwoAnswers(positioningVisiblePlatform.value, result);
    result = calculThreeAnswers(networkEvent.value, result);
    result = calculTwoAnswers(networkStrategy.value, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('development-result').textContent = Math.round(resultOptimisation) + '%';
}


/* PRODUCTIVITY */

function calculProductivity() {
    let numberOfQuestion = 6;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    result = calculThreeAnswers(toolsAutomate.value, result);
    result = calculTwoAnswers(toolsOptimiseProductivity.value, result);
    result = calculTwoAnswers(subcontracting.value, result);
    result = calculTwoAnswers(subcontractingChoice.value, result);
    result = calculTwoAnswers(hasRoutine.value, result);
    result = calculTwoAnswers(routineWeekPlanify.value, result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('productivity-result').textContent = Math.round(resultOptimisation) + '%';
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