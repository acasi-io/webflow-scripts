function nextQuestion() {
    const indexNextQuestion = localStorage.getItem('indexNextQuestion'); 
    storeResult(questionsData); 
    removeHiddenClass(previousBtn);

    if (indexNextQuestion === 'emailForm') {
		simulatorBlock.innerHTML = '';
        showForm(); 
    } else {
        getNextQuestion(questionsData); 
    }
}


function showForm() { 
    const formTemplate = document.getElementById('simulator-form-block');  
    forShowForm(formTemplate); 

    addHiddenClass(previousBtn); 
    removeHiddenClass(questionTheme); 

    simulatorOptions.append(formTemplate); 
}