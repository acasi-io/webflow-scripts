const result = localStorage.getItem('result');  
const firstAnswer = document.getElementById('first-answer'); 
const secondAnswer = document.getElementById('second-answer'); 

if (result === 'multiple_shareholder' || result === 'unique_shareholder') {
	document.getElementById('one-answer').classList.add('simulator-hidden'); 
    document.getElementById('two-answers').classList.remove('simulator-hidden');

    const firstExplanation = document.getElementById('first-explanation'); 
    const secondExplanation = document.getElementById('second-explanation'); 
    if (result === 'multiple_shareholder') {
  	    firstAnswer.innerHTML = 'SARL'; 
        showExplanation('SARL', firstExplanation); 
        secondAnswer.innerHTML = 'SAS'; 
        showExplanation('SAS', secondExplanation); 
    } else if (result === 'unique_shareholder') {
  	    firstAnswer.innerHTML = 'EURL'; 
        showExplanation('EURL', firstExplanation); 
        secondAnswer.innerHTML = 'SASU'; 
        showExplanation('SASU', secondExplanation); 
    }
} else {
    const displayedResult = {
        sas: 'SAS', 
        sasu: 'SASU', 
        micro: 'micro-entreprise'
    }
    const resultText = document.getElementById('simulator-result-text');
    resultText.innerHTML = `${displayedResult[result]}`; 
    const explanationContainer = document.querySelector('.simulator-result-explanation-container');
    showExplanation(result, explanationContainer); 
}


function showExplanation(result, explanationContainer) {
	const explanationText = document.getElementById(`simulator-${result}-explanation`);
    explanationContainer.classList.remove('simulator-hidden'); 
	explanationText.classList.remove('simulator-hidden');
	explanationContainer.append(explanationText);
}
