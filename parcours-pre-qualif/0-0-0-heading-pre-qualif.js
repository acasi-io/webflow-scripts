const headingPreQualif = document.getElementById('heading-pre-qualif');
const urlPreQualif = localStorage.getItem('url');


window.addEventListener('load', () => {
    setTitle(urlPreQualif);
});


function fillHeading(heading) {
	headingPreQualif.textContent = heading;
}


function setTitle(url) {
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
}