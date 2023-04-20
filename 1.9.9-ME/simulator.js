function generateForm() {  
    showForm(); 

    removeHiddenClass(questionTheme); 

    simulatorOptions.append(formTemplate); 
}


/*simulatorSubmitBtn.addEventListener('click', () => {
    localStorage.setItem('result', JSON.stringify(resultArray)); 
});*/