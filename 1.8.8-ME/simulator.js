function generateForm() { 
    const formTemplate = document.getElementById('simulator-form-block');  
    showForm(formTemplate); 

    removeHiddenClass(questionTheme); 

    simulatorOptions.append(formTemplate); 
}