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

/*document.querySelectorAll('.opti-sim_answer-item').forEach(answer => {
  answer.addEventListener('click', handleAnswerClick);
});*/

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

  // Légende des couleurs
  const legend = document.createElement('div');
  legend.className = 'result-legend';
  legend.innerHTML = `
    <span><span class="dot red"></span> urgent</span>
    <span><span class="dot orange"></span> moyen</span>
    <span><span class="dot green"></span> vous avez le temps</span>
  `;
  resultsDiv.appendChild(legend);

  // Affichage des sections
  Object.entries(finalResults).forEach(([theme, pct]) => {
    const section = document.createElement('section');
    section.classList.add('result-section');

    const resultGrid = document.createElement('div');
    resultGrid.classList.add('result-grid');

    // Titre (ex: Organisation: 62%)
    const title = document.createElement('h3');
    title.textContent = `${theme.charAt(0).toUpperCase() + theme.slice(1)}: ${pct}%`;

    // Container des messages
    const messagesContainer = document.createElement('div');
    messagesContainer.classList.add('result-messages');

    detailedResults[theme].forEach(entry => {
      const messageWrapper = document.createElement('div');
      messageWrapper.classList.add('result-message');

      // Ajout de la classe couleur selon les points
      if (entry.points >= 5) {
        messageWrapper.classList.add('green');
      } else if (entry.points >= 3) {
        messageWrapper.classList.add('orange');
      } else {
        messageWrapper.classList.add('red');
      }

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
    const questionTheme = step.dataset.theme;
    const questionStep = step.dataset.step;
    updateNextButtonState(questionTheme, questionStep);
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

      // Si "non" est coché → décocher tous les autres
      if (clickedValue === 'non' && checkbox.checked) {
        checkboxes.forEach(cb => {
          if (cb !== checkbox) {
            cb.checked = false;
            cb.closest('.opti-sim_answer-item')?.classList.remove('is-selected');
          }
        });
      }

      // Si on coche autre chose que "non" → décocher "non"
      if (clickedValue !== 'non' && checkbox.checked) {
        checkboxes.forEach(cb => {
          const item = cb.closest('.opti-sim_answer-item');
          if (item?.dataset.answer === 'non' && cb.checked) {
            cb.checked = false;
            item.classList.remove('is-selected');
          }
        });
      }

      // Mettre à jour les classes "is-selected"
      checkboxes.forEach(cb => {
        const item = cb.closest('.opti-sim_answer-item');
        if (item) {
          item.classList.toggle('is-selected', cb.checked);
        }
      });

      // Mettre à jour selectedAnswers
      const selectedValues = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.closest('.opti-sim_answer-item')?.dataset.answer)
        .filter(Boolean);

      selectedAnswers[`${theme}-${answerKey}`] = selectedValues;

      // Recalculer selon le thème
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
  question.querySelector('.opti-sim_info-text').textContent = infoText;
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
        'Vous avez choisi votre statut juridique après une analyse approfondie. C’est une excellente stratégie qui vous permet d’optimiser votre fiscalité, votre protection sociale et vos possibilités de financement.',
        'Bon début',
        'Vous avez choisi un statut juridique, mais sans étude détaillée. C’est un bon début, mais une analyse plus poussée pourrait vous permettre de mieux aligner votre statut avec vos objectifs et votre activité. N’hésitez pas à consulter un expert.',
        'Attention',
        'Votre statut juridique n’a pas été choisi dans le cadre d’une stratégie réfléchie. Pour optimiser vos avantages fiscaux et sociaux, une analyse approfondie avec un professionnel serait une étape clé.'
      );
    } else if (questionId === 'change-status') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Excellente démarche',
        'Vous avez déjà envisagé (ou effectué) un changement de statut pour optimiser votre situation. Cette anticipation est une démarche stratégique qui vous permet d’adapter votre structure à l’évolution de votre activité.',
        'Bonne réflexion',
        'Vous avez déjà réfléchi à un changement de statut, sans avoir encore agi. C’est une bonne piste : approfondir cette démarche avec un expert pourrait vous aider à mesurer les bénéfices concrets.',
        'Songez-y',
        'Vous n’avez pas encore envisagé de changement de statut. Pourtant, adapter sa structure à l’évolution de l’activité peut représenter une opportunité d’optimisation fiscale et sociale. Une analyse avec un professionnel vous permettrait d’identifier les opportunités d’optimisation.'
      );
    } else if (questionId === 'other-company-optimisation') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Félicitations',
        'Vous avez structuré votre activité avec un montage optimisé (holding, SCI, etc.). C’est une excellente stratégie pour maximiser vos avantages fiscaux et améliorer la gestion globale de votre entreprise.',
        'Bonne initiative',
        'Vous avez mis en place une structuration, mais elle n’est pas forcément optimisée. Un audit de votre organisation pourrait vous aider à identifier de nouvelles pistes d’optimisation fiscale et organisationnelle.',
        'Attention',
        'Vous n’avez pas encore structuré votre activité avec d’autres sociétés. Pourtant, des montages adaptés (holding, SCI, etc.) peuvent être de puissants leviers pour optimiser votre fiscalité et votre gestion. Pensez à explorer cette option avec un conseiller.'
      );
    } else if (questionId === 'organized-administrative-management') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Super',
        'Vous avez délégué la gestion administrative à un prestataire externe (expert-comptable, gestionnaire de paie, etc.). C’est une excellente décision qui vous fait gagner du temps et vous apporte un suivi fiable et stratégique.',
        'Bon début',
        'Vous gérez l’administratif en interne avec un outil adapté. C’est une bonne solution, mais l’accompagnement d’un expert pourrait renforcer la fiabilité et optimiser encore davantage votre organisation.',
        'Attention',
        'Vous gérez seul(e) toute la partie administrative. Cela peut vite devenir chronophage et source d’erreurs. Déléguer ou vous équiper d’un outil adapté vous permettrait de gagner en sérénité et en efficacité.'
      );
    } else if (questionId === 'has-management-calendar') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Excellente organisation',
        'Vous avez un calendrier précis et respectez vos échéances. C’est une excellente organisation qui sécurise votre gestion et limite les risques d’oubli ou de sanction.',
        'Vous êtes sur la bonne voie',
        'Vous avez un calendrier mais le suivi reste irrégulier. Améliorer votre rigueur ou automatiser des rappels vous permettrait d’éviter retards et imprévus.',
        'Attention',
        'Vous n’avez pas de calendrier pour vos échéances administratives. C’est un risque majeur d’oubli ou de pénalité. Mettre en place un suivi, même simple avec un outil numérique, serait une vraie optimisation.'
      );
    } else if (questionId === 'how-follow-payments') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Parfait',
        'Vous utilisez un outil automatisé pour vos paiements et relances. C’est une excellente pratique qui sécurise votre trésorerie et réduit les risques d’impayés.',
        'Bon suivi',
        'Vous faites un suivi manuel régulier. C’est sérieux, mais l’automatisation vous ferait gagner en temps et en fiabilité.',
        'Attention',
        'Vous gérez vos paiements et relances au cas par cas, sans processus clair. C’est risqué pour votre trésorerie. Mettre en place un suivi structuré ou un outil dédié serait une priorité d’optimisation.'
      );
    } else if (questionId === 'has-optimized-billing-software') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        "Bravo",
        "Vous utilisez un logiciel de facturation avec automatisations complètes (facturation, paiements, relances). C’est un levier puissant pour sécuriser et fluidifier votre gestion.",
        "C'est un bon début",
        "Vous avez un logiciel de facturation, mais sans automatisations pour les paiements et relances. Ajouter ces fonctions permettrait d’aller plus loin dans l’optimisation.",
        "Attention",
        "Vous n’utilisez pas encore de logiciel de facturation optimisé. C’est une étape essentielle pour gagner du temps, limiter les erreurs et améliorer le suivi de votre trésorerie."
      );
    } else if (questionId === 'has-optimized-pro-account') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        "Excellent choix",
        "Votre banque est adaptée à votre activité, avec des frais réduits et des services performants. C’est un excellent choix pour optimiser la gestion financière de votre entreprise.",
        "C'est un bon début",
        "Votre banque répond partiellement à vos besoins. Comparer d’autres offres pourrait vous permettre de réduire vos frais et de bénéficier de services plus adaptés.",
        "Attention",
        "Vous utilisez une banque peu ou pas adaptée à votre activité. Cela peut vous coûter cher en frais et limiter votre flexibilité. Explorer des solutions spécialisées serait une optimisation clé."
      );
    } else if (questionId === 'is-up-to-date') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        "Félicitations",
        "Vous êtes parfaitement à jour dans vos obligations. Bravo, c’est un pilier essentiel pour la stabilité et la sérénité de votre gestion.",
        "C'est un bon début",
        "Vous êtes globalement à jour, mais parfois en retard. Anticiper davantage et mettre en place un suivi plus rigoureux vous éviterait les imprévus.",
        "Attention",
        "Vous n’êtes pas à jour dans vos obligations administratives et fiscales. C’est un risque important. Mettre en place un suivi ou vous faire accompagner par un expert serait fortement recommandé."
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
      body:  "Vous privilégiez les tutoriels et vidéos, un format pratique et accessible pour apprendre rapidement. Compléter avec d’autres supports permettrait de diversifier vos compétences."
    },
    "blogs-articles": {
      title: "Blogs et articles",
      body:  "Vous vous formez via des blogs et articles. C’est une bonne habitude pour rester à jour, à compléter par des formats plus approfondis."
    },
    "livres-specialises": {
      title: "Livres spécialisés",
      body:  "Vous utilisez des livres spécialisés. Excellent choix pour acquérir une expertise approfondie, surtout s’ils sont associés à de la pratique."
    },
    "autre": {
      title: "Autre",
      body:  "Vous avez une méthode de formation personnelle. L’essentiel est de rester en veille et de continuer à apprendre régulièrement."
    },
    "non": {
      title: "Non, je ne me forme pas",
      body:  "Vous ne consacrez pas de temps à la formation. Or, c’est un levier clé pour évoluer et rester compétitif. Même un petit temps de formation régulier ferait une grande différence."
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
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = 'Vous travaillez entre 35 et 45h par semaine, un rythme équilibré qui maximise votre productivité tout en préservant votre bien-être.'; }
      else if (answerValue === 'medium') { title = 'Bon équilibre entre travail et vie personnelle'; body = 'Vous travaillez entre 25 et 35h par semaine. C’est un bon équilibre pro/perso, veillez toutefois à ce que ce rythme reste compatible avec vos objectifs de croissance.'; }
      else                                { title = 'Attention'; body = 'Vous travaillez entre 45 et 55h par semaine. Ce rythme intensif peut être efficace à court terme, mais attention au risque de surmenage. Une meilleure organisation pourrait répartir la charge plus durablement.'; }
    }
    else if (qid === 'planned-weeks') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = 'Vous planifiez votre semaine avec précision et anticipez vos priorités. C’est une excellente stratégie pour optimiser votre temps et rester concentré.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous planifiez partiellement vos semaines. C’est une bonne base, mais un planning plus structuré vous aiderait à mieux gérer vos priorités et éviter les imprévus.'; }
      else                                { title = 'Attention'; body = 'Vous gérez vos tâches au jour le jour, sans plan clair. Cela peut générer stress et désorganisation. Structurer vos semaines avec un planning précis vous ferait gagner en efficacité.'; }
    }
    else if (qid === 'daily-routine-productivity') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = 'Vous avez une routine quotidienne avec des rituels bien définis. C’est une excellente habitude pour rester productif et concentré.'; }
      else if (answerValue === 'medium') { title = 'Vous êtes sur la bonne voie'; body = 'Vous avez une certaine routine, mais sans régularité. En l’ancrant davantage, vous pourriez améliorer encore votre efficacité et votre gestion du temps.'; }
      else                                { title = 'Attention'; body = 'Vous n’avez pas de routine structurée. Cela peut nuire à votre concentration et à votre énergie. Mettre en place quelques rituels fixes renforcerait votre productivité.'; }
    }
    else if (qid === 'client-acquisition-strategy') {
      if      (answerValue === 'oui')    { title = 'Super'; body = 'Vous avez une stratégie claire et structurée pour prospecter, avec des actions régulières. C’est une approche idéale pour développer votre activité de manière prévisible.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous avez une stratégie, mais vos actions manquent de régularité ou de suivi. Les rendre plus systématiques vous aiderait à améliorer vos résultats.'; }
      else                                { title = 'Attention'; body = 'Vous prospectez sans véritable stratégie. Cela freine votre croissance. Construire un plan structuré avec des actions mesurables renforcerait votre acquisition de clients.'; }
    }
    else if (qid === 'weekly-admin-time') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = 'Vous réservez un créneau précis chaque semaine pour vos tâches administratives. C’est une excellente organisation qui évite l’accumulation et les oublis.'; }
      else if (answerValue === 'medium') { title = 'Bonne initiative'; body = 'Vous consacrez du temps à l’administratif, mais de manière peu optimisée. Structurer davantage ce temps pourrait réduire la charge mentale et améliorer l’efficacité.'; }
      else                                { title = 'Attention'; body = 'Vous gérez l’administratif au jour le jour, ce qui augmente les risques d’oublis et de stress. Bloquer un créneau régulier serait une optimisation clé.'; }
    }
    else if (qid === 'burnout-prevention-breaks') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = 'Vous prenez régulièrement au moins 5 semaines de repos par an. C’est une excellente habitude pour préserver votre énergie et éviter le burn-out.'; }
      else if (answerValue === 'medium') { title = 'Bonne initiative'; body = 'ous prenez des vacances, mais pas assez ou de manière irrégulière. Planifier davantage de vraies pauses vous aiderait à maintenir un meilleur équilibre.'; }
      else                                { title = 'Attention'; body = 'Vous prenez rarement, voire jamais, de pauses. Cela met votre santé et votre productivité en danger. Intégrer du repos dans votre agenda est essentiel.'; }
    }
    else if (qid === 'work-schedule-balance') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = 'Vos horaires sont fixes et adaptés à vos pics de productivité. C’est une excellente manière d’allier efficacité et équilibre de vie.'; }
      else if (answerValue === 'medium') { title = 'Vous avez une certaine organisation'; body = 'Vous avez une organisation horaire, mais vos variations fréquentes nuisent parfois à votre efficacité. Stabiliser vos horaires pourrait améliorer vos journées.'; }
      else                                { title = 'Attention'; body = 'Vous travaillez à n’importe quelle heure, sans cadre défini. Cela peut nuire à la fois à votre productivité et à votre équilibre personnel. Fixer des plages régulières serait bénéfique.'; }
    }
    else if (qid === 'task-delegation') {
      if      (answerValue === 'oui')    { title = 'Très bonne approche'; body = 'Vous déléguez ce qui n’est pas votre cœur de métier (comptabilité, communication, etc.). C’est une excellente stratégie pour gagner du temps et vous concentrer sur l’essentiel.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous déléguez, mais de manière limitée. Externaliser davantage de tâches pourrait renforcer votre productivité et réduire votre charge de travail.'; }
      else                                { title = 'Attention'; body = 'Vous gérez tout vous-même. Cela peut rapidement devenir une surcharge. Déléguer certaines missions vous permettrait de vous recentrer sur votre véritable valeur ajoutée.'; }
    }
    else if (qid === 'monthly-learning-time') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = 'Vous consacrez entre 6 et 9h par mois à votre formation. C’est un excellent investissement pour rester compétitif et progresser constamment.'; }
      else if (answerValue === 'medium') { title = 'Bon investissement'; body = 'Aous consacrez entre 3 et 6h par mois à vous former. C’est une bonne base, mais augmenter légèrement ce temps renforcerait encore vos compétences.'; }
      else                                { title = 'Attention'; body = 'Vous consacrez moins de 3h par mois à la formation. Or, rester en veille et apprendre régulièrement est essentiel pour évoluer. Intégrer plus de formation à votre emploi du temps serait une vraie optimisation.'; }
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
      if      (answerValue === 'oui')    { title = 'Bravo'; body = 'Vous avez une proposition de valeur claire et différenciante. C’est un atout majeur pour attirer les bons clients et vous démarquer. Continuez à la mettre en avant et à l’affiner.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Votre proposition de valeur existe mais manque encore de clarté ou de différenciation. Travailler sur votre message et votre communication permettrait de la rendre plus percutante.'; }
      else                                { title = 'Attention'; body = 'Vous n’avez pas encore défini clairement votre proposition de valeur. C’est pourtant essentiel pour convaincre vos clients et vous distinguer. Prendre le temps de clarifier ce qui vous rend unique est une priorité.'; }
    }
    else if (qid === 'networking-events-participation') {
      if      (answerValue === 'oui')    { title = 'Excellente démarche'; body = 'Vous participez régulièrement à des événements stratégiques. C’est une excellente démarche pour développer votre réseau et accéder à de nouvelles opportunités.'; }
      else if (answerValue === 'medium') { title = 'C\'est un bon début'; body = 'Vous participez à certains événements, mais sans réelle stratégie. En choisissant mieux vos rendez-vous et en fixant des objectifs, vous pourriez en tirer davantage de bénéfices.'; }
      else                                { title = 'Attention'; body = 'Vous ne participez pas à des événements professionnels. Or, ces rencontres sont un excellent moyen de développer votre réseau et de trouver des clients. En intégrer quelques-uns à votre agenda serait un vrai plus.'; }
    }
    else if (qid === 'online-visibility-channels') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = 'Vous utilisez LinkedIn (et d’autres canaux) de manière régulière et stratégique. C’est une excellente façon d’asseoir votre crédibilité et de trouver de nouveaux clients.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous êtes présent(e) sur LinkedIn ou d’autres canaux, mais sans réelle stratégie. Mettre en place un plan de contenu clair et régulier améliorerait considérablement votre visibilité.'; }
      else                                { title = 'Attention'; body = 'Vous n’utilisez pas encore LinkedIn ou d’autres canaux pour développer votre visibilité. Pourtant, ce sont des leviers puissants pour attirer des clients et renforcer votre positionnement.'; }
    }
    else if (qid === 'client-conversion-system') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = 'Vous avez mis en place une stratégie d’acquisition claire, optimisée et suivie. C’est un levier puissant pour développer votre activité de manière stable et prévisible.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous avez un système d’acquisition, mais il n’est pas encore totalement optimisé. L’analyser et l’améliorer vous permettrait d’obtenir de meilleurs résultats.'; }
      else                                { title = 'Attention'; body = 'Vous n’avez pas encore de système structuré pour attirer des clients. Construire une stratégie (SEO, publicité, inbound marketing) serait une étape clé pour booster votre croissance.'; }
    }
    else if (qid === 'mentorship-or-peer-support') {
      if      (answerValue === 'oui')    { title = 'Super'; body = 'Vous bénéficiez de l’accompagnement d’un mentor ou d’un groupe d’entrepreneurs. C’est une excellente ressource pour progresser plus vite, prendre du recul et éviter les erreurs.'; }
      else if (answerValue === 'medium') { title = 'C\'est un bon début'; body = 'Vous avez un accompagnement, mais pas régulier ou approfondi. En le rendant plus constant, vous pourriez accélérer encore davantage votre développement.'; }
      else                                { title = 'Attention'; body = 'Vous n’êtes pas accompagné par un mentor ni un réseau d’entrepreneurs. Pourtant, ces échanges peuvent apporter des conseils précieux et accélérer votre progression.'; }
    }
    else if (qid === 'competitor-analysis') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = 'Vous analysez régulièrement vos concurrents et ajustez votre offre en conséquence. C’est une excellente pratique pour rester compétitif et pertinent sur votre marché.'; }
      else if (answerValue === 'medium') { title = 'C\'est un bon début'; body = 'Vous observez vos concurrents, mais de manière irrégulière. Structurer votre veille renforcerait votre positionnement et vos opportunités d’innovation.'; }
      else                                { title = 'Attention'; body = 'Vous n’analysez pas vos concurrents. Or, les connaître est essentiel pour vous différencier et affiner votre offre. Mettre en place une veille simple serait déjà un vrai pas en avant.'; }
    }
    else if (qid === 'offer-or-model-innovation') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = 'Vous innovez régulièrement dans votre offre ou votre modèle économique. C’est une excellente stratégie pour rester compétitif et répondre aux attentes du marché.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous innovez de temps en temps, mais pas de manière systématique. En rendant ce processus plus régulier, vous pourriez capter de nouvelles opportunités.'; }
      else                                { title = 'Attention'; body = 'Votre offre n’a pas évolué récemment. L’innovation est pourtant clé pour se démarquer et anticiper les évolutions du marché. Explorer de nouvelles idées dynamiserait votre activité.'; }
    }
    else if (qid === 'business-diversification-plan') {
      if      (answerValue === 'oui')    { title = 'Très bonne stratégie'; body = 'Vous avez une stratégie claire de diversification. C’est une excellente approche pour assurer la pérennité et la croissance de votre activité.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous envisagez une diversification mais sans plan structuré. Définir des actions concrètes vous aiderait à passer à l’étape suivante.'; }
      else                                { title = 'Attention'; body = 'Vous n’avez pas prévu de diversifier votre activité. Pourtant, cela permet de réduire les risques et d’ouvrir de nouveaux marchés. Y réfléchir dès maintenant pourrait être une bonne opportunité.'; }
    }
    else if (qid === 'mileage-allowance-usage') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = 'Vous utilisez les indemnités kilométriques. Très bon choix : cela vous permet d’optimiser vos frais de déplacement et de profiter d’un avantage fiscal intéressant.'; }
      else if (answerValue === 'medium') { title = 'Bon choix'; body = 'Vous utilisez un véhicule professionnel. C’est une bonne alternative, mais pensez à vérifier si les indemnités kilométriques ou d’autres dispositifs seraient plus avantageux dans votre situation.'; }
      else if (answerValue === 'non')     { title = 'Bon à savoir'; body = 'Vous utilisez votre voiture personnelle sans demander les indemnités kilométriques. Vous pourriez récupérer une somme intéressante en les réclamant. C’est une optimisation à intégrer à votre gestion.'; }
      else { title = "Pas d'optimisation supplémentaire"; body = 'Vous n’utilisez pas de véhicule personnel pour vos déplacements professionnels. Pas de frais à optimiser sur ce point.' }
    }
    else if (qid === 'holiday-voucher-setup') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = 'Vous maximisez le montant des chèques vacances (jusqu’à 554,40 € en 2024). Excellente optimisation qui réduit vos charges tout en améliorant votre qualité de vie.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous utilisez les chèques vacances, mais pas à leur plein potentiel. Atteindre le plafond de 554,40 € vous permettrait d’optimiser davantage vos avantages fiscaux.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’utilisez pas encore les chèques vacances. C’est une opportunité simple pour réduire vos charges et bénéficier d’un avantage fiscal intéressant.'; }
    }
    else if (qid === 'cesu-tax-benefits') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = 'Vous exploitez pleinement le dispositif CESU (jusqu’à 2 540 €). Félicitations : c’est une excellente manière d’alléger vos impôts tout en bénéficiant de services à domicile.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous utilisez les CESU partiellement. Augmenter le montant jusqu’au plafond de 2 540 € vous permettrait de maximiser vos économies fiscales.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’utilisez pas le dispositif CESU. Pourtant, il permet de réduire vos charges tout en facilitant le recours à des services personnels (ménage, garde d’enfants, etc.).'; }
    }
    else if (qid === 'expense-tracking-setup') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = 'Vous suivez et optimisez chaque dépense. C’est une excellente pratique qui garantit des économies substantielles et une gestion fiable.'; }
      else if (answerValue === 'medium') { title = 'Vous êtes sur la bonne voie'; body = 'Vous enregistrez vos notes de frais, mais pas de manière totalement rigoureuse. Un suivi plus précis éviterait des pertes financières et faciliterait la gestion.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous ne suivez pas vos notes de frais. Cela peut entraîner des erreurs et des coûts supplémentaires. Structurer un suivi régulier est une optimisation clé.'; }
    }
    else if (qid === 'expense-optimization-strategies') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = 'Vous exploitez tous les leviers possibles (primes, exonérations, forfaits, etc.) pour réduire vos charges. Très bonne gestion !'; }
      else if (answerValue === 'medium') { title = 'Vous avez déjà pris de bonnes initiatives'; body = 'Vous optimisez déjà certaines charges, mais pas encore toutes. Un audit régulier pourrait révéler d’autres pistes d’économies.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’avez pas encore exploré les dispositifs d’optimisation des charges. C’est pourtant une opportunité directe d’améliorer votre rentabilité.'; }
    }
    else if (qid === 'project-tools-automation') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = 'Vous utilisez pleinement des outils comme Notion, Trello ou Zapier. Excellente gestion : vous gagnez en productivité et réduisez votre charge mentale.'; }
      else if (answerValue === 'medium') { title = 'Vous utilisez déjà des outils, c’est un bon début'; body = 'Vous utilisez déjà certains outils, mais de manière partielle. Une meilleure intégration et automatisation vous permettrait de franchir un cap en efficacité.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’utilisez pas encore d’outils de gestion ou d’automatisation. Tester Notion, Trello ou Zapier pourrait vous faire gagner beaucoup de temps et de clarté.'; }
    }
    else if (qid === 'optimized-work-routine') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = 'Vous avez mis en place une routine claire et régulière. C’est une excellente habitude pour maximiser votre concentration et votre productivité.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous avez une routine, mais elle manque de discipline. La rendre plus régulière améliorerait votre efficacité.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’avez pas encore de routine structurée. En mettre une en place progressivement vous aiderait à mieux gérer votre énergie au quotidien.'; }
    }
    else if (qid === 'time-management-techniques') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = 'Vous appliquez rigoureusement des techniques de gestion du temps. C’est un levier puissant pour rester productif et concentré.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous utilisez certaines techniques, mais pas régulièrement. Les appliquer plus systématiquement renforcerait leur efficacité.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’utilisez pas de techniques spécifiques. Tester Pomodoro, Time-Blocking ou d’autres méthodes simples pourrait transformer votre organisation.'; }
    }
    else if (qid === 'goal-tracking-strategy') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = 'Vous disposez d’un système clair pour suivre vos objectifs et prioriser vos tâches. C’est une excellente façon de garder le cap.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous suivez vos objectifs, mais de manière peu rigoureuse. Améliorer le suivi et la priorisation renforcerait vos résultats.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous ne suivez pas vos objectifs de manière organisée. Mettre en place un outil comme Notion ou ClickUp vous aiderait à mieux structurer vos progrès.'; }
    }
    else if (qid === 'decision-making-method') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = 'Vous prenez vos décisions rapidement grâce à une méthodologie claire. Cela vous permet de gagner du temps et d’optimiser vos actions.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous prenez vos décisions, mais parfois trop lentement. Travailler sur une méthode plus structurée renforcerait votre efficacité.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’avez pas de méthode de décision claire. Utiliser la matrice d’Eisenhower ou la règle des 2 minutes pourrait vous aider à décider plus vite.'; }
    }
    else if (qid === 'email-automation-tools') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = 'Vous utilisez des outils comme Sanebox ou Clean Email pour trier et automatiser la gestion de vos emails. Excellente optimisation de votre temps.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous gérez vos emails manuellement. C’est chronophage : des outils d’automatisation pourraient vous aider à gagner en efficacité.'; }
    }
    else if (qid === 'task-planning-tools') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = 'Vous planifiez vos tâches avec des outils comme Trello ou Asana. C’est une excellente méthode pour gérer vos priorités efficacement.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous ne planifiez pas vos tâches avec des outils numériques. Pourtant, cela simplifierait votre organisation et augmenterait votre productivité.'; }
    }
    else if (qid === 'reminder-deadline-tools') {
      if      (answerValue === 'oui')    { title = 'Parfait'; body = 'Vous utilisez des outils comme Google Calendar ou Outlook pour vos rappels et échéances. C’est une très bonne pratique pour ne rien oublier.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous ne digitalisez pas vos rappels et échéances. Cela peut entraîner des oublis. Automatiser avec un calendrier numérique serait un vrai gain de sérénité.'; }
    }
    else if (qid === 'ai-use-professional') {
      if      (answerValue === 'oui')    { title = 'Excellent'; body = 'Vous utilisez l’IA régulièrement pour automatiser, analyser et optimiser. Excellente stratégie pour rester compétitif et productif.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous utilisez l’IA ponctuellement, mais pas encore de manière systématique. Explorer davantage ses usages pourrait vous apporter encore plus de bénéfices.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’utilisez pas l’IA dans votre travail. Pourtant, des outils comme ChatGPT, DALL·E ou d’autres IA spécialisées pourraient booster votre activité.'; }
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
      if      (answerValue.includes('non'))   { title = 'Bon à savoir'; body = 'Vous ne profitez d’aucun dispositif spécifique. Pourtant, il existe de nombreuses exonérations selon votre activité et votre localisation. Une analyse approfondie pourrait vous faire économiser beaucoup.'; }
      else if (answerValue.length === 1)      { title = 'Bon début'; body = 'Vous bénéficiez déjà d’un dispositif fiscal, mais vous pourriez explorer d’autres leviers pour aller plus loin.'; }
      else                                     { title = 'Très bien'; body = 'Vous profitez de plusieurs dispositifs fiscaux (JEI, ZFU, exonération TVA, etc.). Excellent travail d’optimisation pour réduire vos charges.!'; }
    }
    else if (qid === 'benefits-in-kind-tax-reduction') {
      if      (answerValue.includes('non'))           { title = 'Bon à savoir'; body = 'Vous ne bénéficiez pas d’avantages en nature. Pourtant, certains dispositifs simples pourraient vous permettre d’alléger vos charges.'; }
      else if (answerValue.length <= 3)               { title = 'Bon début'; body = 'Vous utilisez certains avantages en nature, mais il existe encore des leviers (matériel, frais de transport, repas, etc.) pour aller plus loin.'; }
      else                                            { title = 'Excellent'; body = 'Vous profitez de plusieurs avantages en nature (véhicule, repas, télétravail, etc.). Excellente optimisation qui réduit vos charges personnelles et votre imposition.'; }
    }
    else if (qid === 'investment-cashflow-tax-optimization') {
      title = `Vous avez sélectionné ${answerValue.length} option(s)`; 
      body  = 'Cela représente autant de leviers d’optimisation potentiels sur votre trésorerie.'; 
    }
    else if (qid === 'per-subscription-tax-saving') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = 'Vous alimentez régulièrement votre PER avec le montant maximal déductible. Bravo ! C’est une excellente stratégie pour préparer votre avenir tout en réduisant vos impôts.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous avez déjà un PER, mais vos versements restent partiels ou occasionnels. Les rendre plus réguliers permettrait de renforcer votre optimisation fiscale et votre capital retraite.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’avez pas encore de PER. Pourtant, c’est un dispositif très avantageux qui permet d’épargner pour la retraite tout en réduisant vos impôts. Commencer par des versements progressifs pourrait être une bonne approche.'; }
    }
    else if (qid === 'training-tax-credit') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = 'Vous utilisez pleinement le crédit d’impôt formation (40 % des dépenses). Félicitations : vous investissez dans vos compétences tout en réduisant vos impôts.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous utilisez ce crédit, mais pas dans son intégralité. Vérifiez si d’autres formations éligibles pourraient renforcer votre optimisation.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous ne profitez pas du crédit d’impôt formation. Pourtant, c’est un levier précieux pour financer votre montée en compétences et alléger vos charges.'; }
    }
    else if (qid === 'energy-transition-tax-credit') {
      if      (answerValue === 'oui')    { title = 'Excellent choix'; body = 'Vous bénéficiez du CITE pour vos travaux de rénovation énergétique. Très bon choix : vous réduisez vos dépenses et vos impôts tout en améliorant votre logement.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous utilisez déjà ce crédit, mais pas pleinement. Vérifiez si d’autres travaux sont éligibles pour maximiser vos avantages.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’utilisez pas le CITE. C’est pourtant une belle opportunité pour financer des rénovations énergétiques et alléger votre fiscalité.'; }
    }
    else if (qid === 'tax-deferral-mechanism') {
      if      (answerValue === 'oui')    { title = 'Très bonne stratégie'; body = 'Vous utilisez des mécanismes d’étalement ou de report d’imposition (par exemple différer vos revenus). C’est une excellente stratégie pour lisser vos charges fiscales.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous appliquez certains mécanismes, mais sans réelle stratégie. Les approfondir avec un expert permettrait d’aller plus loin.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’utilisez pas ces leviers. Pourtant, l’étalement et le report d’imposition sont des outils puissants pour optimiser votre fiscalité.'; }
    }
    else if (qid === 'annual-tax-review-expert') {
      if      (answerValue === 'oui')    { title = 'Bravo'; body = 'Vous réalisez un bilan fiscal précis chaque année avec un expert. C’est une excellente pratique pour maximiser vos déductions et sécuriser votre situation.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous consultez un expert, mais pas systématiquement. En le faisant chaque année, vous pourriez renforcer vos optimisations.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous ne réalisez pas de bilan fiscal annuel. C’est pourtant essentiel pour éviter les erreurs et identifier toutes vos déductions possibles.'; }
    }
    else if (qid === 'vat-recovery-optimization') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = 'Vous récupérez toute la TVA éligible. Félicitations, vous optimisez vos charges et réduisez vos coûts.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous récupérez la TVA, mais pas toujours de manière complète. Un audit de vos déclarations pourrait révéler des opportunités supplémentaires.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous ne récupérez pas systématiquement la TVA. Or, c’est un levier direct pour alléger vos dépenses. Il serait intéressant d’analyser si vous pouvez récupérer davantage de TVA sur vos achats.'; }
    }
    else if (qid === 'current-income-perception') {
      // cas à 5 options
      if      (answerValue === 'oui')        { title = 'Très bon choix'; body = 'Vous privilégiez les dividendes avec un faible salaire. C’est une très bonne stratégie pour réduire vos charges sociales et optimiser votre imposition.'; }
      else if (answerValue === 'mediumyes')  { title = 'Bien optimisé'; body = 'Votre mix salaire/dividendes est optimisé, ce qui vous permet de profiter d’une fiscalité plus avantageuse. Continuez ainsi !'; }
      else if (answerValue === 'medium')     { title = 'Bon début'; body = 'Vous percevez uniquement un salaire. C’est simple à gérer, mais inclure une part de dividendes pourrait améliorer votre optimisation.'; }
      else if (answerValue === 'mediumno')   { title = 'Bon à savoir'; body = 'Vos bénéfices sont imposés directement. C’est adapté dans certains cas, mais étudier d’autres statuts peut vous ouvrir de meilleures opportunités fiscales.'; }
      else                                   { title = 'Attention'; body = 'Vous n’avez pas encore optimisé votre mode de rémunération. Une analyse avec un expert-comptable pourrait réduire vos charges et améliorer votre fiscalité.'; }
    }
    else if (qid === 'home-office-rent-tax-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = 'Vous avez mis en place un loyer avec convention. Excellente optimisation pour réduire votre base imposable en toute conformité.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous facturez un loyer mais sans convention de location. Formaliser cela avec un document officiel sécuriserait la déduction.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’exploitez pas cette possibilité. Pourtant, un loyer correctement déclaré peut être un levier fiscal intéressant.'; }
    }
    else if (qid === 'remuneration-split-optimization') {
      if      (answerValue === 'oui')    { title = 'Félicitations'; body = 'Vous avez optimisé la répartition de vos revenus (salaires, dividendes, compensations) après analyse approfondie. C’est une excellente stratégie pour réduire vos cotisations et vos impôts.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous avez commencé à optimiser, mais sans étude détaillée. Une analyse plus fine pourrait vous permettre de maximiser vos économies.'; }
      else                                { title = 'Bon à savoir'; body = 'Votre rémunération n’est pas optimisée. Travailler sur un mix plus adapté avec un expert pourrait réduire vos charges.'; }
    }
    else if (qid === 'holding-structure-income-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bonne stratégie'; body = 'Vous avez mis en place une holding. C’est une très bonne stratégie pour optimiser la distribution de vos revenus et structurer votre patrimoine.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous envisagez une holding. Si votre chiffre d’affaires est élevé, cela peut devenir un levier fiscal et patrimonial puissant.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’avez pas de holding. Cela n’est pas toujours nécessaire, mais si votre CA est élevé, ce dispositif pourrait être intéressant.'; }
    }
    else if (qid === 'dividends-income-tax-option') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = 'Vous optez pour l’imposition au barème de l’IR avec abattement de 40 %. Très bon choix : cela permet souvent de réduire la fiscalité sur vos dividendes.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous avez choisi cette option, mais sans certitude d’optimisation totale. Une analyse plus approfondie permettrait de confirmer que c’est le meilleur choix pour vous.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous avez choisi le PFU à 30 %. C’est simple, mais parfois moins avantageux que l’imposition au barème avec abattement. Une comparaison pourrait être utile.'; }
    }
    else if (qid === 'cca-cash-injection') {
      const vals = answerValue;
      if (vals.includes('oui'))            { title = 'Très bien'; body = 'Vous utilisez le compte courant d’associé pour injecter de la trésorerie. Bonne pratique qui permet de soutenir votre société tout en gardant une trace comptable claire.'; }
      else                                  { title = 'Bon à savoir'; body = 'Vous n’utilisez pas le CCA. Pourtant, ce mécanisme peut être un levier intéressant pour optimiser votre trésorerie et votre fiscalité.'; }
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
      if      (n === 0)      { title = 'Bon à savoir';       body = 'Votre trésorerie n’est pas placée. Pourtant, de nombreux supports existent (assurance vie, SCPI, SICAV, etc.) pour générer des rendements et optimiser vos impôts.'; }
      else if (n <= 2)       { title = 'Bon début';          body = 'Vous avez placé votre trésorerie sur quelques supports. Une diversification plus large pourrait améliorer vos performances et votre fiscalité.'; }
      else                   { title = 'Excellente diversification'; body = 'Vous diversifiez vos placements (assurance vie, SCPI, obligations, etc.). C’est une excellente stratégie pour optimiser vos rendements et réduire vos risques.'; }
    }
    else if (qid === 'subscribed-insurances-list') {
      const n = answerValue.length;
      if      (n === 0)      { title = 'Bon à savoir';       body = 'Vous n’avez pas d’assurance professionnelle. Cela vous expose à des risques financiers importants en cas de litige ou de sinistre.'; }
      else if (n <= 2)       { title = 'Bon début';          body = 'Vous avez une protection partielle. Ajouter d’autres assurances adaptées à votre secteur pourrait renforcer votre sécurité.'; }
      else                   { title = 'Très bien';          body = 'Vous avez souscrit plusieurs assurances professionnelles (RCP, multirisque, protection juridique, etc.). Très bonne couverture qui sécurise votre activité.'; }
    }
    else if (qid === 'holding-investment-tax-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = 'Votre holding est optimisée et active. Très bon choix : elle vous permet de maximiser vos avantages fiscaux et de structurer efficacement votre patrimoine.'; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = 'Vous avez une holding mais elle est sous-exploitée. Un usage plus stratégique pourrait améliorer encore vos optimisations fiscales.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’avez pas encore structuré vos investissements via une holding. Si votre chiffre d’affaires est élevé, c’est une piste à envisager pour optimiser vos revenus et vos placements.'; }
    }
    else if (qid === 'startup-sme-private-equity-investment') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = 'Vous investissez déjà dans des startups ou PME et bénéficiez des réductions fiscales associées. Très bonne stratégie de diversification et d’optimisation.'; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = 'Vous envisagez ce type d’investissement mais ne l’avez pas encore concrétisé. Lancer un premier placement pourrait être intéressant.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’investissez pas dans ces opportunités. Pourtant, elles offrent à la fois des avantages fiscaux et un potentiel de rendement à long terme.'; }
    }
    else if (qid === 'passive-income-distribution-plan') {
      if      (answerValue === 'oui')    { title = 'Excellente stratégie'; body = 'Vous avez mis en place une stratégie fiscale claire pour vos revenus passifs (intérêts, loyers, dividendes). Excellente optimisation de votre rentabilité nette.'; }
      else if (answerValue === 'medium') { title = 'Bon début';          body = 'Vous gérez vos revenus passifs de manière basique. Une meilleure structuration fiscale pourrait améliorer vos gains.'; }
      else                                { title = 'Bon à savoir';       body = 'Vous n’avez pas encore optimisé la distribution de vos revenus passifs. C’est une piste importante pour réduire vos charges fiscales.'; }
    }
    else if (qid === 'investment-diversification-tax-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = 'Votre portefeuille est bien diversifié et fiscalement optimisé. Très bonne gestion qui réduit les risques et augmente vos opportunités.'; }
      else if (answerValue === 'medium') { title = 'Bon début'; body = 'Vous avez commencé à diversifier vos investissements, mais pas suffisamment. Une meilleure répartition permettrait d’améliorer votre sécurité et vos optimisations fiscales.'; }
      else                                { title = 'Bon à savoir'; body = 'Vos investissements ne sont pas assez diversifiés. Cela peut augmenter vos risques. Élargir vos placements renforcerait votre stratégie patrimoniale.'; }
    }
    else if (qid === 'long-term-investment-capital-gains-tax') {
      if      (answerValue === 'oui')    { title = 'Excellente approche'; body = 'Vous utilisez des dispositifs à long terme (PEA, assurance-vie, etc.) et profitez des régimes fiscaux avantageux. Excellente stratégie pour optimiser vos plus-values.'; }
      else if (answerValue === 'medium') { title = 'Bon début';        body = 'Vous investissez à long terme, mais sans exploiter toutes les stratégies fiscales disponibles. Explorer d’autres solutions renforcerait votre plan.'; }
      else                                { title = 'Bon à savoir';     body = 'Vous n’avez pas encore mis en place de stratégie d’investissement à long terme. Pourtant, c’est un levier majeur pour sécuriser et optimiser votre patrimoine.'; }
    }
    else if (qid === 'supplementary-retirement-plan') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = 'Vous avez mis en place un plan de retraite complémentaire (PER, Madelin, SCPI) avec des versements optimisés. Très bonne stratégie : vous sécurisez votre avenir financier tout en réduisant vos impôts.'; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = 'Vous avez un plan de retraite complémentaire, mais sans stratégie précise. Une analyse plus approfondie permettrait d’améliorer vos bénéfices et votre optimisation fiscale.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’avez pas encore de plan de retraite complémentaire. Explorer des solutions comme le PER ou le Madelin pourrait renforcer votre protection et vos avantages fiscaux.'; }
    }
    else if (qid === 'health-insurance-family-coverage') {
      if      (answerValue === 'oui')    { title = 'Excellente couverture'; body = 'Vous disposez d’une mutuelle optimisée en termes de couverture et de coût. Excellente protection pour vous et votre famille.'; }
      else if (answerValue === 'medium') { title = 'Bon début';            body = 'Vous avez une mutuelle, mais elle est trop coûteuse ou avec une couverture insuffisante. Une réévaluation vous permettrait d’optimiser votre protection.'; }
      else                                { title = 'Bon à savoir';         body = 'Vous n’avez pas de mutuelle adaptée. Pourtant, elle est essentielle pour couvrir vos besoins de santé et ceux de vos proches.'; }
    }
    else if (qid === 'disability-work-interruption-insurance') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = 'Vous êtes bien couvert avec une prévoyance complète et des indemnités optimisées. C’est une excellente protection en cas de coup dur.'; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = 'Vous avez une prévoyance, mais sans optimisation réelle. Une analyse détaillée pourrait améliorer vos garanties.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’avez pas de prévoyance. Cela représente un risque majeur en cas de problème de santé ou d’invalidité.'; }
    }
    else if (qid === 'unemployment-protection-strategy') {
      if      (answerValue === 'oui')    { title = 'Excellente anticipation'; body = 'Vous avez mis en place une protection efficace (contrat cadre dirigeant, ARE, cumul emploi…). Excellente anticipation qui sécurise vos revenus.'; }
      else if (answerValue === 'medium') { title = 'Bon début';             body = 'Vous disposez de quelques sécurités, mais elles restent limitées. Les renforcer permettrait d’assurer une meilleure stabilité financière.'; }
      else                                { title = 'Bon à savoir';          body = 'Vous n’avez pas de dispositif en cas de chômage. Cela peut fragiliser votre sécurité financière.'; }
    }
    else if (qid === 'retirement-income-forecast-optimization') {
      if      (answerValue === 'oui')    { title = 'Très bien'; body = 'Vous savez précisément combien vous toucherez à la retraite et avez mis en place une stratégie optimisée. Très bonne anticipation.'; }
      else if (answerValue === 'medium') { title = 'Bon début';  body = 'Vous avez une idée de votre future retraite, mais sans optimisation complète. Approfondir ce point vous permettrait d’améliorer vos revenus futurs.'; }
      else                                { title = 'Bon à savoir'; body = 'Vous n’avez pas évalué vos revenus de retraite. Une étude approfondie serait utile pour préparer sereinement votre avenir.'; }
    }
    else if (qid === 'estate-planning-inheritance-tax-optimization') {
      if      (answerValue === 'oui')    { title = 'Excellente gestion'; body = 'Vous avez mis en place une stratégie optimisée de transmission (donation, SCI, démembrement…). Excellent moyen de réduire les droits de succession.'; }
      else if (answerValue === 'medium') { title = 'Bon début';           body = 'Vous avez commencé à préparer la transmission, mais sans stratégie complète. Approfondir cette démarche optimiserait vos avantages fiscaux.'; }
      else                                { title = 'Bon à savoir';        body = 'Vous n’avez pas de stratégie de transmission. Pourtant, il existe des solutions simples pour réduire les droits de succession et protéger vos proches.'; }
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
