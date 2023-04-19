const totalQuestions = Object.keys(questionsData).length;
const simulatorInformation = document.getElementById('simulator-information');
    

function generateForm() {
    const formTemplate = document.querySelector('.simulator-form-block'); 
    showForm(formTemplate)

    computeForm(); 
   
    simulatorOptions.append(formTemplate); 
}


/*function computeForm() {
    const resultInput = document.getElementById('result');
    
    const plusieursAnswer = resultArray.find(answer => answer.result === 'société à plusieurs'); 
    const dividendesAnswer = resultArray.find(answer => answer.result === 'dividendes'); 
    const microEntrepriseAnswer = resultArray.find(answer => answer.result === 'moins de 77k'); 
    const seulAnswer = resultArray.find(answer => answer.result === 'société seul'); 
    const salaireAnswer = resultArray.find(answer => answer.result === 'salaire');

    if (microEntrepriseAnswer) {
        resultInput.value = 'micro-entreprise';
    } else if (seulAnswer && dividendesAnswer) {
        resultInput.value = 'SASU';
    } else if (plusieursAnswer && dividendesAnswer) {
        resultInput.value = 'SAS'; 
    } else if (salaireAnswer && plusieursAnswer) {
        resultInput.value = 'SARL ou SAS'; 
    } else if (seulAnswer && salaireAnswer) {
        resultInput.value = 'EURL ou SASU'; 
    } else {
        return;
    }
}*/


function computeForm() {
    const resultInput = document.getElementById('result');
    
    const plusieursAnswer = resultArray.find(answer => answer.question === '0' && answer.result === 'true'); 
    const dividendesAnswer = resultArray.find(answer => answer.question === '6' && answer.result === "Dividendes"); 
    const microEntrepriseAnswer = resultArray.find(answer => answer.question === '4' && answer.result === 'En dessous du seuil maximal pour une ME'); 
    const seulAnswer = resultArray.find(answer => answer.question === '0' && answer.result === 'false'); 
    const salaireAnswer = resultArray.find(answer => answer.question === '6' && answer.result === "Salaire");

    if (microEntrepriseAnswer) {
        resultInput.value = 'micro-entreprise';
    } else if (seulAnswer && dividendesAnswer) {
        resultInput.value = 'SASU';
    } else if (plusieursAnswer && dividendesAnswer) {
        resultInput.value = 'SAS'; 
    } else if (salaireAnswer && plusieursAnswer) {
        resultInput.value = 'SARL ou SAS'; 
    } else if (seulAnswer && salaireAnswer) {
        resultInput.value = 'EURL ou SASU'; 
    } else {
        return;
    }
}


const simulatorSubmitBtn = document.getElementById('simulator-submit-button'); 
simulatorSubmitBtn.addEventListener('click', () => {
    const resultInputValue = document.getElementById('result').value; 
    setItemStorage('result', resultInputValue);  
});