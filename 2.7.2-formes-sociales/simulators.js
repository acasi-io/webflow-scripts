const totalQuestions = Object.keys(questionsData).length;
const simulatorInformation = document.getElementById('simulator-information');
    

function generateForm() {
    const formTemplate = document.querySelector('.simulator-form-block'); 
    showForm(formTemplate)

    computeForm(); 
   
    simulatorOptions.append(formTemplate); 
}


function computeForm() {
    const resultInput = document.getElementById('result');
    
    const plusieursAnswer = resultArray.find(answer => answer.question === '1' && answer.result === 'true'); 
    const dividendesAnswer = resultArray.find(answer => answer.question === '6' && answer.result === "Dividendes"); 
    const microEntrepriseAnswer = resultArray.find(answer => answer.question === '4' && answer.result === 'En dessous du seuil maximal pour une ME'); 
    const seulAnswer = resultArray.find(answer => answer.question === '1' && answer.result === 'false'); 
    const salaireAnswer = resultArray.find(answer => answer.question === '6' && answer.result === "Salaire");

    if (microEntrepriseAnswer) {
        resultInput.value = 'micro';
    } else if (seulAnswer && dividendesAnswer) {
        resultInput.value = 'sasu';
    } else if (plusieursAnswer && dividendesAnswer) {
        resultInput.value = 'sas'; 
    } else if (salaireAnswer && plusieursAnswer) {
        resultInput.value = 'multiple_shareholder'; 
    } else if (seulAnswer && salaireAnswer) {
        resultInput.value = 'unique_shareholder'; 
    } else {
        return;
    }
}


simulatorSubmitBtn.addEventListener('click', () => {
    const resultInputValue = document.getElementById('result').value; 
    setItemStorage('result', resultInputValue);  
});