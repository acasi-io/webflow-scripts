const result = localStorage.getItem('result');  
const firstAnswer = document.getElementById('first-answer'); 
const secondAnswer = document.getElementById('second-answer'); 

if (result === 'SARL ou SAS' || result === 'EURL ou SASU') {
	document.getElementById('one-answer').classList.add('simulator-hidden'); 
    document.getElementById('two-answers').classList.remove('simulator-hidden');
    const firstExplanation = document.getElementById('first-explanation'); 
    const secondExplanation = document.getElementById('second-explanation'); 
    if (result === 'SARL ou SAS') {
  	    firstAnswer.innerHTML = 'SARL'; 
        showExplanation('SARL', firstExplanation); 
        secondAnswer.innerHTML = 'SAS'; 
        showExplanation('SAS', secondExplanation); 
    } else if (result === 'EURL ou SASU') {
  	    firstAnswer.innerHTML = 'EURL'; 
        showExplanation('EURL', firstExplanation); 
        secondAnswer.innerHTML = 'SASU'; 
        showExplanation('SASU', secondExplanation); 
    }
} else {
    const resultText = document.getElementById('simulator-result-text');
    resultText.innerHTML = `${result}`; 
    const explanationContainer = document.querySelector('.simulator-result-explanation-container');
    showExplanation(result, explanationContainer); 
}


function showExplanation(result, explanationContainer) {
	const explanationText = document.getElementById(`simulator-${result}-explanation`);
    explanationContainer.classList.remove('simulator-hidden'); 
	explanationText.classList.remove('simulator-hidden');
	explanationContainer.append(explanationText);
}


//créer un tableau résultat avec un id qui correspond à l'id de la question et l'hubspotValue de la réponse sélectionné 