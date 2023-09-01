const nextBtn = document.getElementById('next-button');
const disabledNextButton = document.getElementById('disabled-button');
const headingPreQualif = document.getElementById('heading-pre-qualif');
const url = localStorage.getItem('url');


storageAnswers = JSON.parse(localStorage.getItem('currentChoice'));



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
    const question = document.getElementById('question-title');
	let currentChoice = {
		question: question.textContent,
		answer: answer.id
	}
  localStorage.setItem('choice', answer.id);
  ajouterObjetUniqueParQuestion(storageAnswers, currentChoice);
  localStorage.setItem('currentChoice', JSON.stringify(storageAnswers));
    disabledNextButton.classList.add('hidden');
    nextBtn.classList.remove('hidden');
	});
});

function ajouterObjetUniqueParQuestion(tableau, nouvelObjet) {
    const question = nouvelObjet.question;
    const indexDoublon = tableau.findIndex(objet => objet.question === question);

    if (indexDoublon !== -1) {
        // Une question identique existe déjà, remplacez l'objet existant par le nouvel objet
        tableau[indexDoublon] = nouvelObjet;
    } else {
        // Ajoutez simplement le nouvel objet au tableau
        tableau.push(nouvelObjet);
    }
}