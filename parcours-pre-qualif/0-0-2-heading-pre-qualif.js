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
          fillHeading('consultants');
      } else if (url.includes('developpeur')) {
          fillHeading('développeurs');
      } else if (url.includes('designer')) {
          fillHeading('designer');
      } else if (url.includes('coach')) {
          fillHeading('coach');
      } else if (url.includes('architecte')) {
          fillHeading('architectes');
      } else if (url.includes('agent-immobilier')) {
          fillHeading('agents immobiliers');
      }
    } else if (url.includes('avocat')) {
        fillHeading('avocats');
    } else {
        fillHeading('indépendants');
    }
}