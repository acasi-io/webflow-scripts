const nextBtn = document.getElementById('next-button');
const screenWidth = window.innerWidth;
const coachMobile = document.getElementById('image-coach-mobile');
const coachImage = document.getElementById("container-coach-image");
const question = document.querySelector('.question-title');


storageAnswers = JSON.parse(localStorage.getItem('choices'));


document.getElementById('previous-button').addEventListener('click', () => {
    history.back();
});
  

document.querySelector('.cta-previous-pre-qualif-mobile').addEventListener('click', () => {
    history.back();
});


document.querySelectorAll('.pre-qualif-answers').forEach(answer => {
	answer.addEventListener('click', () => {
		document.querySelectorAll('.pre-qualif-answers').forEach(otherAnswer => {
			otherAnswer.classList.remove('input-checked');
		});
        
        answer.classList.add('input-checked');

        localStorage.setItem('currentChoice', answer.dataset.hubspotPropertyValue);

        document.getElementById('wrapper-coach-answer').classList.remove('hidden');
  
        resize();

        window.addEventListener("resize", () => {
            resize();
        });

        const choice = localStorage.getItem('currentChoice');
        const coachAnswer = document.getElementById('coach_answer');

        showCoachAnswer(choice, coachAnswer);

        setTimeout(() => {
            document.getElementById('chat_wait').classList.add('hidden');
            document.getElementById('coach_answer').classList.remove('hidden');
            nextBtn.classList.add('next-button');
            nextPage();
        }, 1000);

        if (question.dataset.hubspotProperty) {
            storageAnswers[question.dataset.hubspotProperty] = answer.dataset.hubspotPropertyValue;
            /*currentChoice = {
                hubspot_property: question.dataset.hubspotProperty,
                value: answer.dataset.hubspotPropertyValue
            }*/
        } else {
            return
        }

        //addUniqueObject(storageAnswers, currentChoice);
        localStorage.setItem('choices', JSON.stringify(storageAnswers));
	});
});


/*function addUniqueObject(array, newObject) {
    const question = newObject.hubspot_property;
    const indexDoublon = array.findIndex(objet => objet.hubspot_property === question);

    if (indexDoublon !== -1) {
        array[indexDoublon] = newObject;
    } else {
        array.push(newObject);
    }
}*/


function resize() {
    if (screenWidth <= 768) {
        coachImage.style.display = 'none';
        coachMobile.style.display = 'block';
    } else {
        coachImage.style.top = "330px";
    }
}


function resizeZero() {
    if (screenWidth <= 768) {
        coachImage.style.top = "0px";
        coachImage.style.display = 'block';
        coachMobile.style.display = 'none';
    } else {
        coachImage.style.top = "0px";
    }
}


function redirectUrl() {
    const urlRedirection = question.dataset.url;

    window.location.href = urlRedirection;
    shareCookies();
}


function shareCookies() {
    let answers = JSON.parse(localStorage.getItem('choices'));
    document.cookie = `pre_qualification_workflow_data=${JSON.stringify(answers)}; domain=acasi.io; path=/`;
}