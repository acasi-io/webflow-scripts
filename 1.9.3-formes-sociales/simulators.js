const questionsData = [
    {   
        id: 0, 
        question: "Quel est votre statut actuel ?", 
        theme: "Votre statut",
        nextQuestion: 1,
        choices: [
            {
                id: 1, 
                value: "Salarié",
                image: "💼"
            }, 
            {
                id: 2, 
                value: "Bénéficiaire du chômage",
                image: "🌴"
            }, 
            {
                id: 3, 
                value: "Micro-entrepreneur", 
                image: "🚗"
            }, 
            {
                id: 4, 
                value: "Entrepreneur (EI, SAS/SASU, SARL/EURL)", 
                image: "🚀"
            }
        ]
    }, 
    {
        id: 1,
        question: "Vous vous lancez seul ou à plusieurs ?", 
        theme: "Votre statut",
        nextQuestion: 2, 
        choices: [
            {
                id: 1, 
                value: "Je souhaite créer une société seul", 
                image: "👩",
                result: true, 
                resultValue: "société seul"
            }, 
            {
                id: 2, 
                value: "Je souhaite créer une société à plusieurs", 
                image: "👱‍♀️👩👨",
                result: true, 
                resultValue: "société à plusieurs"
            }
        ]
    },
    {
        id: 2,
        question: "Comptez-vous embaucher des salariés ?", 
        theme: "Votre projet",
        nextQuestion: 3,
        choices: [
            {
                id: 1, 
                value: "Oui", 
                image: "✅"
            }, 
            {
                id: 2, 
                value: "Non", 
                image: "❌"
            }
        ]
    },
    { 
        id: 3,
        question: "Quelle est la nature de votre projet ?", 
        theme: "Votre projet",
        nextQuestion: 4,
        choices: [
            {
                id: 1, 
                value: "Profession réglementée (avocats, médecins...)", 
                image: "👩‍⚕️"
            }, 
            {
                id: 2, 
                value: "Prestation de service / conseil", 
                image: "👩‍💻"
            },
            {
                id: 3, 
                value: "Vente de biens et de marchandises", 
                image: "🏠"
            }, 
            {
                id: 4, 
                value: "Artisanat", 
                image: "🚕"
            }, 
            {
                id: 5, 
                value: "Autre"
            }
        ]
    }, 
    {
        id: 4, 
        question: "Quel chiffre d'affaires envisagez-vous ?", 
        theme: "Données financières",
        nextQuestion: 5,
        choices: [
            {
                id: 1, 
                value: "Moins de 35k par an", 
                image: "💰",
                result: true,
                resultValue: "moins de 35k"
            }, 
            {
                id: 2, 
                value: "Plus de 35k par an", 
                image: "💰💰"
            }
        ]
    }, 
    {
        id: 5, 
        question: "Combien de charges prévoyez-vous ?", 
        theme: "Données financières",
        nextQuestion: 6,
        choices: [
            {
                id: 1, 
                value: "10% du chiffre d'affaires"
            }, 
            {
                id: 2, 
                value: "20% du chiffre d'affaires"
            }, 
            {
                id: 3, 
                value: "40% du chiffre d'affaires"
            }, 
            {
                id: 4, 
                value: "plus de 50% du chiffre d'affaires"
            }
        ]
    },
    {
        id: 6, 
        question: "Combien souhaitez-vous vous rémunérer ?", 
        theme: "Rémunération du dirigeant",
        nextQuestion: 'emailForm',
        choices: [
            {
                id: 1, 
                value: "Je souhaite me verser un salaire tous les mois", 
                result: true, 
                resultValue: "salaire"
            }, 
            {
                id: 2, 
                value: "Je souhaite me rémunérer en dividendes 1 fois par an", 
                result: true,
                resultValue: "dividendes"
            }
        ]
    }
]; 
   
   
const startBtn = document.getElementById('start-button'); 
const nextBtn = document.getElementById('next-button'); 
const previousBtn = document.querySelector('.previous-button'); 
const questionTitle = document.getElementById('question'); 
const questionIndex = 0; 
const simulatorOptions = document.getElementById('simulator-options');
let resultArray = [];
const questionTheme = document.querySelector('.simulator-theme');
const totalQuestions = Object.keys(questionsData).length;
const simulatorInformation = document.getElementById('simulator-information');


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
    questionTheme.textContent = currentQuestion.theme; 
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

   
/*nextBtn.addEventListener('click', () => {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    storeResult();

    if (indexCurrentQuestion !== totalQuestions - 1) {
        previousBtn.classList.remove('simulator-hidden');
        getNextQuestion();
    }
    setIndexPreviousQuestion();
   
    if (indexCurrentQuestion === totalQuestions - 1) {
        showForm();
        addHiddenClass(previousBtn)
        setItemStorage('indexPreviousQuestion', totalQuestions - 1); 
        setItemStorage('indexCurrentQuestion', 'emailForm'); 
        addHiddenClass(document.getElementById('simulator-block')); 
        simulatorInformation.textContent = ''; 
    } 
}); */


function nextQuestion() {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    storeResult();

    if (indexCurrentQuestion !== totalQuestions - 1) {
        previousBtn.classList.remove('simulator-hidden');
        getNextQuestion();
    }
    setIndexPreviousQuestion();
   
    if (indexCurrentQuestion === totalQuestions - 1) {
        showForm();
        addHiddenClass(previousBtn)
        setItemStorage('indexPreviousQuestion', totalQuestions - 1); 
        setItemStorage('indexCurrentQuestion', 'emailForm'); 
        addHiddenClass(document.getElementById('simulator-block')); 
        simulatorInformation.textContent = ''; 
    } 
}


previousBtn.addEventListener('click', () => {
    getPreviousQuestion(); 
    setIndexPreviousQuestion();
    deleteOldValue();
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    const indexNextQuestion = localStorage.getItem('indexNextQuestion'); 
    if (indexCurrentQuestion === 0) {
        previousBtn.classList.add('simulator-hidden'); 
    } else if (indexNextQuestion === 'emailForm') {
        removeHiddenClass(document.getElementById('simulator-block')); 
        addHiddenClass(document.querySelector('.simulator-form-block')); 
        removeHiddenClass(nextBtn);  
    } else {
        return;
    }
}); 
   
   
function showQuestion(currentQuestion) {
    const answerBlock = document.getElementById('answer-block').firstChild;
    const simulatorBlock = document.getElementById('simulator-block'); 
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
            //setItemStorage('indexNextQuestion', currentQuestion.nextQuestion); 
            setItemStorage('indexNextQuestion', currentQuestion.id + 1); 
            nextQuestion();
        }); 

        input.addEventListener('click', (e) => {
            [...document.querySelectorAll('.simulator-answer-btn')].forEach(element => {
                element.classList.remove('simulator-checked'); 
            });
            e.currentTarget.parentNode.classList.add('simulator-checked');
        });
    }); 
}

   
function firstQuestion() {
    const firstQuestionData = questionsData.find(question => question.id === questionIndex);
    setItemStorage('indexCurrentQuestion', firstQuestionData.id); 

    fillQuestionTitleTheme(firstQuestionData); 
       
    showQuestion(firstQuestionData); 
}
   
   
function getNextQuestion() {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexNextQuestion')); 
    const currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
    setItemStorage('indexCurrentQuestion', currentQuestionData.id); 
    setItemStorage('indexNextQuestion', currentQuestionData.id + 1); 

    fillQuestionTitleTheme(currentQuestionData); 
     
    showQuestion(currentQuestionData); 
}
   
   
function getPreviousQuestion() { 
    let indexPreviousQuestion = parseInt(localStorage.getItem('indexPreviousQuestion')); 
    const previousQuestionData = questionsData.find(question => question.id === indexPreviousQuestion); 

    fillQuestionTitleTheme(previousQuestionData); 
   
    showQuestion(previousQuestionData); 
    setItemStorage('indexCurrentQuestion', previousQuestionData.id); 
}

   
function setIndexPreviousQuestion() {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    let indexPreviousQuestion = indexCurrentQuestion - 1; 
    setItemStorage('indexPreviousQuestion', indexPreviousQuestion); 
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
}
    
   
function showForm() {
    simulatorOptions.innerHTML = ''; 
    questionTitle.innerHTML = 'Entrez vos coordonnées pour afficher le résultat de la simulation';
    questionTheme.innerHTML = 'Résultat';
    const formTemplate = document.querySelector('.simulator-form-block'); 
    addHiddenClass(nextBtn); 
    removeHiddenClass(formTemplate);  

    const resultInput = document.getElementById('result');
    const plusieursAnswer = resultArray.find(answer => answer.result === 'société à plusieurs'); 
    const dividendesAnswer = resultArray.find(answer => answer.result === 'dividendes'); 
    const microEntrepriseAnswer = resultArray.find(answer => answer.result === 'moins de 35k'); 
    const seulAnswer = resultArray.find(answer => answer.result === 'société seul'); 
    const salaireAnswer = resultArray.find(answer => answer.result === 'salaire');

    if (microEntrepriseAnswer) {
        resultInput.value = 'micro-entreprise';
    } else if (seulAnswer && dividendesAnswer) {
        resultInput.value = 'SASU';
    } else if (plusieursAnswer && dividendesAnswer) {
        resultInput.value = 'SAS'; 
    } else if (salaireAnswer && plusieursAnswer) {
        resultInput.value = 'SARL ou SAS'; 
    } else if (seulAnswer && salaireAnswer) {
        resultInput.value = 'EURL ou SASU'; 
    } else {
        return;
    }
   
    simulatorOptions.append(formTemplate); 
}


const simulatorSubmitBtn = document.getElementById('simulator-submit-button'); 
simulatorSubmitBtn.addEventListener('click', () => {
    const resultInputValue = document.getElementById('result').value; 
    setItemStorage('result', resultInputValue);  
});


function deleteOldValue() {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    const currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
  
    const answerToFind = resultArray.find(answer => answer.question === currentQuestionData.question);
  
    let indexAnswerToFind = resultArray.indexOf(answerToFind); 
  
    resultArray.splice(indexAnswerToFind, 1); 
}