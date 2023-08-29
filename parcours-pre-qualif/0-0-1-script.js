const nextBtn = document.getElementById('next-button'); 
const questionTitle = document.getElementById('question-title');
// const questionTheme = document.querySelector('.simulator-theme');
let resultArray = []; 
const startBtn = document.getElementById('start-button'); 
const simulatorBlock = document.getElementById('simulator-block');
const simulatorOptions = document.getElementById('simulator-options');
// const hubspotPropertiesBlock = document.getElementById('hubspot-properties');
const previousBtn = document.getElementById('previous-button');
let previousQuestionArray = []; 
const simulatorSubmitBtn = document.getElementById('simulator-submit-button'); 
// const formTemplate = document.getElementById('simulator-form-block');
//const answerBlock = document.getElementById('answer-block')



/*let currentQuestion = questionsData[0];
let numberOfChoices = currentQuestion.choices.length;
let divAnswer = document.querySelector('.simulator-answer-btn');

for (let i = 0; i < numberOfChoices - 1; i++) {
    let clone = divAnswer.cloneNode(true);
    answerBlock.appendChild(clone);
}*/


/*currentQuestion.choices.forEach(choice => {
    const divAnswer = document.createElement('div');
    divAnswer.textContent = choice.value;
    divAnswer.classList.add('simulator-answer-btn');
    const inputAnswer = document.create
    answerBlock.appendChild(divAnswer);
});*/



window.addEventListener('load', () => {
    setItemStorage('previousQuestion', 0); 
    setItemStorage('indexNextQuestion', 0);
    setItemStorage('indexCurrentChoice', 0); 
    setItemStorage('indexCurrentQuestion', 0);
    //setItemStorage('url', window.location.href);
    firstQuestion();
}); 

function setItemStorage(key, value) {
    localStorage.setItem(key, value); 
}

function addHiddenClass(elementProperty) {
    elementProperty.classList.add('simulator-hidden'); 
}

function removeHiddenClass(elementProperty) {
    elementProperty.classList.remove('simulator-hidden'); 
}

/*function fillQuestionTitleTheme(currentQuestion) {
    questionTitle.textContent = currentQuestion.question; 
    if (currentQuestion.theme) {
        questionTheme.textContent = currentQuestion.theme; 
    } 
}*/


/*startBtn.addEventListener('click', () => {
    removeHiddenClass(document.getElementById('form-question')); 
    addHiddenClass(document.querySelector('.simulator-start')); 
    addHiddenClass(document.querySelector('.simulator-start-image')); 
    removeHiddenClass(document.querySelector('.simulator-questions-image'));
    firstQuestion();
});*/


previousBtn.addEventListener('click', () => {
    getPreviousQuestion(); 
    deleteOldValueResultArray();
    deleteOldValuePreviousArray();
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    const indexNextQuestion = localStorage.getItem('indexNextQuestion'); 
    const indexPreviousQuestion = parseInt(localStorage.getItem('previousQuestion')); 
    if (indexPreviousQuestion > 0) {
        getLastElement(); 
    } 
    if (indexCurrentQuestion === 0) {
        previousBtn.classList.add('simulator-hidden'); 
    } else if (indexNextQuestion === 'emailForm') {
        removeHiddenClass(document.getElementById('simulator-block')); 
        addHiddenClass(document.querySelector('.simulator-form-block')); 
        removeHiddenClass(nextBtn);  
    }
});


function firstQuestion() {
    let questionIndex = 0
    //let url = localStorage.getItem('url');

    /*if (url.includes('index')) {
        questionIndex = 1;
    } else {
        questionIndex = 0
    }*/

    const firstQuestionData = questionsData.find(question => question.id === questionIndex);
    setItemStorage('indexCurrentQuestion', firstQuestionData.id); 

    questionTitle.textContent = firstQuestionData.question

    // fillQuestionTitleTheme(firstQuestionData);   
       
    generateQuestion(firstQuestionData); 
}


function generateQuestion(currentQuestion) {
    //const answerBlock = document.getElementById('answer-block').firstChild; 
    const answerBlock = document.querySelector('.pre-qualif-answer');
    simulatorBlock.innerHTML = '';
    // appendHubspotProperty(currentQuestion);

    currentQuestion.choices.forEach((choice, index) => {
        console.log(choice)
        let answer;
        showQuestion(currentQuestion, answerBlock, answer, choice, index);
    });
}


function showQuestion(currentQuestion, answerBlock, answer, choice, index) {
    const cloneAnswerBlock = answerBlock.cloneNode(true); 
    simulatorBlock.appendChild(cloneAnswerBlock); 
    answer = simulatorBlock.children[index];

    //const { id, value, image, hubspotValue } = choice;
    const { id, value } = choice;
    const input = answer.querySelector('.simulator-radio'); 
    input.setAttribute('id', id); 
    input.setAttribute('value', id);
    //input.setAttribute('data-hubspot-value', hubspotValue);

    const label = answer.querySelector('.simulator-answer'); 
    label.textContent = value; 
    label.setAttribute('for', id); 
 
    //const emoji = answer.querySelector('.simulator-emoji');
    /*if (image) { 
        emoji.textContent = image; 
    } else {
        emoji.remove(); 
    }*/

    //highlightCards(choice, answer); 
    computeQuestion(currentQuestion, answer, input); 
}


function computeQuestion(currentQuestion, answer, input) {
    answer.addEventListener('click', () => { 
        setItemStorage('indexCurrentChoice', input.id); 
        updateLocalStorage(currentQuestion); 
    });

    input.addEventListener('click', (e) => {
        [...document.querySelectorAll('.simulator-answer-btn')].forEach(element => {
            element.classList.remove('simulator-checked'); 
        });
        e.currentTarget.parentNode.classList.add('simulator-checked');
        //const hubspotPropertyBlock = hubspotPropertiesBlock.querySelector(`[data-hubspot-property='${currentQuestion.property}']`)
        //hubspotPropertyBlock.querySelector('input').setAttribute("value", e.currentTarget.dataset.hubspotValue);
        nextQuestion(); 
    });
}


/*function appendHubspotProperty(currentQuestion) {
    const property = currentQuestion.property;
    if (property) {
        hubspotPropertiesBlock.insertAdjacentHTML('beforeend', `<div data-hubspot-property="${property}" style='visibility: hidden; height: 0'><label>${property}</label><input type='text'/></div>`)
    }
}*/


function updateLocalStorage(currentQuestion) {
    const currentChoiceIndex = parseInt(localStorage.getItem('indexCurrentChoice')); 
    const currentChoiceData = currentQuestion.choices.find(data => data.id === currentChoiceIndex)
    setItemStorage('indexNextQuestion', currentChoiceData.nextQuestion);
}


function updateResultArray(currentChoice, currentQuestion) {
    if (currentChoice.result === true) {
        const newResult = {}; 
        newResult.question = `${currentQuestion.id}`;
        if (currentChoice.resultValue) {
            newResult.result = `${currentChoice.resultValue}`; 
            setItemStorage('result', currentChoice.resultValue);
        } else {
            newResult.result = `${currentChoice.hubspotValue}`;
            setItemStorage('result', currentChoice.hubspotValue);
        }
        resultArray.push(newResult); 
    }
}


/*function showForm() {
    simulatorOptions.innerHTML = ''; 
    questionTitle.innerHTML = 'Entrez vos coordonnées pour afficher le résultat de la simulation';
    questionTheme.innerHTML = 'Résultat'; 
    addHiddenClass(nextBtn); 
    addHiddenClass(previousBtn);
    removeHiddenClass(formTemplate);  
    addHiddenClass(document.getElementById('simulator-information'));
}*/


function getNextQuestion(questionsData) {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexNextQuestion'));
    let currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
    setItemStorage('indexCurrentQuestion', currentQuestionData.id);

    let url = localStorage.getItem('url');

    if (currentQuestionData.dependsOnMetiers === true && url.includes('metiers')) {
        currentQuestionData = questionsData.find(question => question.id === currentQuestionData.nextQuestionMetiers);
    }

    questionTitle.textContent = currentQuestionData.question;

    if (currentQuestionData.theme) {
        questionTheme.textContent = currentQuestionData.theme; 
    }

    /*if (currentQuestionData.precision) {
        removeHiddenClass(document.getElementById('precision_charges_container')); 
    }*/

    generateQuestion(currentQuestionData); 
}


function getPreviousQuestion() { 
    let indexPreviousQuestion = parseInt(localStorage.getItem('previousQuestion')); 
    const previousQuestionData = questionsData.find(question => question.id === indexPreviousQuestion); 

    //fillQuestionTitleTheme(previousQuestionData); 

    questionTitle.textContent = previousQuestionData.question;

    /*if (previousQuestionData.precision) {
        removeHiddenClass(document.getElementById('precision_charges_container')); 
    } else {
        addHiddenClass(document.getElementById('precision_charges_container'));
    }*/
   
    generateQuestion(previousQuestionData); 
    setItemStorage('indexCurrentQuestion', previousQuestionData.id); 
}


/*function highlightCards(currentQuestion, answer) {
    if (currentQuestion.highlight === true) {
        answer.style.boxShadow = "0px 0px 10px #132966"; 
    }
}*/


let currentChoiceData; 
let currentQuestionData; 

function findQuestionForStoreResult(questionsData) {
    const indexCurrentChoice = parseInt(localStorage.getItem('indexCurrentChoice')); 
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
    currentChoiceData = currentQuestionData.choices.find(choice => choice.id === indexCurrentChoice); 
    updateResultArray(currentChoiceData, currentQuestionData);
}


function storeResult(questionsData) {
    findQuestionForStoreResult(questionsData);
    updatePreviousQuestionArray(currentQuestionData, currentChoiceData);
}


function updatePreviousQuestionArray(currentQuestion, currentChoice) {
    const newValue = {};  
    newValue.question = `${currentQuestion.questionTree}`; 
    newValue.value = `${currentChoice.value}`; 
    setItemStorage('previousQuestion', currentQuestion.questionTree); 
    previousQuestionArray.push(newValue); 
}


function deleteOldValuePreviousArray() {
    const previousQuestion = parseInt(localStorage.getItem('previousQuestion')); 
    const currentQuestionData = questionsData.find(question => question.questionTree === previousQuestion); 
  
    const answerToFind = previousQuestionArray.find(answer => answer.question === currentQuestionData.questionTree);
  
    let indexAnswerToFind = previousQuestionArray.indexOf(answerToFind); 
  
    previousQuestionArray.splice(indexAnswerToFind, 1); 
}


function deleteOldValueResultArray() {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    const currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
  
    const answerToFind = resultArray.find(answer => answer.question === currentQuestionData.question);
  
    let indexAnswerToFind = resultArray.indexOf(answerToFind); 
  
    resultArray.splice(indexAnswerToFind, 1); 
}


function getLastElement() {
    let previousQuestionArrayLength = Object.keys(previousQuestionArray).length; 
    const lastElement = previousQuestionArray[previousQuestionArrayLength - 1]; 
    localStorage.setItem('previousQuestion', lastElement.question); 
}


function nextQuestion() {
    const indexNextQuestion = localStorage.getItem('indexNextQuestion'); 
    storeResult(questionsData); 
    //removeHiddenClass(previousBtn);

    if (indexNextQuestion === 'end') {
		simulatorBlock.innerHTML = '';
        //generateForm(); 
        questionTitle.textContent = 'END';
    } else if (indexNextQuestion === 'link signup') {
        questionTitle.textContent = 'SIGN-UP'
    } else {
        getNextQuestion(questionsData); 
    }

    /*if (indexNextQuestion === 'emailForm') {
		simulatorBlock.innerHTML = '';
        generateForm(); 
    } else {
        getNextQuestion(questionsData); 
    }*/
}

function generateForm() {  
    showForm(); 

    //removeHiddenClass(questionTheme); 

    //simulatorOptions.append(formTemplate); 
}


/*let nextButton = document.querySelector('.next-button');

nextButton.addEventListener('click', () => {
    let url = window.location.href
    localStorage.setItem('url', url)
});*/