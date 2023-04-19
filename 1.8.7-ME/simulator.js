/*function nextQuestion() {
    const indexNextQuestion = localStorage.getItem('indexNextQuestion'); 
    storeResult(questionsData); 
    removeHiddenClass(previousBtn);

    if (indexNextQuestion === 'emailForm') {
		simulatorBlock.innerHTML = '';
        generateForm(); 
    } else {
        getNextQuestion(questionsData); 
    }
}*/


function generateForm() { 
    const formTemplate = document.getElementById('simulator-form-block');  
    showForm(formTemplate); 

    removeHiddenClass(questionTheme); 

    simulatorOptions.append(formTemplate); 
}