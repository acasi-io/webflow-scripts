const totalQuestions = Object.keys(questionsData).length;
const simulatorInformation = document.getElementById('simulator-information');


/*startBtn.addEventListener('click', () => {
    setItemStorage('indexPreviousQuestion', 0); 
    setItemStorage('indexCurrentChoice', 0); 
    setItemStorage('indexCurrentQuestion', 0); 
    removeHiddenClass(document.getElementById('form-question')); 
    addHiddenClass(document.querySelector('.simulator-start')); 
    addHiddenClass(document.querySelector('.simulator-start-image')); 
    removeHiddenClass(document.querySelector('.simulator-questions-image'));
    firstQuestion();
});*/


function nextQuestion() {
    const indexCurrentQuestion = parseInt(localStorage.getItem('indexCurrentQuestion')); 
    storeResult(questionsData);

    if (indexCurrentQuestion !== totalQuestions - 1) {
        previousBtn.classList.remove('simulator-hidden');
        getNextQuestion(questionsData);
    }
   
    if (indexCurrentQuestion === totalQuestions - 1) {
        showForm();
        addHiddenClass(previousBtn)
        setItemStorage('indexPreviousQuestion', totalQuestions - 1); 
        setItemStorage('indexCurrentQuestion', 'emailForm'); 
        addHiddenClass(document.getElementById('simulator-block')); 
        simulatorInformation.textContent = ''; 
    } 
}
    
   
function showForm() {
    const formTemplate = document.querySelector('.simulator-form-block'); 
    forShowForm(formTemplate)

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
   
    simulatorOptions.append(formTemplate); 
}


const simulatorSubmitBtn = document.getElementById('simulator-submit-button'); 
simulatorSubmitBtn.addEventListener('click', () => {
    const resultInputValue = document.getElementById('result').value; 
    setItemStorage('result', resultInputValue);  
});