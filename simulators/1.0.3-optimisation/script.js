document.getElementById('start-btn').addEventListener('click', () => {
    document.querySelector('.section_opti-sim-hero').classList.add('hide');
    document.querySelector('.section_opti-sim').classList.remove('hide');
});

/*document.querySelectorAll('.opti-sim_answer-item').forEach((answer) => {
    answer.addEventListener('mouseover', () => {
        answer.querySelector('p').style.color = 'white';
    });

    answer.addEventListener('mouseout', () => {
        if (!answer.classList.contains('is-selected')) { 
            answer.querySelector('p').style.color = '#484848';
        }
    });
});*/

let selectedAnswers = {};

const totalQuestionsByTheme = {
    administratif: 10,
    organisation: 6,
    development: 6
};

const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');
const steps = Array.from(document.querySelectorAll('.opti-sim_question-container'));

document.querySelectorAll('.opti-sim_question-container').forEach((step, index) => {
    if (!step.dataset.step) {
        step.dataset.step = index + 1;
    }
});

function getStepIndex(stepElement) {
    return steps.indexOf(stepElement);
}

function disableNextButton() {
    nextButton.classList.add('is-disabled');
    nextButton.disabled = true;
}

function enableNextButton() {
    nextButton.classList.remove('is-disabled');
    nextButton.disabled = false;
}

function updateProgressBar(questionTheme) {
    const totalQuestions = totalQuestionsByTheme[questionTheme];
    if (!totalQuestions) return;

    const maxPoints = totalQuestions * 5;
    let totalPoints = 0;
    let answeredQuestions = 0;

    Object.keys(selectedAnswers).forEach(key => {
        if (key.startsWith(questionTheme)) {
            if (selectedAnswers[key] === '' || selectedAnswers[key] === null || selectedAnswers[key] === 'no-effect') return;

            answeredQuestions++;
            const answerValue = selectedAnswers[key];

            let pointsForAnswer = 0;
            if (answerValue === 'sasu') {
                pointsForAnswer = 5;
            } else if (answerValue === 'eurl') {
                pointsForAnswer = 4;
            } else if (answerValue === 'ei') {
                pointsForAnswer = 3;
            } else if (answerValue === 'micro') {
                pointsForAnswer = 1;
            }

            if (answerValue === 'oui') {
                pointsForAnswer += 5;
            } else if (answerValue === 'medium') {
                pointsForAnswer += 3;
            } else if (answerValue === 'non') {
                pointsForAnswer += 0;
            }

            totalPoints += pointsForAnswer;
        }
    });

    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    const goodPercentage = (totalPoints / maxPoints) * 100;
    const badPercentage = progressPercentage - goodPercentage;

    const progressBar = document.querySelector(`.opti-sim_theme-item[data-theme="${questionTheme}"] .opti-sim_progress-bar-wrapper`);
    const goodBar = progressBar?.querySelector('.opti-sim_progress-bar.is-good');
    const badBar = progressBar?.querySelector('.opti-sim_progress-bar.is-bad');

    if (progressBar && goodBar && badBar) {
        goodBar.style.width = `${goodPercentage}%`;
        badBar.style.width = `${Math.max(0, badPercentage)}%`;
    }
}

function handleAnswerClick(event) {
    const answerDiv = event.target.closest('.opti-sim_answer-item');
    if (!answerDiv) return;

    const questionContainer = answerDiv.closest('.opti-sim_question-container');
    const questionTheme = questionContainer.dataset.theme;
    const questionStep = questionContainer.dataset.step || getStepIndex(questionContainer) + 1;
    const answerValue = answerDiv.dataset.answer;

    selectedAnswers[`${questionTheme}-${questionStep}`] = answerValue;

    questionContainer.querySelectorAll('.opti-sim_answer-item').forEach(div => {
        div.classList.remove('is-selected');
        div.style.color = '#484848';
    });

    answerDiv.classList.add('is-selected');
    answerDiv.style.color = 'white';

    if (questionTheme === 'administratif') calculAdministratif();
    if (questionTheme === 'organisation') calculOrganisation();

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
    const questions = steps.filter(step => step.dataset.theme === 'administratif');
    let maxResultPossible = 0;
    let result = 0;
    let answeredQuestions = 0;

    questions.forEach((question, index) => {
        const questionKey = `administratif-${index + 1}`;
        let answerValue = selectedAnswers[questionKey];

        if (answerValue !== 'no-effect' && answerValue !== null && answerValue !== '') {
            if (answerValue === 'sasu') {
                result += 5;
            } else if (answerValue === 'eurl') {
                result += 4;
            } else if (answerValue === 'ei') {
                result += 3;
            } else if (answerValue === 'micro') {
                result += 1;
            } else if (answerValue === 'oui') {
                result += 5;
            } else if (answerValue === 'medium') {
                result += 3;
            } else if (answerValue === 'non') {
                result += 0;
            }

            if (selectedAnswers[questionKey]) {
                answeredQuestions++;
            }

            const resultOptimisation = (result / (answeredQuestions * 5)) * 100;
            document.getElementById('administratif-result').textContent = Math.round(resultOptimisation);
        }
    });
}

function calculOrganisation() {
    const questions = steps.filter(step => step.dataset.theme === 'organisation');
    let maxResultPossible = 0;
    let result = 0;
    let answeredQuestions = 0;

    questions.forEach((question, index) => {
        const questionKey = `organisation-${index + 1}`;
        const answerValue = selectedAnswers[questionKey];

        if (answerValue !== 'no-effect' && answerValue !== null && answerValue !== '') {
            result = calculThreeAnswers(questionKey, result);
            
            if (selectedAnswers[questionKey]) {
                answeredQuestions++;
            }

            const resultOptimisation = (result / (answeredQuestions * 5)) * 100;
            document.getElementById('organisation-result').textContent = Math.round(resultOptimisation);
        }
    });
}

function updateNextButtonState(questionTheme, questionStep) {
    const key = `${questionTheme}-${questionStep}`;

    if (selectedAnswers[key]) {
        enableNextButton();
    } else {
        disableNextButton();
    }

    if (questionStep === 1) {
        prevButton.style.opacity = 0;
    } else {
        prevButton.style.opacity = 1;
    }
}

function changeQuestion(direction) {
    const activeStep = steps.find(step => !step.classList.contains('hide'));
    if (!activeStep) return;

    const currentIndex = getStepIndex(activeStep);
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex < 0 || nextIndex >= steps.length) return;

    const nextStepElement = steps[nextIndex];
    const questionTheme = nextStepElement.dataset.theme;
    const questionStep = nextStepElement.dataset.step || getStepIndex(nextStepElement) + 1;

    updateNextButtonState(questionTheme, questionStep);

    activeStep.classList.add('hide');
    nextStepElement.classList.remove('hide');

    applyCurrentThemeOnFirstQuestion(questionTheme);
    updateProgressBar(questionTheme);
}

nextButton.addEventListener('click', () => changeQuestion('next'));
prevButton.addEventListener('click', () => changeQuestion('prev'));

function initializeQuiz() {
    steps.forEach(step => {
        const questionTheme = step.dataset.theme;
        const questionStep = step.dataset.step;
        updateNextButtonState(questionTheme, questionStep);
    });

    prevButton.style.opacity = 0;
}

initializeQuiz();