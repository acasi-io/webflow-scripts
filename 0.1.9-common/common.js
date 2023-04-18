const nextBtn = document.getElementById('next-button'); 
const questionTitle = document.getElementById('question');
let questionIndex = 0; 
const questionTheme = document.querySelector('.simulator-theme');
let resultArray = []; 
const startBtn = document.getElementById('start-button'); 
const simulatorBlock = document.getElementById('simulator-block');
const simulatorOptions = document.getElementById('simulator-options');
const previousBtn = document.getElementById('previous-button');
let previousQuestionArray = []; 



function setItemStorage(key, value) {
    localStorage.setItem(key, value); 
}

function addHiddenClass(elementProperty) {
    elementProperty.classList.add('simulator-hidden'); 
}

function removeHiddenClass(elementProperty) {
    elementProperty.classList.remove('simulator-hidden'); 
}

function fillQuestionTitleTheme(currentQuestion) {
    questionTitle.textContent = currentQuestion.question; 
    if (currentQuestion.theme) {
        questionTheme.textContent = currentQuestion.theme; 
    } 
}


startBtn.addEventListener('click', () => {
    setItemStorage('indexPreviousQuestion', 0); 
    setItemStorage('indexCurrentChoice', 0); 
    setItemStorage('indexCurrentQuestion', 0); 
    removeHiddenClass(document.getElementById('form-question')); 
    addHiddenClass(document.querySelector('.simulator-start')); 
    addHiddenClass(document.querySelector('.simulator-start-image')); 
    removeHiddenClass(document.querySelector('.simulator-questions-image'));
    firstQuestion();
});


function firstQuestion() {
    const firstQuestionData = questionsData.find(question => question.id === questionIndex);
    setItemStorage('indexCurrentQuestion', firstQuestionData.id); 

    fillQuestionTitleTheme(firstQuestionData);  
       
    generateQuestion(firstQuestionData); 
}


function generateQuestion(currentQuestion) {
    const answerBlock = document.getElementById('answer-block').firstChild; 
    simulatorBlock.innerHTML = '';
    appendHubspotProperty(currentQuestion);

    currentQuestion.choices.forEach((choice, index) => {
        let answer; 
        showQuestion(answerBlock, currentQuestion, choice, index, answer)
    }); 
}


function showQuestion(answerBlock, currentQuestion, choice, index, answer) {
    const cloneAnswerBlock = answerBlock.cloneNode(true); 
    simulatorBlock.appendChild(cloneAnswerBlock); 
    answer = simulatorBlock.children[index];

    const { id, value, image, hubspotValue } = choice;
    const input = answer.querySelector('.simulator-radio'); 
    input.setAttribute('id', id); 
    input.setAttribute('value', id);
    input.setAttribute('data-hubspot-value', hubspotValue);

    const label = answer.querySelector('.simulator-answer'); 
    label.textContent = value; 
    label.setAttribute('for', id); 
 
    const emoji = answer.querySelector('.simulator-emoji');
    if (image) { 
        emoji.textContent = image; 
    } else {
        emoji.remove(); 
    }

    highlightCards(currentQuestion, answer);
    computeQuestion(currentQuestion, input, answer); 
}


function computeQuestion(currentQuestion, input, answer) {
    answer.addEventListener('click', () => { 
        setItemStorage('indexCurrentChoice', input.id); 
        updateLocalStorage(currentQuestion); 
    });

    input.addEventListener('click', (e) => {
        [...document.querySelectorAll('.simulator-answer-btn')].forEach(element => {
            element.classList.remove('simulator-checked'); 
        });
        e.currentTarget.parentNode.classList.add('simulator-checked');
        const hubspotPropertyBlock = hubspotPropertiesBlock.querySelector(`[data-hubspot-property='${currentQuestion.property}']`)
        hubspotPropertyBlock.querySelector('input').setAttribute("value", e.currentTarget.dataset.hubspotValue);
        nextQuestion(); 
    });
}


function appendHubspotProperty(currentQuestion) {
    const property = currentQuestion.property;
    if (property) {
        hubspotPropertiesBlock.insertAdjacentHTML('beforeend', `<div data-hubspot-property="${property}" style='visibility: hidden; height: 0'><label>${property}</label><input type='text'/></div>`)
    }
}


function updateLocalStorage(currentQuestion) {
    const currentChoiceIndex = parseInt(localStorage.getItem('indexCurrentChoice')); 
    const currentChoiceData = currentQuestion.choices.find(data => data.id === currentChoiceIndex)
    setItemStorage('indexNextQuestion', currentChoiceData.nextQuestion);
}


function updateResultArray(currentChoice, currentQuestion) {
    if (currentChoice.result === true) {
        const newResult = {}; 
        newResult.question = `${currentQuestion.question}`;
        newResult.result = `${currentChoice.resultValue}`;
        resultArray.push(newResult); 
        setItemStorage('result', currentChoice.resultValue); 
    }
}


function forShowForm(formTemplate) {
    simulatorOptions.innerHTML = ''; 
    questionTitle.innerHTML = 'Entrez vos coordonnées pour afficher le résultat de la simulation';
    questionTheme.innerHTML = 'Résultat'; 
    addHiddenClass(nextBtn); 
    removeHiddenClass(formTemplate);  
    addHiddenClass(document.getElementById('simulator-information'));
}


let currentChoiceData; 
let currentQuestionData; 

function findQuestionForStoreResult(questionsData) {
    const indexCurrentChoice = parseInt(localStorage.getItem('indexCurrentChoice')); 
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
    currentChoiceData = currentQuestionData.choices.find(choice => choice.id === indexCurrentChoice); 
    updateResultArray(currentChoiceData, currentQuestionData);
}


function getNextQuestion(questionsData) {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexNextQuestion')); 
    const currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
    setItemStorage('indexCurrentQuestion', currentQuestionData.id);

    fillQuestionTitleTheme(currentQuestionData); 

    generateQuestion(currentQuestionData); 
}


function highlightCards(currentQuestion, answer) {
    if (currentQuestion.highlight === true) {
        answer.style.boxShadow = "0px 0px 10px #132966"; 
    }
}