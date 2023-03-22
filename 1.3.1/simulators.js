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
const submitBtn = document.querySelector('.simulator-submit-button');
const totalQuestions = Object.keys(questionsData).length;
const simulatorInformation = document.getElementById('simulator-information');
   
   
startBtn.addEventListener('click', () => {
    localStorage.setItem('indexPreviousQuestion', 0);
    localStorage.setItem('indexCurrentChoice', 0); 
    localStorage.setItem('indexCurrentQuestion', 0);
    document.getElementById('form-question').classList.remove('simulator-hidden');
    document.querySelector('.simulator-start').classList.add('simulator-hidden');
    document.querySelector('.simulator-start-image').classList.add('simulator-hidden');
    document.querySelector('.simulator-questions-image').classList.remove('simulator-hidden');
    firstQuestion();
}); 
   
nextBtn.addEventListener('click', () => {
    const indexNextQuestion = localStorage.getItem('indexNextQuestion'); 
   
    if (indexNextQuestion === 'emailForm') {
        showForm();
        setIndexPreviousQuestion(); 
        localStorage.setItem('indexPreviousQuestion', totalQuestions - 1);
        localStorage.setItem('indexCurrentQuestion', 'emailForm'); 
        document.getElementById('simulator-block').classList.add('simulator-hidden');
        simulatorInformation.textContent = ''; 
    } else {
        previousBtn.classList.remove('simulator-hidden');
        getNextQuestion(); 
        setIndexPreviousQuestion(); 
    } 
    storeResult(); 
    console.log(resultArray);
}); 


previousBtn.addEventListener('click', () => {
    getPreviousQuestion(); 
    setIndexPreviousQuestion();
    deleteOldValue();
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    const indexNextQuestion = localStorage.getItem('indexNextQuestion'); 
    if (indexCurrentQuestion === 0) {
        previousBtn.classList.add('simulator-hidden'); 
    } else if (indexNextQuestion === 'emailForm') {
        document.getElementById('simulator-block').classList.remove('simulator-hidden');
        document.querySelector('.simulator-form-block').classList.add('simulator-hidden'); 
        submitBtn.classList.add('simulator-hidden');
        nextBtn.classList.remove('simulator-hidden'); 
        
    } else {
        return;
    }
}); 
   
   
function showQuestion(currentQuestion) {
    fillContent(currentQuestion);
}
   
   
function fillContent(currentQuestion) {
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
        console.log(input.id);
            localStorage.setItem('indexCurrentChoice', input.id);
            localStorage.setItem('indexNextQuestion', currentQuestion.nextQuestion);
        }); 
    }); 
}

   
function firstQuestion() {
    const firstQuestionData = questionsData.find(question => question.id === questionIndex);
    localStorage.setItem('indexCurrentQuestion', firstQuestionData.id); 
   
    questionTitle.textContent = firstQuestionData.question;
    questionTheme.textContent = firstQuestionData.theme;
       
    showQuestion(firstQuestionData); 
}
   
   
function getNextQuestion() {
    //simulatorOptions.innerHTML = ''; 
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexNextQuestion')); 
    const currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
    localStorage.setItem('indexCurrentQuestion', currentQuestionData.id); 
   
    questionTitle.textContent = currentQuestionData.question;
    questionTheme.textContent = currentQuestionData.theme;
     
    showQuestion(currentQuestionData); 
}
   
   
function getPreviousQuestion() {
    //simulatorOptions.innerHTML = '';  
    let indexPreviousQuestion = parseInt(localStorage.getItem('indexPreviousQuestion')); 
    const previousQuestionData = questionsData.find(question => question.id === indexPreviousQuestion); 
   
    questionTitle.textContent = previousQuestionData.question; 
   
    showQuestion(previousQuestionData); 
    localStorage.setItem('indexCurrentQuestion', previousQuestionData.id);
}
   
function setIndexPreviousQuestion() {
    let indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    let indexPreviousQuestion = indexCurrentQuestion - 1; 
    localStorage.setItem('indexPreviousQuestion', indexPreviousQuestion);
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
    const indexPreviousQuestion = parseInt(localStorage.getItem('indexPreviousQuestion')); 
    const previousQuestionData = questionsData.find(question => question.id === indexPreviousQuestion); 
    const currentChoiceData = previousQuestionData.choices.find(choice => choice.id === indexCurrentChoice); 
    updateResultArray(currentChoiceData, previousQuestionData); 
}
    
   
function showForm() {
    simulatorOptions.innerHTML = ''; 
    questionTitle.innerHTML = 'Entrez vos coordonnées pour afficher le résultat de la simulation';
    questionTheme.innerHTML = 'Résultat';
    nextBtn.classList.add('simulator-hidden'); 
    submitBtn.classList.remove('simulator-hidden');
    const formTemplate = document.querySelector('.simulator-form-block'); 
    formTemplate.classList.remove('simulator-hidden'); 

    const resultInput = document.getElementById('result'); 
    fillAnswer(resultInput, value); 
   
    simulatorOptions.append(formTemplate); 
}

submitBtn.addEventListener('click', (e) => {
    e.preventDefault(); 
    simulatorOptions.innerHTML = ''; 
    previousBtn.classList.add('simulator-hidden'); 
    submitBtn.classList.add('simulator-hidden');
    getResult(); 
    simulatorInformation.textContent = 'Les résultats de cette simulation ne sont pas définitifs. D’autres paramètres personnels peuvent entrer en compte dans le choix de la forme sociale la plus adaptée pour vous. Si vous souhaitez avoir de l’aide d’un nos experts. Prenez rendez-vous ici'; 
});


function fillAnswer(element, property) {
    const plusieursAnswer = resultArray.find(answer => answer.result === 'société à plusieurs'); 
    const dividendesAnswer = resultArray.find(answer => answer.result === 'dividendes'); 
    const microEntrepriseAnswer = resultArray.find(answer => answer.result === 'moins de 35k'); 
    const seulAnswer = resultArray.find(answer => answer.result === 'société seul'); 
    const salaireAnswer = resultArray.find(answer => answer.result === 'salaire');

    if (microEntrepriseAnswer) {
        element.property = 'micro-entreprise';
    } else if (seulAnswer && dividendesAnswer) {
        element.property = 'SASU';
    } else if (plusieursAnswer && dividendesAnswer) {
        element.property = 'SAS'; 
    } else if (salaireAnswer && plusieursAnswer) {
        element.property = 'SARL'; 
    } else if (seulAnswer && salaireAnswer) {
        element.property = 'EURL'; 
    } else {
        return;
    }
}


function getResult() {
    questionTitle.textContent = 'La forme sociale recommandée pour vous est'; 
    questionTheme.textContent = 'Résultat'; 

    fillAnswer(simulatorOptions, innerHTML); 
}


function deleteOldValue() {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    const currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
  
    const answerToFind = resultArray.find(answer => answer.question === currentQuestionData.question);
  
    let indexAnswerToFind = resultArray.indexOf(answerToFind); 
  
    resultArray.splice(indexAnswerToFind, 1); 
}

const simulatorAnswers = document.querySelectorAll('.simulator-answer'); 

simulatorAnswers.forEach(simulatorAnswer => {
    simulatorAnswer.addEventListener('change', () => {
        document.querySelector('.simulator-answer-btn').classList.add('simulator-checked');
    }); 
}); 


const simulatorSubmitBtn = document.getElementById('simulator-submit-button2'); 
const mailInput = document.getElementById('email'); 
const phoneInput = document.getElementById('phone'); 

simulatorSubmitBtn.addEventListener('click', (e) => {
    if (mailInput.value != '' && phoneInput != '') { 
        e.preventDefault();
        simulatorOptions.innerHTML = ''; 
        previousBtn.classList.add('simulator-hidden'); 
        submitBtn.classList.add('simulator-hidden');
        simulatorSubmitBtn.classList.add('simulator-hidden');
        getResult(); 
        simulatorInformation.textContent = 'Les résultats de cette simulation ne sont pas définitifs. D’autres paramètres personnels peuvent entrer en compte dans le choix de la forme sociale la plus adaptée pour vous. Si vous souhaitez avoir de l’aide d’un nos experts. Prenez rendez-vous ici'; 
    } else {
        return; 
    }
});