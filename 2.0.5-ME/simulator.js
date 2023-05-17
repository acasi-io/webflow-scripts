function generateForm() {  
    showForm(); 

    removeHiddenClass(questionTheme); 

    simulatorOptions.append(formTemplate); 
}


let currentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 

if (currentQuestion === 2 || currentQuestion === 7) {
    document.getElementById('precision_charges_container').classList.remove('simulator-hidden');
}