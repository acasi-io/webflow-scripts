document.getElementById('start-btn').addEventListener('click', () => {
    document.querySelector('.section_opti-sim-hero').classList.add('hide');
    document.querySelector('.section_opti-sim').classList.remove('hide');
});

document.querySelectorAll('.opti-sim_answer-item').forEach((answer) => {
    answer.addEventListener('mouseover', () => {
        answer.querySelector('p').style.color = 'white';
    });

    answer.addEventListener('mouseout', () => {
        if (!answer.classList.contains('is-selected')) { 
            answer.querySelector('p').style.color = '#484848';
        }
    });
});

let selectedAnswers = {};

const totalQuestionsByTheme = {
    administratif: 10,
    organisation: 6,
    development: 6
};

const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');
const steps = Array.from(document.querySelectorAll('.opti-sim_question-container'));

function disableNextButton() {
    nextButton.classList.add('is-disabled');
    nextButton.disabled = true;
}

function enableNextButton() {
    nextButton.classList.remove('is-disabled');
    nextButton.disabled = false;
}

function updateNextButtonState(questionTheme, questionStep) {
    const key = `${questionTheme}-${questionStep}`;
    selectedAnswers[key] ? enableNextButton() : disableNextButton();
}

function applyCurrentThemeOnFirstQuestion(questionTheme) {
    const currentTheme = document.querySelector(`.opti-sim_theme-item[data-theme="${questionTheme}"]`);
    if (currentTheme) {
        currentTheme.classList.add('is-current');
        currentTheme.querySelectorAll('p').forEach((p) => {
            p.style.color = '#484848';
        });
    }
}

function updateProgressBar(questionTheme) {
    const totalQuestions = totalQuestionsByTheme[questionTheme];
    if (!totalQuestions) return;
    
    const answeredQuestions = Object.keys(selectedAnswers).filter(key => key.startsWith(questionTheme)).length;
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    
    const progressBar = document.querySelector(`.opti-sim_theme-item[data-theme="${questionTheme}"] .opti-sim_progress-bar`);
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
    }
}

function handleAnswerClick(event) {
    const answerDiv = event.target.closest('.opti-sim_answer-item');
    if (!answerDiv) return;

    const questionContainer = answerDiv.closest('.opti-sim_question-container');
    const questionTheme = questionContainer.dataset.theme;
    const questionStep = questionContainer.dataset.step;
    const answerValue = answerDiv.dataset.answer;

    selectedAnswers[`${questionTheme}-${questionStep}`] = answerValue;

    questionContainer.querySelectorAll('.opti-sim_answer-item').forEach(div => {
        div.classList.remove('is-selected');
        div.querySelector('p').style.color = '#484848';
    });

    answerDiv.classList.add('is-selected');
    answerDiv.querySelector('p').style.color = 'white';

    if (questionTheme === 'administratif') calculAdministratif();
    if (questionTheme === 'organisation') calculOrganisation();

    let currentScoreText = document.getElementById(`${questionTheme}-result`);
    let currentScore = parseInt(currentScoreText.textContent);

    if (currentScore <= 50) {
        currentScoreText.classList.add('is-bad');
    } else if (currentScore > 50 && currentScore <= 75) {
        currentScoreText.classList.add('is-medium');
    } else {
        currentScoreText.classList.add('is-good');
    }

    updateProgressBar(questionTheme);
    enableNextButton();
}

document.querySelectorAll('.opti-sim_answer-item').forEach(answer => {
    answer.addEventListener('click', handleAnswerClick);
});

function calculThreeAnswers(questionKey, result) {
    const question = selectedAnswers[questionKey];
    if (question === 'oui') {
        return result + 5;
    } else if (question === 'medium') {
        return result + 3;
    } else if (question === 'non') {
        return result + 0;
    }
    return result;
}

function calculTwoAnswers(questionKey, result) {
    const question = selectedAnswers[questionKey];
    if (question === 'oui') {
        return result + 5;
    } else if (question === 'non') {
        return result + 0;
    }
    return result;
}

function calculAdministratif() {
    let numberOfQuestion = 10;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    const socialForm = selectedAnswers['administratif-1'];

    if (socialForm === 'sasu') {
        result = 5;
    } else if (socialForm === 'eurl') {
        result = 4;
    } else if (socialForm === 'ei') {
        result = 3;
    } else if (socialForm === 'micro') {
        result = 1;
    }

    result = calculThreeAnswers('administratif-2', result);
    result = calculThreeAnswers('administratif-3', result);
    result = calculThreeAnswers('administratif-4', result);
    result = calculThreeAnswers('administratif-5', result);
    result = calculThreeAnswers('administratif-6', result);
    result = calculThreeAnswers('administratif-7', result);
    result = calculThreeAnswers('administratif-8', result);
    result = calculThreeAnswers('administratif-9', result);
    result = calculThreeAnswers('administratif-10', result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('administratif-result').textContent = Math.round(resultOptimisation);
}

function calculOrganisation() {
    let numberOfQuestion = 6;
    let maxResultPossible = numberOfQuestion * 5;
    let result = 0;

    result = calculThreeAnswers('organisation-11', result);
    result = calculThreeAnswers('organisation-12', result);
    result = calculThreeAnswers('organisation-13', result);
    result = calculThreeAnswers('organisation-14', result);
    result = calculThreeAnswers('organisation-15', result);
    result = calculThreeAnswers('organisation-16', result);

    const resultOptimisation = (result / maxResultPossible) * 100;

    document.getElementById('organisation-result').textContent = Math.round(resultOptimisation);
}

function changeQuestion(direction) {
    const activeStep = steps.find(step => !step.classList.contains('hide'));
    if (!activeStep) return;

    const currentStep = parseInt(activeStep.dataset.step);
    const nextStep = direction === 'next' ? currentStep + 1 : currentStep - 1;
    const nextStepElement = steps.find(step => parseInt(step.dataset.step) === nextStep);

    showCheckImgae(nextStep);
    
    if (!nextStepElement) return;

    const questionTheme = nextStepElement.dataset.theme;
    
    updateProgressBar(questionTheme);

    activeStep.classList.add('hide');
    nextStepElement.classList.remove('hide');

    applyCurrentThemeOnFirstQuestion(questionTheme);
    updateNextButtonState(questionTheme, nextStep);

    prevButton.style.opacity = nextStep === 1 ? 0 : 1;
}

nextButton.addEventListener('click', () => changeQuestion('next'));
prevButton.addEventListener('click', () => changeQuestion('prev'));

function showCheckImgae(nextStep) {
    const administratifDiv = document.querySelector(`.opti-sim_theme-item[data-theme='administratif']`);
    const organisationDiv = document.querySelector(`.opti-sim_theme-item[data-theme='organisation']`);

    if (nextStep === 11) {
        administratifDiv.querySelector('.opti-sim_check-icon').style.display = 'block';
    } else if (nextStep === 17) {
        organisationDiv.querySelector('.opti-sim_check-icon').style.display = 'block';
    }
}

function initializeQuiz() {
    steps.forEach(step => {
        const questionTheme = step.dataset.theme;
        const questionStep = step.dataset.step;
        updateNextButtonState(questionTheme, questionStep);
    });

    prevButton.style.opacity = 0;
}

initializeQuiz();