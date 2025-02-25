document.addEventListener('DOMContentLoaded', () => {
    let selectedAnswers = {};

    function handleAnswerClick(event) {
        const answerDiv = event.target.closest('[data-answer]');
        if (!answerDiv) return;

        const questionContainer = answerDiv.closest('.opti-sim_question-container');
        const questionTheme = questionContainer.dataset.theme;
        const questionStep = questionContainer.dataset.step;
        const answerValue = answerDiv.dataset.answer;

        selectedAnswers[`${questionTheme}-${questionStep}`] = answerValue;

        questionContainer.querySelectorAll('[data-answer]').forEach(div => {
            div.classList.remove('is-selected');
        });

        answerDiv.classList.add('is-selected');

        if (questionTheme === 'administratif') {
            calculAdministratif();
        }
    }

    document.querySelectorAll('[data-answer]').forEach(answer => {
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

        console.log(resultOptimisation);
        document.getElementById('administratif-result').textContent = Math.round(resultOptimisation);
    }

    document.getElementById('next-btn').addEventListener('click', () => {
        const steps = Array.from(document.querySelectorAll('.opti-sim_question-container'));
        const activeStep = steps.find(step => !step.classList.contains('hide'));
        const currentStep = parseInt(activeStep.dataset.step);
        const nextStep = currentStep + 1;

        const nextStepElement = steps.find(step => parseInt(step.dataset.step) === nextStep);

        if (nextStepElement) {
            activeStep.classList.add('hide');
            nextStepElement.classList.remove('hide');
        }
    });
});
