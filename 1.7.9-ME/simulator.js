const questionsData = [
    {   
        id: 0, 
        question: "Quel est votre type d'activité ?", 
        //questionTree: "Quel est votre type d'activité ?",
        questionTree: 0,
        property: "company_creation_activity",
        highlight: true, 
        choices: [
            {
                id: 1, 
                value: "Vente de marchandises", 
                image: "🏠", 
                nextQuestion: 1,
                hubspotValue: 'Achat/Vente',
            }, 
            {
                id: 2, 
                value: "Prestation de services",
                image: "👩‍💻", 
                nextQuestion: 6,
                hubspotValue: 'Services',
            }
        ]
    }, 
    {
        id: 1,
        question: "Cette année, vous allez réaliser", 
        //questionTree: "Marchandises - Cette année vous allez réaliser",
        property: "estimated_revenue",
        questionTree: 1,
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
        //questionTree: "Marchandises - vos charges représentent",
        questionTree: 2,
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
        //questionTree: "Marchandises - L'année dernière vous avez réalisé",
        questionTree: 3,
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
        //questionTree: "Marchandises - vos clients sont majoritairement des",
        questionTree: 4,
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
        //questionTree: "Marchandises - l'année dernière vous avez réalisé",
        questionTree: 5,
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
        //questionTree: "Services - cette année, vous allez réaliser",
        questionTree: 6,
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
        //questionTree: "Services - vos charges représentent",
        questionTree: 7,
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
        //questionTree: "Services - l'année dernière vous avez réalisé",
        questionTree: 8,
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
        //questionTree: "Services - vos clients sont majoritairement des",
        questionTree: 9,
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
        //questionTree: "Services - l'année dernière vous avez réalisé ",
        questionTree: 10,
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



function nextQuestion() {
    const indexNextQuestion = localStorage.getItem('indexNextQuestion'); 
    storeResult(); 
    removeHiddenClass(previousBtn);

    if (indexNextQuestion === 'emailForm') {
		simulatorBlock.innerHTML = '';
        showForm(); 
    } else {
        getNextQuestion(questionsData); 
    }
}



previousBtn.addEventListener('click', (e) => {
    getPreviousQuestion(); 
    deleteOldValue(); 
    getLastElement(); 
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    const indexNextQuestion = localStorage.getItem('indexNextQuestion'); 
    if (indexCurrentQuestion === 0) {
        addHiddenClass(e.target);  
    } else if (indexNextQuestion === 'emailForm') {
        removeHiddenClass(document.getElementById('simulator-block')); 
        addHiddenClass(document.querySelector('.simulator-form-block')); 
        removeHiddenClass(nextBtn);  
    }
})


/*previousBtn.addEventListener('click', () => {
	const previousQuestion = localStorage.getItem('previousQuestion');
    const previousQuestionData = questionsData.find(question => question.questionTree === previousQuestion);
    showQuestion(previousQuestionData); 
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
});*/


function getPreviousQuestion() { 
    let indexPreviousQuestion = parseInt(localStorage.getItem('previousQuestion')); 
    const previousQuestionData = questionsData.find(question => question.id === indexPreviousQuestion); 

    fillQuestionTitleTheme(previousQuestionData); 
   
    showQuestion(previousQuestionData); 
    setItemStorage('indexCurrentQuestion', previousQuestionData.id); 
}


function showForm() { 
    const formTemplate = document.getElementById('simulator-form-block');  
    forShowForm(formTemplate); 

    addHiddenClass(previousBtn); 
    removeHiddenClass(questionTheme); 

    simulatorOptions.append(formTemplate); 
}

   
function storeResult() {
    findQuestionForStoreResult(questionsData); 
    updatePreviousQuestionArray(currentQuestionData, currentChoiceData); 
}


function updatePreviousQuestionArray(currentQuestion, currentChoice) {
    const newValue = new Object();  
    newValue.question = `${currentQuestion.questionTree}`; 
    newValue.value = `${currentChoice.value}`; 
    setItemStorage('previousQuestion', currentQuestion.questionTree); 
    previousQuestionArray.push(newValue); 
    console.log(previousQuestionArray);
}

function deleteOldValue() {
    const previousQuestion = parseInt(localStorage.getItem('previousQuestion')); 
    const currentQuestionData = questionsData.find(question => question.questionTree === previousQuestion); 
  
    const answerToFind = previousQuestionArray.find(answer => answer.question === currentQuestionData.questionTree);
  
    let indexAnswerToFind = previousQuestionArray.indexOf(answerToFind); 
  
    previousQuestionArray.splice(indexAnswerToFind, 1); 
} 


function getLastElement() {
    let previousQuestionArrayLength = Object.keys(previousQuestionArray).length; 
    const lastElement = previousQuestionArray[previousQuestionArrayLength - 1]; 
    localStorage.setItem('previousQuestion', lastElement.question); 
}



/*function nextQuestion() {
    const indexNextQuestion = localStorage.getItem('indexNextQuestion'); 
    storeResult(); 
    removeHiddenClass(previousBtn);

    if (indexNextQuestion === 'emailForm') {
		simulatorBlock.innerHTML = '';
        showForm(); 
    } else {
        getNextQuestion(questionsData); 
    }
}


previousBtn.addEventListener('click', () => {
	const previousQuestion = localStorage.getItem('previousQuestion');
    const previousQuestionData = questionsData.find(question => question.questionTree === previousQuestion);
    generateQuestion(previousQuestionData); 
    questionTitle.textContent = previousQuestionData.question; 
    setItemStorage('indexCurrentQuestion', previousQuestionData.id); 
	deleteOldValue(); 
    if (previousQuestionData.id === 0) {
        addHiddenClass(previousBtn); 
    } /*else {
        const lastQuestion = previousQuestionArray.length - 1; 
        const newPreviousQuestion = previousQuestionArray[lastQuestion].question; 
        setItemStorage('previousQuestion', newPreviousQuestion);
    } 
});


function showForm() { 
    const formTemplate = document.getElementById('simulator-form-block');  
    forShowForm(formTemplate); 

    removeHiddenClass(questionTheme); 

    simulatorOptions.append(formTemplate); 
}

   
function storeResult() {
    findQuestionForStoreResult(questionsData); 
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
} */
