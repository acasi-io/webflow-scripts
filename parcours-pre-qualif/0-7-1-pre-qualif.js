const nextBtn = document.getElementById('next-button');
const screenWidth = window.innerWidth;
const coachMobile = document.getElementById('image-coach-mobile');
const coachImage = document.getElementById("container-coach-image");
const question = document.querySelector('.is_question_title');


let storageAnswers = JSON.parse(localStorage.getItem('choices'));
if (!storageAnswers) {
    storageAnswers = {};
}


document.getElementById('previous-button').addEventListener('click', () => {
    history.back();
});
  

document.querySelector('.prequalif_cta_previous_mobile').addEventListener('click', () => {
    history.back();
});


document.querySelectorAll('.prequalif_answers_item').forEach(answer => {
	answer.addEventListener('click', () => {
		document.querySelectorAll('.prequalif_answers_item').forEach(otherAnswer => {
			otherAnswer.classList.remove('input-checked');
		});
        
        answer.classList.add('input-checked');

        localStorage.setItem('currentChoiceId', answer.id);
        localStorage.setItem('currentChoice', answer.dataset.hubspotPropertyValue);

        document.getElementById('wrapper-coach-answer').classList.remove('hidden');
  
        resize();

        window.addEventListener("resize", () => {
            resize();
        });

        const choice = localStorage.getItem('currentChoice');
        const coachAnswer = document.getElementById('coach_answer');

        showCoachAnswer(choice, coachAnswer);

        document.getElementById('prequalif-buttons-wrapper').style.zIndex = "2";
        nextBtn.classList.add('next-button');
        nextPage();

        setTimeout(() => {
            document.getElementById('chat_wait').classList.add('hidden');
            document.getElementById('coach_answer').classList.remove('hidden');
        }, 1000);

        const property = question.dataset.hubspotProperty;
        const shouldStore = question.dataset.store !== "false";

        if (property && shouldStore) {
            const value = answer.dataset.hubspotPropertyValue === 'true' || answer.dataset.hubspotPropertyValue === 'false'
                ? JSON.parse(answer.dataset.hubspotPropertyValue)
                : answer.dataset.hubspotPropertyValue;

            storageAnswers[property] = value;
            localStorage.setItem('choices', JSON.stringify(storageAnswers));
        }

        localStorage.setItem('choices', JSON.stringify(storageAnswers));
	});
});


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
    let urlParams = JSON.parse(localStorage.getItem('urlParams'));
    let answers = JSON.parse(localStorage.getItem('choices'));
    
    if (answers === null || answers === undefined) {
        answers = {};
    }

    const preQualificationData = {...urlParams, ...answers};

    document.cookie = `pre_qualification_workflow_data=${JSON.stringify(preQualificationData)}; domain=acasi.io; path=/`;
}