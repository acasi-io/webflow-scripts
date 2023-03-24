const questionsData = [
    {   
        id: 0, 
        question: "Quel est votre type d'activité ?", 
        choices: [
            {
                id: 1, 
                value: "Vente de marchandises",
                nextQuestion: 1
            }, 
            {
                id: 2, 
                value: "Prestation de services",
                nextQuestion: 1
            }
        ]
    }, 
    {
        id: 1,
        question: "Cette année, vous allez réaliser", 
        choices: [
            {
                id: 1, 
                value: "Moins de 85 500€ de CA", 
                nextQuestion: 2
            }, 
            {
                id: 2, 
                value: "Entre 85 500€ et 94 300€ de CA", 
                nextQuestion: 3
            }, 
            {
                id: 3, 
                value: "Plus de 94 300€ de CA", 
                nextQuestion: 4
            }, 
            {
                id: 4, 
                value: "Plus de 176 200 € de CA", 
                nextQuestion: 5
            }
        ]
    },
    {
        id: 2,
        question: "Vos charges représentent", 
        choices: [
            {
                id: 1, 
                value: "Plus de % de votre CA", 
                nextQuestion: "emailForm", 
                result: true, 
                resultValue: "Plus de % de votre CA"
            }, 
            {
                id: 2, 
                value: "Moins de % de votre CA", 
                nextQuestion: "emailForm", 
                result: true, 
                resultValue: "Moins de % de votre CA"
            }
        ]
    },
    { 
        id: 3,
        question: "L'année dernière vous avez réalisé", 
        choices: [
            {
                id: 1, 
                value: "Plus de 85 500€", 
                nextQuestion: "emailForm", 
                result: true, 
                resultValue: "Plus de 85 500€"
            }, 
            {
                id: 2, 
                value: "Moins de 85 800€", 
                nextQuestion: 2 
            },
            {
                id: 3, 
                value: "C'est ma premère année d'activité", 
                nextQuestion: 2
            }
        ]
    }, 
    {
        id: 4, 
        question: "Vos clients sont majoritairement des", 
        choices: [
            {
                id: 1, 
                value: "Particuliers", 
                nextQuestion: "emailForm", 
                result: true, 
                resultValue: "Particuliers"
            }, 
            {
                id: 2, 
                value: "Professionnels (autres sociétés)", 
                nextQuestion: "emailForm", 
                result: true, 
                resultValue: "Professionnels"
            }
        ]
    }, 
    {
        id: 5, 
        question: "L'année dernière vous avez réalisé ", 
        choices: [
            {
                id: 1, 
                value: "Moins de 176 200€", 
                nextQuestion: 2
            }, 
            {
                id: 2, 
                value: "Plus de 176 200€", 
                nextQuestion: "emailForm", 
                result: true,
                resultValue: "Plus de 176 200€"
            }
        ]
    }
];


let questionIndex = 0; 
const previousBtn = document.getElementById('previous-button'); 
const nextBtn = document.getElementById('next-button'); 
const questionTitle = document.getElementById('question');
let resultArray = []; 
const startBtn = document.querySelector('.simulator-start-button'); 
const simulatorOptions = document.getElementById('simulator-options'); 
const simulatorBlock = document.getElementById('simulator-block');
let previousQuestionArray = []; 
let previousQuestionArrayLength = Object.keys(previousQuestionArray).length; 


function setItemStorage(key, value) {
    localStorage.setItem(key, value); 
}

function addHiddenClass(elementProperty) {
    elementProperty.classList.add('simulator-hidden'); 
}

function removeHiddenClass(elementProperty) {
	elementProperty.classList.remove('simulator-hidden'); 
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


nextBtn.addEventListener('click', () => {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    const indexNextQuestion = localStorage.getItem('indexNextQuestion'); 
    storeResult(); 
    removeHiddenClass(previousBtn);
    console.log(previousQuestionArrayLength); 

    if (indexNextQuestion === 'emailForm') {
				simulatorBlock.innerHTML = '';
        questionTitle.textContent = '';
        showForm(); 
    } else {
        getNextQuestion(); 
    }
}); 


previousBtn.addEventListener('click', () => {
	const previousQuestion = localStorage.getItem('previousQuestion');
    const previousQuestionData = questionsData.find(question => question.question === previousQuestion);
    showQuestion(previousQuestionData); 
    questionTitle.textContent = previousQuestionData.question; 
    setItemStorage('indexCurrentQuestion', previousQuestionData.id); 
	deleteOldValue(); 
    const lastQuestion = previousQuestionArray.length - 1; 
    const newPreviousQuestion = previousQuestionArray[lastQuestion].question; 
    setItemStorage('previousQuestion', newPreviousQuestion);
});


function firstQuestion() {
    const firstQuestionData = questionsData.find(question => question.id === questionIndex);
    setItemStorage('indexCurrentQuestion', firstQuestionData.id); 

    questionTitle.textContent = firstQuestionData.question;  
       
    showQuestion(firstQuestionData); 
}


function showQuestion(currentQuestion) {
    const answerBlock = document.getElementById('answer-block').firstChild;
    simulatorBlock.innerHTML = ''; 
   
    currentQuestion.choices.forEach((choice, index) => {
        const cloneAnswerBlock = answerBlock.cloneNode(true); 
        simulatorBlock.appendChild(cloneAnswerBlock); 
        answer = simulatorBlock.children[index];
   
        const { id, value, image } = choice; 
        const input = answer.querySelector('.simulator-radio'); 
        input.setAttribute('id', id); 
        input.setAttribute('value', id); 
   
        const label = answer.querySelector('.simulator-answer'); 
        label.textContent = value; 
        label.setAttribute('for', id); 
     
        const emoji = answer.querySelector('.simulator-emoji');
        if (image) { 
            emoji.textContent = image; 
        } else {
            emoji.remove(); 
        }
   
        answer.addEventListener('click', () => { 
            setItemStorage('indexCurrentChoice', input.id); 
            updateLocalStorage(currentQuestion); 
        }); 

        input.addEventListener('click', (e) => {
            [...document.querySelectorAll('.simulator-answer-btn')].forEach(element => {
                element.classList.remove('simulator-checked'); 
            });
            e.currentTarget.parentNode.classList.add('simulator-checked');
        });
    }); 
}


function updateLocalStorage(currentQuestion) {
    const currentChoiceIndex = parseInt(localStorage.getItem('indexCurrentChoice')); 
    const currentChoiceData = currentQuestion.choices.find(data => data.id === currentChoiceIndex)
    setItemStorage('indexNextQuestion', currentChoiceData.nextQuestion);
}


function getNextQuestion() {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexNextQuestion')); 
    const currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
    setItemStorage('indexCurrentQuestion', currentQuestionData.id)

    questionTitle.textContent = currentQuestionData.question;
     
    showQuestion(currentQuestionData); 
}


function showForm() { 
	simulatorOptions.innerHTML = '';
	questionTitle.textContent = 'Résultat'; 
    const formTemplate = document.getElementById('simulator-form-block');  
    addHiddenClass(nextBtn); 
    removeHiddenClass(formTemplate); 

    simulatorOptions.append(formTemplate); 
}


function updateResultArray(currentChoice, currentQuestion) {
    if (currentChoice.result === true) {
        const newResult = new Object(); 
        newResult.question = `${currentQuestion.question}`;
        newResult.result = `${currentChoice.resultValue}`;
        resultArray.push(newResult); 
        setItemStorage('result', currentChoice.resultValue); 
    }
}
   
function storeResult() {
    const indexCurrentChoice = parseInt(localStorage.getItem('indexCurrentChoice')); 
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    const currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
    const currentChoiceData = currentQuestionData.choices.find(choice => choice.id === indexCurrentChoice); 
		updateResultArray(currentChoiceData, currentQuestionData); 
    updatePreviousQuestionArray(currentQuestionData, currentChoiceData); 
    console.log(previousQuestionArray);
}


function updatePreviousQuestionArray(currentQuestion, currentChoice) {
    const newValue = new Object(); 
    newValue.question = `${currentQuestion.question}`; 
    newValue.value = `${currentChoice.value}`; 
    setItemStorage('previousQuestion', currentQuestion.question); 
    previousQuestionArray.push(newValue); 
}

function deleteOldValue() {
    const previousQuestion = localStorage.getItem('previousQuestion'); 
    const currentQuestionData = questionsData.find(question => question.question === previousQuestion); 
  
    const answerToFind = previousQuestionArray.find(answer => answer.question === currentQuestionData.question);
  
    let indexAnswerToFind = previousQuestionArray.indexOf(answerToFind); 
  
    previousQuestionArray.splice(indexAnswerToFind, 1); 
} 



/*function setItemStorage(key, value) {
    localStorage.setItem(key, value); 
}


startBtn.addEventListener('click', () => {
    setItemStorage('indexPreviousQuestion', 0); 
    setItemStorage('indexCurrentChoice', 0); 
    setItemStorage('indexCurrentQuestion', 0);
    firstQuestion();
});


nextBtn.addEventListener('click', () => {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    const indexNextQuestion = localStorage.getItem('indexNextQuestion'); 
    storeResult();

    if (indexNextQuestion === 'emailForm') {
        simulatorBlock.innerHTML = '';
        questionTitle.textContent = '';
        showForm(); 
    } else {
        getNextQuestion(); 
    }
}); 


function firstQuestion() {
    const firstQuestionData = questionsData.find(question => question.id === questionIndex);
    setItemStorage('indexCurrentQuestion', firstQuestionData.id); 

    questionTitle.textContent = firstQuestionData.question;  
       
    showQuestion(firstQuestionData); 
}


function showQuestion(currentQuestion) {
    const answerBlock = document.getElementById('answer-block');
    simulatorBlock.innerHTML = ''; 
   
    currentQuestion.choices.forEach((choice, index) => {
        const cloneAnswerBlock = answerBlock.cloneNode(true); 
        simulatorBlock.appendChild(cloneAnswerBlock); 
        answer = simulatorBlock.children[index];
   
        const { id, value, image } = choice; 
        const input = answer.querySelector('.simulator-radio'); 
        input.setAttribute('id', id); 
        input.setAttribute('value', id); 
   
        const label = answer.querySelector('.simulator-answer'); 
        label.textContent = value; 
        label.setAttribute('for', id); 
     
        const emoji = answer.querySelector('.simulator-emoji');
        if (image) { 
            emoji.textContent = image; 
        } else {
            emoji.remove(); 
        }
   
        answer.addEventListener('click', () => { 
            setItemStorage('indexCurrentChoice', input.id); 
            updateLocalStorage(currentQuestion); 
        }); 

        input.addEventListener('click', (e) => {
            [...document.querySelectorAll('.simulator-answer-btn')].forEach(element => {
                element.classList.remove('simulator-checked'); 
            });
            e.currentTarget.parentNode.classList.add('simulator-checked');
        });
    }); 
}

function updateLocalStorage(currentQuestion) {
    const currentChoiceIndex = parseInt(localStorage.getItem('indexCurrentChoice')); 
    const currentChoiceData = currentQuestion.choices.find(data => data.id === currentChoiceIndex)
    setItemStorage('indexNextQuestion', currentChoiceData.nextQuestion);
}


function getNextQuestion() {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexNextQuestion')); 
    const currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
    setItemStorage('indexCurrentQuestion', currentQuestionData.id)

    questionTitle.textContent = currentQuestionData.question;
     
    showQuestion(currentQuestionData); 
}


function showForm() {
    const formulaire = document.getElementById('form'); 
    const cloneForm = formulaire.content.cloneNode(true); 
    nextBtn.classList.add('hidden'); 
    viewAnswerBtn.classList.remove('hidden'); 

    simulatorBlock.append(cloneForm); 
}


function updateResultArray(currentChoice, currentQuestion) {
    if (currentChoice.result === true) {
        const newResult = new Object(); 
        newResult.question = `${currentQuestion.question}`;
        newResult.result = `${currentChoice.resultValue}`;
        resultArray.push(newResult); 
    }
}
   
function storeResult() {
    const indexCurrentChoice = parseInt(localStorage.getItem('indexCurrentChoice')); 
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    const currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
    const currentChoiceData = currentQuestionData.choices.find(choice => choice.id === indexCurrentChoice); 
    updateResultArray(currentChoiceData, currentQuestionData);
    updatePreviousQuestionArray(currentQuestionData, currentChoiceData); 
}


function updatePreviousQuestionArray(currentQuestion, currentChoice) {
    const newValue = new Object(); 
    newValue.question = `${currentQuestion.question}`; 
    newValue.value = `${currentChoice.value}`; 
    setItemStorage('previousQuestion', currentQuestion.question); 
    previousQuestionArray.push(newValue); 
}

function deleteOldValue() {
    const previousQuestion = localStorage.getItem('previousQuestion'); 
    const currentQuestionData = questionsData.find(question => question.question === previousQuestion); 
  
    const answerToFind = previousQuestionArray.find(answer => answer.question === currentQuestionData.question);
  
    let indexAnswerToFind = previousQuestionArray.indexOf(answerToFind); 
  
    previousQuestionArray.splice(indexAnswerToFind, 1); 
}*/



/*

CODE WEBFLOW ME RESULTAT 

<script>

const resultText = document.getElementById('simulator-result-explanation-container');
const resultStorage = localStorage.getItem('result');  
const nextBtn = document.getElementById('next-button'); 


function addHiddenClass(elementProperty) {
	elementProperty.classList.add('simulator-hidden'); 
}

function removeHiddenClass(elementProperty) {
	elementProperty.classList.remove('simulator-hidden'); 
}


function fillAnswer(number) {
	const explanation = document.getElementById(`simulator-${number}-explanation`); 
  explanation.classList.remove('simulator-hidden'); 
	resultText.append(explanation);
}


if (resultStorage === "Plus de 85 500€" || resultStorage === "Particuliers") {
  fillAnswer('first');
} else if (resultStorage === "Plus de % de votre CA") { 
  fillAnswer('two');
} else if (resultStorage === "Moins de % de votre CA") {
  fillAnswer('three'); 
} else if (resultStorage === "Professionnels") {
  fillAnswer('four');
} else {
  fillAnswer('five'); 
}


nextBtn.addEventListener('click', () => {
	addHiddenClass(document.getElementById('simulator-result-container')); 
  removeHiddenClass(document.getElementById('simulator-two-answers'));
  const questionTitle = document.getElementById('simulator-result-title'); 
  
  if (resultStorage === "Plus de 85 500€" || resultStorage === "Particuliers") {
  	questionTitle.textContent = "Vous souhaitez qu'Acasi vous aide à choisir votre nouveau statut ?";
	} else if (resultStorage === "Professionnels") {
  	questionTitle.textContent = "Souhaitez-vous qu'on vous aide à préparer la transition vers le régime de la TVA ?";
	} else if (resultStorage === "Plus de 176 200€") {
  	questionTitle.textContent = "Vous souhaitez avoir de l'aide pour la transition vers un autre statut juridique ?";
  } else {
  	return window.location.href = "https://www.acasi.io/"; 
	}
  addHiddenClass(nextBtn); 
});


const yesToHelp = document.getElementById('yes-to-help'); 
const noToHelp = document.getElementById('no-to-help');


yesToHelp.addEventListener('click', () => {
	removeHiddenClass(document.getElementById('simulator-result-container')); 
  addHiddenClass(document.getElementById('simulator-two-answers'));
	resultText.textContent = "Nous allons vous rappeler dans la journée !";  
});


noToHelp.addEventListener('click', () => {
	removeHiddenClass(document.getElementById('simulator-result-container')); 
  addHiddenClass(document.getElementById('simulator-two-answers'));
	resultText.textContent = "Pas de problèmes ! Sachez qu'en ce moment, la création de société est totalement gratuite avec Acasi. J'en profite !"; 
});


</script>

*/