document.getElementById('start-btn').addEventListener('click', () => {
  document.querySelector('.section_opti-sim-hero').classList.add('hide');
  document.querySelector('.section_opti-sim').classList.remove('hide');
});

let selectedAnswers = {};

const finalResults = {};

const detailedResults = {
  gestion: [],
  organisation: [],
  development: [],
  wage: [],
  protection: []
};


/*const totalQuestionsByTheme = {
  gestion: 13,
  organisation: 10,
  development: 8
};*/

const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');
const steps = Array.from(document.querySelectorAll('.opti-sim_question-container'));

steps.forEach((step, index) => {
  if (!step.dataset.step) {
    step.dataset.step = index + 1;
  }
});

function getStepIndex(stepElement) {
  return steps.indexOf(stepElement);
}

function disableNextButton() {
  nextButton.classList.add('is-disabled');
  nextButton.disabled = true;
}

function enableNextButton() {
  nextButton.classList.remove('is-disabled');
  nextButton.disabled = false;
}

/*function updateProgressBar(questionTheme) {
  // Liste, par thème, des questions à cases multiples
  const multiIds = {
    development: [
      'chosen-protection-plan',
      'retirement-contribution-type',
      'ai-task-usage'
    ],
    wage: [
      'investment-cashflow-tax-optimization'
    ],
    protection: [
      'treasury-investment-supports',
      'subscribed-insurances-list'
    ]
  };

  // on filtre les steps « notées »
  const themeSteps = steps.filter(
    step => step.dataset.theme === questionTheme && step.dataset.point !== 'false'
  );
  const totalQuestions = themeSteps.length;
  if (!totalQuestions) return;

  const maxPoints = totalQuestions * 5;
  let totalPoints = 0;
  let answeredQuestions = 0;

  // récupère la liste des multi‐IDs pour ce thème
  const themeMulti = multiIds[questionTheme] || [];

  themeSteps.forEach(step => {
    // clé « normale »
    let key = `${questionTheme}-${step.dataset.step}`;

    // si c'est une de vos questions à cases multiples, on utilise l'ID
    if (themeMulti.includes(step.id)) {
      key = `${questionTheme}-${step.id}`;
    }

    const answer = selectedAnswers[key];

    // on compte la question comme « répondue » dès qu'il y a :
    //  • un tableau non vide (cases multiples)
    //  • ou une valeur unique « oui/medium/non » autre que '' / 'no-effect'
    if (Array.isArray(answer) ? answer.length > 0 : answer && answer !== '' && answer !== 'no-effect') {
      answeredQuestions++;

      // on ajoute des points *seulement* pour les réponses oui/medium (pas pour les tableaux)
      if (!Array.isArray(answer)) {
        if (answer === 'oui') {
          totalPoints += 5;
        } else if (answer === 'medium') {
          totalPoints += 3;
        }
      }
    }
  });

  const progressPercentage = (answeredQuestions / totalQuestions) * 100;
  let goodPercentage = (totalPoints / maxPoints) * 100;
  if (goodPercentage > 100) goodPercentage = 100;
  let badPercentage = progressPercentage - goodPercentage;
  if (badPercentage < 0) badPercentage = 0;

  // mise à jour du DOM
  const wrapper = document.querySelector(
    `.opti-sim_theme-item[data-theme="${questionTheme}"] .opti-sim_progress-bar-wrapper`
  );
  if (!wrapper) return;
  wrapper.querySelector('.opti-sim_progress-bar.is-good').style.width = `${goodPercentage}%`;
  wrapper.querySelector('.opti-sim_progress-bar.is-bad' ).style.width = `${badPercentage}%`;
}*/

function updateProgressBar(questionTheme) {
  // les IDs multi par thème
  const multiIds = {
    organisation: [
      'learning-methods',
    ],
    development: [
      'chosen-protection-plan',
      'retirement-contribution-type',
      'ai-task-usage'
    ],
    wage: [
      'eligible-benefit-cases',
      'investment-cashflow-tax-optimization',
      'benefits-in-kind-tax-reduction'
    ],
    protection: [
      'treasury-investment-supports',
      'subscribed-insurances-list'
    ]
  };

  // on ne prend que les steps « notées »
  const themeSteps = steps.filter(
    step => step.dataset.theme === questionTheme && step.dataset.point !== 'false'
  );
  if (themeSteps.length === 0) return;

  let totalPoints = 0;
  let answeredQuestions = 0;
  let maxPoints = 0;

  // liste des multi pour ce thème
  const themeMulti = multiIds[questionTheme] || [];

  themeSteps.forEach(step => {
    // pour chaque step on détermine :
    //  • combien de points elle peut rapporter (5 ou #checkbox)
    //  • combien elle rapporte effectivement (oui/medium ou length du tableau)
    let stepMax = 5;
    if (themeMulti.includes(step.id)) {
      // question multi : max = nombre de cases
      stepMax = step.querySelectorAll('input[type="checkbox"]').length;
    }
    maxPoints += stepMax;

    // clé dans selectedAnswers
    const key = themeMulti.includes(step.id)
      ? `${questionTheme}-${step.id}`
      : `${questionTheme}-${step.dataset.step}`;

    const answer = selectedAnswers[key];

    // si c'est coché / répondu
    const isAnswered = Array.isArray(answer)
      ? answer.length > 0
      : answer && answer !== '' && answer !== 'no-effect';

    if (isAnswered) {
      answeredQuestions++;

      // on calcule les points rapportés
      if (Array.isArray(answer)) {
        totalPoints += answer.length;
      } else if (answer === 'oui') {
        totalPoints += 5;
      } else if (answer === 'medium') {
        totalPoints += 3;
      }
    }
  });

  // calcul des pourcentages
  const goodPercentage = Math.min(100, (totalPoints / maxPoints) * 100);
  // si on a répondu à X/Y questions, progress = X/Y*100
  const progressPercentage = (answeredQuestions / themeSteps.length) * 100;
  // mais pour le rouge, on veut tout sauf le vert
  const badPercentage = Math.max(0, progressPercentage - goodPercentage);

  // mise à jour du DOM
  const wrapper = document.querySelector(
    `.opti-sim_theme-item[data-theme="${questionTheme}"] .opti-sim_progress-bar-wrapper`
  );
  if (!wrapper) return;
  wrapper.querySelector('.opti-sim_progress-bar.is-good').style.width = `${goodPercentage}%`;
  wrapper.querySelector('.opti-sim_progress-bar.is-bad' ).style.width = `${badPercentage}%`;
}

function handleAnswerClick(event) {
  const answerDiv = event.target.closest('.opti-sim_answer-item');
  if (!answerDiv) return;

  const questionContainer = answerDiv.closest('.opti-sim_question-container');
  const questionTheme = questionContainer.dataset.theme;
  const questionStep = questionContainer.dataset.step;
  // Assurer que la question a un id
  const questionId = questionContainer.id || `question-${questionStep}`;
  questionContainer.id = questionId;

  const answerValue = answerDiv.dataset.answer;
  const questionInfoWrapper = questionContainer.querySelector('.opti-sim_info-wrapper');
  const currentLeftContainer = document.querySelector(
    `.opti-sim_left-content-container[data-theme='${questionTheme}']`
  );
  const currentLeftThemeWrapper = document.querySelector(
    `.opti-sim_theme-item[data-theme='${questionTheme}']`
  );

  // Pour les autres questions (radio), on retire la sélection de tous les éléments puis on l'ajoute à celui cliqué
  questionContainer.querySelectorAll('.opti-sim_answer-item').forEach(div => {
    div.classList.remove('is-selected');
    div.style.color = '#484848';
  });
  answerDiv.classList.add('is-selected');
  answerDiv.style.color = 'white';
  selectedAnswers[`${questionTheme}-${questionStep}`] = answerValue;

  currentLeftContainer.classList.add('is-current');
  currentLeftThemeWrapper.classList.add('is-current');

  // Recalcul des scores en fonction du thème
  if (questionTheme === 'gestion') {
    calculGestion();
  }
  if (questionTheme === 'organisation') {
    // Pour "learning-methods", la fonction utilisera les valeurs stockées dans selectedAnswers
    calculOrganisation(questionId);
  }
  if (questionTheme === 'development') {
    // Pour "learning-methods", la fonction utilisera les valeurs stockées dans selectedAnswers
    calculDevelopment(questionId);
  }
  if (questionTheme === 'wage') {
    calculWage(questionId);
  }
  if (questionTheme === 'protection') {
    calculProtection(questionId);
  }

  enableNextButton();
  if (questionInfoWrapper) {
    questionInfoWrapper.style.display = 'block';
  }

  const questionResultValue = document.getElementById(`${questionTheme}-result`).textContent;
  if (questionResultValue === 'NaN') {
    document.getElementById(`${questionTheme}-result`).textContent = '0';
  }
}

document.querySelectorAll('.opti-sim_answer-item').forEach(answer => {
  const container = answer.closest('.opti-sim_question-container');
  if (!container || container.id === 'learning-methods') return;

  answer.addEventListener('click', handleAnswerClick);
});

function calculThreeAnswers(questionKey, result) {
  const question = selectedAnswers[questionKey];
  if (question === 'oui') {
    return result + 5;
  } else if (question === 'medium') {
    return result + 3;
  } else if (question === 'non') {
    return result + 0;
  }
  return result;
}

function calculThreeAnswersOrganisation(answerValue, result) {
  if (answerValue === 'oui') {
    return result + 5;
  } else if (answerValue === 'medium') {
    return result + 3;
  } else if (answerValue === 'non') {
    return result + 0;
  }
  return result;
}

function calculTwoAnswers(questionKey, result) {
  const question = selectedAnswers[questionKey];
  if (question === 'oui') {
    return result + 5;
  } else if (question === 'non') {
    return result + 0;
  }
  return result;
}

function updateNextButtonState(questionTheme, questionStep) {
  const stepEl = steps.find(s =>
    s.dataset.theme === questionTheme &&
    (String(s.dataset.step) === String(questionStep) || s.id === String(questionStep))
  );

  const isTip = stepEl?.dataset.tip === 'true';
  if (isTip) {
    enableNextButton();
    prevButton.style.opacity = questionStep === 1 ? 0 : 1;
    return;
  }

  const key = `${questionTheme}-${questionStep}`;
  const selectedAnswer = selectedAnswers[key];

  if (selectedAnswer) {
    enableNextButton();
  } else {
    disableNextButton();
  }
  prevButton.style.opacity = questionStep === 1 ? 0 : 1;
}


function changeQuestion(direction) {
  const activeStep = steps.find(step => !step.classList.contains('hide'));
  if (!activeStep) return;

  let currentIndex = getStepIndex(activeStep);
  let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

  if (direction === 'next' && currentIndex === steps.length - 1) {
    return showResults();
  }

  // 🔁 Boucle pour sauter les questions avec data-ignore="true"
  while (
    nextIndex >= 0 &&
    nextIndex < steps.length &&
    steps[nextIndex].dataset.ignore === 'true'
  ) {
    nextIndex = direction === 'next' ? nextIndex + 1 : nextIndex - 1;
  }

  // ✅ Vérifie qu'on est encore dans les bornes
  if (nextIndex < 0 || nextIndex >= steps.length) return;

  const nextStepElement = steps[nextIndex];
  const questionTheme = nextStepElement.dataset.theme;
  const questionStep = nextStepElement.dataset.step || getStepIndex(nextStepElement) + 1;

  updateNextButtonState(questionTheme, questionStep);

  activeStep.classList.add('hide');
  nextStepElement.classList.remove('hide');

  console.log(detailedResults);
}

function showResults() {
  // masque le quiz
  document.querySelector('.opti-sim_content-wrapper').classList.add('hide');
  // affiche la zone de résultats
  const resultWrapper = document.querySelector('.opti-sim_results-wrapper');
  resultWrapper.classList.remove('hide');
  renderResults(resultWrapper);
}

function renderResults(container) {
  const resultsDiv = container.querySelector('.results') ||
    (() => {
      const d = document.createElement('div');
      d.classList.add('results');
      container.appendChild(d);
      return d;
    })();

  resultsDiv.innerHTML = '';

  // --- Légende des couleurs (sans le vert) ---
  const legend = document.createElement('div');
  legend.className = 'result-legend';
  legend.innerHTML = `
    <span><span class="dot red"></span> urgent</span>
    <span><span class="dot orange"></span> moyen</span>
  `;
  resultsDiv.appendChild(legend);

  // Mapping des noms de thèmes -> libellés affichés
  const THEME_LABELS = {
    wage: 'Rémunération',
    development: 'Développement',
    organisation: 'Organisation',
    gestion: 'Gestion',
    protection: 'Protection'
  };

  const capitalize = (str) => !str ? '' : str.charAt(0).toUpperCase() + str.slice(1);

  // --- Affichage des sections ---
  Object.entries(finalResults).forEach(([theme, pct]) => {
    const section = document.createElement('section');
    section.classList.add('result-section');

    const resultGrid = document.createElement('div');
    resultGrid.classList.add('result-grid');

    // Titre (ex: Rémunération : 62%)
    const title = document.createElement('h3');
    const themeName = THEME_LABELS[theme] || capitalize(theme);
    title.textContent = `${themeName} : ${pct}%`;

    // Container des messages
    const messagesContainer = document.createElement('div');
    messagesContainer.classList.add('result-messages');

    // Sécurité: récupérer la liste détaillée du thème (sinon tableau vide)
    const entries = Array.isArray(detailedResults[theme]) ? detailedResults[theme] : [];

    entries.forEach(entry => {
      // On masque les messages "verts" (points >= 5)
      if (entry.points >= 5) return;

      const messageWrapper = document.createElement('div');
      messageWrapper.classList.add('result-message');

      // Couleur en fonction des points
      messageWrapper.classList.add(entry.points >= 3 ? 'orange' : 'red');

      // Bullet rond
      const bullet = document.createElement('div');
      bullet.classList.add('bullet');

      // Texte du message
      const messageText = document.createElement('div');
      messageText.textContent = entry.message;

      // Structure finale
      messageWrapper.appendChild(bullet);
      messageWrapper.appendChild(messageText);
      messagesContainer.appendChild(messageWrapper);
    });

    // Construction finale du bloc
    resultGrid.appendChild(title);
    resultGrid.appendChild(messagesContainer);
    section.appendChild(resultGrid);
    resultsDiv.appendChild(section);
  });
}



nextButton.addEventListener('click', () => changeQuestion('next'));
prevButton.addEventListener('click', () => changeQuestion('prev'));

function initializeQuiz() {
  steps.forEach(step => {
    const theme = step.dataset.theme;
    const stepIdOrIndex = step.dataset.step || step.id;
    updateNextButtonState(theme, stepIdOrIndex);
  });
  prevButton.style.opacity = 0;
}


initializeQuiz();


function setupExclusiveMultiCheckbox({ questionId, answerKey, theme }) {
  const questionElement = document.getElementById(questionId);
  if (!questionElement) return;

  const checkboxes = questionElement.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const clickedItem = checkbox.closest('.opti-sim_answer-item');
      const clickedValue = clickedItem?.dataset.answer;

      if (!clickedValue) return;

      if (clickedValue === 'non' && checkbox.checked) {
        checkboxes.forEach(cb => {
          if (cb !== checkbox) {
            cb.checked = false;
            cb.closest('.opti-sim_answer-item')?.classList.remove('is-selected');
          }
        });
      }

      if (clickedValue !== 'non' && checkbox.checked) {
        checkboxes.forEach(cb => {
          const item = cb.closest('.opti-sim_answer-item');
          if (item?.dataset.answer === 'non' && cb.checked) {
            cb.checked = false;
            item.classList.remove('is-selected');
          }
        });
      }

      checkboxes.forEach(cb => {
        const item = cb.closest('.opti-sim_answer-item');
        if (item) {
          item.classList.toggle('is-selected', cb.checked);
        }
      });

      const selectedValues = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.closest('.opti-sim_answer-item')?.dataset.answer)
        .filter(Boolean);

      selectedAnswers[`${theme}-${answerKey}`] = selectedValues;

      if (theme === 'organisation') {
        calculOrganisation(questionId);
      } else if (theme === 'development') {
        calculDevelopment(questionId);
      } else if (theme === 'wage') {
        calculWage(questionId);
      }

      updateNextButtonState(theme, questionId);
    });
  });
}

setupExclusiveMultiCheckbox({
  questionId: 'learning-methods',
  answerKey: 'learning-methods',
  theme: 'organisation'
});

setupExclusiveMultiCheckbox({
  questionId: 'eligible-benefit-cases',
  answerKey: 'eligible-benefit-cases',
  theme: 'wage'
});

setupExclusiveMultiCheckbox({
  questionId: 'benefits-in-kind-tax-reduction',
  answerKey: 'benefits-in-kind-tax-reduction',
  theme: 'wage'
});


function setupMultiAnswerQuestion({ questionId, answerKey, theme }) {
  const questionElement = document.getElementById(questionId);
  if (!questionElement) return;

  const checkboxes = questionElement.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const selectedValues = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      if (selectedValues.includes('non')) {
        // Si "non" est coché, on décoche les autres
        checkboxes.forEach(cb => {
          if (cb.value !== 'non') cb.checked = false;
        });
      } else {
        // Si autre chose est coché, on décoche "non"
        checkboxes.forEach(cb => {
          if (cb.value === 'non') cb.checked = false;
        });
      }

      // ✅ Mettre à jour les classes "is-selected"
      checkboxes.forEach(cb => {
        const item = cb.closest('.opti-sim_answer-item');
        if (item) {
          item.classList.toggle('is-selected', cb.checked);
        }
      });

      const finalValues = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      selectedAnswers[answerKey] = finalValues;

      if (theme === 'organisation') {
        calculOrganisation(questionId);
      } else if (theme === 'development') {
        calculDevelopment(questionId);
      } else if (theme === 'wage') {
        calculWage(questionId);
      } else if (theme === 'protection') {
        calculProtection(questionId);
      }

      updateNextButtonState(theme, questionId);
    });
  });
}

setupMultiAnswerQuestion({
  questionId: 'chosen-protection-plan',
  answerKey: 'development-chosen-protection-plan',
  theme: 'development'
});

setupMultiAnswerQuestion({
  questionId: 'retirement-contribution-type',
  answerKey: 'development-retirement-contribution-type',
  theme: 'development'
});

setupMultiAnswerQuestion({
  questionId: 'ai-task-usage',
  answerKey: 'development-ai-task-usage',
  theme: 'development'
});

setupMultiAnswerQuestion({
  questionId: 'investment-cashflow-tax-optimization',
  answerKey: 'wage-investment-cashflow-tax-optimization',
  theme: 'wage'
});

setupMultiAnswerQuestion({
  questionId: 'treasury-investment-supports',
  answerKey: 'protection-treasury-investment-supports',
  theme: 'protection'
});

setupMultiAnswerQuestion({
  questionId: 'subscribed-insurances-list',
  answerKey: 'protection-subscribed-insurances-list',
  theme: 'protection'
});



function fillInfoText(question, infoTitle, infoText) {
  question.querySelector('.opti-sim_info-title').textContent = infoTitle;
  question.querySelector('.opti-sim_info-text').innerHTML = infoText;
}

function fillInfoTextAnswerCondition(answerValue, question, ouiTitle, ouiText, mediumTitle, mediumText, nonTitle, nonText) {
  if (answerValue === 'oui') {
    fillInfoText(question, ouiTitle, ouiText);
  } else if (answerValue === 'medium') {
    fillInfoText(question, mediumTitle, mediumText);
  } else if (answerValue === 'non') {
    fillInfoText(question, nonTitle, nonText);
  }
}

function fillInfoFiveTextAnswerCondition(answerValue, question, ouiTitle, ouiText, mediumyesTitle, mediumyesText, mediumTitle, mediumText, mediumnoTitle, mediumnoText, nonTitle, nonText) {
  if (answerValue === 'oui') {
    fillInfoText(question, ouiTitle, ouiText);
  } else if (answerValue === 'mediumyes') {
    fillInfoText(question, mediumyesTitle, mediumyesText);
  } else if (answerValue === 'medium') {
    fillInfoText(question, mediumnoTitle, mediumnoText);
  } else if (answerValue === 'mediumno') {
    fillInfoText(question, mediumTitle, mediumText);
  } else if (answerValue === 'non') {
    fillInfoText(question, nonTitle, nonText);
  }
}

function calculGestion() {
  const questions = steps.filter(step => step.dataset.theme === 'gestion');
  let result = 0;
  let answeredQuestions = 0;
  let answers = {};
  detailedResults.gestion = [];

  let unemploymentAnswer = null;
  let socialFormAnswer = null;
  let turnoverAnswer = null;

  // Déterminer le nombre réel de questions "notées" pour Gestion
  const questionsCountable = questions.filter(q => q.dataset.point !== 'false');
  const totalQuestionsForGestion = questionsCountable.length;

  questions.forEach((question, index) => {
    const questionKey = `gestion-${index + 1}`;
    let answerValue = selectedAnswers[questionKey];

    let questionId = question.id;
    if (!questionId) {
      questionId = `question-${index + 1}`;
      question.id = questionId;
    }

    answers[questionId] = answerValue;

    if (questionId === 'has-unemployment') {
      unemploymentAnswer = answerValue;
    } else if (questionId === 'social-form') {
      socialFormAnswer = answerValue;
    } else if (questionId === 'turnover') {
      turnoverAnswer = answerValue;
      localStorage.setItem('turnover', turnoverAnswer);
    }

    const holdingQuestion = document.getElementById('holding-structure-income-optimization');
    if (holdingQuestion) {
      if (turnoverAnswer !== 'more-500') {
        holdingQuestion.style.display = 'none';
        holdingQuestion.dataset.ignore = 'true';
        holdingQuestion.dataset.point = 'false';
      } else {
        holdingQuestion.style.display = ''; // au cas où on revient en arrière
        holdingQuestion.dataset.ignore = 'false';
        holdingQuestion.dataset.point = '';
      }
    }

    const ccaCashInjesctionQuestion = document.getElementById('cca-cash-injection');
    if (ccaCashInjesctionQuestion) {
      if (socialFormAnswer !== 'eurl' || socialFormAnswer !== 'sasu') {
        ccaCashInjesctionQuestion.style.display = 'none';
        ccaCashInjesctionQuestion.dataset.ignore = 'true';
        ccaCashInjesctionQuestion.dataset.point = 'false';
      } else {
        ccaCashInjesctionQuestion.style.display = ''; // au cas où on revient en arrière
        ccaCashInjesctionQuestion.dataset.ignore = 'false';
        ccaCashInjesctionQuestion.dataset.point = '';
      }
    }

    if (questionId === 'defined-strategy') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Bravo',
        `Vous avez choisi votre statut juridique <strong>après une analyse approfondie</strong>. C’est une excellente stratégie qui vous permet d’<strong>optimiser votre fiscalité, votre protection sociale et vos possibilités de financement</strong>.`,
        'Bon début',
        `Vous avez choisi un statut juridique, mais <strong>sans étude détaillée</strong>. C’est un bon début, mais <strong>une analyse plus poussée</strong> pourrait vous permettre de mieux aligner votre statut avec vos objectifs et votre activité. <strong>L’accompagnement d’un expert</strong> serait précieux.`,
        'Attention',
        `Votre statut juridique <strong>n’a pas été choisi dans le cadre d’une stratégie réfléchie</strong>. Pour <strong>optimiser vos avantages fiscaux et sociaux</strong>, une analyse approfondie avec un professionnel serait une étape clé.`
      );
    } else if (questionId === 'change-status') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Excellente démarche',
        `Vous avez déjà <strong>envisagé (ou effectué) un changement de statut</strong> pour optimiser votre situation. Cette anticipation est une <strong>démarche stratégique</strong> qui vous permet d’<strong>adapter votre structure à l’évolution de votre activité</strong>.`,
        'Bonne réflexion',
        `Vous avez déjà <strong>réfléchi à un changement de statut</strong>, sans avoir encore agi. C’est une bonne piste : <strong>approfondir cette démarche avec un expert</strong> pourrait vous aider à mesurer les bénéfices concrets.`,
        'Songez-y',
        `Vous <strong>n’avez pas encore envisagé de changement de statut</strong>. Pourtant, <strong>adapter sa structure à l’évolution de l’activité</strong> peut représenter une opportunité d’<strong>optimisation fiscale et sociale</strong>. Un conseiller peut vous aider à explorer ces options.`
      );
    } else if (questionId === 'other-company-optimisation') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Félicitations',
        `Vous avez structuré votre activité avec un <strong>montage optimisé (holding, SCI, etc.)</strong>. C’est une excellente stratégie pour <strong>maximiser vos avantages fiscaux</strong> et <strong>améliorer la gestion globale de votre entreprise</strong>.`,
        'Bonne initiative',
        `Vous avez mis en place une structuration, mais <strong>elle n’est pas forcément optimisée</strong>. <strong>Un audit de votre organisation</strong> pourrait vous aider à identifier de nouvelles pistes d’<strong>optimisation fiscale et organisationnelle</strong>.`,
        'Attention',
        `Vous <strong>n’avez pas encore structuré votre activité avec d’autres sociétés</strong>. Pourtant, des montages adaptés (holding, SCI, etc.) peuvent être de <strong>puissants leviers</strong> pour <strong>optimiser votre fiscalité et votre gestion</strong>. Explorer ces options pourrait être intéressant.`
      );
    } else if (questionId === 'organized-administrative-management') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Super',
        `Vous avez <strong>délégué la gestion administrative à un prestataire externe</strong> (expert-comptable, gestionnaire de paie, etc.). C’est une excellente décision qui vous fait <strong>gagner du temps</strong> et vous apporte un <strong>suivi fiable et stratégique</strong>.`,
        'Bon début',
        `Vous <strong>gérez l’administratif en interne</strong> avec un outil adapté. C’est une bonne solution, mais <strong>l’accompagnement d’un expert</strong> pourrait renforcer la fiabilité et <strong>optimiser encore davantage votre organisation</strong>.`,
        'Attention',
        `Vous <strong>gérez seul(e) toute la partie administrative</strong>. Cela peut vite devenir <strong>chronophage et source d’erreurs</strong>. Déléguer ou vous équiper d’un outil adapté vous permettrait de <strong>gagner en sérénité et en efficacité</strong>.`
      );
    } else if (questionId === 'has-management-calendar') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Excellente organisation',
        `Vous avez un <strong>calendrier précis</strong> et respectez vos échéances. C’est une excellente organisation qui <strong>sécurise votre gestion</strong> et <strong>limite les risques d’oubli ou de sanction</strong>.`,
        'Vous êtes sur la bonne voie',
        `Vous avez un calendrier mais <strong>le suivi reste irrégulier</strong>. <strong>Améliorer votre rigueur</strong> ou <strong>automatiser des rappels</strong> vous permettrait d’éviter retards et imprévus.`,
        'Attention',
        `Vous <strong>n’avez pas de calendrier pour vos échéances administratives</strong>. C’est un <strong>risque majeur d’oubli ou de pénalité</strong>. Mettre en place un suivi, même simple avec un <strong>outil numérique</strong>, serait une vraie optimisation.`
      );
    } else if (questionId === 'how-follow-payments') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Parfait',
        `Vous utilisez un <strong>outil automatisé</strong> pour vos paiements et relances. C’est une excellente pratique qui <strong>sécurise votre trésorerie</strong> et réduit les <strong>risques d’impayés</strong>.`,
        'Bon suivi',
        `Vous faites un <strong>suivi manuel régulier</strong>. C’est sérieux, mais <strong>l’automatisation</strong> vous ferait gagner en temps et en fiabilité.`,
        'Attention',
        `Vous gérez vos paiements et relances <strong>au cas par cas, sans processus clair</strong>. C’est risqué pour votre trésorerie. <strong>Mettre en place un suivi structuré</strong> ou un <strong>outil dédié</strong> serait une priorité d’optimisation.`
      );
    } else if (questionId === 'has-optimized-billing-software') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        "Bravo",
        `Vous utilisez un <strong>logiciel de facturation avec automatisations complètes</strong> (facturation, paiements, relances). C’est un <strong>levier puissant</strong> pour <strong>sécuriser et fluidifier votre gestion</strong>.`,
        "C'est un bon début",
        `Vous avez un logiciel de facturation, mais <strong>sans automatisations</strong> pour les paiements et relances. <strong>Ajouter ces fonctions</strong> permettrait d’aller plus loin dans l’optimisation.`,
        "Attention",
        `Vous <strong>n’utilisez pas encore de logiciel de facturation optimisé</strong>. C’est une <strong>étape essentielle</strong> pour <strong>gagner du temps, limiter les erreurs et améliorer le suivi de votre trésorerie</strong>.`
      );
    } else if (questionId === 'has-optimized-pro-account') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        "Excellent choix",
        `Votre banque est <strong>adaptée à votre activité</strong>, avec des <strong>frais réduits</strong> et des <strong>services performants</strong>. C’est un excellent choix pour <strong>optimiser la gestion financière</strong> de votre entreprise.`,
        "C'est un bon début",
        `Votre banque <strong>répond partiellement à vos besoins</strong>. <strong>Comparer d’autres offres</strong> pourrait vous permettre de <strong>réduire vos frais</strong> et de bénéficier de <strong>services plus adaptés</strong>.`,
        "Attention",
        `Vous utilisez une banque <strong>peu ou pas adaptée à votre activité</strong>. Cela peut vous <strong>coûter cher en frais</strong> et <strong>limiter votre flexibilité</strong>. Explorer des <strong>solutions spécialisées</strong> serait une optimisation clé.`
      );
    } else if (questionId === 'is-up-to-date') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        "Félicitations",
        `Vous êtes <strong>parfaitement à jour</strong> dans vos obligations. <strong>Bravo</strong>, c’est un <strong>pilier essentiel</strong> pour la stabilité et la <strong>sérénité de votre gestion</strong>.`,
        "C'est un bon début",
        `Vous êtes <strong>globalement à jour</strong>, mais parfois en retard. <strong>Anticiper davantage</strong> et mettre en place un <strong>suivi plus rigoureux</strong> vous éviterait les imprévus.`,
        "Attention",
        `Vous <strong>n’êtes pas à jour</strong> dans vos obligations administratives et fiscales. C’est un <strong>risque important</strong>. <strong>Mettre en place un suivi</strong> ou vous faire accompagner par un <strong>expert</strong> serait fortement recommandé.`
      );
    }

    // Cumul du score pour cette question
    result += (answerValue === 'oui' ? 5 : answerValue === 'medium' ? 3 : 0);

    // Si la question est "notée", incrémenter le nombre de questions répondues
    if (question.dataset.point !== 'false') {
      if (selectedAnswers[questionKey]) {
        answeredQuestions++;
      }
    }

    let points = (answerValue === 'oui' ? 5 : answerValue === 'medium' ? 3 : 0);

    // const titleText = question.querySelector('.opti-sim_info-title')?.textContent.trim() ?? '';
    const bodyText  = question.querySelector('.opti-sim_info-text')?.textContent.trim() ?? '';

    let message;
    if (bodyText) {
      message = bodyText
        ? `${bodyText}`
        : bodyText;
    } else {
      message = `Réponse « ${answerValue} »`;
      points = 5;
    }

    detailedResults.gestion.push({ message, points });
    /*const infoTitleEl = question.querySelector('.opti-sim_info-title')?.textContent ?? '';
    const infoTextEl  = question.querySelector('.opti-sim_info-text')?.textContent  ?? '';

    const message = (infoTitleEl && infoTextEl)
    ? `${infoTitleEl.textContent} : ${infoTextEl.textContent}`
    : `Réponse « ${answerValue} »`;

    detailedResults.gestion.push({
      message,
      points
    });*/

    /*detailedResults.gestion.push({
      message: `${title} : ${text}`,
      points: points
    });*/
  });

  // Ajout des points conditionnels (non inclus dans selectedAnswers)
  if (unemploymentAnswer && socialFormAnswer && turnoverAnswer) {
    let conditionTitle = "";
    let conditionText = "";
    let conditionPoints = 0;

    if (
      (socialFormAnswer === "ei" && unemploymentAnswer === "no-unemployment" && turnoverAnswer === "less-80") ||
      (socialFormAnswer === "micro" && unemploymentAnswer === "no-unemployment" && turnoverAnswer === "less-80") ||
      (socialFormAnswer === "eurl" && unemploymentAnswer === "unemployment" && turnoverAnswer === "btwn-80-250") ||
      (socialFormAnswer === "sasu" && unemploymentAnswer === "unemployment" && turnoverAnswer === "more-250")
    ) {
      conditionPoints = 5;
      conditionTitle = "Félicitations";
      conditionText = "Vous optimisez parfaitement votre activité 🎉";
    } else if (
      (socialFormAnswer === "eurl" && unemploymentAnswer === "unemployment" && turnoverAnswer === "less-80") ||
      (socialFormAnswer === "eurl" && unemploymentAnswer === "unemployment" && turnoverAnswer === "more-250") ||
      (socialFormAnswer === "sasu" && unemploymentAnswer === "unemployment" && turnoverAnswer === "less-80") ||
      (socialFormAnswer === "sasu" && unemploymentAnswer === "unemployment" && turnoverAnswer === "btwn-80-250")
    ) {
      conditionPoints = 3;
      conditionTitle = "C'est bien";
      conditionText = "Mais vous pouvez davantage optimiser votre activité en ayant un statut adapté à votre CA.";
    } else {
      conditionPoints = 0;
      conditionTitle = "Votre activité n’est pas optimisée";
      conditionText = "Il est conseillé de revoir votre statut en fonction de votre CA.";
    }

    result += conditionPoints;

    if (conditionText) {
      let turnoverQuestion = document.getElementById('turnover');
      turnoverQuestion.querySelector('.opti-sim_info-wrapper').style.display = 'block';
      turnoverQuestion.querySelector('.opti-sim_info-title').textContent = conditionTitle;
      turnoverQuestion.querySelector('.opti-sim_info-text').textContent = conditionText;
    }
    detailedResults.gestion.push({
      message: conditionText,
      points:  conditionPoints
    });
  }

  // Calcul du score en pourcentage pour l'affichage textuel
  const resultOptimisation = answeredQuestions > 0 ? (result / (answeredQuestions * 5)) * 100 : 0;
  document.getElementById('gestion-result').textContent = Math.round(resultOptimisation);
  // Exemple dans calculDevelopment, juste avant updateProgressBar('development'):
  finalResults.gestion = Math.round(resultOptimisation);
  console.log(detailedResults);


  // Calcul de la barre de progression en se basant sur le nombre réel de questions "notées"
  const maxPointsGestion = totalQuestionsForGestion * 5;
  let goodPercentage = (result / maxPointsGestion) * 100;
  if (goodPercentage > 100) { goodPercentage = 100; }
  let progressPercentage = (answeredQuestions / totalQuestionsForGestion) * 100;
  let badPercentage = progressPercentage - goodPercentage;
  if (badPercentage < 0) { badPercentage = 0; }

  // Mise à jour de la barre de progression pour Gestion
  const progressBar = document.querySelector('.opti-sim_theme-item[data-theme="gestion"] .opti-sim_progress-bar-wrapper');
  if (progressBar) {
    const goodBar = progressBar.querySelector('.opti-sim_progress-bar.is-good');
    const badBar = progressBar.querySelector('.opti-sim_progress-bar.is-bad');
    if (goodBar && badBar) {
      goodBar.style.width = `${goodPercentage}%`;
      badBar.style.width = `${badPercentage}%`;
    }
  }
}

function calculOrganisation(questionContainerId) {
  // 1. Récupérer les questions notées du thème "organisation"
  const questions = steps.filter(
    step => step.dataset.theme === 'organisation' && step.dataset.point !== 'false'
  );

  // 2. Définir les textes pour "learning-methods"
  const learningMethods = {
    "tutoriels-videos": {
      title: "Tutoriels et vidéos",
      body:  `Vous privilégiez les <strong>tutoriels et vidéos</strong>, un format pratique et accessible pour apprendre rapidement. Compléter avec d’autres supports permettrait de <strong>diversifier vos compétences</strong>.`
    },
    "blogs-articles": {
      title: "Blogs et articles",
      body:  `Vous vous formez via des <strong>blogs et articles</strong>. C’est une bonne habitude pour <strong>rester à jour</strong>, à compléter par des formats plus approfondis.`
    },
    "livres-specialises": {
      title: "Livres spécialisés",
      body:  `Vous utilisez des <strong>livres spécialisés</strong>. Excellent choix pour acquérir une <strong>expertise approfondie</strong>, surtout s’ils sont associés à de la pratique.`
    },
    "autre": {
      title: "Autre",
      body:  `Vous avez une <strong>méthode de formation personnelle</strong>. L’essentiel est de <strong>rester en veille</strong> et de <strong>continuer à apprendre régulièrement</strong>.`
    },
    "non": {
      title: "Non, je ne me forme pas",
      body:  `Vous ne consacrez pas de temps à la <strong>formation</strong>. Or, c’est un <strong>levier clé</strong> pour évoluer et rester <strong>compétitif</strong>. Même un <strong>petit temps régulier</strong> ferait une grande différence.`
    }
  };

  // 3. Identifier les questions à cases multiples
  const multiIds = ['learning-methods'];

  // 4. Initialisation des compteurs et du stockage détaillé
  let result = 0;
  let answeredQuestions = 0;
  detailedResults.organisation = [];

  // 5. Parcourir chaque question
  questions.forEach(question => {
    // a) Clé et réponse
    const key = `organisation-${question.dataset.step}`;
    const raw = selectedAnswers[key];
    const answerValue = multiIds.includes(question.id || '') 
      ? (Array.isArray(raw) ? raw : raw ? [raw] : [])
      : raw;

    // b) ID stable
    const qid = question.id || `organisation-${question.dataset.step}`;
    question.id = qid;

    // c) Calcul des points
    let points = 0;
    if (qid === 'learning-methods') {
      const vals = answerValue;
      if      (vals.includes('non'))   points = 0;
      else if (vals.length === 1)      points = 3;
      else if (vals.length >= 2)       points = 5;
    } else {
      if      (answerValue === 'oui')    points = 5;
      else if (answerValue === 'medium') points = 3;
      else                                 points = 0;
    }
    result += points;

    // d) Construire title & body
    let title = "", body = "";
    if (qid === 'learning-methods') {
      const choice = answerValue.includes('non')
        ? 'non'
        : (answerValue[0] || 'non');
      const info = learningMethods[choice];
      title = info.title;
      body  = info.body;
    }
    else if (qid === 'hours-worked') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = `Vous travaillez entre <strong>35 et 45h par semaine</strong>, un rythme équilibré qui maximise votre productivité tout en préservant votre bien-être.`; }
      else if (answerValue === 'medium') { title = 'Bon équilibre entre travail et vie personnelle'; body = `Vous travaillez entre <strong>25 et 35h par semaine</strong>. C’est un bon équilibre pro/perso, veillez toutefois à ce que ce rythme reste compatible avec vos objectifs de croissance.`; }
      else                                { title = 'Attention'; body = `Vous travaillez entre <strong>45 et 55h par semaine</strong>. Ce rythme intensif peut être efficace à court terme, mais attention au <strong>risque de surmenage</strong>. Une meilleure organisation pourrait répartir la charge plus durablement.`; }
    }
    else if (qid === 'planned-weeks') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = `Vous planifiez votre semaine avec <strong>précision</strong> et <strong>anticipez vos priorités</strong>. C’est une excellente stratégie pour <strong>optimiser votre temps</strong> et rester concentré.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous planifiez <strong>partiellement vos semaines</strong>. C’est une bonne base, mais un <strong>planning plus structuré</strong> vous aiderait à mieux gérer vos priorités et éviter les imprévus.`; }
      else                                { title = 'Attention'; body = `Vous gérez vos tâches <strong>au jour le jour, sans plan clair</strong>. Cela peut générer <strong>stress et désorganisation</strong>. Structurer vos semaines avec un planning précis vous ferait <strong>gagner en efficacité</strong>.`; }
    }
    else if (qid === 'daily-routine-productivity') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous avez une <strong>routine quotidienne</strong> avec des <strong>rituels bien définis</strong>. C’est une excellente habitude pour rester <strong>productif et concentré</strong>.`; }
      else if (answerValue === 'medium') { title = 'Vous êtes sur la bonne voie'; body = `Vous avez une certaine routine, mais <strong>sans régularité</strong>. En l’ancrant davantage, vous pourriez améliorer encore votre <strong>efficacité</strong> et votre <strong>gestion du temps</strong>.`; }
      else                                { title = 'Attention'; body = `Vous <strong>n’avez pas de routine structurée</strong>. Cela peut nuire à votre <strong>concentration</strong> et à votre <strong>énergie</strong>. Mettre en place quelques <strong>rituels fixes</strong> renforcerait votre productivité.`; }
    }
    else if (qid === 'client-acquisition-strategy') {
      if      (answerValue === 'oui')    { title = 'Super'; body = `Vous avez une <strong>stratégie claire et structurée</strong> pour prospecter, avec des <strong>actions régulières</strong>. C’est une approche idéale pour développer votre activité de manière prévisible.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous avez une stratégie, mais vos <strong>actions manquent de régularité</strong> ou de suivi. Les rendre plus <strong>systématiques</strong> vous aiderait à améliorer vos résultats.`; }
      else                                { title = 'Attention'; body = `Vous prospectez <strong>sans véritable stratégie</strong>. Cela freine votre croissance. Construire un <strong>plan structuré</strong> avec des <strong>actions mesurables</strong> renforcerait votre acquisition de clients.`; }
    }
    else if (qid === 'weekly-admin-time') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous réservez un <strong>créneau précis</strong> chaque semaine pour vos tâches administratives. C’est une excellente organisation qui évite l’<strong>accumulation</strong> et les <strong>oublis</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bonne initiative'; body = `Vous consacrez du temps à l’administratif, mais de manière <strong>peu optimisée</strong>. Structurer davantage ce temps pourrait <strong>réduire la charge mentale</strong> et améliorer l’<strong>efficacité</strong>.`; }
      else                                { title = 'Attention'; body = `Vous gérez l’administratif <strong>au jour le jour</strong>, ce qui augmente les <strong>risques d’oublis</strong> et de <strong>stress</strong>. Bloquer un <strong>créneau régulier</strong> serait une optimisation clé.`; }
    }
    else if (qid === 'burnout-prevention-breaks') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous prenez régulièrement au moins <strong>5 semaines de repos par an</strong>. C’est une excellente habitude pour <strong>préserver votre énergie</strong> et éviter le <strong>burn-out</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bonne initiative'; body = `Vous prenez des vacances, mais <strong>pas assez</strong> ou de manière <strong>irrégulière</strong>. Planifier davantage de <strong>vraies pauses</strong> vous aiderait à maintenir un meilleur équilibre.`; }
      else                                { title = 'Attention'; body = `Vous prenez <strong>rarement, voire jamais, de pauses</strong>. Cela met votre <strong>santé</strong> et votre <strong>productivité</strong> en danger. Intégrer du <strong>repos</strong> dans votre agenda est essentiel.`; }
    }
    else if (qid === 'work-schedule-balance') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = `Vos horaires sont <strong>fixes</strong> et adaptés à vos <strong>pics de productivité</strong>. C’est une excellente manière d’allier <strong>efficacité</strong> et <strong>équilibre de vie</strong>.`; }
      else if (answerValue === 'medium') { title = 'Vous avez une certaine organisation'; body = `Vous avez une organisation horaire, mais vos <strong>variations fréquentes</strong> nuisent parfois à votre <strong>efficacité</strong>. Stabiliser vos horaires pourrait améliorer vos journées.`; }
      else                                { title = 'Attention'; body = `Vous travaillez à <strong>n’importe quelle heure, sans cadre défini</strong>. Cela peut nuire à la fois à votre <strong>productivité</strong> et à votre <strong>équilibre personnel</strong>. Fixer des <strong>plages régulières</strong> serait bénéfique.`; }
    }
    else if (qid === 'task-delegation') {
      if      (answerValue === 'oui')    { title = 'Très bonne approche'; body = `Vous <strong>déléguez</strong> ce qui n’est pas votre <strong>cœur de métier</strong> (comptabilité, communication, etc.). C’est une excellente stratégie pour <strong>gagner du temps</strong> et vous concentrer sur l’<strong>essentiel</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous déléguez, mais de manière <strong>limitée</strong>. <strong>Externaliser davantage</strong> de tâches pourrait renforcer votre <strong>productivité</strong> et réduire votre <strong>charge de travail</strong>.`; }
      else                                { title = 'Attention'; body = `Vous <strong>gérez tout vous-même</strong>. Cela peut rapidement devenir une <strong>surcharge</strong>. <strong>Déléguer certaines missions</strong> vous permettrait de vous recentrer sur votre véritable <strong>valeur ajoutée</strong>.`; }
    }
    else if (qid === 'monthly-learning-time') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous consacrez entre <strong>6 et 9h par mois</strong> à votre formation. C’est un <strong>excellent investissement</strong> pour rester <strong>compétitif</strong> et progresser constamment.`; }
      else if (answerValue === 'medium') { title = 'Bon investissement'; body = `Vous consacrez entre <strong>3 et 6h par mois</strong> à vous former. C’est une <strong>bonne base</strong>, mais <strong>augmenter légèrement ce temps</strong> renforcerait encore vos <strong>compétences</strong>.`; }
      else                                { title = 'Attention'; body = `Vous consacrez <strong>moins de 3h par mois</strong> à la formation. Or, rester en <strong>veille</strong> et apprendre régulièrement est essentiel pour évoluer. Intégrer plus de <strong>formation</strong> à votre emploi du temps serait une vraie optimisation.`; }
    }

    // f) Injecter dans le simulateur si c’est la question active
    if (qid === questionContainerId) {
      const wrap    = question.querySelector('.opti-sim_info-wrapper');
      const tEl     = question.querySelector('.opti-sim_info-title');
      const textEl  = question.querySelector('.opti-sim_info-text');
      if (wrap)   wrap.style.display = 'block';
      if (tEl)    tEl.textContent      = title;
      if (textEl) textEl.textContent   = body;
    }

    // g) Compter comme répondue
    const isAnswered = multiIds.includes(qid)
      ? answerValue.length > 0
      : ['oui','medium','non'].includes(answerValue);
    if (isAnswered) answeredQuestions++;

    // h) Stocker le détail seulement si title ou body existent
    if (title || body) {
      const message = body ? `${body}` : title;
      detailedResults.organisation.push({ message, points });
    }
  });

  // 6. Calculer le pourcentage global et mettre à jour l’UI
  const pct = answeredQuestions > 0
    ? Math.round((result / (answeredQuestions * 5)) * 100)
    : 0;
  document.getElementById('organisation-result').textContent = pct;
  updateProgressBar('organisation');
  finalResults.organisation = pct;

  console.log(detailedResults.organisation);
}

function calculDevelopment(questionContainerId) {
  // 1. Récupérer toutes les questions notées du thème "development"
  const questions = steps.filter(
    step => step.dataset.theme === 'development' && step.dataset.point !== 'false'
  );

  // 2. Identifiants des questions à réponses multiples
  const multiIds = [
    'chosen-protection-plan',
    'retirement-contribution-type',
    'ai-task-usage'
  ];

  // 3. Initialisation
  let result = 0;
  let answeredQuestions = 0;
  detailedResults.development = [];

  // 4. Parcours de chaque question
  questions.forEach(question => {
    // a) ID stable et clé pour selectedAnswers
    const qid = question.id || question.dataset.step;
    question.id = qid;
    let key = `development-${question.dataset.step}`;
    if (multiIds.includes(qid)) key = `development-${qid}`;

    // b) Récupérer la/les réponse(s)
    const raw = selectedAnswers[key];
    const answerValue = multiIds.includes(qid)
      ? Array.isArray(raw) ? raw : raw ? [raw] : []
      : raw;

    // c) Calcul des points
    let points = 0;
    if (multiIds.includes(qid)) {
      points = answerValue.length;
    } else {
      if      (answerValue === 'oui')    points = 5;
      else if (answerValue === 'medium') points = 3;
      else                                points = 0;
    }
    result += points;

    // d) Construire title et body
    let title = '', body = '';

    if (qid === 'unique-value-proposition') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous avez une <strong>proposition de valeur claire et différenciante</strong>. C’est un atout majeur pour <strong>attirer les bons clients</strong> et <strong>vous démarquer</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Votre proposition de valeur existe mais <strong>manque encore de clarté ou de différenciation</strong>. Travailler votre <strong>message</strong> et votre <strong>communication</strong> la rendrait plus percutante.`; }
      else                                { title = 'Attention'; body = `Vous n’avez pas encore <strong>défini clairement votre proposition de valeur</strong>. Clarifier <strong>ce qui vous rend unique</strong> est une priorité pour convaincre vos clients.`; }
    }
    else if (qid === 'networking-events-participation') {
      if      (answerValue === 'oui')    { title = 'Excellente démarche'; body = `Vous participez régulièrement à des <strong>événements stratégiques</strong>. Excellente démarche pour <strong>développer votre réseau</strong> et accéder à de <strong>nouvelles opportunités</strong>.`; }
      else if (answerValue === 'medium') { title = 'C\'est un bon début'; body = `Vous participez à certains événements, mais <strong>sans réelle stratégie</strong>. Mieux <strong>choisir vos rendez-vous</strong> et fixer des <strong>objectifs</strong> augmenterait les bénéfices.`; }
      else                                { title = 'Attention'; body = `Vous ne participez pas à des événements professionnels. Or, ces rencontres sont un <strong>excellent moyen</strong> de développer votre réseau et de <strong>trouver des clients</strong>. En intégrer quelques-uns à votre agenda serait un vrai plus.`; }
    }
    else if (qid === 'online-visibility-channels') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = `Vous utilisez <strong>LinkedIn</strong> (et d’autres canaux) de manière <strong>régulière et stratégique</strong>, ce qui renforce votre <strong>crédibilité</strong> et attire de <strong>nouveaux clients</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous êtes présent(e) sur LinkedIn, mais <strong>sans réelle stratégie</strong>. Mettre en place un <strong>plan de contenu clair et régulier</strong> améliorerait fortement votre visibilité.`; }
      else                                { title = 'Attention'; body = `Vous n’utilisez pas encore LinkedIn ou d’autres canaux. Ce sont des <strong>leviers puissants</strong> pour <strong>attirer des clients</strong> et <strong>renforcer votre positionnement</strong>.`; }
    }
    else if (qid === 'client-conversion-system') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = `Vous avez mis en place une <strong>stratégie d’acquisition claire, optimisée et suivie</strong>, un levier puissant pour une croissance <strong>stable et prévisible</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous avez un système d’acquisition, mais <strong>pas totalement optimisé</strong>. L’<strong>analyser</strong> et l’<strong>améliorer</strong> vous offrirait de meilleurs résultats.`; }
      else                                { title = 'Attention'; body = `Vous n’avez pas encore de <strong>système structuré</strong> pour attirer des clients. Construire une stratégie (<strong>SEO, publicité, inbound</strong>) serait une étape clé pour booster votre croissance.`; }
    }
    else if (qid === 'mentorship-or-peer-support') {
      if      (answerValue === 'oui')    { title = 'Super'; body = `Vous bénéficiez d’un <strong>mentor</strong> ou d’un <strong>groupe d’entrepreneurs</strong>, une ressource précieuse pour <strong>progresser plus vite</strong> et <strong>éviter les erreurs</strong>.`; }
      else if (answerValue === 'medium') { title = 'C\'est un bon début'; body = `Vous avez un accompagnement, mais <strong>pas régulier ou approfondi</strong>. Le rendre plus <strong>constant</strong> accélérerait votre développement.`; }
      else                                { title = 'Attention'; body = `Vous n’êtes pas accompagné par un mentor ni un réseau. Ces échanges apportent des <strong>conseils précieux</strong> et <strong>accélèrent la progression</strong>.`; }
    }
    else if (qid === 'competitor-analysis') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous analysez régulièrement vos <strong>concurrents</strong> et <strong>ajustez votre offre</strong> en conséquence, une excellente pratique pour rester <strong>compétitif</strong>.`; }
      else if (answerValue === 'medium') { title = 'C\'est un bon début'; body = `Vous observez vos concurrents de manière <strong>irrégulière</strong>. Structurer votre <strong>veille</strong> renforcerait votre positionnement et l’<strong>innovation</strong>.`; }
      else                                { title = 'Attention'; body = `Vous n’analysez pas vos concurrents. Les connaître est <strong>essentiel</strong> pour vous <strong>différencier</strong> et affiner votre offre. Mettre en place une veille simple serait déjà un vrai pas en avant.`; }
    }
    else if (qid === 'offer-or-model-innovation') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = `Vous <strong>innovez régulièrement</strong> dans votre offre ou votre modèle économique, une excellente stratégie pour <strong>rester compétitif</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous innovez, mais <strong>pas de manière systématique</strong>. Rendre le processus plus <strong>régulier</strong> ouvrirait de nouvelles opportunités.`; }
      else                                { title = 'Attention'; body = `Votre offre n’a pas <strong>évolué récemment</strong>. L’<strong>innovation</strong> est pourtant clé pour se <strong>démarquer</strong> et anticiper les évolutions du marché. Explorer de nouvelles idées dynamiserait votre activité.'`; }
    }
    else if (qid === 'business-diversification-plan') {
      if      (answerValue === 'oui')    { title = 'Très bonne stratégie'; body = `Vous avez une <strong>stratégie claire de diversification</strong>, excellente approche pour la <strong>pérennité</strong> et la <strong>croissance</strong> de votre activité.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous envisagez une diversification mais <strong>sans plan structuré</strong>. Définir des <strong>actions concrètes</strong> aiderait à passer à l’étape suivante.`; }
      else                                { title = 'Attention'; body = `Vous n’avez pas prévu de diversifier votre activité. Pourtant, cela permet de trong>réduire les risques</strong> et d'<strong>ouvrir de nouveaux marchés</strong>. Y réfléchir dès maintenant pourrait être une bonne opportunité.`; }
    }
    else if (qid === 'mileage-allowance-usage') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous utilisez les <strong>indemnités kilométriques</strong> : très bon choix pour <strong>optimiser vos frais de déplacement</strong> et bénéficier d’un <strong>avantage fiscal</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon choix'; body = `Vous utilisez un <strong>véhicule professionnel</strong>. C’est une bonne alternative, mais pensez à vérifier si les indemnités kilométriques ou d’autres dispositifs seraient <strong>plus avantageux</strong> dans votre situation.`; }
      else if (answerValue === 'non')     { title = 'Bon à savoir'; body = `Vous utilisez votre voiture personnelle <strong>sans demander les indemnités kilométriques</strong>. Les réclamer permettrait de <strong>récupérer une somme intéressante</strong>.`; }
      else { title = "Pas d'optimisation supplémentaire"; body = `Vous n’utilisez pas de <strong>véhicule personnel</strong> pour vos déplacements professionnels. Pas de frais à optimiser sur ce point.` }
    }
    else if (qid === 'holiday-voucher-setup') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous <strong>maximisez</strong> le montant des <strong>chèques vacances</strong> (jusqu’à 554,40 € en 2024), une optimisation qui <strong>réduit vos charges</strong> et améliore votre qualité de vie.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous utilisez les chèques vacances, mais <strong>pas à leur plein potentiel</strong>. Atteindre le <strong>plafond</strong> permettrait d’optimiser davantage vos avantages.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’utilisez pas encore les <strong>chèques vacances</strong>. C’est une opportunité simple pour <strong>réduire vos charges</strong> et bénéficier d’un avantage fiscal intéressant.`; }
    }
    else if (qid === 'cesu-tax-benefits') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = `Vous exploitez pleinement le dispositif <strong>CESU</strong> (jusqu’à 2 540 €), un excellent moyen d’<strong>alléger vos impôts</strong> tout en profitant de services à domicile.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous utilisez les CESU de manière <strong>partielle</strong>. Monter jusqu’au <strong>plafond</strong> maximiserait vos économies fiscales.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’utilisez pas le dispositif <strong>CESU</strong>, alors qu’il <strong>réduit vos charges</strong> et facilite le recours à des <strong>services personnels</strong>.`; }
    }
    else if (qid === 'expense-tracking-setup') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = `Vous <strong>suivez et optimisez</strong> chaque dépense, une pratique qui garantit des <strong>économies substantielles</strong> et une gestion fiable.`; }
      else if (answerValue === 'medium') { title = 'Vous êtes sur la bonne voie'; body = `Vous enregistrez vos notes de frais, mais de manière <strong>pas totalement rigoureuse</strong>. Un suivi plus <strong>précis</strong> éviterait des pertes financières.`; }
      else                                { title = 'Bon à savoir'; body = `Vous ne suivez pas vos notes de frais. Cela peut entraîner des erreurs et des coûts supplémentaires. Structurer un <strong>suivi régulier</strong> est une optimisation <strong>clé</strong>.`; }
    }
    else if (qid === 'expense-optimization-strategies') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = `Vous exploitez <strong>tous les leviers possibles</strong> (primes, exonérations, forfaits…) pour <strong>réduire vos charges</strong> : très bonne gestion.`; }
      else if (answerValue === 'medium') { title = 'Vous avez déjà pris de bonnes initiatives'; body = `Vous optimisez déjà certaines charges, mais <strong>pas toutes</strong>. Un <strong>audit régulier</strong> pourrait révéler d’autres économies.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’avez pas encore exploré les dispositifs d’<strong>optimisation des charges</strong>, une opportunité directe pour <strong>améliorer la rentabilité</strong>.`; }
    }
    else if (qid === 'project-tools-automation') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = `Vous utilisez pleinement des outils comme <strong>Notion, Trello, Zapier</strong> : excellente gestion, plus de <strong>productivité</strong> et moins de <strong>charge mentale</strong>.`; }
      else if (answerValue === 'medium') { title = 'Vous utilisez déjà des outils, c’est un bon début'; body = `Vous utilisez déjà certains outils, mais de manière <strong>partielle</strong>. Une meilleure <strong>intégration</strong> et <strong>automatisation</strong> boosterait votre efficacité.`; }
      else                                { title = 'Bon à savoir'; body = `Vous <strong>n’utilisez pas</strong> encore d’outils de gestion ou d’automatisation. Tester <strong>Notion, Trello ou Zapier</strong> pourrait vous faire gagner beaucoup de temps et de clarté.`; }
    }
    else if (qid === 'optimized-work-routine') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous avez mis en place une <strong>routine claire et régulière</strong>. C’est une excellente habitude pour maximiser votre <strong>concentration</strong> et votre <strong>productivité</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous avez une routine, mais elle <strong>manque de discipline</strong>. La rendre plus <strong>régulière</strong> améliorerait votre efficacité.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’avez pas encore de <strong>routine structurée</strong>. En mettre une en place progressivement vous aiderait à mieux <strong>gérer votre énergie</strong> au quotidien.`; }
    }
    else if (qid === 'time-management-techniques') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = `Vous appliquez rigoureusement des <strong>techniques de gestion du temps</strong>. C’est un <strong>levier puissant</strong> pour rester <strong>productif</strong> et concentré.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous utilisez certaines techniques, mais <strong>pas régulièrement</strong>. Les appliquer plus <strong>systématiquement</strong> renforcerait leur efficacité.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’utilisez pas de <strong>techniques spécifiques</strong>. Tester <strong>Pomodoro</strong>, le <strong>Time-Blocking</strong> ou d’autres méthodes simples pourrait transformer votre organisation.`; }
    }
    else if (qid === 'goal-tracking-strategy') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous disposez d’un <strong>système clair</strong> pour <strong>suivre vos objectifs</strong> et <strong>prioriser vos tâches</strong>. C’est une excellente façon de garder le cap.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous suivez vos objectifs, mais de manière <strong>peu rigoureuse</strong>. Améliorer le <strong>suivi</strong> et la <strong>priorisation</strong> renforcerait vos résultats.`; }
      else                                { title = 'Bon à savoir'; body = `Vous ne suivez pas vos objectifs de manière <strong>organisée</strong>. Mettre en place un outil comme <strong>Notion</strong> ou <strong>ClickUp</strong> vous aiderait à mieux structurer vos progrès.`; }
    }
    else if (qid === 'decision-making-method') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = `Vous prenez vos décisions <strong>rapidement</strong> grâce à une <strong>méthodologie claire</strong>. Cela vous permet de <strong>gagner du temps</strong> et d’<strong>optimiser vos actions</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous prenez vos décisions, mais parfois <strong>trop lentement</strong>. Travailler sur une <strong>méthode plus structurée</strong> renforcerait votre efficacité.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’avez pas de <strong>méthode de décision claire</strong>. Utiliser la <strong>matrice d’Eisenhower</strong> ou la <strong>règle des 2 minutes</strong> pourrait vous aider à décider plus vite.`; }
    }
    else if (qid === 'email-automation-tools') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous utilisez des outils comme <strong>Sanebox</strong> ou <strong>Clean Email</strong> pour trier et automatiser vos emails : excellente optimisation de votre <strong>temps</strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Vous gérez vos emails <strong>manuellement</strong>, ce qui est chronophage. L’<strong>automatisation</strong> vous ferait gagner en efficacité.`; }
    }
    else if (qid === 'task-planning-tools') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = `Vous planifiez vos tâches avec des outils comme <strong>Trello</strong> ou <strong>Asana</strong>, une méthode très efficace pour gérer vos <strong>priorités</strong> efficacement.`; }
      else                                { title = 'Bon à savoir'; body = `Vous ne planifiez pas vos tâches avec des <strong>outils numériques</strong>. Les utiliser simplifierait l’<strong>organisation</strong> et la <strong>productivité</strong>.`; }
    }
    else if (qid === 'reminder-deadline-tools') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = `Vous utilisez <strong>Google Calendar</strong> ou <strong>Outlook</strong> pour vos rappels et échéances : excellente pratique pour <strong>ne rien oublier</strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Vous ne digitalisez pas vos <strong>rappels</strong> et <strong>échéances</strong>. Automatiser avec un calendrier numérique apportera un vrai <strong>gain de sérénité</strong>.`; }
    }
    else if (qid === 'ai-use-professional') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = `Vous utilisez l’<strong>IA</strong> régulièrement pour <strong>automatiser</strong>, <strong>analyser</strong> et <strong>optimiser</strong> : excellente stratégie pour rester <strong>compétitif</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous utilisez l’IA de façon <strong>ponctuelle</strong>, mais pas encore de manière systématique. Explorer davantage ses <strong>usages</strong> augmenterait les bénéfices.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’utilisez pas l’<strong>IA</strong> dans votre travail. Des outils comme <strong>ChatGPT</strong> ou <strong>DALL·E</strong> pourraient <strong>booster votre activité</strong>.`; }
    }

    // f) Injection dans le simulateur pour la question active
    if (qid === questionContainerId) {
      const wrapper = question.querySelector('.opti-sim_info-wrapper');
      const titleEl = question.querySelector('.opti-sim_info-title');
      const textEl  = question.querySelector('.opti-sim_info-text');
      if (wrapper) wrapper.style.display = 'block';
      if (titleEl) titleEl.textContent = title;
      if (textEl ) textEl.textContent  = body;
    }

    // g) Compter comme répondue
    const isAnswered = multiIds.includes(qid)
      ? answerValue.length > 0
      : ['oui','medium','non'].includes(answerValue);
    if (isAnswered) answeredQuestions++;

    // h) Stocker le détail uniquement si title ou body sont définis
    if (title || body) {
      const message = body ? `${body}` : title;
      detailedResults.development.push({ message, points });
    }
  });

  // 5. Calcul du score global et mise à jour de l’UI
  const pct = answeredQuestions > 0
    ? Math.round((result / (answeredQuestions * 5)) * 100)
    : 0;
  document.getElementById('development-result').textContent = pct;
  updateProgressBar('development');
  finalResults.development = pct;

  console.log(detailedResults.development);
}

function calculWage(questionContainerId) {
  // 1. Récupérer toutes les questions notées du thème "wage"
  const questions = steps.filter(
    step => step.dataset.theme === 'wage' && step.dataset.point !== 'false'
  );

  // 2. Identifiants des questions multi‐checkbox
  const multiIds = [
    'eligible-benefit-cases',
    'investment-cashflow-tax-optimization',
    'benefits-in-kind-tax-reduction'
  ];

  // 3. Initialisation des compteurs et du stockage
  let result = 0;
  let answeredQuestions = 0;
  let maxPossibleScore = 0;
  detailedResults.wage = [];

  // 4. Parcours de chaque question
  questions.forEach(question => {
    // a) ID stable + clé dans selectedAnswers
    const qid = question.id || question.dataset.step;
    question.id = qid;
    let key = `wage-${question.dataset.step}`;
    if (multiIds.includes(qid)) key = `wage-${qid}`;

    // b) Récupérer la ou les réponses
    const raw = selectedAnswers[key];
    const answerValue = multiIds.includes(qid)
      ? (Array.isArray(raw) ? raw : raw ? [raw] : [])
      : raw;

    // c) Calcul des points
    let points = 0;
    if (qid === 'eligible-benefit-cases') {
      const vals = answerValue;
      if      (vals.includes('non'))   points = 0;
      else if (vals.length === 1)      points = 1, maxPossibleScore += 2;
      else if (vals.length >= 2)       points = 2, maxPossibleScore += 2;
    }
    else if (qid === 'benefits-in-kind-tax-reduction') {
      const vals = answerValue;
      if      (vals.includes('non'))           points = 0, maxPossibleScore += 5;
      else if (vals.length >= 1 && vals.length <= 3) points = 3, maxPossibleScore += 5;
      else                                      points = 5, maxPossibleScore += 5;
    }
    else if (qid === 'investment-cashflow-tax-optimization') {
      points = answerValue.length;
      maxPossibleScore += 4;
    }
    else {
      // questions à choix unique
      if      (answerValue === 'oui')    points = 5, maxPossibleScore += 5;
      else if (answerValue === 'medium') points = 3, maxPossibleScore += 5;
      else                                points = 0, maxPossibleScore += 5;
    }
    result += points;

    // d) Construire title & body sans lire le DOM
    let title = '', body = '';

    if (qid === 'eligible-benefit-cases') {
      if      (answerValue.includes('non'))   { title = 'Bon à savoir'; body = `Vous ne profitez d’<strong>aucun dispositif spécifique</strong>. Pourtant, il existe de <strong>nombreuses exonérations</strong> selon votre activité et votre localisation. Une <strong>analyse approfondie</strong> pourrait vous faire économiser beaucoup.`; }
      else if (answerValue.length === 1)      { title = 'Bon début'; body = `Vous bénéficiez déjà d’un <strong>dispositif fiscal</strong>, mais vous pourriez <strong>explorer d’autres leviers</strong> pour aller plus loin.`; }
      else                                     { title = 'Très bien'; body = `Vous profitez de <strong>plusieurs dispositifs fiscaux</strong> (JEI, ZFU, exonération TVA, etc.). Excellent travail d’<strong>optimisation</strong> pour <strong>réduire vos charges</strong>.`; }
    }
    else if (qid === 'benefits-in-kind-tax-reduction') {
      if      (answerValue.includes('non'))           { title = 'Bon à savoir'; body = `Vous ne bénéficiez pas d’<strong>avantages en nature</strong>. Pourtant, certains dispositifs simples pourraient vous permettre d’<strong>alléger vos charges</strong>.`; }
      else if (answerValue.length <= 3)               { title = 'Bon début'; body = `Vous utilisez certains <strong>avantages en nature</strong>, mais il existe encore des <strong>leviers</strong> (matériel, frais de transport, repas, etc.) pour aller plus loin.`; }
      else                                            { title = 'Excellent'; body = `Vous profitez de <strong>plusieurs avantages en nature</strong> (véhicule, repas, télétravail, etc.). Excellente optimisation qui <strong>réduit vos charges personnelles</strong> et votre <strong>imposition</strong>.`; }
    }
    else if (qid === 'investment-cashflow-tax-optimization') {
      title = `Vous avez sélectionné ${answerValue.length} option(s)`; 
      body  = 'Cela représente autant de leviers d’optimisation potentiels sur votre trésorerie.'; 
    }
    else if (qid === 'per-subscription-tax-saving') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous alimentez régulièrement votre <strong>PER</strong> avec le <strong>montant maximal déductible</strong>. Bravo ! C’est une excellente stratégie pour <strong>préparer votre avenir</strong> tout en <strong>réduisant vos impôts</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous avez déjà un <strong>PER</strong>, mais vos versements restent <strong>partiels</strong> ou <strong>occasionnels</strong>. Les rendre plus <strong>réguliers</strong> permettrait de renforcer votre <strong>optimisation fiscale</strong> et votre <strong>capital retraite</strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’avez pas encore de <strong>PER</strong>. Pourtant, c’est un <strong>dispositif très avantageux</strong> qui permet d’<strong>épargner pour la retraite</strong> tout en <strong>réduisant vos impôts</strong>. Commencer par des <strong>versements progressifs</strong> pourrait être une bonne approche.`; }
    }
    else if (qid === 'training-tax-credit') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = `Vous utilisez pleinement le <strong>crédit d’impôt formation</strong> (40 % des dépenses). Félicitations : vous <strong>investissez dans vos compétences</strong> tout en <strong>réduisant vos impôts</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous utilisez ce crédit, mais <strong>pas dans son intégralité</strong>. Vérifiez si d’autres <strong>formations éligibles</strong> pourraient renforcer votre <strong>optimisation</strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Vous ne profitez pas du <strong>crédit d’impôt formation</strong>. Pourtant, c’est un <strong>levier précieux</strong> pour financer votre <strong>montée en compétences</strong> et <strong>alléger vos charges</strong>.`; }
    }
    else if (qid === 'energy-transition-tax-credit') {
      if      (answerValue === 'oui')    { title = 'Excellent choix'; body = `Vous bénéficiez du <strong>CITE</strong> pour vos <strong>travaux de rénovation énergétique</strong>. Très bon choix : vous <strong>réduisez vos dépenses</strong> et vos <strong>impôts</strong> tout en <strong>améliorant votre logement</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous utilisez déjà ce crédit, mais <strong>pas pleinement</strong>. Vérifiez si d’autres <strong>travaux</strong> sont éligibles pour <strong>maximiser vos avantages</strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’utilisez pas le <strong>CITE</strong>. C’est pourtant une <strong>belle opportunité</strong> pour financer des <strong>rénovations énergétiques</strong> et <strong>alléger votre fiscalité</strong>.`; }
    }
    else if (qid === 'tax-deferral-mechanism') {
      if      (answerValue === 'oui')    { title = 'Très bonne stratégie'; body = `Vous utilisez des <strong>mécanismes d’étalement</strong> ou de <strong>report d’imposition</strong> (par exemple différer vos revenus). C’est une excellente stratégie pour <strong>lisser vos charges fiscales</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous appliquez certains mécanismes, mais <strong>sans réelle stratégie</strong>. Les approfondir avec un <strong>expert</strong> permettrait d’aller plus loin.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’utilisez pas ces <strong>leviers</strong>. Pourtant, l’<strong>étalement</strong> et le <strong>report d’imposition</strong> sont des <strong>outils puissants</strong> pour <strong>optimiser votre fiscalité</strong>.`; }
    }
    else if (qid === 'annual-tax-review-expert') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous réalisez un <strong>bilan fiscal précis</strong> chaque année avec un <strong>expert</strong>. C’est une excellente pratique pour <strong>maximiser vos déductions</strong> et <strong>sécuriser votre situation</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous consultez un <strong>expert</strong>, mais <strong>pas systématiquement</strong>. En le faisant chaque année, vous pourriez <strong>renforcer vos optimisations</strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Vous ne réalisez pas de <strong>bilan fiscal annuel</strong>. C’est pourtant <strong>essentiel</strong> pour <strong>éviter les erreurs</strong> et identifier toutes vos <strong>déductions possibles</strong>.`; }
    }
    else if (qid === 'vat-recovery-optimization') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = `Vous récupérez <strong>toute la TVA éligible</strong>. Félicitations, vous <strong>optimisez vos charges</strong> et <strong>réduisez vos coûts</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous récupérez la TVA, mais <strong>pas toujours de manière complète</strong>. Un <strong>audit</strong> de vos déclarations pourrait révéler des <strong>opportunités supplémentaires</strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Vous ne récupérez pas systématiquement la <strong>TVA</strong>. Or, c’est un <strong>levier direct</strong> pour <strong>alléger vos dépenses</strong>.`; }
    }
    else if (qid === 'current-income-perception') {
      // cas à 5 options
      if      (answerValue === 'oui')        { title = 'Très bon choix'; body = `Vous privilégiez les <strong>dividendes</strong> avec un <strong>faible salaire</strong>. C’est une très bonne stratégie pour <strong>réduire vos charges sociales</strong> et <strong>optimiser votre imposition</strong>.`; }
      else if (answerValue === 'mediumyes')  { title = 'Bien optimisé'; body = `Votre <strong>mix salaire/dividendes</strong> est optimisé, ce qui vous permet de profiter d’une <strong>fiscalité plus avantageuse</strong>. Continuez ainsi !`; }
      else if (answerValue === 'medium')     { title = 'Bon début'; body = `Vous percevez <strong>uniquement un salaire</strong>. C’est simple à gérer, mais inclure une <strong>part de dividendes</strong> pourrait améliorer votre optimisation.`; }
      else if (answerValue === 'mediumno')   { title = 'Bon à savoir'; body = `Vos <strong>bénéfices</strong> sont imposés directement en <strong>micro-entreprise</strong>. C’est adapté dans certains cas, mais étudier d’<strong>autres statuts</strong> peut vous ouvrir de <strong>meilleures opportunités fiscales</strong>.`; }
      else                                   { title = 'Attention'; body = `Vous n’avez pas encore <strong>optimisé votre mode de rémunération</strong>. Une <strong>analyse avec un expert-comptable</strong> pourrait <strong>réduire vos charges</strong> et améliorer votre <strong>fiscalité</strong>.`; }
    }
    else if (qid === 'home-office-rent-tax-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous avez mis en place un <strong>loyer avec convention</strong>. Excellente optimisation pour <strong>réduire votre base imposable</strong> en toute conformité.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous facturez un <strong>loyer</strong> mais <strong>sans convention de location</strong>. Formaliser cela avec un <strong>document officiel</strong> sécuriserait la déduction.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’exploitez pas cette possibilité. Pourtant, un <strong>loyer correctement déclaré</strong> peut être un <strong>levier fiscal intéressant</strong>.`; }
    }
    else if (qid === 'remuneration-split-optimization') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = `Vous avez <strong>optimisé la répartition</strong> de vos revenus (salaires, dividendes, compensations) après <strong>analyse approfondie</strong>. C’est une excellente stratégie pour <strong>réduire vos cotisations</strong> et vos <strong>impôts</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous avez commencé à <strong>optimiser</strong>, mais <strong>sans étude détaillée</strong>. Une <strong>analyse plus fine</strong> pourrait vous permettre de <strong>maximiser vos économies</strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Votre <strong>rémunération n’est pas optimisée</strong>. Travailler sur un <strong>mix plus adapté</strong> avec un <strong>expert</strong> pourrait <strong>réduire vos charges</strong>.`; }
    }
    else if (qid === 'holding-structure-income-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bonne stratégie'; body = `Vous avez mis en place une <strong>holding</strong>. C’est une très bonne stratégie pour <strong>optimiser la distribution</strong> de vos revenus et <strong>structurer votre patrimoine</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous envisagez une <strong>holding</strong>. Si votre <strong>chiffre d’affaires est élevé</strong>, cela peut devenir un <strong>levier fiscal</strong> et patrimonial puissant.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’avez pas de <strong>holding</strong>. Cela n’est pas toujours nécessaire, mais si votre <strong>CA est élevé</strong>, ce dispositif pourrait être intéressant.`; }
    }
    else if (qid === 'dividends-income-tax-option') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous optez pour l’<strong>imposition au barème de l’IR</strong> avec <strong>abattement de 40 %</strong>. Très bon choix : cela permet souvent de <strong>réduire la fiscalité</strong> sur vos dividendes.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous avez choisi cette option, mais <strong>sans certitude d’optimisation totale</strong>. Une <strong>analyse plus approfondie</strong> permettrait de confirmer que c’est le <strong>meilleur choix</strong> pour vous.`; }
      else                                { title = 'Bon à savoir'; body = `Vous avez choisi le <strong>PFU à 30 %</strong>. C’est simple, mais parfois <strong>moins avantageux</strong> que l’imposition au barème avec abattement. Une <strong>comparaison</strong> pourrait être utile.`; }
    }
    else if (qid === 'cca-cash-injection') {
      const vals = answerValue;
      if (vals.includes('oui'))            { title = 'Très bien'; body = `Vous utilisez le <strong>compte courant d’associé</strong> pour injecter de la trésorerie. Bonne pratique qui permet de <strong>soutenir votre société</strong> tout en gardant une <strong>trace comptable claire</strong>.`; }
      else                                  { title = 'Bon à savoir'; body = `Vous n’utilisez pas le <strong>CCA</strong>. Pourtant, ce mécanisme peut être un <strong>levier intéressant</strong> pour optimiser votre <strong>trésorerie</strong> et votre <strong>fiscalité</strong>.`; }
    }

    // f) Injection dans le simulateur pour la question active
    if (qid === questionContainerId) {
      const wrapper = question.querySelector('.opti-sim_info-wrapper');
      const titleEl = question.querySelector('.opti-sim_info-title');
      const textEl  = question.querySelector('.opti-sim_info-text');
      if (wrapper) wrapper.style.display = 'block';
      if (titleEl) titleEl.textContent = title;
      if (textEl ) textEl.textContent  = body;
    }

    // g) Compter comme répondue
    const isAnswered = multiIds.includes(qid)
      ? answerValue.length > 0
      : ['oui','medium','non'].includes(answerValue);
    if (isAnswered) answeredQuestions++;

    // h) Stocker le détail uniquement si title ou body sont définis
    if (title || body) {
      const message = body ? `${body}` : title;
      detailedResults.wage.push({ message, points });
    }
  });

  // 5. Calcul du pourcentage et mise à jour UI
  const pct = maxPossibleScore > 0
    ? Math.round((result / maxPossibleScore) * 100)
    : 0;
  document.getElementById('wage-result').textContent = pct;
  updateProgressBar('wage');
  finalResults.wage = pct;

  console.log(detailedResults.wage);
}

function calculProtection(questionContainerId) {
  // 1. Récupérer les questions notées du thème "protection"
  const questions = steps.filter(
    step => step.dataset.theme === 'protection' && step.dataset.point !== 'false'
  );

  // 2. Identifiants des questions multi‐checkbox
  const multiIds = [
    'treasury-investment-supports',
    'subscribed-insurances-list'
  ];

  // 3. Initialiser compteurs et stockage détaillé
  let result = 0;
  let answeredQuestions = 0;
  let maxPossibleScore = 0;
  detailedResults.protection = [];

  // 4. Parcourir chaque question
  questions.forEach(question => {
    // a) ID stable + clé pour selectedAnswers
    const qid = question.id || question.dataset.step;
    question.id = qid;
    const key = multiIds.includes(qid)
      ? `protection-${qid}`
      : `protection-${question.dataset.step}`;

    // b) Récupérer la réponse (array pour multi, string sinon)
    const raw = selectedAnswers[key];
    const answerValue = multiIds.includes(qid)
      ? (Array.isArray(raw) ? raw : raw ? [raw] : [])
      : raw;

    // c) Calculer les points et maxPossibleScore
    let points = 0;
    if (qid === 'treasury-investment-supports') {
      const n = answerValue.length;
      maxPossibleScore += 5;
      if      (n === 0)      points = 0;
      else if (n <= 2)       points = 3;
      else                   points = 5;
    }
    else if (qid === 'subscribed-insurances-list') {
      const n = answerValue.length;
      maxPossibleScore += 5;
      if      (n === 0)      points = 0;
      else if (n <= 2)       points = 3;
      else                   points = 5;
    }
    else {
      // questions à choix unique
      maxPossibleScore += 5;
      if      (answerValue === 'oui')    points = 5;
      else if (answerValue === 'medium') points = 3;
      else                                 points = 0;
    }
    result += points;

    // d) Construire title & body sans interroger le DOM
    let title = '', body = '';

    if (qid === 'treasury-investment-supports') {
      const n = answerValue.length;
      if      (n === 0)      { title = 'Bon à savoir';       body = `Votre trésorerie <strong>n’est pas placée</strong>. Pourtant, de nombreux supports existent (<strong>assurance vie, SCPI, SICAV</strong>, etc.) pour <strong>générer des rendements</strong> et <strong>optimiser vos impôts</strong>.`; }
      else if (n <= 2)       { title = 'Bon début';          body = `Vous avez placé votre trésorerie sur <strong>quelques supports</strong>. Une <strong>diversification plus large</strong> pourrait améliorer vos performances et votre fiscalité.`; }
      else                   { title = 'Excellente diversification'; body = `Vous diversifiez vos placements (<strong>assurance vie, SCPI, obligations</strong>, etc.). C’est une <strong>excellente stratégie</strong> pour <strong>optimiser vos rendements</strong> et <strong>réduire vos risques</strong>.`; }
    }
    else if (qid === 'subscribed-insurances-list') {
      const n = answerValue.length;
      if      (n === 0)      { title = 'Bon à savoir';       body = `Vous n’avez pas d’<strong>assurance professionnelle</strong>. Cela vous expose à des <strong>risques financiers importants</strong> en cas de litige ou de sinistre.`; }
      else if (n <= 2)       { title = 'Bon début';          body = `Vous avez une <strong>protection partielle</strong>. Ajouter d’autres <strong>assurances adaptées</strong> à votre secteur pourrait <strong>renforcer votre sécurité</strong>.`; }
      else                   { title = 'Très bien';          body = `Vous avez souscrit <strong>plusieurs assurances professionnelles</strong> (RCP, multirisque, protection juridique, etc.). Très bonne couverture qui <strong>sécurise votre activité</strong>.`; }
    }
    else if (qid === 'holding-investment-tax-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Votre holding est <strong>optimisée et active</strong>. Très bon choix : elle vous permet de <strong>maximiser vos avantages fiscaux</strong> et de <strong>structurer efficacement votre patrimoine</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = `Vous avez une holding mais elle est <strong>sous-exploitée</strong>. Un usage plus <strong>stratégique</strong> pourrait améliorer encore vos optimisations fiscales.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’avez pas encore <strong>structuré vos investissements</strong> via une holding. Si votre <strong>chiffre d’affaires est élevé</strong>, c’est une piste à envisager pour <strong>optimiser vos revenus</strong> et vos placements.`; }
    }
    else if (qid === 'startup-sme-private-equity-investment') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous investissez déjà dans des <strong>startups ou PME</strong> et bénéficiez des <strong>réductions fiscales</strong> associées. Très bonne stratégie de <strong>diversification</strong> et d’<strong>optimisation</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = `Vous envisagez ce type d’investissement mais ne l’avez pas encore <strong>concrétisé</strong>. Lancer un <strong>premier placement</strong> pourrait être intéressant.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’investissez pas dans ces <strong>opportunités</strong>. Pourtant, elles offrent à la fois des <strong>avantages fiscaux</strong> et un <strong>potentiel de rendement</strong> à long terme.`; }
    }
    else if (qid === 'passive-income-distribution-plan') {
      if      (answerValue === 'oui')    { title = 'Excellente stratégie'; body = `Vous avez mis en place une <strong>stratégie fiscale claire</strong> pour vos revenus passifs (<strong>intérêts, loyers, dividendes</strong>). Excellente optimisation de votre <strong>rentabilité nette</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';          body = `Vous gérez vos revenus passifs de manière <strong>basique</strong>. Une <strong>meilleure structuration fiscale</strong> pourrait améliorer vos gains.`; }
      else                                { title = 'Bon à savoir';       body = `Vous n’avez pas encore <strong>optimisé la distribution</strong> de vos revenus passifs. C’est une piste importante pour <strong>réduire vos charges fiscales</strong>.`; }
    }
    else if (qid === 'investment-diversification-tax-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Votre <strong>portefeuille est bien diversifié</strong> et <strong>fiscalement optimisé</strong>. Très bonne gestion qui <strong>réduit les risques</strong> et augmente vos opportunités.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Vous avez commencé à <strong>diversifier vos investissements</strong>, mais pas suffisamment. Une <strong>meilleure répartition</strong> permettrait d’améliorer votre sécurité et vos optimisations fiscales.`; }
      else                                { title = 'Bon à savoir'; body = `Vos investissements <strong>ne sont pas assez diversifiés</strong>. Cela peut <strong>augmenter vos risques</strong>. Élargir vos placements renforcerait votre stratégie patrimoniale.`; }
    }
    else if (qid === 'long-term-investment-capital-gains-tax') {
      if      (answerValue === 'oui')    { title = 'Excellente approche'; body = `Vous utilisez des dispositifs à <strong>long terme</strong> (<strong>PEA, assurance-vie</strong>, etc.) et profitez des <strong>régimes fiscaux avantageux</strong>. Excellente stratégie pour <strong>optimiser vos plus-values</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';        body = `Vous investissez à <strong>long terme</strong>, mais sans exploiter toutes les <strong>stratégies fiscales disponibles</strong>. Explorer d’autres solutions renforcerait votre plan.`; }
      else                                { title = 'Bon à savoir';     body = `Vous n’avez pas encore mis en place de <strong>stratégie d’investissement à long terme</strong>. Pourtant, c’est un <strong>levier majeur</strong> pour <strong>sécuriser</strong> et <strong>optimiser votre patrimoine</strong>.`; }
    }
    else if (qid === 'supplementary-retirement-plan') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous avez mis en place un <strong>plan de retraite complémentaire</strong> (PER, Madelin, SCPI) avec des <strong>versements optimisés</strong>. Très bonne stratégie : vous <strong>sécurisez votre avenir financier</strong> tout en <strong>réduisant vos impôts</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = `Vous avez un plan de retraite complémentaire, mais <strong>sans stratégie précise</strong>. Une <strong>analyse plus approfondie</strong> permettrait d’améliorer vos bénéfices et votre optimisation fiscale.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’avez pas encore de <strong>plan de retraite complémentaire</strong>. Explorer des solutions comme le <strong>PER</strong> ou le <strong>Madelin</strong> pourrait renforcer votre protection et vos avantages fiscaux.`; }
    }
    else if (qid === 'health-insurance-family-coverage') {
      if      (answerValue === 'oui')    { title = 'Excellente couverture'; body = `Vous disposez d’une <strong>mutuelle optimisée</strong> en termes de <strong>couverture</strong> et de <strong>coût</strong>. Excellente protection pour vous et votre famille.`; }
      else if (answerValue === 'medium') { title = 'Bon début';            body = `Vous avez une mutuelle, mais elle est <strong>trop coûteuse</strong> ou avec une <strong>couverture insuffisante</strong>. Une réévaluation vous permettrait d’<strong>optimiser votre protection</strong>.`; }
      else                                { title = 'Bon à savoir';         body = `Vous n’avez pas de <strong>mutuelle adaptée</strong>. Pourtant, elle est <strong>essentielle</strong> pour couvrir vos <strong>besoins de santé</strong> et ceux de vos proches.`; }
    }
    else if (qid === 'disability-work-interruption-insurance') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous êtes bien couvert avec une <strong>prévoyance complète</strong> et des <strong>indemnités optimisées</strong>. C’est une excellente protection en cas de <strong>coup dur</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = `Vous avez une prévoyance, mais <strong>sans optimisation réelle</strong>. Une <strong>analyse détaillée</strong> pourrait améliorer vos garanties.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’avez pas de <strong>prévoyance</strong>. Cela représente un <strong>risque majeur</strong> en cas de problème de santé ou d’invalidité.`; }
    }
    else if (qid === 'unemployment-protection-strategy') {
      if      (answerValue === 'oui')    { title = 'Excellente anticipation'; body = `Vous avez mis en place une <strong>protection efficace</strong> (contrat cadre dirigeant, ARE, cumul emploi…). Excellente anticipation qui <strong>sécurise vos revenus</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';             body = `Vous disposez de <strong>quelques sécurités</strong>, mais elles restent limitées. Les <strong>renforcer</strong> permettrait d’assurer une <strong>meilleure stabilité financière</strong>.`; }
      else                                { title = 'Bon à savoir';          body = `Vous n’avez pas de <strong>dispositif en cas de chômage</strong>. Cela peut <strong>fragiliser votre sécurité financière</strong>.`; }
    }
    else if (qid === 'retirement-income-forecast-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous savez précisément <strong>combien vous toucherez à la retraite</strong> et avez mis en place une <strong>stratégie optimisée</strong>. Très bonne anticipation.`; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = `Vous avez une idée de votre <strong>future retraite</strong>, mais <strong>sans optimisation complète</strong>. Approfondir ce point vous permettrait d’<strong>améliorer vos revenus futurs</strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Vous n’avez pas évalué vos <strong>revenus de retraite</strong>. Une <strong>étude approfondie</strong> serait utile pour <strong>préparer sereinement votre avenir</strong>.`; }
    }
    else if (qid === 'estate-planning-inheritance-tax-optimization') {
      if      (answerValue === 'oui')    { title = 'Excellente gestion'; body = `Vous avez mis en place une <strong>stratégie optimisée</strong> de transmission (<strong>donation, SCI, démembrement</strong>…). Excellent moyen de <strong>réduire les droits de succession</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';           body = `Vous avez commencé à préparer la <strong>transmission</strong>, mais <strong>sans stratégie complète</strong>. Approfondir cette démarche <strong>optimiserait vos avantages fiscaux</strong>.`; }
      else                                { title = 'Bon à savoir';        body = `Vous n’avez pas de <strong>stratégie de transmission</strong>. Pourtant, il existe des <strong>solutions simples</strong> pour <strong>réduire les droits de succession</strong> et <strong>protéger vos proches</strong>.`; }
    }

    // f) Injecter dans le simulateur uniquement si c'est la question active
    if (qid === questionContainerId) {
      const wrap = question.querySelector('.opti-sim_info-wrapper');
      const tEl  = question.querySelector('.opti-sim_info-title');
      const bEl  = question.querySelector('.opti-sim_info-text');
      if (wrap) wrap.style.display = 'block';
      if (tEl ) tEl.textContent = title;
      if (bEl ) bEl.textContent = body;
    }

    // g) Compter comme répondue
    const isAnswered = multiIds.includes(qid)
      ? answerValue.length > 0
      : ['oui','medium','non'].includes(answerValue);
    if (isAnswered) answeredQuestions++;

    // h) Stocker le détail uniquement si title ou body sont définis
    if (title || body) {
      const message = body ? `${body}` : title;
      detailedResults.protection.push({ message, points });
    }
  });

  // 5. Calcul du pourcentage et mise à jour UI
  const pct = maxPossibleScore > 0
    ? Math.round((result / maxPossibleScore) * 100)
    : 0;
  document.getElementById('protection-result').textContent = pct;
  updateProgressBar('protection');
  finalResults.protection = pct;

  console.log(detailedResults.protection);
}
