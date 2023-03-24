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
                nextQuestion: "emailForm"
            }, 
            {
                id: 2, 
                value: "Moins de % de votre CA", 
                nextQuestion: "emailForm" 
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
                nextQuestion: "emailForm"
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
                nextQuestion: "emailForm"
            }, 
            {
                id: 2, 
                value: "Professionnels (autres sociétés)", 
                nextQuestion: "emailForm"
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
                nextQuestion: "emailForm"
            }
        ]
    }
]; 


let questionIndex = 0; 
const previousBtn = document.getElementById('previous-button'); 
const nextBtn = document.getElementById('next-button'); 
const viewAnswerBtn = document.querySelector('.view-answer'); 
const questionTitle = document.getElementById('question');
let resultArray = []; 
const simulatorBlock = document.getElementById('simulator-block');


function setItemStorage(key, value) {
    localStorage.setItem(key, value); 
}


window.addEventListener('load', () => {
    setItemStorage('indexPreviousQuestion', 0); 
    setItemStorage('indexCurrentChoice', 0); 
    setItemStorage('indexCurrentQuestion', 0);
    firstQuestion();
});


nextBtn.addEventListener('click', () => {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    const indexNextQuestion = localStorage.getItem('indexNextQuestion'); 

    if (indexNextQuestion === 'emailForm') {
        simulatorBlock.innerHTML = '';
        questionTitle.textContent = '';
        showForm(); 
    } else {
        getNextQuestion(); 
    }
    //storeResult();
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
        const cloneAnswerBlock = answerBlock.content.cloneNode(true); 
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

        /*input.addEventListener('click', (e) => {
            [...document.querySelectorAll('.simulator-answer-btn')].forEach(element => {
                element.classList.remove('simulator-checked'); 
            });
            e.currentTarget.parentNode.classList.add('simulator-checked');
        });*/
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


function getAnswer() {
    simulatorBlock.innerHTML = ''; 
    const indexLastChoice = parseInt(localStorage.getItem('indexCurrentChoice')); 
    const indexLastQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 

    if (indexLastQuestion === 3 && indexLastChoice === 1) {
        simulatorBlock.innerHTML = '3 et 1'; 
    } else if (indexLastQuestion === 2 && indexLastChoice === 1) {
        simulatorBlock.innerHTML = '2 et 1'; 
    } else if (indexLastQuestion === 2 && indexLastChoice === 2) {
        simulatorBlock.innerHTML = '2 et 2';  
    } else if (indexLastQuestion === 4 && indexLastChoice === 1) {
        simulatorBlock.innerHTML = '4 et 1'; 
    } else if (indexLastQuestion === 4 && indexLastChoice === 2) {
        simulatorBlock.innerHTML = '4 et 2';  
    } else {
        simulatorBlock.innerHTML = 'autre';  
    }
}


viewAnswerBtn.addEventListener('click', () => {
    const emailInput = document.getElementById('email'); 
    const telInput = document.getElementById('tel'); 
    if (emailInput.value === '' || telInput.value === '') {
        alert('Veuillez renseignez votre mail et votre numéro de téléphone pour accéder à la réponse'); 
    } else {
        getAnswer(); 
    }
}); 