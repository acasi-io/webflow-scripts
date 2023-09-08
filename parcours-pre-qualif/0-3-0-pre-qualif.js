const nextBtn = document.getElementById('next-button');
const disabledNextButton = document.getElementById('disabled-button');
const headingPreQualif = document.getElementById('heading-pre-qualif');
const url = localStorage.getItem('url');
const screenWidth = window.innerWidth;
const coachMobile = document.getElementById('image-coach-mobile');
const coachImage = document.getElementById("container-coach-image");
const hubspotPropertiesBlock = document.getElementById('hubspot-properties');
const question = document.querySelector('.question-title');


storageAnswers = JSON.parse(localStorage.getItem('choices'));



document.getElementById('previous-button').addEventListener('click', () => {
    history.back();
});
  

document.querySelector('.cta-previous-pre-qualif-mobile').addEventListener('click', () => {
    history.back();
});


function fillHeading(heading) {
	headingPreQualif.textContent = heading;
}


if (url.includes('metiers')) { 
	if (url.includes('consultant')) {
  	fillHeading('Comptabilité pour consultants');
  } else if (url.includes('developpeur')) {
  	fillHeading('Comptabilité pour développeurs');
  } else if (url.includes('designer')) {
  	fillHeading('Comptabilité pour designer');
  } else if (url.includes('coach')) {
  	fillHeading('Comptabilité pour coach');
  } else if (url.includes('developpeur')) {
  	fillHeading('Comptabilité pour développeurs');
  } else if (url.includes('architecte')) {
  	fillHeading('Comptabilité pour architectes');
  } else if (url.includes('agent-immobilier')) {
  	fillHeading('Comptabilité pour agents immobiliers');
  }
} else if (url.includes('avocat')) {
	fillHeading('Comptabilité pour avocats');
} else if (url.includes('creation')) {
	fillHeading('Création de société');
    if (creation === true) {
        threeQuestionsBar.classList.remove('hidden');
        fourQuestionsBar.classList.add('hidden');
    }
} else if (url.includes('sas-sasu')) {
	fillHeading('Comptabilité pour SAS - SASU');
} else if (url.includes('eurl-sarl')) {
	fillHeading('Comptabilité pour SARL - EURL');
} else if (url.includes('entreprise-individuelle')) {
	fillHeading('Comptabilité pour entreprise individuelle');
} else {
	fillHeading('Comptabilité pour les freelances et indépendants');
}


document.querySelectorAll('.pre-qualif-answers').forEach(answer => {
	answer.addEventListener('click', () => {
		document.querySelectorAll('.pre-qualif-answers').forEach(otherAnswer => {
			otherAnswer.classList.remove('input-checked');
		});
    
        answer.classList.add('input-checked');
        let currentChoice = {
            hubspot_property: question.id,
            value: answer.id
        }
        localStorage.setItem('currentChoice', answer.id);
        addUniqueObject(storageAnswers, currentChoice);
        localStorage.setItem('choices', JSON.stringify(storageAnswers));

        document.getElementById('wrapper-coach-answer').classList.remove('hidden');
  
        resize();

        window.addEventListener("resize", () => {
            resize();
        });

        showCoachAnswer();

        setTimeout(() => {
            document.getElementById('chat_wait').classList.add('hidden');
            document.getElementById('coach_answer').classList.remove('hidden');
            nextBtn.classList.add('next-button');
        }, 1000);
	});
});


function addUniqueObject(array, newObject) {
    const question = newObject.hubspot_property;
    const indexDoublon = array.findIndex(objet => objet.hubspot_property === question);

    if (indexDoublon !== -1) {
        array[indexDoublon] = newObject;
    } else {
        array.push(newObject);
    }
}


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


function appendHubspotProperty() {
    const properties = JSON.parse(localStorage.getItem('choices'));

    properties.forEach(property => {
        hubspotPropertiesBlock.insertAdjacentHTML('beforeend', `<div data-hubspot-property="${property.hubspot_property}" style='visibility: hidden; height: 0'><label>${property.hubspot_property}</label><input type='text' ${property.value} /></div>`);
    });

    /*if (property.hubspot_property) {
        hubspotPropertiesBlock.insertAdjacentHTML('beforeend', `<div data-hubspot-property="${property.hubspot_property}" style='visibility: hidden; height: 0'><label>${property.hubspot_property}</label><input type='text' ${property.value} /></div>`);
    }*/
}