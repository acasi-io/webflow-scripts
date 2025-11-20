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

function updateCurrentProgressBar(questionTheme) {
  document.querySelectorAll('.opti-sim_theme-item').forEach(item => {
    item.classList.remove('is-current');
  });

  const currentBar = document.querySelector(`.opti-sim_theme-item[data-theme="${questionTheme}"]`);
  if (currentBar) {
    currentBar.classList.add('is-current');
  }
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
  const wrapper = document.querySelectorAll(
    `.opti-sim_theme-item[data-theme="${questionTheme}"] .opti-sim_progress-bar-wrapper`
  );

  if (!wrapper) return;
  wrapper.querySelector('.opti-sim_progress-bar.is-good').style.width = `${goodPercentage}%`;
  wrapper.querySelector('.opti-sim_progress-bar.is-bad' ).style.width = `${badPercentage}%`;
}*/

function updateProgressBar(questionTheme) {
  const themeSteps = steps.filter(
    step => step.dataset.theme === questionTheme && step.dataset.point !== 'false'
  );
  if (themeSteps.length === 0) return;

  const multiIds = {
    organisation: ['learning-methods'],
    development: ['chosen-protection-plan', 'retirement-contribution-type', 'ai-task-usage'],
    wage: ['eligible-benefit-cases', 'investment-cashflow-tax-optimization', 'benefits-in-kind-tax-reduction'],
    protection: ['treasury-investment-supports', 'subscribed-insurances-list']
  };
  const themeMulti = multiIds[questionTheme] || [];

  let answeredQuestions = 0;

  themeSteps.forEach(step => {
    const key = themeMulti.includes(step.id)
      ? `${questionTheme}-${step.id}`
      : `${questionTheme}-${step.dataset.step}`;

    const answer = selectedAnswers[key];

    const isAnswered = Array.isArray(answer)
      ? answer.length > 0
      : answer && answer !== '' && answer !== 'no-effect';

    if (isAnswered) answeredQuestions++;
  });

  const progressPercentage = (answeredQuestions / themeSteps.length) * 100;

  // 👉 ici on met à jour toutes les barres de ce thème
  const bars = document.querySelectorAll(
    `.opti-sim_theme-item[data-theme="${questionTheme}"] .opti-sim_progress-bar`
  );

  bars.forEach(bar => {
    bar.style.width = `${progressPercentage}%`;
  });
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

  /*if (direction === 'next' && currentIndex === steps.length - 1) {
    return showResults();
  }*/

  if (direction === 'next' && currentIndex === steps.length - 1) {
    // À la fin des questions, afficher le formulaire
    document.querySelector('.opti-sim_question-wrapper').classList.add('hide');
    document.querySelector('.opti-sim_form-results-wrapper').classList.remove('hide');
    return;
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

  updateCurrentProgressBar(questionTheme);
  updateNextButtonState(questionTheme, questionStep);

  activeStep.classList.add('hide');
  nextStepElement.classList.remove('hide');
}

/*function showResults() {
  // masque le quiz
  document.querySelector('.opti-sim_content-wrapper').classList.add('hide');
  // affiche la zone de résultats
  const resultWrapper = document.querySelector('.opti-sim_results-wrapper');
  resultWrapper.classList.remove('hide');
  renderResults(resultWrapper);
}*/

/*function renderResults(container) {
  // Libellés des thèmes
  const THEME_LABELS = {
    wage: 'Rémunération',
    development: 'Développement',
    organisation: 'Organisation',
    gestion: 'Gestion',
    protection: 'Protection'
  };

  const capitalize = str => !str ? '' : str.charAt(0).toUpperCase() + str.slice(1);

  Object.entries(finalResults).forEach(([theme, pct]) => {
    // 1. Trouver le bon wrapper dans le DOM via data-theme
    const themeWrapper = container.querySelector(`.opti-sim_results-theme-wrapper[data-theme="${theme}"]`);
    if (!themeWrapper) return;

    // 2. Injecter le pourcentage
    const percentEl = themeWrapper.querySelector('.opti-sim_results-theme-percent');
    if (percentEl) percentEl.textContent = `${pct}%`;

    // 3. Récupérer les résultats détaillés
    const entries = Array.isArray(detailedResults[theme]) ? detailedResults[theme] : [];

    const good = entries.filter(e => e.points === 5);
    const medium = entries.filter(e => e.points > 0 && e.points < 5);
    const bad = entries.filter(e => e.points === 0);

    // 4. Mapping des blocs et données
    const groups = [
      { class: 'is-good', data: good },
      { class: 'is-medium', data: medium },
      { class: 'is-bad', data: bad }
    ];

    groups.forEach(group => {
      const block = themeWrapper.querySelector(`.opti-sim_results-points-wrapper.${group.class}`);
      if (!block) return;

      const container = block.querySelector('.opti-sim_results-points-check-wrapper');
      if (!container) return;

      // Vider les anciens paragraphes
      container.innerHTML = '';

      group.data.forEach(entry => {
        const line = document.createElement('div');
        line.classList.add('opti-sim_results-text-wrapper');

        // Le rond
        const dot = document.createElement('div');
        dot.classList.add('opti-sim_results-check');

        // Le texte
        const textContainer = document.createElement('div');
        textContainer.classList.add('opti-sim_results-text-container');
        const p = document.createElement('p');
        p.innerHTML = entry.message;
        textContainer.appendChild(p);

        // Ajouter au DOM
        line.appendChild(dot);
        line.appendChild(textContainer);
        container.appendChild(line);
      });
    });
  });
}*/


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
  const multiIds = ['other-company-optimisation'];

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

    /* if (questionId === 'defined-strategy') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Bravo',
        `Vous avez choisi votre statut juridique <strong>après une analyse approfondie</strong>. C’est une excellente stratégie qui vous permet d’<strong>optimiser votre fiscalité, votre protection sociale et vos possibilités de financement</strong>.`,
        'Bon début',
        `<strong>Analysez</strong> plus finement votre statut <strong><a href='https://www.acasi.io/q0' target='_blank'>avec un expert</a></strong> pour <strong>mieux l’adapter</strong>.`,
        'Attention',
        `Prenez rendez-vous <strong><a href='https://www.acasi.io/q0' target='_blank'>avec un expert</a></strong> pour discuter de votre statut et <strong>optimiser</strong> fiscalité et protection sociale.`
      );
    } else if (questionId === 'change-status') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Excellente démarche',
        `Vous avez déjà <strong>envisagé (ou effectué) un changement de statut</strong> pour optimiser votre situation. Cette anticipation est une <strong>démarche stratégique</strong> qui vous permet d’<strong>adapter votre structure à l’évolution de votre activité</strong>.`,
        'Bonne réflexion',
        `Approfondissez la possibilité de changer de staut <strong><a href='https://www.acasi.io/q0' target='_blank'>avec un expert</a></strong> pour <strong>mesurer les gains</strong>.`,
        'Songez-y',
        `Pensez à envisager un <strong>changement de statut</strong> pour <strong>optimiser</strong> votre activité. Prenez rendez-vous <strong><a href='https://www.acasi.io/q0' target='_blank'>avec un expert</a></strong> maintenant.`
      );
    }*/ if (questionId === 'other-company-optimisation') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Félicitations',
        `Vous avez structuré votre activité avec un <strong>montage optimisé (holding, SCI, etc.)</strong>. C’est une excellente stratégie pour <strong>maximiser vos avantages fiscaux</strong> et <strong>améliorer la gestion globale de votre entreprise</strong>.`,
        'Bonne initiative',
        `Faites auditer votre montage pour <strong>identifier des optimisations possibles</strong>.`,
        'Attention',
        `Étudiez les avantages d’une <strong><a href='https://www.acasi.io/comptabilite-holding' target='_blank'>holding</a> ou <a href='https://www.acasi.io/sci' target='_blank'>SCI</a></strong> pour mieux optimiser.`
      );
    } else if (questionId === 'organized-administrative-management') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Super',
        `Vous avez <strong>délégué la gestion administrative à un prestataire externe</strong> (expert-comptable, gestionnaire de paie, etc.). C’est une excellente décision qui vous fait <strong>gagner du temps</strong> et vous apporte un <strong>suivi fiable et stratégique</strong>.`,
        'Bon début',
        `Pensez à <strong>renforcer votre organisation</strong> avec l’appui d’un expert.`,
        'Attention',
        `Mettez en place un outil ou <strong>déléguez</strong> pour éviter erreurs et perte de temps.`
      );
    } else if (questionId === 'has-management-calendar') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Excellente organisation',
        `Vous avez un <strong>calendrier précis</strong> et respectez vos échéances. C’est une excellente organisation qui <strong>sécurise votre gestion</strong> et <strong>limite les risques d’oubli ou de sanction</strong>.`,
        'Vous êtes sur la bonne voie',
        `<strong>Automatisez</strong> vos rappels pour sécuriser vos échéances.`,
        'Attention',
        `<strong><a href='https://culturefreelance.com/comment-organiser-son-planning-hebdomadaire-en-freelance-avec-modele/' target='_blank'>Créez un calendrier</a></strong> simple (Google Agenda, Notion…) pour éviter les pénalités.`
      );
    } else if (questionId === 'how-follow-payments') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Parfait',
        `Vous utilisez un <strong>outil automatisé</strong> pour vos paiements et relances. C’est une excellente pratique qui <strong>sécurise votre trésorerie</strong> et réduit les <strong>risques d’impayés</strong>.`,
        'Bon suivi',
        `Passez à <strong>l’automatisation</strong> pour gagner du temps et fiabilité.`,
        'Attention',
        `Mettez en place un <strong><a href='https://culturefreelance.com/recouvrement-amiable-en-freelance/' target='_blank'>suivi structuré</a></strong> pour réduire les impayés.`
      );
    } else if (questionId === 'has-optimized-billing-software') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        "Bravo",
        `Vous utilisez un <strong>logiciel de facturation avec automatisations complètes</strong> (facturation, paiements, relances). C’est un <strong>levier puissant</strong> pour <strong>sécuriser et fluidifier votre gestion</strong>.`,
        "C'est un bon début",
        `<strong>Ajoutez des automatisation</strong>s à votre logiciel de facturation pour aller plus loin dans l’efficacité.`,
        "Attention",
        `Installez un <strong><a href='https://culturefreelance.com/comment-facturer-un-client-en-freelance-modele/' target='_blank'>logiciel de facturation</a></strong> pour gagner temps et fiabilité.`
      );
    } else if (questionId === 'has-optimized-pro-account') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        "Excellent choix",
        `Votre banque est <strong>adaptée à votre activité</strong>, avec des <strong>frais réduits</strong> et des <strong>services performants</strong>. C’est un excellent choix pour <strong>optimiser la gestion financière</strong> de votre entreprise.`,
        "C'est un bon début",
        `<strong>Comparez d’autres offres</strong> de banques pour réduire frais et optimiser services.`,
        "Attention",
        `<strong>Changez de banque</strong> pour réduire vos coûts et gagner en flexibilité.`
      );
    } /* else if (questionId === 'is-up-to-date') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        "Félicitations",
        `Vous êtes <strong>parfaitement à jour</strong> dans vos obligations. <strong>Bravo</strong>, c’est un <strong>pilier essentiel</strong> pour la stabilité et la <strong>sérénité de votre gestion</strong>.`,
        "C'est un bon début",
        `Anticipez mieux vos échéances administratives pour éviter les retards.`,
        "Attention",
        `Mettez en place un suivi ou <strong><a href='https://www.acasi.io/q0' target='_blank'>consultez un expert</a></strong> pour rattraper vos obligations administratives et fiscales.`
      );
    }*/

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

  const resultOptimisation = answeredQuestions > 0 ? (result / (answeredQuestions * 5)) * 100 : 0;
  document.getElementById('gestion-result').textContent = Math.round(resultOptimisation);
  finalResults.gestion = Math.round(resultOptimisation);

  updateProgressBar('gestion');
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
      else if (answerValue === 'medium') { title = 'Bon équilibre entre travail et vie personnelle'; body = `Vérifiez que le rythme 25-35h / semaine reste compatible avec <strong>vos objectifs de croissance</strong>.`; }
      else                                { title = 'Attention'; body = `Réduisez vos heures ou optimisez votre organisation pour <strong><a href='https://culturefreelance.com/freelance-comment-eviter-le-burn-out/' target='_blank'>éviter le surmenage</a></strong>.`; }
    }
    else if (qid === 'planned-weeks') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = `Vous planifiez votre semaine avec <strong>précision</strong> et <strong>anticipez vos priorités</strong>. C’est une excellente stratégie pour <strong>optimiser votre temps</strong> et rester concentré.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Structurez davantage <strong><a href='https://culturefreelance.com/comment-organiser-son-planning-hebdomadaire-en-freelance-avec-modele/' target='_blank'>votre planning</a></strong> pour mieux gérer vos priorités.`; }
      else                                { title = 'Attention'; body = `Créez un <strong><a href='https://culturefreelance.com/comment-organiser-son-planning-hebdomadaire-en-freelance-avec-modele/' target='_blank'>planning hebdo</a></strong> clair pour éviter stress et imprévus.`; }
    }
    else if (qid === 'daily-routine-productivity') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous avez une <strong>routine quotidienne</strong> avec des <strong>rituels bien définis</strong>. C’est une excellente habitude pour rester <strong>productif et concentré</strong>.`; }
      else if (answerValue === 'medium') { title = 'Vous êtes sur la bonne voie'; body = `<strong><a href='https://culturefreelance.com/la-methode-du-batching-pour-gagner-du-temps/' target='_blank'>Stabilisez vos rituels</a></strong> pour améliorer concentration et efficacité.`; }
      else                                { title = 'Attention'; body = `Mettez en place <strong><a href='https://culturefreelance.com/la-methode-du-batching-pour-gagner-du-temps/' target='_blank'>une routine</a></strong> simple pour mieux gérer votre énergie.`; }
    }
    else if (qid === 'client-acquisition-strategy') {
      if      (answerValue === 'oui')    { title = 'Super'; body = `Vous avez une <strong>stratégie claire et structurée</strong> pour prospecter, avec des <strong>actions régulières</strong>. C’est une approche idéale pour développer votre activité de manière prévisible.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Rendez vos actions de prospection plus systématiques pour améliorer vos résultats. Vous pouvez utiliser <strong><a href='https://culturefreelance.com/utiliser-linkedin-pour-prospecter/' target='_blank'>LinkedIn</a></strong> ou <strong><a href='https://culturefreelance.com/comment-prospecter-avec-chatgpt/' target='_blank'>ChatGPT</a></strong>.`; }
      else                                { title = 'Attention'; body = `Créez un vrai plan de prospection pour accélérer votre croissance avec <strong><a href='https://culturefreelance.com/utiliser-linkedin-pour-prospecter/' target='_blank'>LinkedIn</a></strong> ou <strong><a href='https://culturefreelance.com/comment-prospecter-avec-chatgpt/' target='_blank'>ChatGPT</a></strong>.`; }
    }
    /*else if (qid === 'weekly-admin-time') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous réservez un <strong>créneau précis</strong> chaque semaine pour vos tâches administratives. C’est une excellente organisation qui évite l’<strong>accumulation</strong> et les <strong>oublis</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bonne initiative'; body = `Optimisez le temps dédié à l’administratif pour réduire votre charge mentale.`; }
      else                                { title = 'Attention'; body = `Fixez un créneau hebdo pour éviter les oublis et le stress administratif.`; }
    }*/
    else if (qid === 'burnout-prevention-breaks') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous prenez régulièrement au moins <strong>5 semaines de repos par an</strong>. C’est une excellente habitude pour <strong>préserver votre énergie</strong> et éviter le <strong>burn-out</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bonne initiative'; body = `<strong><a href='https://culturefreelance.com/comment-organiser-ses-vacances-quand-on-est-freelance/' target='_blank'>Planifiez des pauses plus régulières</a></strong> pour préserver votre énergie.`; }
      else                                { title = 'Attention'; body = `<strong><a href='https://culturefreelance.com/comment-organiser-ses-vacances-quand-on-est-freelance/' target='_blank'>Ajoutez du repos</a></strong> à votre agenda pour protéger santé et productivité.`; }
    }
    else if (qid === 'work-schedule-balance') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = `Vos horaires sont <strong>fixes</strong> et adaptés à vos <strong>pics de productivité</strong>. C’est une excellente manière d’allier <strong>efficacité</strong> et <strong>équilibre de vie</strong>.`; }
      else if (answerValue === 'medium') { title = 'Vous avez une certaine organisation'; body = `<strong><a href='https://culturefreelance.com/comprendre-loi-de-carlson/' target='_blank'>Stabilisez vos horaires</a></strong> pour gagner en efficacité.`; }
      else                                { title = 'Attention'; body = `Fixez des <strong><a href='https://culturefreelance.com/comprendre-loi-de-carlson/' target='_blank'>plages horaires régulières</a></strong> pour structurer vos journées.`; }
    }
    else if (qid === 'task-delegation') {
      if      (answerValue === 'oui')    { title = 'Très bonne approche'; body = `Vous <strong>déléguez</strong> ce qui n’est pas votre <strong>cœur de métier</strong> (comptabilité, communication, etc.). C’est une excellente stratégie pour <strong>gagner du temps</strong> et vous concentrer sur l’<strong>essentiel</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Externalisez davantage vos tâches pour libérer du temps stratégique.`; }
      else                                { title = 'Attention'; body = `Déléguez certaines tâches pour éviter la surcharge.`; }
    }
    else if (qid === 'monthly-learning-time') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous consacrez entre <strong>6 et 9h par mois</strong> à votre formation. C’est un <strong>excellent investissement</strong> pour rester <strong>compétitif</strong> et progresser constamment.`; }
      else if (answerValue === 'medium') { title = 'Bon investissement'; body = `Augmentez légèrement le temps de <strong><a href='https://culturefreelance.com/les-formations-gratuites-pour-se-lancer-en-freelance/' target='_blank'>formation</a></strong> pour progresser plus vite.`; }
      else                                { title = 'Attention'; body = ` Intégrez plus de <strong><a href='https://culturefreelance.com/les-formations-gratuites-pour-se-lancer-en-freelance/' target='_blank'>formation</a></strong> pour rester compétitif.`; }
    }

    // f) Injecter dans le simulateur si c’est la question active
    if (qid === questionContainerId) {
      const wrap    = question.querySelector('.opti-sim_info-wrapper');
      const tEl     = question.querySelector('.opti-sim_info-title');
      const textEl  = question.querySelector('.opti-sim_info-text');
      if (wrap)   wrap.style.display = 'block';
      if (tEl)    tEl.textContent      = title;
      if (textEl) textEl.innerHTML   = body;
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
      else if (answerValue === 'medium') { title = 'Bon début'; body = `<strong>Clarifiez votre message</strong> et différenciez-vous (travail éditorial / page offres).`; }
      else                                { title = 'Attention'; body = `Définissez ce qui vous rend <strong>unique</strong> par rapport à vos concurrent (atelier rapide + page dédiée).`; }
    }
    else if (qid === 'networking-events-participation') {
      if      (answerValue === 'oui')    { title = 'Excellente démarche'; body = `Vous participez régulièrement à des <strong>événements stratégiques</strong>. Excellente démarche pour <strong>développer votre réseau</strong> et accéder à de <strong>nouvelles opportunités</strong>.`; }
      else if (answerValue === 'medium') { title = 'C\'est un bon début'; body = `Sélectionnez mieux les <strong>évènements professionnels</strong> et fixez des objectifs mesurables.`; }
      else                                { title = 'Attention'; body = `Ajoutez 1–2 <strong>évènements professionnels</strong> pertinents au calendrier ce trimestre.`; }
    }
    else if (qid === 'online-visibility-channels') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = `Vous utilisez <strong>LinkedIn</strong> (et d’autres canaux) de manière <strong>régulière et stratégique</strong>, ce qui renforce votre <strong>crédibilité</strong> et attire de <strong>nouveaux clients</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Créez un <strong><a href='https://culturefreelance.com/utiliser-metricool-pour-gerer-ses-reseaux-sociaux/' target='_blank'>plan éditorial</a></strong> simple (2-3 posts / semaine + messages ciblés).`; }
      else                                { title = 'Attention'; body = `Ouvrez un canal prioritaire (LinkedIn) et lancez 1 routine hebdo.`; }
    }
    else if (qid === 'client-conversion-system') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = `Vous avez mis en place une <strong>stratégie d’acquisition claire, optimisée et suivie</strong>, un levier puissant pour une croissance <strong>stable et prévisible</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Formalisez votre système d’acquisition et suivez 3 KPIs pour l’améliorer.`; }
      else                                { title = 'Attention'; body = `Mettez en place une stratégie simple (SEO/Ads + <strong><a href='https://culturefreelance.com/freelance-9-lead-magnet-pour-votre-activite/' target='_blank'>lead magnet</a></strong>) et utilisez un <strong><a href='https://culturefreelance.com/comment-utiliser-un-crm-en-freelance/' target='_blank'>CRM</a></strong> pour tout centraliser.`; }
    }
    else if (qid === 'mentorship-or-peer-support') {
      if      (answerValue === 'oui')    { title = 'Super'; body = `Vous bénéficiez d’un <strong>mentor</strong> ou d’un <strong>groupe d’entrepreneurs</strong>, une ressource précieuse pour <strong>progresser plus vite</strong> et <strong>éviter les erreurs</strong>.`; }
      else if (answerValue === 'medium') { title = 'C\'est un bon début'; body = `Passez à un suivi mensuel dans votre accompagnement avec objectifs et relectures.`; }
      else                                { title = 'Attention'; body = `Rejoignez un <strong><a href='https://culturefreelance.com/les-8-communautes-de-freelances-a-rejoindre-absolument/' target='_blank'>groupe / communauté</a></strong> ou trouvez un mentor ce mois-ci.`; }
    }
    else if (qid === 'competitor-analysis') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous analysez régulièrement vos <strong>concurrents</strong> et <strong>ajustez votre offre</strong> en conséquence, une excellente pratique pour rester <strong>compétitif</strong>.`; }
      else if (answerValue === 'medium') { title = 'C\'est un bon début'; body = `Cadrez une <strong>veille mensuelle de vos concurrents</strong> (prix, offres, messages).`; }
      else                                { title = 'Attention'; body = `Créez une grille simple de <strong>veille et comparez</strong> 5 concurrents.`; }
    }
    else if (qid === 'offer-or-model-innovation') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = `Vous <strong>innovez régulièrement</strong> dans votre offre ou votre modèle économique, une excellente stratégie pour <strong>rester compétitif</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Rendez <strong><a href='https://culturefreelance.com/comprendre-les-tendances-du-marche-freelance-en-2025/' target='_blank'>l’innovation de votre offre</a></strong> régulière (1 test/mois, retour client).`; }
      else                                { title = 'Attention'; body = `Identifiez <strong><a href='https://culturefreelance.com/comprendre-les-tendances-du-marche-freelance-en-2025/' target='_blank'>une amélioration d’offre</a></strong> à prototyper ce trimestre.`; }
    }
    else if (qid === 'business-diversification-plan') {
      if      (answerValue === 'oui')    { title = 'Très bonne stratégie'; body = `Vous avez une <strong>stratégie claire de diversification</strong>, excellente approche pour la <strong>pérennité</strong> et la <strong>croissance</strong> de votre activité.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Priorisez un axe de <strong>diversification de votre activité</strong> et listez 3 actions concrètes.`; }
      else                                { title = 'Attention'; body = `Évaluez un nouveau service / marché avec mini-étude pour <strong>diversifier votre activité</strong>.`; }
    }
    else if (qid === 'mileage-allowance-usage') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous utilisez les <strong>indemnités kilométriques</strong> : très bon choix pour <strong>optimiser vos frais de déplacement</strong> et bénéficier d’un <strong>avantage fiscal</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon choix'; body = `Comparez véhicule professionnel vs <strong><a href='https://comptapedia.fr/indemnites-kilometriques/' target='_blank'>indemnités kilométriques</a></strong> pour le meilleur net.`; }
      else if (answerValue === 'non')     { title = 'Bon à savoir'; body = `Activez les <strong><a href='https://comptapedia.fr/indemnites-kilometriques/' target='_blank'>indemnités kilométriques</a></strong> sur vos trajets professionnels (barème + suivi).`; }
      else { title = "Pas d'optimisation supplémentaire"; body = `Vous n'avaez pas de voiture, donc pas de frais à optimiser sur ce point.` }
    }
    else if (qid === 'holiday-voucher-setup') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous <strong>maximisez</strong> le montant des <strong>chèques vacances</strong> (jusqu’à 554,40 € en 2024), une optimisation qui <strong>réduit vos charges</strong> et améliore votre qualité de vie.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Montez progressivement au plafond des <strong><a href='https://www.acasi.io/optimisations-independant' target='_blank'>chèques vacances</a></strong> pour maximiser l’avantage. `; }
      else                                { title = 'Bon à savoir'; body = `Mettez en place les <strong><a href='https://www.acasi.io/optimisations-independant' target='_blank'>chèques vacances</a></strong> pour réduire vos charges.`; }
    }
    else if (qid === 'cesu-tax-benefits') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = `Vous exploitez pleinement le dispositif <strong>CESU</strong> (jusqu’à 2 540 €), un excellent moyen d’<strong>alléger vos impôts</strong> tout en profitant de services à domicile.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Augmentez jusqu’au plafond des <strong><a href='https://comptapedia.fr/cesu/' target='_blank'>CESU</a></strong> pour <strong>maximiser</strong> l’économie.`; }
      else                                { title = 'Bon à savoir'; body = `Activez les <strong><a href='https://comptapedia.fr/cesu/' target='_blank'>CESU</a></strong> pour <strong>alléger vos impôt</strong>s et votre charge mentale.`; }
    }
    else if (qid === 'expense-tracking-setup') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = `Vous <strong>suivez et optimisez</strong> chaque dépense, une pratique qui garantit des <strong>économies substantielles</strong> et une gestion fiable.`; }
      else if (answerValue === 'medium') { title = 'Vous êtes sur la bonne voie'; body = `Formalisez la procédure des notes de frais et faîtes des contrôles mensuels.`; }
      else                                { title = 'Bon à savoir'; body = `Installez un outil de notes de frais et centralisez-les.`; }
    }
    else if (qid === 'expense-optimization-strategies') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = `Vous exploitez <strong>tous les leviers possibles</strong> (primes, exonérations, forfaits…) pour <strong>réduire vos charges</strong> : très bonne gestion.`; }
      else if (answerValue === 'medium') { title = 'Vous avez déjà pris de bonnes initiatives'; body = `Identifiez 2–3 <strong><a href='https://www.acasi.io/optimisations-independant' target='_blank'>leviers supplémentaires</a></strong> à activer pour optimiser vos charges.`; }
      else                                { title = 'Bon à savoir'; body = `Faites un mini-audit pour repérer des <strong><a href='https://www.acasi.io/optimisations-independant' target='_blank'>économies rapides</a></strong> sur vos charges.`; }
    }
    else if (qid === 'project-tools-automation') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = `Vous utilisez pleinement des outils comme <strong>Notion, Trello, Zapier</strong> : excellente gestion, plus de <strong>productivité</strong> et moins de <strong>charge mentale</strong>.`; }
      else if (answerValue === 'medium') { title = 'Vous utilisez déjà des outils, c’est un bon début'; body = `Intégrez vos outils de gestion de projets et <strong><a href='https://culturefreelance.com/comment-automatiser-taches-repetitives-freelances/' target='_blank'>automatisez les tâches récurrentes</a></strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Déployez un outil (<strong><a href='https://culturefreelance.com/comment-les-freelances-utilisent-notion-pour-sorganiser/' target='_blank'>Notion</a></strong> / Trello) et une <strong><a href='https://culturefreelance.com/comment-automatiser-taches-repetitives-freelances/' target='_blank'>automatisation clé</a></strong>.`; }
    }
    else if (qid === 'optimized-work-routine') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous avez mis en place une <strong>routine claire et régulière</strong>. C’est une excellente habitude pour maximiser votre <strong>concentration</strong> et votre <strong>productivité</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Stabilisez vos horaires et <strong><a href='https://culturefreelance.com/la-methode-du-batching-pour-gagner-du-temps/' target='_blank'>rituels</a></strong> pour gagner en focus.`; }
      else                                { title = 'Bon à savoir'; body = `Définissez une <strong><a href='https://culturefreelance.com/la-methode-du-batching-pour-gagner-du-temps/' target='_blank'>routine de travail</a></strong> pour mieux gérer votre énergie.`; }
    }
    else if (qid === 'time-management-techniques') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = `Vous appliquez rigoureusement des <strong>techniques de gestion du temps</strong>. C’est un <strong>levier puissant</strong> pour rester <strong>productif</strong> et concentré.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Appliquez les <strong><a href='https://culturefreelance.com/les-meilleures-techniques-pour-atteindre-l-etat-de-flow/' target='_blank'>techniques de gestion du temps</a></strong> (Pomodoro, etc) chaque jour sur vos tâches clés.`; }
      else                                { title = 'Bon à savoir'; body = `Testez <strong><a href='https://culturefreelance.com/les-meilleures-techniques-pour-atteindre-l-etat-de-flow/' target='_blank'>Pomodoro ou Time-Blocking</a></strong> dès cette semaine pour mieux gérer votre temps.`; }
    }
    else if (qid === 'goal-tracking-strategy') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous disposez d’un <strong>système clair</strong> pour <strong>suivre vos objectifs</strong> et <strong>prioriser vos tâches</strong>. C’est une excellente façon de garder le cap.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Améliorer le suivi et la priorisation de vos objectifs avec des KPIs simples.`; }
      else                                { title = 'Bon à savoir'; body = `Mettez en place <strong><a href='https://culturefreelance.com/comment-les-freelances-utilisent-notion-pour-sorganiser/' target='_blank'>un tracker</a></strong> (Notion / ClickUp) dès maintenant pour suivre vos objectifs.`; }
    }
    else if (qid === 'decision-making-method') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = `Vous prenez vos décisions <strong>rapidement</strong> grâce à une <strong>méthodologie claire</strong>. Cela vous permet de <strong>gagner du temps</strong> et d’<strong>optimiser vos actions</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Travaillez <strong><a href='https://culturefreelance.com/freelance-prioriser-ses-missions-avec-la-matrice-eisenhower/' target='_blank'>une méthode plus structurée</a></strong> pour renforcer votre efficacité dans la prise de décision.`; }
      else                                { title = 'Bon à savoir'; body = `Adoptez une méthode simple, comme <strong><a href='https://culturefreelance.com/freelance-prioriser-ses-missions-avec-la-matrice-eisenhower/' target='_blank'>la matrice d’Eisenhower</a></strong> ou la règle des 2 minutes, pour décider plus vite.`; }
    }
    else if (qid === 'email-automation-tools') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous utilisez des outils comme <strong>Sanebox</strong> ou <strong>Clean Email</strong> pour trier et automatiser vos emails : excellente optimisation de votre <strong>temps</strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Installez Sanebox / Clean Email et créez des règles pour automatiser vos emails.`; }
    }
    else if (qid === 'task-planning-tools') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = `Vous planifiez vos tâches avec des outils comme <strong>Trello</strong> ou <strong>Asana</strong>, une méthode très efficace pour gérer vos <strong>priorités</strong> efficacement.`; }
      else                                { title = 'Bon à savoir'; body = `Centralisez vos tâches dans <strong><a href='https://culturefreelance.com/comment-les-freelances-utilisent-notion-pour-sorganiser/' target='_blank'>un outil unique</a></strong> pour simplifier votre organisation.`; }
    }
    else if (qid === 'reminder-deadline-tools') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = `Vous utilisez <strong>Google Calendar</strong> ou <strong>Outlook</strong> pour vos rappels et échéances : excellente pratique pour <strong>ne rien oublier</strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Activez les rappels et échéances dans un calendrier.`; }
    }
    else if (qid === 'ai-use-professional') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = `Vous utilisez l’<strong>IA</strong> régulièrement pour <strong>automatiser</strong>, <strong>analyser</strong> et <strong>optimiser</strong> : excellente stratégie pour rester <strong>compétitif</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Étendez <strong><a href='https://culturefreelance.com/freelance-ia-outils-pour-gagner-du-temps/' target='_blank'>l’IA</a></strong> à un ou deux cas d’usage supplémentaires.`; }
      else                                { title = 'Bon à savoir'; body = `Testez <strong><a href='https://culturefreelance.com/freelance-ia-outils-pour-gagner-du-temps/' target='_blank'>ChatGPT / DALL·E pour gagner du temps</a></strong> et de la qualité.`; }
    }

    // f) Injection dans le simulateur pour la question active
    if (qid === questionContainerId) {
      const wrapper = question.querySelector('.opti-sim_info-wrapper');
      const titleEl = question.querySelector('.opti-sim_info-title');
      const textEl  = question.querySelector('.opti-sim_info-text');
      if (wrapper) wrapper.style.display = 'block';
      if (titleEl) titleEl.textContent = title;
      if (textEl ) textEl.innerHTML  = body;
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
      if      (answerValue.includes('non'))   { title = 'Bon à savoir'; body = `Faites un check des dispositifs fiscaux selon votre activité / localisation.`; }
      else if (answerValue.length === 1)      { title = 'Bon début'; body = `Explorez 1 ou 2 exonérations fiscales supplémentaires adaptées à votre cas.`; }
      else                                     { title = 'Très bien'; body = `Vous profitez de <strong>plusieurs dispositifs fiscaux</strong> (JEI, ZFU, exonération TVA, etc.). Excellent travail d’<strong>optimisation</strong> pour <strong>réduire vos charges</strong>.`; }
    }
    else if (qid === 'benefits-in-kind-tax-reduction') {
      if      (answerValue.includes('non'))           { title = 'Bon à savoir'; body = `Vous ne bénéficiez pas d’<strong>avantages en nature</strong>. Pourtant, certains dispositifs simples pourraient vous permettre d’<strong>alléger vos charges</strong>.`; }
      else if (answerValue.length <= 3)               { title = 'Bon début'; body = `Activez un à deux avantages en nature supplémentaires pertinents (matériel, frais de transport, repas, etc.).`; }
      else                                            { title = 'Excellent'; body = `Identifiez des avantages simples (matériel, repas, transport).`; }
    }
    else if (qid === 'investment-cashflow-tax-optimization') {
      title = `Vous avez sélectionné ${answerValue.length} option(s)`; 
      body  = 'Cela représente autant de leviers d’optimisation potentiels sur votre trésorerie.'; 
    }
    else if (qid === 'per-subscription-tax-saving') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous alimentez régulièrement votre <strong>PER</strong> avec le <strong>montant maximal déductible</strong>. Bravo ! C’est une excellente stratégie pour <strong>préparer votre avenir</strong> tout en <strong>réduisant vos impôts</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Passez à des versements réguliers sur votre <strong><a href='https://comptapedia.fr/per/' target='_blank'>PER</a></strong> pour maximiser la déduction.`; }
      else                                { title = 'Bon à savoir'; body = `Ouvrez un <strong><a href='https://comptapedia.fr/per/' target='_blank'>PER</a></strong> et démarrez par des versements progressifs.`; }
    }
    else if (qid === 'training-tax-credit') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = `Vous utilisez pleinement le <strong>crédit d’impôt formation</strong> (40 % des dépenses). Félicitations : vous <strong>investissez dans vos compétences</strong> tout en <strong>réduisant vos impôts</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Ajoutez des formations éligibles pour utiliser pleinement le <strong><a href='https://www.acasi.io/optimisations-independant' target='_blank'>crédit d’impôt formation</a></strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Activez le <strong><a href='https://www.acasi.io/optimisations-independant' target='_blank'>crédit d’impôt formation</a></strong> pour financer votre montée en compétences.`; }
    }
    else if (qid === 'energy-transition-tax-credit') {
      if      (answerValue === 'oui')    { title = 'Excellent choix'; body = `Vous bénéficiez du <strong>CITE</strong> pour vos <strong>travaux de rénovation énergétique</strong>. Très bon choix : vous <strong>réduisez vos dépenses</strong> et vos <strong>impôts</strong> tout en <strong>améliorant votre logement</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Listez d’autres travaux éligibles au crédit d’impôt pour la transition énergétique pour maximiser l’aide.`; }
      else                                { title = 'Bon à savoir'; body = `Étudiez le CITE pour financer vos rénovations et réduire l’impôt.`; }
    }
    else if (qid === 'tax-deferral-mechanism') {
      if      (answerValue === 'oui')    { title = 'Très bonne stratégie'; body = `Vous utilisez des <strong>mécanismes d’étalement</strong> ou de <strong>report d’imposition</strong> (par exemple différer vos revenus). C’est une excellente stratégie pour <strong>lisser vos charges fiscales</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Approfondissez vos mécanismes d’étalement ou de report d’imposition <strong><a href='https://www.acasi.io/q0' target='_blank'>avec un expert</a></strong> permettrait d’aller plus loin.`; }
      else                                { title = 'Bon à savoir'; body = `Étudiez l’étalement / le report de votre imposition pour <strong>réduire vos pics d’imposition</strong>.`; }
    }
    else if (qid === 'annual-tax-review-expert') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = `Vous réalisez un <strong>bilan fiscal précis</strong> chaque année avec un <strong>expert</strong>. C’est une excellente pratique pour <strong>maximiser vos déductions</strong> et <strong>sécuriser votre situation</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Planifiez un bilan annuel récurrent <strong><a href='https://www.acasi.io/q0' target='_blank'>avec un expert</a></strong> pour optimiser davantage.`; }
      else                                { title = 'Bon à savoir'; body = `Prenez rendez-vous <strong><a href='https://www.acasi.io/q0' target='_blank'>avec un expert</a></strong> pour un bilan fiscal et rattraper les déductions.`; }
    }
    else if (qid === 'vat-recovery-optimization') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = `Vous récupérez <strong>toute la TVA éligible</strong>. Félicitations, vous <strong>optimisez vos charges</strong> et <strong>réduisez vos coûts</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Auditez vos déclarations pour <strong><a href='https://comptapedia.fr/tva/' target='_blank'>capter la TVA manquante</a></strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Mettez en place un process de <strong><a href='https://comptapedia.fr/tva/' target='_blank'>récupération systématique de TVA</a></strong>.`; }
    }
    else if (qid === 'current-income-perception') {
      // cas à 5 options
      if      (answerValue === 'oui')        { title = 'Très bon choix'; body = `Vous privilégiez les <strong>dividendes</strong> avec un <strong>faible salaire</strong>. C’est une très bonne stratégie pour <strong>réduire vos charges sociales</strong> et <strong>optimiser votre imposition</strong>.`; }
      else if (answerValue === 'mediumyes')  { title = 'Bien optimisé'; body = `Maintenez le calibrage salaire / <strong><a href='https://comptapedia.fr/dividendes/' target='_blank'>dividendes</a></strong> et suivez l’impact net.`; }
      else if (answerValue === 'medium')     { title = 'Bon début'; body = `Étudiez l’introduction de <strong><a href='https://comptapedia.fr/dividendes/' target='_blank'>dividendes</a></strong> pour votre revenu.`; }
      else if (answerValue === 'mediumno')   { title = 'Bon à savoir'; body = `Prenez rendez-vous <strong><a href='https://www.acasi.io/q0' target='_blank'>avec un expert</a></strong> pour comparer votre statut actuel à d’autres pour alléger l’impôt. `; }
      else                                   { title = 'Attention'; body = `Faites une analyse <strong><a href='https://www.acasi.io/q0' target='_blank'>avec un expert</a></strong> pour réduire vos charges / IR et améliorer votre fiscalité.`; }
    }
    else if (qid === 'home-office-rent-tax-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous avez mis en place un <strong>loyer avec convention</strong>. Excellente optimisation pour <strong>réduire votre base imposable</strong> en toute conformité.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Formalisez une convention pour sécuriser la déduction de votre <strong><a href='https://www.acasi.io/optimisations-independant' target='_blank'>loyer au domicile du dirigeant</a></strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Évaluez la mise en place d’un <strong><a href='https://www.acasi.io/optimisations-independant' target='_blank'>loyer au domicile du dirigeant</a></strong> déclaré.`; }
    }
    else if (qid === 'remuneration-split-optimization') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = `Vous avez <strong>optimisé la répartition</strong> de vos revenus (salaires, dividendes, compensations) après <strong>analyse approfondie</strong>. C’est une excellente stratégie pour <strong>réduire vos cotisations</strong> et vos <strong>impôts</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Affinez le mix (salaire / dividendes / autres) <strong><a href='https://www.acasi.io/q0' target='_blank'>avec un expert</a></strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Travaillez sur un mix de rémunération plus adapté <strong><a href='https://www.acasi.io/q0' target='_blank'>avec un expert</a></strong> pour réduire vos charges.`; }
    }
    else if (qid === 'holding-structure-income-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bonne stratégie'; body = `Vous avez mis en place une <strong>holding</strong>. C’est une très bonne stratégie pour <strong>optimiser la distribution</strong> de vos revenus et <strong>structurer votre patrimoine</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Étudiez la pertinence d’une holding selon votre CA <strong><a href='https://www.acasi.io/q0' target='_blank'>avec un expert</a></strong>.`; }
      else                                { title = 'Bon à savoir'; body = `Si votre CA est élevé, analysez l’intérêt d’une holding <strong><a href='https://www.acasi.io/q0' target='_blank'>avec un expert</a></strong>.`; }
    }
    else if (qid === 'dividends-income-tax-option') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous optez pour l’<strong>imposition au barème de l’IR</strong> avec <strong>abattement de 40 %</strong>. Très bon choix : cela permet souvent de <strong>réduire la fiscalité</strong> sur vos dividendes.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Comparez le barème progressif avec le PFU pour valider le meilleur choix. `; }
      else                                { title = 'Bon à savoir'; body = `Comparez le barème progressif avec le PFU pour valider le meilleur choix.`; }
    }
    else if (qid === 'cca-cash-injection') {
      const vals = answerValue;
      if (vals.includes('oui'))            { title = 'Très bien'; body = `Vous utilisez le <strong>compte courant d’associé</strong> pour injecter de la trésorerie. Bonne pratique qui permet de <strong>soutenir votre société</strong> tout en gardant une <strong>trace comptable claire</strong>.`; }
      else                                  { title = 'Bon à savoir'; body = `<strong><a href='https://comptapedia.fr/compte-courant-dassocie/' target='_blank'>Utilisez le CCA</a></strong> pour gérer les besoins ponctuels de trésorerie.`; }
    }

    // f) Injection dans le simulateur pour la question active
    if (qid === questionContainerId) {
      const wrapper = question.querySelector('.opti-sim_info-wrapper');
      const titleEl = question.querySelector('.opti-sim_info-title');
      const textEl  = question.querySelector('.opti-sim_info-text');
      if (wrapper) wrapper.style.display = 'block';
      if (titleEl) titleEl.textContent = title;
      if (textEl ) textEl.innerHTML  = body;
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
      else if (n <= 2)       { title = 'Bon début';          body = `<strong>Ajoutez de nouveaux supports</strong> de placement de la trésorerie pour réduire vos risques et vos impôts.`; }
      else                   { title = 'Excellente diversification'; body = `Placez votre trésorerie (assurance vie, SCPI, SICAV) pour générer du rendement.`; }
    }
    else if (qid === 'subscribed-insurances-list') {
      const n = answerValue.length;
      if      (n === 0)      { title = 'Bon à savoir';       body = `Souscrivez à une assurance professionnelle adaptée pour sécuriser votre activité.`; }
      else if (n <= 2)       { title = 'Bon début';          body = `Ajoutez des assurances professionnelles clés (RCP, multirisque, cyber).`; }
      else                   { title = 'Très bien';          body = `Vous avez souscrit <strong>plusieurs assurances professionnelles</strong> (RCP, multirisque, protection juridique, etc.). Très bonne couverture qui <strong>sécurise votre activité</strong>.`; }
    }
    else if (qid === 'holding-investment-tax-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Votre holding est <strong>optimisée et active</strong>. Très bon choix : elle vous permet de <strong>maximiser vos avantages fiscaux</strong> et de <strong>structurer efficacement votre patrimoine</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = `<strong><a href='https://www.acasi.io/comptabilite-holding' target='_blank'>Étendez l’usage de votre holding</a></strong> (dividendes, réinvestissements).`; }
      else                                { title = 'Bon à savoir'; body = `Si votre CA est élevé, analysez la création d’une holding <strong><a href='https://www.acasi.io/q0' target='_blank'>avec un expert</a></strong>.`; }
    }
    else if (qid === 'startup-sme-private-equity-investment') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous investissez déjà dans des <strong>startups ou PME</strong> et bénéficiez des <strong>réductions fiscales</strong> associées. Très bonne stratégie de <strong>diversification</strong> et d’<strong>optimisation</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = ` Lancez un premier placement (PME / private equity) pour tester le dispositif.`; }
      else                                { title = 'Bon à savoir'; body = `Explorez le <strong>private equity</strong> : avantages fiscaux + fort potentiel.`; }
    }
    else if (qid === 'passive-income-distribution-plan') {
      if      (answerValue === 'oui')    { title = 'Excellente stratégie'; body = `Vous avez mis en place une <strong>stratégie fiscale claire</strong> pour vos revenus passifs (<strong>intérêts, loyers, dividendes</strong>). Excellente optimisation de votre <strong>rentabilité nette</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';          body = `Optimisez la structuration de vos revenus passifs pour <strong>augmenter le net après impôt</strong>.`; }
      else                                { title = 'Bon à savoir';       body = `Créez une stratégie fiscale dédiée à vos revenus passifs.`; }
    }
    else if (qid === 'investment-diversification-tax-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Votre <strong>portefeuille est bien diversifié</strong> et <strong>fiscalement optimisé</strong>. Très bonne gestion qui <strong>réduit les risques</strong> et augmente vos opportunités.`; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = `Ajoutez de nouveaux actifs pour renforcer la <strong><a href='https://culturefreelance.com/riche-independant/' target='_blank'>diversification de vos investissement</a></strong>.`; }
      else                                { title = 'Bon à savoir'; body = `<tsrong>Diversifiez vos placements</tsrong> pour réduire les risques et les impôts.`; }
    }
    else if (qid === 'long-term-investment-capital-gains-tax') {
      if      (answerValue === 'oui')    { title = 'Excellente approche'; body = `Vous utilisez des dispositifs à <strong>long terme</strong> (<strong>PEA, assurance-vie</strong>, etc.) et profitez des <strong>régimes fiscaux avantageux</strong>. Excellente stratégie pour <strong>optimiser vos plus-values</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';        body = `Explorez <strong><a href='https://culturefreelance.com/riche-independant/' target='_blank'>d’autres stratégies fiscales</a></strong> long terme.`; }
      else                                { title = 'Bon à savoir';     body = `Lancez un <a href='https://comptapedia.fr/plan-depargne-en-actions/' target='_blank'>PEA</a> ou une <a href='https://comptapedia.fr/assurance-vie/' target='_blank'>assurance-vie</a> pour <strong><a href='https://culturefreelance.com/riche-independant/' target='_blank'>optimiser vos gains futurs</a></strong>.`; }
    }
    else if (qid === 'supplementary-retirement-plan') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous avez mis en place un <strong>plan de retraite complémentaire</strong> (PER, Madelin, SCPI) avec des <strong>versements optimisés</strong>. Très bonne stratégie : vous <strong>sécurisez votre avenir financier</strong> tout en <strong>réduisant vos impôts</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = `Ajustez votre plan retraite avec une stratégie plus claire.`; }
      else                                { title = 'Bon à savoir'; body = `Étudiez le <strong><a href='https://comptapedia.fr/per/' target='_blank'>PER</a></strong>> ou le Madelin pour préparer votre retraite et réduire vos impôts. `; }
    }
    else if (qid === 'health-insurance-family-coverage') {
      if      (answerValue === 'oui')    { title = 'Excellente couverture'; body = `Vous disposez d’une <strong>mutuelle optimisée</strong> en termes de <strong>couverture</strong> et de <strong>coût</strong>. Excellente protection pour vous et votre famille.`; }
      else if (answerValue === 'medium') { title = 'Bon début';            body = `Réévaluez votre mutuelle pour réduire le coût ou élargir la couverture.`; }
      else                                { title = 'Bon à savoir';         body = `Souscrivez une mutuelle adaptée à vos besoins et à ceux de votre famille.`; }
    }
    else if (qid === 'disability-work-interruption-insurance') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous êtes bien couvert avec une <strong>prévoyance complète</strong> et des <strong>indemnités optimisées</strong>. C’est une excellente protection en cas de <strong>coup dur</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = `<strong>Analysez votre prévoyance</strong> pour optimiser vos garanties.`; }
      else                                { title = 'Bon à savoir'; body = `<strong>Souscrivez une prévoyance</strong> pour sécuriser vos revenus en cas de coup dur.`; }
    }
    else if (qid === 'unemployment-protection-strategy') {
      if      (answerValue === 'oui')    { title = 'Excellente anticipation'; body = `Vous avez mis en place une <strong>protection efficace</strong> (contrat cadre dirigeant, ARE, cumul emploi…). Excellente anticipation qui <strong>sécurise vos revenus</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';             body = `Renforcez vos sécurités pour la protection en cas de chômage pour plus de stabilité financière.`; }
      else                                { title = 'Bon à savoir';          body = `Évaluez les solutions chômage pour protéger vos revenus.`; }
    }
    else if (qid === 'retirement-income-forecast-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = `Vous savez précisément <strong>combien vous toucherez à la retraite</strong> et avez mis en place une <strong>stratégie optimisée</strong>. Très bonne anticipation.`; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = `Affinez vos estimations et optimisations pour la retraite.`; }
      else                                { title = 'Bon à savoir'; body = `Faites une simulation retraite pour planifier vos revenus futurs.`; }
    }
    else if (qid === 'estate-planning-inheritance-tax-optimization') {
      if      (answerValue === 'oui')    { title = 'Excellente gestion'; body = `Vous avez mis en place une <strong>stratégie optimisée</strong> de transmission (<strong>donation, SCI, démembrement</strong>…). Excellent moyen de <strong>réduire les droits de succession</strong>.`; }
      else if (answerValue === 'medium') { title = 'Bon début';           body = `Formalisez une stratégie plus complète de <strong>transmission patrimoniale</strong>.`; }
      else                                { title = 'Bon à savoir';        body = `Mettez en place une <strong>stratégie de transmission patrimonial</strong>e pour réduire droits de succession.`; }
    }

    // f) Injecter dans le simulateur uniquement si c'est la question active
    if (qid === questionContainerId) {
      const wrap = question.querySelector('.opti-sim_info-wrapper');
      const tEl  = question.querySelector('.opti-sim_info-title');
      const bEl  = question.querySelector('.opti-sim_info-text');
      if (wrap) wrap.style.display = 'block';
      if (tEl ) tEl.textContent = title;
      if (bEl ) bEl.innerHTML = body;
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
}



function saveResultsToLocalStorage() {
  const data = {
    finalResults,
    detailedResults
  };
  localStorage.setItem('optiSimResults', JSON.stringify(data));
}



/*const form = document.querySelector('#opti-sim-result-form');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Calculs
  calculOrganisation();
  calculWage();
  calculDevelopment();
  calculProtection();
  calculGestion();

  // Sauvegarde
  saveResultsToLocalStorage();

  // Valeurs
  const email = form.querySelector('input[name="email"]').value;
  const phone = form.querySelector('input[name="phone"]').value;

  // Vérification email obligatoire
  if (!email) {
    alert("Merci de renseigner votre email.");
    return;
  }

  const params = new URLSearchParams();
  params.append("email", email);
  params.append("phone", phone);

  fetch("https://script.google.com/macros/s/AKfycbzOvQ1ATx00SZz6mBM0thjyo1MIJK6RFyHqyvbLZMOvik7CnbbzWhzViJnuSz-fnbr5/exec", {
    method: "POST",
    body: params
  });

  window.location.href = "/simulateur-optimisations-freelance-resultats";
});*/

// 1️⃣ Génération UID + lien de résultats
const uid = Date.now().toString(36) + Math.random().toString(36).slice(2);
const resultsLink = `https://www.acasi.io/simulateur-optimisations-freelance-resultats?uid=${uid}`;


// 2️⃣ HubSpot callback listener
window.addEventListener("message", function(event) {
  
  // A. Formulaire chargé → on remplit le champ hidden results_link
  if (event.data.type === "hsFormCallback" && event.data.eventName === "onFormReady") {
    console.log("✔ HubSpot form loaded");

    const hiddenField = document.querySelector('input[name="results_link"]');
    if (hiddenField) {
      hiddenField.value = resultsLink;
      console.log("➡ results_link injecté :", resultsLink);
    }
  }

  // B. Formulaire soumis → on déclenche ton simulateur + Apps Script + redirection
  if (event.data.type === "hsFormCallback" && event.data.eventName === "onFormSubmit") {
    console.log("✔ HubSpot form submitted");

    // Récupération email + phone depuis le formulaire HubSpot
    const emailField = document.querySelector('input[name="email"]');
    const phoneField = document.querySelector('input[name="phone"]');

    const email = emailField ? emailField.value : "";
    const phone = phoneField ? phoneField.value : "";

    // 3️⃣ TES CALCULS
    calculOrganisation();
    calculWage();
    calculDevelopment();
    calculProtection();
    calculGestion();

    // 4️⃣ Sauvegarde localStorage
    saveResultsToLocalStorage();

    // 5️⃣ Envoi des données dans Google Sheet
    const params = new URLSearchParams();
    params.append("email", email);
    params.append("phone", phone);
    params.append("uid", uid);
    params.append("results_link", resultsLink);

    fetch("https://script.google.com/macros/s/AKfycby3zaoC_WlRVVYSS8rRYmvObHQ5eRzubfrXF5-MsRegneMMPdvAJtqbS-Rwve9KJvFH/exec", {
      method: "POST",
      body: params
    }).catch(err => console.error("Erreur Apps Script :", err));

    // 6️⃣ Redirection vers la page résultats
    window.location.href = resultsLink;
  }

});
