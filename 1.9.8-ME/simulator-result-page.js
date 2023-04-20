const resultText = document.getElementById('simulator-result-explanation-container');  
const nextBtn = document.getElementById('next-button');
const previousBtn = document.getElementById('previous-button'); 
const resultWrapper = document.getElementById('simulator-result-wrapper');
const answers = document.getElementById('simulator-two-answers'); 
const resultHeading = document.getElementById('simulator-big-result'); 
const resultTitle = document.getElementById('simulator-result-title'); 
const rendezvousLink = document.getElementById('simulator-rendezvous-link'); 
const resultContainer = document.getElementById('simulator-result-container');
const resultStorage = localStorage.getItem('result'); 


function addHiddenClass(elementProperty) {
	elementProperty.classList.add('simulator-hidden'); 
}

function removeHiddenClass(elementProperty) {
	elementProperty.classList.remove('simulator-hidden'); 
}


/*function fillAnswer(number) {
	const explanation = document.getElementById(`simulator-${number}-explanation`); 
  	explanation.classList.remove('simulator-hidden'); 
	resultText.append(explanation);
}*/


/*if (
	resultStorage[0].question === '3' && resultStorage[0].result === 'true' ||
	resultStorage[0].question === '8' && resultStorage[0].result === 'Dépassement du seuil de franchise de TVA' ||
	resultStorage[0].question === '4' && resultStorage[0].result === 'false') 
	{
	resultHeading.innerHTML = '👉 Vous allez dépasser le seuil de la franchise de TVA cette année.';
  	fillAnswer('first');
} else if (resultStorage[0].question === '2' && resultStorage[0].result === 'true') { 
	resultHeading.innerHTML = '👉 Vos charges sont supérieures à 34%. La micro-entreprise n’est pas adaptée pour vous';
  	fillAnswer('two');
} else if (resultStorage[0].question === '2' && resultStorage[0].result === 'false') {
	resultTitle.innerHTML = 'La micro-entreprise est adaptée à votre situation pour le moment';
  	resultHeading.innerHTML = '👉 Vos charges représentent moins de 34% de votre CA.'; 
  	fillAnswer('three'); 
} else if (resultStorage[0].question === '4' && resultStorage[0].result === 'true') {
	resultHeading.innerHTML = '👉 Vous allez dépasser le seuil de la franchise de TVA cette année.'; 
  	fillAnswer('four');
} else if (resultStorage[0].question === '7' && resultStorage[0].result === 'true') {
	resultHeading.innerHTML = '👉 Vos charges sont supérieures à 50%. La micro-entreprise n’est pas adaptée pour vous';
    fillAnswer('six');
} else if (resultStorage[0].question === '7' && resultStorage[0].result === 'false') {
	resultTitle.innerHTML = 'La micro-entreprise est adaptée à votre situation pour le moment';
  	resultHeading.innerHTML = '👉 Vos charges représentent moins de 50% de votre CA.';
  	fillAnswer('seven');
} else {
	resultHeading.innerHTML = '👉 Attention ! Vous êtes sur le point de dépasser les seuils de CA durant deux années consécutives';
  	fillAnswer('five'); 
}*/



/*if (resultStorage === "Plus de 91 900€" || resultStorage === "Plus de 36 800€" || resultStorage === "Particuliers") {
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
}*/ 


function fillAnswer(explanationLabel) {
	const explanation = document.querySelector(`.simulator-result-explanation[data-answer='${explanationLabel}']`); 
	explanation.classList.remove('simulator-hidden'); 
	resultText.append(explanation);
}

const EXPLANATION_TITLE = {
	under_allowance_threshold_34: 'La micro-entreprise est adaptée à votre situation pour le moment', 
	under_allowance_threshold_50: 'La micro-entreprise est adaptée à votre situation pour le moment'
}
 
 
fillAnswer(resultStorage);
const EXPLANATION_DETAILS = {
	above_franchise_threshold: "👉 Vous allez dépasser le seuil de la franchise de TVA cette année.",
	private: "👉 Vous allez dépasser le seuil de la franchise de TVA cette année.", 
	professional: "👉 Vous allez dépasser le seuil de la franchise de TVA cette année.", 
	over_allowance_threshold_34: "👉 Vos charges sont supérieures à 34%. La micro-entreprise n'est pas adaptée pour vous",
	under_allowance_threshold_34: "👉 Vos charges représentent moins de 34% de votre CA.", 
	over_allowance_threshold_50: "👉 Vos charges sont supérieures à 50%. La micro-entreprise n'est pas adaptée pour vous",
	under_allowance_threshold_50: "👉 Vos charges représentent moins de 50% de votre CA.", 
	previous_revenue_above_threshold: "👉 Attention ! Vous êtes sur le point de dépasser les seuils de CA durant deux années consécutives"
}

resultHeading.innerHTML = EXPLANATION_DETAILS[resultStorage];

if (EXPLANATION_TITLE[resultStorage]) {
	resultTitle.innerHTML = EXPLANATION_TITLE[resultStorage];
}


function showAnswers() {
	addHiddenClass(resultWrapper); 
  	removeHiddenClass(answers);
  	addHiddenClass(nextBtn); 
  	removeHiddenClass(rendezvousLink);
}


/*nextBtn.addEventListener('click', () => {  
	if (
		resultStorage[0].question === '2' && resultStorage[0].result === 'false' || 
		resultStorage[0].question === '7' && resultStorage[0].result === 'false') {
  	    rendezvous(); 
    } else if (resultStorage[0].question === '2' && resultStorage[0].result === 'true') {
  	    showAnswers(); 
  	    resultTitle.textContent = "Vous souhaitez qu'Acasi vous aide à préparer votre transition vers la TVA ?";
	} else if (
		resultStorage[0].question === '5' && resultStorage[0].result === 'true' || 
		resultStorage[0].question === '9' && resultStorage[0].result === 'true') {
  	    showAnswers(); 
        resultTitle.textContent = "Vous souhaitez avoir de l'aide pour la transition vers un autre statut juridique ?";
    } else {
  	    showAnswers(); 
        resultTitle.textContent = "Vous souhaitez qu'Acasi vous aide à choisir votre nouveau statut ?";
    } 
});*/


nextBtn.addEventListener('click', () => {  
	if (resultStorage.startsWith === "under_allowance_threshold_" ) {
  	    rendezvous(); 
    } else if (resultStorage === "professional") {
  	    showAnswers(); 
  	    resultTitle.textContent = "Vous souhaitez qu'Acasi vous aide à préparer votre transition vers la TVA ?";
	} else if (resultStorage === "previous_revenue_above_threshold") {
  	    showAnswers(); 
        resultTitle.textContent = "Vous souhaitez avoir de l'aide pour la transition vers un autre statut juridique ?";
    } else {
  	    showAnswers(); 
        resultTitle.textContent = "Vous souhaitez qu'Acasi vous aide à choisir votre nouveau statut ?";
    } 
});

/*nextBtn.addEventListener('click', () => {  
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
});*/


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

