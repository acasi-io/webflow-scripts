const questionsData = [
    {   
        id: 0, 
        question: "Quel est votre type d'activité ?", 
        questionTree: "Quel est votre type d'activité ?",
        property: "company_creation_activity",
        choices: [
            {
                id: 1, 
                value: "Vente de marchandises", 
                image: "🏠", 
                highlight: true, 
                nextQuestion: 1,
                hubspotValue: 'Achat/Vente',
            }, 
            {
                id: 2, 
                value: "Prestation de services",
                image: "👩‍💻", 
                highlight: true, 
                nextQuestion: 6,
                hubspotValue: 'Services',
            }
        ]
    }, 
    {
        id: 1,
        question: "Cette année, vous allez réaliser", 
        questionTree: "Marchandises - Cette année vous allez réaliser",
        property: "estimated_revenue",
        choices: [
            {
                id: 1, 
                value: "Moins de 91 900€ de CA", 
                image: "💰", 
                nextQuestion: 2,
                hubspotValue: 'Franchise de TVA',
            }, 
            {
                id: 2, 
                value: "Entre 91 900€ et 101 000€ de CA", 
                image: "💰💰", 
                nextQuestion: 3,
                hubspotValue: 'Seuil majoré de TVA',
            }, 
            {
                id: 3, 
                value: "Plus de 101 000€ de CA", 
                image: "💰💰💰", 
                nextQuestion: 4,
                hubspotValue: 'Sortie de la franchise de TVA',
            }, 
            {
                id: 4, 
                value: "Plus de 188 700€ de CA", 
                image: "💰💰💰💰", 
                nextQuestion: 5,
                hubspotValue: 'Dépassement du seuil maximal',
            }
        ]
    },
    {
        id: 2,
        question: "Vos charges représentent", 
        questionTree: "Marchandises - vos charges représentent",
        property: "over_allowance_threshold",
        choices: [
            {
                id: 1, 
                value: "Plus de 34% de votre CA", 
                nextQuestion: "emailForm", 
                result: true, 
                resultValue: "Plus de 34% de votre CA",
                hubspotValue: true,
            }, 
            {
                id: 2, 
                value: "Moins de 34% de votre CA", 
                nextQuestion: "emailForm", 
                result: true, 
                resultValue: "Moins de 34% de votre CA",
                hubspotValue: false,
            }
        ]
    },
    { 
        id: 3,
        question: "L'année dernière vous avez réalisé", 
        questionTree: "Marchandises - L'année dernière vous avez réalisé",
        property: "previous_revenue",
        choices: [
            {
                id: 1, 
                value: "Plus de 91 900€", 
                nextQuestion: "emailForm", 
                image: "💰💰", 
                result: true, 
                resultValue: "Plus de 91 900€",
                hubspotValue: 'Dépassement du seuil de franchise de TVA',
            }, 
            {
                id: 2, 
                value: "Moins de 91 900€", 
                image: "💰", 
                nextQuestion: 2,
                hubspotValue: 'Franchise de TVA',
            },
            {
                id: 3, 
                value: "C'est ma premère année d'activité", 
                image: "🚀", 
                nextQuestion: 2,
                hubspotValue: "1ère année d'activité",
            }
        ]
    }, 
    {
        id: 4, 
        question: "Vos clients sont majoritairement des", 
        questionTree: "Marchandises - vos clients sont majoritairement des",
        property: "professional_customers",
        choices: [
            {
                id: 1, 
                value: "Particuliers", 
                nextQuestion: "emailForm", 
                image: "👩‍💼", 
                result: true, 
                resultValue: "Particuliers",
                hubspotValue: false,
            }, 
            {
                id: 2, 
                value: "Professionnels (autres sociétés)", 
                nextQuestion: "emailForm", 
                image: "🏭", 
                result: true, 
                resultValue: "Professionnels",
                hubspotValue: true,
            }
        ]
    }, 
    {
        id: 5, 
        question: "L'année dernière vous avez réalisé", 
        questionTree: "Marchandises - l'année dernière vous avez réalisé",
        property: "previous_revenue_above_threshold",
        choices: [
            {
                id: 1, 
                value: "Moins de 188 700€", 
                image: "💰", 
                nextQuestion: 2,
                hubspotValue: false,
            }, 
            {
                id: 2, 
                value: "Plus de 188 700€", 
                nextQuestion: "emailForm", 
                image: "💰💰", 
                result: true,
                resultValue: "Plus de 188 700€",
                hubspotValue: true,
            }
        ]
    },
    {
        id: 6,
        question: "Cette année, vous allez réaliser", 
        questionTree: "Services - cette année, vous allez réaliser",
        property: "estimated_revenue",
        choices: [
            {
                id: 1, 
                value: "Moins de 36 800€ de CA", 
                image: "💰", 
                nextQuestion: 7,
                hubspotValue: 'Franchise de TVA',
            }, 
            {
                id: 2, 
                value: "Entre 36 800€ et 39 100€ de CA", 
                image: "💰💰", 
                nextQuestion: 8,
                hubspotValue: 'Seuil majoré de TVA',
            }, 
            {
                id: 3, 
                value: "Plus de 39 100€ de CA", 
                image: "💰💰💰", 
                nextQuestion: 9,
                hubspotValue: 'Dépassement du seuil de franchise de TVA',
            }, 
            {
                id: 4, 
                value: "Plus de 77 700€ de CA", 
                image: "💰💰💰💰", 
                nextQuestion: 10,
                hubspotValue: 'Dépassement du seuil maximal',
            }
        ]
    },
    {
        id: 7,
        question: "Vos charges représentent", 
        questionTree: "Services - vos charges représentent",
        property: "over_allowance_threshold",
        choices: [
            {
                id: 1, 
                value: "Plus de 50% de votre CA", 
                nextQuestion: "emailForm", 
                result: true, 
                resultValue: "Plus de 50% de votre CA",
                hubspotValue: true,
            }, 
            {
                id: 2, 
                value: "Moins de 50% de votre CA", 
                nextQuestion: "emailForm", 
                result: true, 
                resultValue: "Moins de 50% de votre CA",
                hubspotValue: false,
            }
        ]
    },
    { 
        id: 8,
        question: "L'année dernière vous avez réalisé", 
        questionTree: "Services - l'année dernière vous avez réalisé",
        property: "previous_revenue",
        choices: [
            {
                id: 1, 
                value: "Plus de 36 800€", 
                nextQuestion: "emailForm", 
                image: "💰💰", 
                result: true, 
                resultValue: "Plus de 36 800€",
                hubspotValue: "Dépassement du seuil de franchise de TVA",
            }, 
            {
                id: 2, 
                value: "Moins de 36 800€", 
                image: "💰", 
                nextQuestion: 7,
                hubspotValue: "Franchise de TVA",
            },
            {
                id: 3, 
                value: "C'est ma premère année d'activité", 
                image: "🚀", 
                nextQuestion: 7,
                hubspotValue: "1ère année d'activité",
            }
        ]
    }, 
    {
        id: 9, 
        question: "Vos clients sont majoritairement des", 
        questionTree: "Services - vos clients sont majoritairement des",
        property: "professional_customers",
        choices: [
            {
                id: 1, 
                value: "Particuliers", 
                nextQuestion: "emailForm", 
                image: "👩‍💼", 
                result: true, 
                resultValue: "Particuliers",
                hubspotValue: false,
            }, 
            {
                id: 2, 
                value: "Professionnels (autres sociétés)", 
                nextQuestion: "emailForm", 
                image: "🏭", 
                result: true, 
                resultValue: "Professionnels",
                hubspotValue: true,
            }
        ]
    }, 
    {
        id: 10, 
        question: "L'année dernière vous avez réalisé ", 
        questionTree: "Services - l'année dernière vous avez réalisé ",
        property: "previous_revenue_above_threshold",
        choices: [
            {
                id: 1, 
                value: "Moins de 77 700€", 
                image: "💰", 
                nextQuestion: 7,
                hubspotValue: false
            }, 
            {
                id: 2, 
                value: "Plus de 77 700€", 
                nextQuestion: "emailForm", 
                image: "💰💰", 
                result: true,
                resultValue: "Plus de 77 700€",
                hubspotValue: true
            }
        ]
    }
];


const previousBtn = document.getElementById('previous-button'); 
let previousQuestionArray = []; 
let previousQuestionArrayLength = Object.keys(previousQuestionArray).length; 


function nextQuestion() {
    const indexNextQuestion = localStorage.getItem('indexNextQuestion'); 
    storeResult(); 
    removeHiddenClass(previousBtn);

    if (indexNextQuestion === 'emailForm') {
		simulatorBlock.innerHTML = '';
        showForm(); 
    } else {
        getNextQuestion(); 
    }
}


previousBtn.addEventListener('click', () => {
	const previousQuestion = localStorage.getItem('previousQuestion');
    const previousQuestionData = questionsData.find(question => question.questionTree === previousQuestion);
    showQuestion(previousQuestionData); 
    /*if (previousQuestionData.theme) {
        fillQuestionTitleTheme(previousQuestionData); 
    } else {
        questionTitle.textContent = previousQuestionData.question; 
        addHiddenClass(questionTheme); 
    }
    fillQuestionTitleTheme(previousQuestionData);*/
    questionTitle.textContent = previousQuestionData.question; 
    setItemStorage('indexCurrentQuestion', previousQuestionData.id); 
	deleteOldValue(); 
    if (previousQuestionData.id === 0) {
        addHiddenClass(previousBtn); 
    } else {
        const lastQuestion = previousQuestionArray.length - 1; 
        const newPreviousQuestion = previousQuestionArray[lastQuestion].question; 
        setItemStorage('previousQuestion', newPreviousQuestion);
    } 
});


function getNextQuestion() {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexNextQuestion')); 
    const currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
    setItemStorage('indexCurrentQuestion', currentQuestionData.id);
    //getCurrentQuestionForNextQuestion(currentQuestionData, questionsData); 

    questionTitle.textContent = currentQuestionData.question;
    showQuestion(currentQuestionData); 
}


function showForm() { 
	simulatorOptions.innerHTML = '';
    questionTitle.textContent = 'Entrez vos coordonnées pour afficher le résultat de la simulation';
	questionTheme.textContent = 'Résultat'; 
    const formTemplate = document.getElementById('simulator-form-block');  
    addHiddenClass(nextBtn); 
    removeHiddenClass(formTemplate);
    addHiddenClass(document.getElementById('simulator-information'));
    //forShowForm(formTemplate); 

    addHiddenClass(previousBtn); 
    removeHiddenClass(questionTheme); 

    simulatorOptions.append(formTemplate); 
}


/*function updateResultArray(currentChoice, currentQuestion) {
    if (currentChoice.result === true) {
        const newResult = new Object(); 
        newResult.question = `${currentQuestion.question}`;
        newResult.result = `${currentChoice.resultValue}`;
        resultArray.push(newResult); 
        setItemStorage('result', currentChoice.resultValue); 
    }
}*/
   
function storeResult() {
    const indexCurrentChoice = parseInt(localStorage.getItem('indexCurrentChoice')); 
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    const currentQuestionData = questionsData.find(question => question.id === indexCurrentQuestion); 
    const currentChoiceData = currentQuestionData.choices.find(choice => choice.id === indexCurrentChoice); 
	updateResultArray(currentChoiceData, currentQuestionData);
    //findQuestionForStoreResult(currentQuestionData, currentChoiceData, questionsData); 
    updatePreviousQuestionArray(currentQuestionData, currentChoiceData); 
}


function updatePreviousQuestionArray(currentQuestion, currentChoice) {
    const newValue = new Object();  
    newValue.question = `${currentQuestion.questionTree}`; 
    newValue.value = `${currentChoice.value}`; 
    setItemStorage('previousQuestion', currentQuestion.questionTree); 
    previousQuestionArray.push(newValue); 
}

function deleteOldValue() {
    const previousQuestion = localStorage.getItem('previousQuestion'); 
    const currentQuestionData = questionsData.find(question => question.questionTree === previousQuestion); 
  
    const answerToFind = previousQuestionArray.find(answer => answer.question === currentQuestionData.questionTree);
  
    let indexAnswerToFind = previousQuestionArray.indexOf(answerToFind); 
  
    previousQuestionArray.splice(indexAnswerToFind, 1); 
} 




/*

CODE WEBFLOW ME RESULTAT 

<script>

const resultText = document.getElementById('simulator-result-explanation-container');
const resultStorage = localStorage.getItem('result');  
const nextBtn = document.getElementById('next-button');
const previousBtn = document.getElementById('previous-button'); 
const resultWrapper = document.getElementById('simulator-result-wrapper');
const answers = document.getElementById('simulator-two-answers'); 
const resultHeading = document.getElementById('simulator-big-result'); 
const resultTitle = document.getElementById('simulator-result-title'); 
const rendezvousLink = document.getElementById('simulator-rendezvous-link'); 
const resultContainer = document.getElementById('simulator-result-container'); 


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


if (resultStorage === "Plus de 91 900€" || resultStorage === "Plus de 36 800€" || resultStorage === "Particuliers") {
	resultHeading.innerHTML = '👉 Vous allez dépasser le seuil de la franchise de TVA cette année.';
  	fillAnswer('first');
} else if (resultStorage === "Plus de 34% de votre CA") { 
	resultHeading.innerHTML = '👉 Vos charges sont supérieures à 34%. La micro-entreprise n’est pas adaptée pour vous';
  	fillAnswer('two');
} else if (resultStorage === "Moins de 34% de votre CA") {
	resultTitle.innerHTML = 'La micro-entreprise est adaptée à votre situation pour le moment';
  	resultHeading.innerHTML = '👉 Vos charges représentent moins de 34% de votre CA.'; 
  	fillAnswer('three'); 
} else if (resultStorage === "Professionnels") {
	resultHeading.innerHTML = '👉 Vous allez dépasser le seuil de la franchise de TVA cette année.'; 
  	fillAnswer('four');
} else if (resultStorage === "Plus de 50% de votre CA") {
	resultHeading.innerHTML = '👉 Vos charges sont supérieures à 50%. La micro-entreprise n’est pas adaptée pour vous';
  fillAnswer('six');
} else if (resultStorage === "Moins de 50% de votre CA") {
	resultTitle.innerHTML = 'La micro-entreprise est adaptée à votre situation pour le moment';
  	resultHeading.innerHTML = '👉 Vos charges représentent moins de 50% de votre CA.';
  	fillAnswer('seven');
} else {
	resultHeading.innerHTML = '👉 Attention ! Vous êtes sur le point de dépasser les seuils de CA durant deux années consécutives';
  	fillAnswer('five'); 
}


function showAnswers() {
	addHiddenClass(resultWrapper); 
  	removeHiddenClass(answers);
  	addHiddenClass(nextBtn); 
  	removeHiddenClass(rendezvousLink);
}


nextBtn.addEventListener('click', () => {  
	if (resultStorage === "Moins de 34% de votre CA" || resultStorage === "Moins de 50% de votre CA") {
  	rendezvous(); 
  } else if (resultStorage === "Professionnels") {
  	showAnswers(); 
  	resultTitle.textContent = "Vous souhaitez qu'Acasi vous aide à préparer votre transition vers la TVA ?";
	} else if (resultStorage === "Plus de 188 700€" || resultStorage === "Plus de 77 700€") {
  	showAnswers(); 
    resultTitle.textContent = "Vous souhaitez avoir de l'aide pour la transition vers un autre statut juridique ?";
  } else {
  	showAnswers(); 
    resultTitle.textContent = "Vous souhaitez qu'Acasi vous aide à choisir votre nouveau statut ?";
	} 
});


previousBtn.addEventListener('click', () => { 
  removeHiddenClass(nextBtn); 
 	removeHiddenClass(resultContainer); 
  removeHiddenClass(resultWrapper); 
 	addHiddenClass(answers);
  addHiddenClass(rendezvousLink);
});


const yesToHelp = document.getElementById('yes-to-help'); 
const noToHelp = document.getElementById('no-to-help');


yesToHelp.addEventListener('click', () => {
	showCalendly();
});


noToHelp.addEventListener('click', () => { 
	addHiddenClass(answers);
	rendezvous(); 
});


function rendezvous() {
	removeHiddenClass(resultWrapper);
	addHiddenClass(resultContainer);
	removeHiddenClass(document.getElementById('simulator-non-answer-final'));  
	addHiddenClass(resultTitle);
  addHiddenClass(rendezvousLink);
}


function showCalendly() {
	addHiddenClass(resultWrapper); 
 	addHiddenClass(answers);
  addHiddenClass(rendezvousLink); 
 	addHiddenClass(document.getElementById('rocket-img')); 
  removeHiddenClass(document.getElementById('coach-calendly-img')); 
	removeHiddenClass(document.getElementById('title-calendly')); 
  addHiddenClass(document.getElementById('result-title')); 
	removeHiddenClass(document.getElementById('simulator-calendly')); 
}


</script>

*/