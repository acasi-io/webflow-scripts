document.getElementById('start-btn').addEventListener('click', () => {
  document.querySelector('.section_opti-sim-hero').classList.add('hide');
  document.querySelector('.section_opti-sim').classList.remove('hide');
});

let selectedAnswers = {};

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

function updateProgressBar(questionTheme) {
  // Filtrer les questions pour le thème concerné qui comptent pour le score
  const themeSteps = steps.filter(
    step => step.dataset.theme === questionTheme && step.dataset.point !== 'false'
  );
  const totalQuestions = themeSteps.length;
  if (!totalQuestions) return;

  const maxPoints = totalQuestions * 5;
  let totalPoints = 0;
  let answeredQuestions = 0;

  themeSteps.forEach(step => {
    const questionStep = step.dataset.step;
    const key = `${questionTheme}-${questionStep}`;
    const answerValue = selectedAnswers[key];
    if (answerValue && answerValue !== '' && answerValue !== 'no-effect') {
      answeredQuestions++;
      if (answerValue === 'oui') {
        totalPoints += 5;
      } else if (answerValue === 'medium') {
        totalPoints += 3;
      }
    }
  });

  const progressPercentage = (answeredQuestions / totalQuestions) * 100;
  let goodPercentage = (totalPoints / maxPoints) * 100;
  if (goodPercentage > 100) { goodPercentage = 100; }
  let badPercentage = progressPercentage - goodPercentage;
  if (badPercentage < 0) { badPercentage = 0; }

  /*console.log(
    `updateProgressBar [${questionTheme}]: answeredQuestions=${answeredQuestions}/${totalQuestions}, totalPoints=${totalPoints}, maxPoints=${maxPoints}`
  );
  console.log(
    `goodPercentage=${goodPercentage}%, progressPercentage=${progressPercentage}%, badPercentage=${badPercentage}%`
  );*/

  const progressBar = document.querySelector(
    `.opti-sim_theme-item[data-theme="${questionTheme}"] .opti-sim_progress-bar-wrapper`
  );
  if (!progressBar) {
    // console.warn("Aucun élément progressBar trouvé pour le thème:", questionTheme);
    return;
  }
  const goodBar = progressBar.querySelector('.opti-sim_progress-bar.is-good');
  const badBar = progressBar.querySelector('.opti-sim_progress-bar.is-bad');
  if (!goodBar || !badBar) {
    // console.warn("Les éléments goodBar ou badBar sont introuvables pour le thème:", questionTheme);
    return;
  }

  goodBar.style.width = `${goodPercentage}%`;
  badBar.style.width = `${badPercentage}%`;
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
    calculOrganisation(answerValue, questionId);
  }
  if (questionTheme === 'development') {
    // Pour "learning-methods", la fonction utilisera les valeurs stockées dans selectedAnswers
    calculDevelopment(answerValue, questionId);
  }
  if (questionTheme === 'wage') {
    calculWage(answerValue, questionId);
  }
  if (questionTheme === 'protection') {
    calculProtection(answerValue, questionId);
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


/*document.querySelectorAll('.opti-sim_answer-item').forEach(answer => {
  const parentQuestion = answer.closest('.opti-sim_question-container');
  const questionStep = parentQuestion?.dataset.step;
  const questionTheme = parentQuestion?.dataset.theme;

  // Exclure uniquement si c'est la question "learning-methods"
  const isLearningMethods = questionTheme === 'organisation' && questionStep === 'learning-methods';

  if (!isLearningMethods) {
    answer.addEventListener('click', handleAnswerClick);
  }
});*/

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

/*function changeQuestion(direction) {
  const activeStep = steps.find(step => !step.classList.contains('hide'));
  if (!activeStep) return;
  const currentIndex = getStepIndex(activeStep);
  const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
  if (nextIndex < 0 || nextIndex >= steps.length) return;
  const nextStepElement = steps[nextIndex];
  const questionTheme = nextStepElement.dataset.theme;
  const questionStep = nextStepElement.dataset.step || getStepIndex(nextStepElement) + 1;
  updateNextButtonState(questionTheme, questionStep);
  activeStep.classList.add('hide');
  nextStepElement.classList.remove('hide');
}*/

function changeQuestion(direction) {
  const activeStep = steps.find(step => !step.classList.contains('hide'));
  if (!activeStep) return;

  let currentIndex = getStepIndex(activeStep);
  let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

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

/*const learningMethodsQuestion = document.getElementById('learning-methods');
if (learningMethodsQuestion) {
  const checkboxes = learningMethodsQuestion.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const selected = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
      selectedAnswers['organisation-learning-methods'] = selected;

      calculOrganisation(null, 'learning-methods');
    });
  });
}*/

/*const learningMethodsQuestion = document.getElementById('learning-methods');

if (learningMethodsQuestion) {
  const checkboxes = learningMethodsQuestion.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const clickedItem = checkbox.closest('.opti-sim_answer-item');
      const clickedValue = clickedItem?.dataset.answer;

      if (!clickedValue) return;

      // Si on clique sur "non" → décocher tous les autres
      if (clickedValue === 'non' && checkbox.checked) {
        checkboxes.forEach(cb => {
          if (cb !== checkbox) {
            cb.checked = false;
            cb.closest('.opti-sim_answer-item')?.classList.remove('is-selected');
          }
        });
      }

      // Si on clique sur autre chose que "non" → décocher "non" si elle était sélectionnée
      if (clickedValue !== 'non' && checkbox.checked) {
        checkboxes.forEach(cb => {
          const item = cb.closest('.opti-sim_answer-item');
          if (item?.dataset.answer === 'non' && cb.checked) {
            cb.checked = false;
            item.classList.remove('is-selected');
          }
        });
      }

      // Mettre à jour les classes is-selected
      checkboxes.forEach(cb => {
        const item = cb.closest('.opti-sim_answer-item');
        if (item) {
          if (cb.checked) {
            item.classList.add('is-selected');
          } else {
            item.classList.remove('is-selected');
          }
        }
      });

      // Mettre à jour selectedAnswers
      const selectedValues = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.closest('.opti-sim_answer-item')?.dataset.answer)
        .filter(Boolean);

      selectedAnswers['organisation-learning-methods'] = selectedValues;

      // Recalculer
      calculOrganisation(null, 'learning-methods');

      // ➕ Mise à jour de l'état du bouton "suivant"
      updateNextButtonState('organisation', 'learning-methods');
    });
  });
}*/

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
        calculOrganisation(null, questionId);
      } else if (theme === 'development') {
        calculDevelopment(null, questionId);
      } else if (theme === 'wage') {
        calculWage(null, null);
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


/*const protectionPlanQuestion = document.getElementById('chosen-protection-plan');

if (protectionPlanQuestion) {
  const checkboxes = protectionPlanQuestion.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const items = Array.from(checkboxes);
      const selectedValues = items
        .filter(cb => cb.checked)
        .map(cb => cb.closest('.opti-sim_answer-item')?.dataset.answer)
        .filter(Boolean);

      // Ajouter les classes is-selected
      items.forEach(cb => {
        const item = cb.closest('.opti-sim_answer-item');
        if (item) {
          item.classList.toggle('is-selected', cb.checked);
        }
      });

      // Stocker les réponses
      selectedAnswers['development-chosen-protection-plan'] = selectedValues;

      // Recalculer
      calculDevelopment(null, 'chosen-protection-plan');

      // Activer le bouton "Suivant" si au moins une réponse
      updateNextButtonState('development', 'chosen-protection-plan');
    });
  });
}*/

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
        calculOrganisation(null, questionId);
      } else if (theme === 'development') {
        calculDevelopment(null, questionId);
      } else if (theme === 'wage') {
        calculWage(null, questionId);
      } else if (theme === 'protection') {
        calculProtection(null, questionId);
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
        'Une analyse approfondie de votre statut juridique vous permet d’optimiser votre fiscalité, votre protection sociale et votre accès au financement. Excellente stratégie !',
        'Bon début',
        'Cependant, une étude plus détaillée pourrait vous permettre d’optimiser davantage votre statut juridique en fonction de votre activité et de vos objectifs. N’hésitez pas à consulter un expert.',
        'Attention',
        'Il est essentiel de choisir son statut juridique en fonction d’une véritable stratégie pour maximiser ses avantages fiscaux et sociaux. Une analyse avec un professionnel pourrait vous aider à ajuster votre choix.'
      );
    } else if (questionId === 'change-status') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Excellente démarche',
        'Anticiper un changement de statut en fonction de l’évolution de votre activité est une approche stratégique qui vous permet de rester compétitif.',
        'Bonne réflexion',
        'Il pourrait être intéressant d’approfondir cette question avec un expert pour évaluer les bénéfices concrets d’un changement de statut.',
        'Songez-y',
        'Il peut être judicieux d’envisager un changement de statut en fonction de l’évolution de votre entreprise. Une analyse avec un professionnel vous permettrait d’identifier les opportunités d’optimisation.'
      );
    } else if (questionId === 'other-company-optimisation') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Félicitations',
        'Une structuration optimisée de votre activité vous permet de maximiser vos avantages fiscaux et d’améliorer la gestion de votre entreprise. Vous êtes sur la bonne voie !',
        'Bonne initiative',
        'Cependant, un audit de votre structuration pourrait vous permettre d’optimiser encore plus votre fiscalité et votre organisation. N’hésitez pas à approfondir cette réflexion.',
        'Attention',
        'Structurer son activité avec des montages adaptés (holding, SCI, etc.) peut être une excellente stratégie pour optimiser votre fiscalité et votre gestion. Pensez à explorer cette option avec un conseiller.'
      );
    } else if (questionId === 'organized-administrative-management') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Super',
        'Vous avez optimisé la gestion administrative en déléguant à un expert, ce qui vous permet de gagner du temps et de bénéficier de conseils stratégiques. Continuez ainsi !',
        'Bon début',
        'Un outil interne est une bonne solution, mais l’accompagnement d’un expert-comptable pourrait vous apporter encore plus d’optimisation et de sérénité.',
        'Attention',
        'Pensez à déléguer la gestion administrative à un expert-comptable ou à utiliser un outil adapté. Cela vous fera gagner un temps précieux et vous assurera d’être en conformité avec la réglementation.'
      );
    } else if (questionId === 'has-management-calendar') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Excellente organisation',
        'Avoir un calendrier bien défini et respecter les échéances est une clé essentielle pour une gestion sereine et efficace.',
        'Vous êtes sur la bonne voie',
        'Veillez à améliorer le suivi de votre calendrier pour éviter les retards et les imprévus. Des rappels automatisés pourraient vous aider.',
        'Attention',
        'Il est crucial d’instaurer un calendrier pour gérer vos échéances administratives. Cela vous évitera les oublis et les pénalités. Un outil numérique pourrait être une excellente solution !'
      );
    } else if (questionId === 'how-follow-payments') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        'Parfait',
        'Votre suivi automatisé garantit une gestion fluide de votre trésorerie et minimise les impayés. Continuez ainsi !',
        'Bon suivi',
        'Mais l’automatisation pourrait vous faire gagner du temps et sécuriser davantage vos paiements. Pensez à investir dans un outil adapté.',
        'Attention',
        'Un suivi structuré est essentiel pour éviter les impayés et les tensions de trésorerie. Pensez à mettre en place un processus clair ou à utiliser un outil dédié.'
      );
    } else if (questionId === 'has-optimized-billing-software') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        "Bravo",
        "Un logiciel de facturation automatisé est un atout majeur pour optimiser la gestion de votre activité et sécuriser votre trésorerie.",
        "C'est un bon début",
        "Ajouter l’automatisation des paiements et des relances vous permettrait d’optimiser encore plus votre gestion et de réduire les retards de paiement.",
        "Attention",
        "Un logiciel de facturation optimisé vous ferait gagner un temps précieux et limiterait les erreurs. Pensez à vous équiper d’un outil adapté à votre activité."
      );
    } else if (questionId === 'has-optimized-pro-account') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        "Excellent choix",
        "Une banque optimisée réduit vos frais et vous offre des services adaptés pour une gestion plus efficace de votre trésorerie.",
        "C'est un bon début",
        "Votre banque répond en partie à vos besoins, mais il pourrait être intéressant d’évaluer d’autres options pour optimiser vos coûts et services.",
        "Attention",
        "Une banque inadaptée peut engendrer des frais inutiles et limiter votre flexibilité. Pensez à comparer les offres pour trouver une solution mieux adaptée à votre activité."
      );
    } else if (questionId === 'is-up-to-date') {
      fillInfoTextAnswerCondition(
        answerValue,
        question,
        "Félicitations",
        "Être à jour est essentiel pour éviter les sanctions et assurer une gestion sereine de votre entreprise.",
        "C'est un bon début",
        "Vous êtes globalement à jour, mais veillez à anticiper encore mieux pour éviter les retards et les imprévus. Un suivi plus rigoureux pourrait être bénéfique.",
        "Attention",
        "Il est important de régulariser votre situation pour éviter des complications. Pensez à mettre en place un suivi administratif ou à vous faire accompagner par un expert"
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
  }

  // Calcul du score en pourcentage pour l'affichage textuel
  const resultOptimisationText = answeredQuestions > 0 ? (result / (answeredQuestions * 5)) * 100 : 0;
  document.getElementById('gestion-result').textContent = Math.round(resultOptimisationText);

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

function calculOrganisation(answerValue, questionContainerId) {
  const questions = steps.filter(step => step.dataset.theme === 'organisation');
  let result = 0;
  let answeredQuestions = 0;

  // Définitions des textes et titres pour la question "learning-methods"
  const learningMethodsTexts = {
    "tutoriels-videos": "Super ! Les tutoriels et vidéos sont un excellent moyen d’apprentissage pratique et accessible. Complétez avec d’autres ressources pour diversifier vos connaissances.",
    "blogs-articles": "Très bien ! Lire des articles spécialisés vous permet d’acquérir des connaissances régulièrement. Pensez à combiner avec d’autres supports pour approfondir.",
    "livres-specialises": "Excellent choix ! Les livres spécialisés offrent une expertise approfondie. Associez-les à des formations pratiques pour maximiser votre apprentissage.",
    "autre": "Bonne initiative ! Quelle que soit la méthode choisie, l’essentiel est de rester en veille et de continuer à apprendre.",
    "non": "Se former est essentiel pour progresser et s’adapter aux évolutions de votre secteur. Essayez d’intégrer un peu de formation dans votre emploi du temps !"
  };
  const learningMethodsTitles = {
    "tutoriels-videos": "Tutoriels et vidéos",
    "blogs-articles": "Blogs et articles",
    "livres-specialises": "Livres spécialisés",
    "autre": "Autre",
    "non": "Non, je ne me forme pas"
  };

  questions.forEach(question => {
    const questionKey = `organisation-${question.dataset.step}`;
    const questionId = question.id || `question-${question.dataset.step}`;
    question.id = questionId;

    // Gestion particulière pour la question "learning-methods"
    if (questionId === 'learning-methods') {
      // On suppose que pour cette question, selectedAnswers[questionKey] est un tableau de valeurs (checkboxes)
      let selectedValues = selectedAnswers[questionKey];
      if (!Array.isArray(selectedValues)) {
        selectedValues = [selectedValues];
      }
      let scoreForLearning = 0;
      let displayText = "";
      let title = "";
      
      // Si le tableau contient "non", alors le score est 0 et on affiche le texte associé à "non"
      if (selectedValues.includes('non')) {
        scoreForLearning = 0;
        displayText = learningMethodsTexts["non"];
        title = learningMethodsTitles["non"];
      } else {
        // Si une seule réponse est sélectionnée, c'est 3 points et on affiche le texte correspondant
        if (selectedValues.length === 1) {
          scoreForLearning = 3;
          const answer = selectedValues[0];
          displayText = learningMethodsTexts[answer] || "";
          title = learningMethodsTitles[answer] || "";
        }
        // Si deux réponses ou plus sont sélectionnées, c'est 5 points
        else if (selectedValues.length >= 2) {
          scoreForLearning = 5;
          const answer = selectedValues[0];
          displayText = learningMethodsTexts[answer] || "";
          title = learningMethodsTitles[answer] || "";
        }
      }
      result += scoreForLearning;
      answeredQuestions++;
      // Mise à jour de la zone d'info de la question "learning-methods"
      const infoTitle = question.querySelector('.opti-sim_info-title');
      const infoText = question.querySelector('.opti-sim_info-text');
      infoTitle.textContent = title;
      infoText.textContent = displayText
    } else {
      // Pour les autres questions à choix unique
      if (questionId === questionContainerId) {
        result = calculThreeAnswersOrganisation(answerValue, result);
        answeredQuestions++;

        // Gestion des textes d'information spécifiques pour certaines questions
        if (questionId === 'hours-worked') {
          fillInfoTextAnswerCondition(
            answerValue,
            question,
            'Félicitations',
            'Vous avez trouvé un bon équilibre entre productivité et bien-être. Cette gestion vous permet d’être performant sans risquer l’épuisement.',
            'Bon équilibre entre travail et vie personnelle',
            'Assurez-vous que ce rythme vous permet d’atteindre vos objectifs sans compromettre votre croissance.',
            'Attention',
            'Travailler intensément sur une courte période peut être nécessaire, mais veillez à ne pas tomber dans le surmenage. Une organisation plus optimisée pourrait vous aider à mieux répartir votre charge de travail.'
          );
        } else if (questionId === 'planned-weeks') {
          fillInfoTextAnswerCondition(
            answerValue,
            question,
            'Excellent',
            'Une planification détaillée vous permet d’optimiser votre temps et d’anticiper vos priorités efficacement. Continuez ainsi !',
            'Bon début',
            'Une planification plus précise vous aiderait à mieux prioriser vos tâches et à éviter les imprévus. Pensez à utiliser un outil de gestion du temps.',
            'Attention',
            'Gérer les tâches au jour le jour peut entraîner du stress et un manque de visibilité. Essayez de structurer votre semaine avec un planning clair pour gagner en efficacité.'
          );
        } else if (questionId === 'daily-routine-productivity') {
          fillInfoTextAnswerCondition(
            answerValue,
            question,
            'Bravo',
            'Avoir des rituels bien définis favorise la productivité et la concentration. Vous optimisez votre temps de manière efficace !',
            'Vous êtes sur la bonne voie',
            'Une routine plus régulière pourrait encore améliorer votre efficacité et votre gestion du temps.',
            'Attention',
            'Travailler sans structure peut être contre-productif. Mettre en place une routine avec des rituels précis vous aidera à mieux gérer votre énergie et vos priorités.'
          );
        } else if (questionId === 'client-acquisition-strategy') {
          fillInfoTextAnswerCondition(
            answerValue,
            question,
            'Super',
            'Une stratégie de prospection claire et suivie est essentielle pour assurer un développement commercial régulier et prévisible.',
            'Bon début',
            'Structurer vos actions et les rendre plus régulières vous permettrait d’optimiser encore plus vos résultats.',
            'Attention',
            'Une prospection aléatoire peut nuire à votre croissance. Mettre en place un plan structuré avec des actions précises vous aidera à trouver des clients plus efficacement.'
          );
        } else if (questionId === 'weekly-admin-time') {
          fillInfoTextAnswerCondition(
            answerValue,
            question,
            'Très bien',
            'Consacrer un temps dédié à l’administratif vous permet d’être rigoureux et d’éviter l’accumulation des tâches.',
            'Bonne initiative',
            'Mais optimiser davantage votre organisation pourrait vous faire gagner du temps et réduire la charge mentale.',
            'Attention',
            'Gérer l’administratif au jour le jour peut entraîner des oublis et du stress. Bloquez un créneau régulier pour ces tâches afin d’être plus efficace.'
          );
        } else if (questionId === 'burnout-prevention-breaks') {
          fillInfoTextAnswerCondition(
            answerValue,
            question,
            'Bravo',
            'Prendre des pauses régulières est essentiel pour maintenir votre énergie et éviter le burn-out.',
            'Bonne initiative',
            'Vous prenez du repos, mais il pourrait être bénéfique d’assurer une vraie régularité pour un meilleur équilibre.',
            'Attention',
            'Ne pas prendre de pauses peut nuire à votre santé et à votre productivité sur le long terme. Planifiez du repos pour recharger vos batteries.'
          );
        } else if (questionId === 'work-schedule-balance') {
          fillInfoTextAnswerCondition(
            answerValue,
            question,
            'Parfait',
            'Des horaires fixes et adaptés permettent d’être plus productif tout en maintenant un bon équilibre de vie.',
            'Vous avez une certaine organisation',
            'Mais la stabilité de vos horaires pourrait encore améliorer votre efficacité.',
            'Attention',
            'Travailler sans cadre défini peut nuire à votre productivité et à votre bien-être. Fixer des plages horaires adaptées vous aidera à mieux structurer vos journées.'
          );
        } else if (questionId === 'task-delegation') {
          fillInfoTextAnswerCondition(
            answerValue,
            question,
            'Très bonne approche',
            'Déléguer ce qui n’est pas votre cœur de métier vous permet de vous concentrer sur l’essentiel et d’optimiser votre temps.',
            'Bon début',
            'Déléguer plus systématiquement certaines tâches pourrait encore améliorer votre productivité et alléger votre charge de travail.',
            'Attention',
            'Tout gérer seul peut vite devenir une surcharge. Déléguer certaines tâches (comptabilité, communication, etc.) vous permettrait de vous concentrer sur votre véritable valeur ajoutée.'
          );
        } else if (questionId === 'monthly-learning-time') {
          fillInfoTextAnswerCondition(
            answerValue,
            question,
            'Bravo',
            'Investir du temps dans votre formation vous permet de rester compétitif et d’évoluer constamment. Continuez ainsi !',
            'Bon investissement',
            'Augmenter légèrement votre temps de formation pourrait vous permettre d’acquérir encore plus de compétences stratégiques.',
            'Attention',
            'Se former régulièrement est essentiel pour rester à jour et développer son activité. Essayez d’y consacrer un peu plus de temps chaque mois !'
          );
        } else if (questionId === 'learning-methods') {
          // Ici, on peut réafficher l'info si nécessaire
          fillInfoTextAnswerCondition(
            answerValue,
            question,
            'Bravo',
            'Investir du temps dans votre formation vous permet de rester compétitif et d’évoluer constamment. Continuez ainsi !',
            'Bon investissement',
            'Augmenter légèrement votre temps de formation pourrait vous permettre d’acquérir encore plus de compétences stratégiques.',
            'Attention',
            'Se former régulièrement est essentiel pour rester à jour et développer son activité. Essayez d’y consacrer un peu plus de temps chaque mois !'
          );
        }
      } else if (selectedAnswers[questionKey]) {
        const prevAnswer = selectedAnswers[questionKey];
        result = calculThreeAnswersOrganisation(prevAnswer, result);
        answeredQuestions++;
      }
    }
  });

  const resultOptimisation = answeredQuestions > 0 ? (result / (answeredQuestions * 5)) * 100 : 0;
  document.getElementById('organisation-result').textContent = Math.round(resultOptimisation);
  updateProgressBar('organisation');
}

function calculDevelopment(answerValue, questionContainerId) {
  const questions = steps.filter(step => step.dataset.theme === 'development');
  let result = 0;
  let answeredQuestions = 0;

  questions.forEach(question => {
    /*const questionKey = `development-${question.dataset.step}`;
    const questionId = question.id || `question-${question.dataset.step}`;
    question.id = questionId;*/

    const questionId = question.id || `question-${question.dataset.step}`;
    question.id = questionId;

    let questionKey = `development-${question.dataset.step}`;
    if (questionId === 'chosen-protection-plan') {
      questionKey = 'development-chosen-protection-plan'; // clé exacte utilisée dans selectedAnswers
    } else if (questionId === 'retirement-contribution-type') {
      questionKey = 'development-retirement-contribution-type';
    } else if (questionId === 'ai-task-usage') {
      questionKey = 'development-ai-task-usage';
    }

    if (questionId === questionContainerId) {
      result = calculThreeAnswersOrganisation(answerValue, result);
      answeredQuestions++;

      // Gestion des textes d'information spécifiques pour certaines questions
      if (questionId === 'unique-value-proposition') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Bravo',
          'Une proposition de valeur bien définie vous permet de vous démarquer sur votre marché et d’attirer les bons clients. Continuez à l’affiner et à la mettre en avant !',
          'Bon début',
          'Il serait intéressant d’affiner encore votre positionnement pour le rendre plus percutant et différenciant. Un travail sur votre message et votre communication peut vous aider.',
          'Attention',
          'Avoir une proposition de valeur claire est essentiel pour convaincre vos clients et vous différencier. Prenez le temps de définir ce qui vous rend unique et mettez-le en avant !'
        );
      } else if (questionId === 'networking-events-participation') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Excellente démarche',
          'Participer régulièrement à des événements stratégiques vous permet de développer votre réseau et d’accéder à de nouvelles opportunités.',
          "C'est un bon début",
          'Structurer davantage votre participation en choisissant les bons événements et en établissant des objectifs clairs pourrait améliorer votre impact.',
          'Attention',
          'Les événements professionnels sont un excellent moyen de rencontrer des partenaires et des clients potentiels. Essayez d’en intégrer quelques-uns à votre agenda pour élargir votre réseau !'
        );
      } else if (questionId === 'online-visibility-channels') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Parfait',
          'Une présence régulière et stratégique sur LinkedIn et d’autres canaux renforce votre crédibilité et attire de nouveaux clients. Continuez ainsi !',
          'Bon début',
          'Structurer votre approche avec un plan de contenu et une régularité accrue pourrait améliorer encore votre visibilité.',
          'Attention',
          'LinkedIn et d’autres plateformes sont d’excellents leviers pour trouver des clients et asseoir votre expertise. Pensez à y consacrer du temps pour développer votre activité.'
        );
      } else if (questionId === 'client-conversion-system') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Félicitations',
          'Une stratégie bien pensée et suivie est un levier puissant pour développer votre activité de manière prévisible et efficace.',
          'Bon début',
          'L’optimisation de vos actions marketing et une analyse plus poussée de leurs performances pourraient améliorer vos résultats.',
          'Attention',
          'Un système d’acquisition client structuré est essentiel pour assurer une croissance stable. Pensez à mettre en place des actions claires (SEO, publicité, inbound marketing) pour attirer plus de prospects.'
        );
      } else if (questionId === 'mentorship-or-peer-support') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Super',
          'Être entouré d’un mentor ou d’un groupe de pairs vous permet de prendre du recul, d’accélérer votre développement et d’éviter les erreurs courantes.',
          "C'est un bon début",
          'Un accompagnement plus régulier et approfondi pourrait encore renforcer votre croissance et votre stratégie.',
          'Attention',
          'Un mentor ou un réseau d’entrepreneurs peut vous apporter des conseils précieux et vous aider à surmonter vos défis plus rapidement. Pensez à rejoindre un groupe ou à solliciter un accompagnement.'
        );
      } else if (questionId === 'competitor-analysis') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bien',
          'Une veille concurrentielle régulière vous permet d’ajuster votre stratégie et de rester compétitif. Continuez à surveiller les tendances du marché.',
          "C'est un bon début",
          'Une analyse plus approfondie et régulière pourrait vous donner un avantage encore plus fort sur vos concurrents.',
          'Attention',
          'Connaître ses concurrents est essentiel pour se positionner et se différencier. Essayez de mettre en place une veille simple pour identifier leurs forces et faiblesses.'
        );
      } else if (questionId === 'offer-or-model-innovation') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Excellent',
          'Innover régulièrement vous permet de rester compétitif et de répondre aux nouvelles attentes de vos clients. Continuez à tester et à vous adapter !',
          'Bon début',
          'Rendre l’innovation plus systématique et fréquente pourrait vous aider à capter de nouvelles opportunités sur votre marché.',
          'Attention',
          'L’innovation est clé pour se démarquer et anticiper les évolutions du marché. Pensez à analyser les tendances et à tester de nouvelles approches pour dynamiser votre activité.'
        );
      } else if (questionId === 'business-diversification-plan') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bonne stratégie',
          'Anticiper et structurer la diversification permet d’assurer la pérennité et la croissance de votre activité. Continuez à explorer de nouvelles opportunités !',
          'Bon début',
          'Structurer davantage votre approche avec des actions concrètes pourrait vous permettre d’accélérer votre diversification et de minimiser les risques.',
          'Attention',
          'Diversifier son activité permet de réduire les risques et d’explorer de nouveaux marchés. Il peut être intéressant d’y réfléchir et d’élaborer un plan à moyen terme.'
        );
      } else if (questionId === 'mileage-allowance-usage') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Bravo',
          'En utilisant les indemnités kilométriques, vous optimisez vos frais de déplacement tout en bénéficiant d’un avantage fiscal intéressant. Continuez ainsi !',
          'Bon choix',
          'Utiliser un véhicule professionnel est une bonne alternative, mais pensez à bien optimiser vos frais en fonction de votre situation.',
          'Bon à savoir',
          'Vous pourriez récupérer une somme intéressante en demandant vos indemnités kilométriques. Pensez à les inclure dans votre gestion pour réduire vos charges !'
        );
      } else if (questionId === 'holiday-voucher-setup') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bien',
          'Vous maximisez les avantages fiscaux tout en profitant d’un complément pour vos vacances. Continuez à en tirer pleinement profit !',
          'Bon début',
          'Vous utilisez les chèques vacances, mais vous pourriez optimiser davantage en atteignant le plafond maximal de 540,54 € en 2025.',
          'Bon à savoir',
          'Les chèques vacances permettent de réduire vos charges tout en bénéficiant d’un avantage fiscal. Pensez à les mettre en place pour vous ou vos salariés !'
        );
      } else if (questionId === 'cesu-tax-benefits') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Félicitations',
          'Vous exploitez pleinement les CESU pour bénéficier d’une réduction fiscale optimale. Une excellente stratégie d’optimisation !',
          'Bon début',
          'Vous pourriez encore maximiser vos économies en utilisant le montant plafond de 2 540 €',
          'Bon à savoir',
          'Les CESU permettent d’alléger votre fiscalité tout en bénéficiant de services à domicile. Pourquoi ne pas en profiter pour optimiser vos charges ?'
        );
      } else if (questionId === 'expense-tracking-setup') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Parfait',
          'Un suivi rigoureux des notes de frais garantit une gestion optimale et des économies substantielles. Continuez ainsi !',
          'Vous êtes sur la bonne voie',
          'Mais un suivi encore plus précis pourrait vous faire gagner du temps et éviter des pertes financières.',
          'Bon à savoir',
          'Une gestion efficace des notes de frais est essentielle pour éviter les erreurs et optimiser votre fiscalité. Pensez à structurer un suivi régulier !'
        );
      } else if (questionId === 'expense-optimization-strategies') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Excellent',
          'Vous exploitez tous les leviers possibles pour optimiser vos charges et réduire vos coûts. Une gestion exemplaire !',
          'Vous avez déjà pris de bonnes initiatives',
          'Mais il existe encore des opportunités pour aller plus loin dans l’optimisation. Un audit régulier de vos charges peut être bénéfique.',
          'Bon à savoir',
          'L’optimisation des charges permet de réduire les coûts et d’améliorer la rentabilité. Pourquoi ne pas explorer les exonérations et autres dispositifs fiscaux disponibles ?'
        );
      } else if (questionId === 'project-tools-automation') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Félicitations',
          'Votre gestion optimisée avec des outils comme Notion, Trello ou Zapier vous permet d’automatiser et d’améliorer votre productivité. Continuez ainsi !',
          'Vous utilisez déjà des outils, c’est un bon début',
          'Mais une meilleure intégration et automatisation pourraient encore améliorer votre efficacité.',
          'Bon à savoir',
          'Les outils de gestion et d’automatisation peuvent vous faire gagner du temps et réduire votre charge mentale. Pourquoi ne pas tester Notion, Trello ou Zapier ?'
        );
      } else if (questionId === 'optimized-work-routine') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Bravo',
          'Une routine bien établie permet d’améliorer votre concentration et votre efficacité au quotidien.',
          'Bon début',
          'Vous avez une routine, mais gagner en discipline pourrait maximiser votre productivité. Pourquoi ne pas essayer de la structurer davantage ?',
          'Bon à savoir',
          'Une routine efficace vous aidera à rester productif et à mieux gérer votre énergie. Pensez à en mettre une en place progressivement !'
        );
      } else if (questionId === 'time-management-techniques') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Excellent',
          'Les techniques comme Pomodoro ou le Time-Blocking vous aident à rester efficace et à mieux structurer votre temps. Continuez ainsi !',
          'Bon début',
          'Vous appliquez ces techniques, mais pas de manière systématique. Une meilleure régularité pourrait encore améliorer votre organisation.',
          'Bon à savoir',
          'Gérer son temps efficacement est clé pour être productif. Pourquoi ne pas tester la méthode Pomodoro ou le Time-Blocking pour mieux structurer votre travail ?'
        );
      } else if (questionId === 'goal-tracking-strategy') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bien',
          'Avoir un système de suivi précis permet de garder le cap et d’atteindre plus facilement vos objectifs.',
          'Bon début',
          'Vous suivez vos objectifs, mais un meilleur suivi pourrait vous aider à prioriser plus efficacement vos tâches.',
          'Bon à savoir',
          'Suivre ses objectifs permet de rester motivé et productif. Pourquoi ne pas essayer un outil comme Notion ou ClickUp pour structurer vos progrès ?'
        );
      } else if (questionId === 'decision-making-method') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Parfait',
          'Une prise de décision rapide et méthodique permet d’éviter les pertes de temps et d’optimiser votre efficacité.',
          'Bon début',
          'Vous prenez des décisions, mais parfois avec hésitation. Travailler sur une méthode plus claire vous aidera à gagner en rapidité.',
          'Bon à savoir',
          'Une bonne méthodologie de décision permet d’éviter l’indécision et de gagner en efficacité. Pourquoi ne pas tester la matrice d’Eisenhower ou la règle des 2 minutes ?'
        );
      } else if (questionId === 'email-automation-tools') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bien',
          'L’automatisation des emails avec des outils comme Sanebox ou Clean Email vous fait gagner du temps et améliore votre gestion.',
          '',
          '',
          'Bon à savoir',
          'Gérer manuellement tous ses emails peut être chronophage. Des outils d’automatisation peuvent vous aider à trier et organiser vos messages plus efficacement.'
        );
      } else if (questionId === 'task-planning-tools') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Excellent',
          'Utiliser des outils comme Trello ou Asana permet une gestion plus efficace de vos tâches et de vos priorités.',
          '',
          '',
          'Bon à savoir',
          'Planifier ses tâches avec des outils numériques facilite l’organisation et la productivité. Pourquoi ne pas essayer Trello ou Notion ?'
        );
      } else if (questionId === 'reminder-deadline-tools') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Parfait',
          'Google Calendar ou Outlook sont d’excellents outils pour ne jamais oublier une échéance et rester organisé.',
          '',
          '',
          'Bon à savoir',
          'Suivre ses rappels et échéances manuellement peut être compliqué. Pourquoi ne pas automatiser cela avec un calendrier numérique ?'
        );
      } else if (questionId === 'ai-use-professional') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Félicitations',
          'L’IA vous permet d’optimiser votre travail, d’automatiser certaines tâches et d’améliorer votre productivité.',
          'Bon début',
          'Vous utilisez déjà l’IA, mais pas de manière systématique. Explorer davantage ses possibilités pourrait vous apporter encore plus d’avantages.',
          'Bon à savoir',
          'L’IA peut être un excellent levier d’optimisation. Pourquoi ne pas tester des outils comme ChatGPT, DALL·E ou des IA de gestion automatisée ?'
        );
      }
    }
    // Pour les autres questions (celles qui ne correspondent pas à la question en cours)
    
    if (questionId === 'chosen-protection-plan' || questionId === 'retirement-contribution-type' || questionId === 'ai-task-usage') {
      let selected = selectedAnswers[questionKey] || [];
      if (!Array.isArray(selected)) selected = [selected];
      const pointCount = selected.length;
      result += pointCount;
      answeredQuestions++;
    }
    
    if (selectedAnswers[questionKey] && !['chosen-protection-plan', 'retirement-contribution-type', 'ai-task-usage'].includes(questionId)) {
      const prevAnswer = selectedAnswers[questionKey];
      result = calculThreeAnswersOrganisation(prevAnswer, result);
      answeredQuestions++;
    }
  });

  const resultOptimisation = answeredQuestions > 0 ? (result / (answeredQuestions * 5)) * 100 : 0;
  document.getElementById('development-result').textContent = Math.round(resultOptimisation);
  updateProgressBar('development');
}

function calculWage(answerValue, questionContainerId) {
  const questions = steps.filter(step => step.dataset.theme === 'wage');
  let result = 0;
  let answeredQuestions = 0;
  let maxPossibleScore = 0;


  questions.forEach(question => {
    // const questionKey = `wage-${question.dataset.step}`;
    // const questionId = question.id || `question-${question.dataset.step}`;
    // question.id = questionId;

    let questionKey = `wage-${question.dataset.step}`;
    const questionId = question.id || `question-${question.dataset.step}`;
    question.id = questionId;

    if (questionId === 'eligible-benefit-cases') {
      questionKey = 'wage-eligible-benefit-cases';
    } else if (questionId === 'investment-cashflow-tax-optimization') {
      questionKey = 'wage-investment-cashflow-tax-optimization';
    } else if (questionId === 'benefits-in-kind-tax-reduction') {
      questionKey = 'wage-benefits-in-kind-tax-reduction';
    }

    if (questionId === 'eligible-benefit-cases') {
      /*let selectedValues = selectedAnswers[questionKey];
      console.log(selectedValues);
      if (!Array.isArray(selectedValues)) selectedValues = [selectedValues];
      console.log(selectedValues.length);*/

      let selectedRaw = selectedAnswers[questionKey];
      let selectedValues = Array.isArray(selectedRaw) ? selectedRaw : typeof selectedRaw === 'string' ? [selectedRaw] : [];
      console.log(selectedValues);
      console.log(selectedValues.length);
    
      let score = 0;
      let title = '';
      let displayText = '';
    
      if (selectedValues.includes('non')) {
        score = 0;
        title = 'Bon à savoir';
        displayText = 'Il existe plusieurs dispositifs d’allégements fiscaux selon votre activité et votre localisation. Une analyse approfondie pourrait vous permettre de réduire votre fiscalité';
      } else if (selectedValues.length === 1) {
        score = 1;
        title = 'Bon début';
        displayText = 'Vous bénéficiez d’un dispositif fiscal, ce qui est un bon début. Avez-vous exploré d’autres possibilités d’exonérations auxquelles vous pourriez avoir droit ?';
      } else if (selectedValues.length >= 2) {
        score = 2;
        title = 'Très bien';
        displayText = 'Vous profitez de plusieurs dispositifs fiscaux, ce qui vous permet de réduire vos charges et d’optimiser votre fiscalité. Continuez ainsi !';
      }
    
      result += score;
      answeredQuestions++;
      maxPossibleScore += 2;
    
      const infoTitle = question.querySelector('.opti-sim_info-title');
      const infoText = question.querySelector('.opti-sim_info-text');
      if (infoTitle) infoTitle.textContent = title;
      if (infoText) infoText.textContent = displayText;
    } else if (questionId === 'benefits-in-kind-tax-reduction') {
      /*let selectedValues = selectedAnswers[questionKey];
      console.log(selectedValues);
      if (!Array.isArray(selectedValues)) selectedValues = [selectedValues];
      console.log(selectedValues.length);*/

      let selectedRaw = selectedAnswers[questionKey];
      let selectedValues = Array.isArray(selectedRaw) ? selectedRaw : typeof selectedRaw === 'string' ? [selectedRaw] : [];
      console.log(selectedValues);
      console.log(selectedValues.length);
    
      let score = 0;
      let title = '';
      let displayText = '';
    
      if (selectedValues.includes('non')) {
        score = 0;
        title = 'Bon à savoir';
        displayText = 'Vous ne bénéficiez pas d’avantages en nature. Certains dispositifs (véhicule de fonction, matériel, repas professionnels) peuvent alléger vos charges fiscales.';
      } else if (selectedValues.length >= 1 && selectedValues.length <= 3) {
        score = 3;
        title = 'Bon début';
        displayText = 'Vous utilisez quelques avantages en nature. Il serait intéressant d’examiner s’il y a d’autres opportunités d’optimisation adaptées à votre situation.';
      } else if (selectedValues.length > 3) {
        score = 5;
        title = 'Excellent';
        displayText = 'Vous profitez de plusieurs avantages en nature, ce qui optimise votre fiscalité tout en réduisant vos charges personnelles.';
      }
    
      result += score;
      answeredQuestions++;
      maxPossibleScore += 5;
    
      const infoTitle = question.querySelector('.opti-sim_info-title');
      const infoText = question.querySelector('.opti-sim_info-text');
      if (infoTitle) infoTitle.textContent = title;
      if (infoText) infoText.textContent = displayText;
    } else if (questionId === 'investment-cashflow-tax-optimization') {
      let selected = selectedAnswers[questionKey] || [];
      if (!Array.isArray(selected)) selected = [selected];
      const pointCount = selected.length;
      result += pointCount;
      answeredQuestions++;

      maxPossibleScore += 4;
    } else if (questionId === questionContainerId) {
      result = calculThreeAnswersOrganisation(answerValue, result);
      console.log(answerValue, result);
      answeredQuestions++;
      maxPossibleScore += 5;

      // Gestion des textes d'information spécifiques pour certaines questions
      if (questionId === 'per-subscription-tax-saving') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Bravo',
          'En versant le montant maximal chaque année, vous optimisez votre épargne retraite tout en réduisant votre imposition. Continuez ainsi !',
          'Bon début',
          'Vous avez déjà un PER, ce qui est une bonne démarche. Cependant, des versements plus réguliers pourraient améliorer votre optimisation fiscale et votre capital pour la retraite.',
          'Bon à savoir',
          'Un PER est un excellent moyen d’épargner tout en réduisant vos impôts. Pourquoi ne pas en ouvrir un et commencer par des versements progressifs ?'
        );
      } else if (questionId === 'training-tax-credit') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Félicitations',
          'En utilisant pleinement le crédit d’impôt formation, vous investissez dans votre montée en compétences tout en réduisant vos impôts.',
          "Bon début",
          'Vous utilisez ce crédit, mais il pourrait être optimisé davantage. Vérifiez si certaines formations supplémentaires pourraient être éligibles !',
          'Bon à savoir',
          'Le crédit d’impôt formation est une opportunité précieuse pour financer votre montée en compétences. Pensez à vous renseigner sur les formations éligibles à ce dispositif.'
        );
      } else if (questionId === 'energy-transition-tax-credit') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Excellent choix',
          'En optimisant ce crédit d’impôt, vous réduisez vos dépenses énergétiques tout en bénéficiant d’un allègement fiscal.',
          'Bon début',
          'Vous avez déjà utilisé ce crédit, mais il pourrait être maximisé. Avez-vous exploré toutes les options possibles pour vos travaux de rénovation énergétique ?',
          'Bon à savoir',
          'Ce crédit permet d’alléger vos dépenses pour des travaux de rénovation énergétique. Pourquoi ne pas étudier les dispositifs disponibles pour en bénéficier ?'
        );
      } else if (questionId === 'tax-deferral-mechanism') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bonne stratégie',
          'Différer vos revenus vous permet d’optimiser votre fiscalité et de lisser votre imposition sur plusieurs années.',
          'Bon début',
          'Vous utilisez certains mécanismes, mais une stratégie plus poussée pourrait encore améliorer votre fiscalité. Pensez à consulter un expert pour affiner votre approche !',
          'Bon à savoir',
          'L’étalement et le report d’imposition sont des leviers puissants pour optimiser vos charges fiscales. Pourquoi ne pas en discuter avec un expert-comptable ?'
        );
      } else if (questionId === 'annual-tax-review-expert') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Bravo',
          'Un suivi précis de votre fiscalité chaque année permet de maximiser vos déductions et d’optimiser votre gestion financière.',
          'Bon début',
          'Vous consultez un expert, mais pas systématiquement. Une approche plus régulière pourrait encore améliorer votre situation fiscale.',
          'Bon à savoir',
          'Un bilan fiscal annuel avec un expert permet d’éviter les erreurs et de maximiser vos déductions. Pourquoi ne pas en planifier un prochainement ?'
        );
      } else if (questionId === 'vat-recovery-optimization') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Félicitations',
          'Vous récupérez toute la TVA éligible, ce qui optimise la gestion de vos finances et réduit vos coûts.',
          'Bon début',
          'Vous récupérez la TVA, mais il pourrait y avoir des opportunités non exploitées. Un audit de vos déclarations pourrait vous aider à maximiser cette récupération.',
          'Bon à savoir',
          'La récupération de la TVA est un levier clé pour réduire vos charges. Il serait intéressant d’analyser si vous pouvez récupérer davantage de TVA sur vos achats.'
        );
      } else if (questionId === 'current-income-perception') {
        fillInfoFiveTextAnswerCondition(
          answerValue,
          question,
          'Très bon choix',
          'En privilégiant les dividendes avec un faible salaire, vous réduisez vos charges sociales et optimisez votre imposition.',
          'Bien optimisé',
          'Votre mix salaire/dividendes est optimisé, ce qui vous permet de bénéficier d’une fiscalité plus avantageuse. Continuez ainsi !',
          'Bon début',
          'Vous percevez uniquement un salaire, ce qui simplifie votre gestion, mais pourrait être optimisé en intégrant une part de dividendes.',
          'Bon à savoir',
          'En micro-entreprise, vos bénéfices sont imposés directement. Pensez à étudier d’autres statuts si vous souhaitez optimiser votre imposition.',
          'Attention',
          'Vous n’avez pas encore optimisé votre mode de rémunération. Une analyse avec un expert-comptable pourrait vous aider à réduire vos charges fiscales.'
        );
      } else if (questionId === 'home-office-rent-tax-optimization') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bien',
          'Déclarer un loyer avec une convention de location est une excellente manière de réduire votre base imposable tout en restant conforme à la législation.',
          'Bon début',
          'Vous avez mis en place un loyer, mais sans convention de location. Formaliser cela avec un document officiel pourrait sécuriser cette déduction fiscale.',
          'Bon à savoir',
          'Vous n’exploitez pas cette possibilité. Un loyer au domicile du dirigeant peut être un bon levier d’optimisation fiscale si bien déclaré.'
        );
      } else if (questionId === 'remuneration-split-optimization') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Félicitations',
          'Vous avez optimisé la répartition de vos revenus avec une approche détaillée, ce qui réduit efficacement vos charges sociales et impôts.',
          'Bon début',
          'Vous avez commencé à optimiser votre rémunération, mais une analyse plus approfondie pourrait encore améliorer votre fiscalité.',
          'Bon à savoir',
          'Votre rémunération n’est pas optimisée. Un mix entre salaires, dividendes et autres compensations pourrait être plus avantageux.'
        );
      } else if (questionId === 'holding-structure-income-optimization') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bonne stratégie',
          'Une holding vous permet d’optimiser la distribution de vos revenus et de structurer votre patrimoine professionnel.',
          'Bon début',
          'Vous y réfléchissez, ce qui est une bonne démarche. Si votre chiffre d’affaires est élevé, cela peut être un levier intéressant à mettre en place.',
          'Bon à savoir',
          'Une holding n’est pas toujours nécessaire, mais si votre entreprise génère un chiffre d’affaires important, cela peut être une option intéressante à étudier.'
        );
      } else if (questionId === 'dividends-income-tax-option') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bien',
          'En optant pour l’imposition sur le revenu avec l’abattement de 40 %, vous réduisez efficacement votre fiscalité sur les dividendes.',
          'Bon début',
          'Vous avez choisi cette option, mais une analyse approfondie pourrait vous permettre d’optimiser davantage votre imposition.',
          'Bon à savoir',
          'Vous avez préféré le PFU à 30 %, ce qui est plus simple mais parfois moins avantageux que l’imposition sur le revenu avec abattement.'
        );
      } else if (questionId === 'cca-cash-injection') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bien',
          'Vous utilisez le compte courant d’associé pour financer votre société, ce qui est une bonne pratique pour la gestion de trésorerie.',
          '',
          '',
          'Bon à savoir',
          'Vous n’injectez pas d’argent dans le CCA. Cette option peut être un levier intéressant pour optimiser la trésorerie et la fiscalité de votre entreprise.'
        );
      }
    }
    // Pour les autres questions (celles qui ne correspondent pas à la question en cours)
    /*else if (selectedAnswers[questionKey]) {
      const prevAnswer = selectedAnswers[questionKey];
      result = calculThreeAnswersOrganisation(prevAnswer, result);
      answeredQuestions++;
    }*/

    if (selectedAnswers[questionKey] && !['eligible-benefit-cases', 'investment-cashflow-tax-optimization', 'benefits-in-kind-tax-reduction'].includes(questionId)) {
      const prevAnswer = selectedAnswers[questionKey];
      result = calculThreeAnswersOrganisation(prevAnswer, result);
      answeredQuestions++;
      maxPossibleScore += 5;
    }
  });

  // const resultOptimisation = answeredQuestions > 0 ? (result / (answeredQuestions * 5)) * 100 : 0;
  const resultOptimisation = (result / maxPossibleScore) * 100;
  document.getElementById('wage-result').textContent = Math.round(resultOptimisation);
  updateProgressBar('wage');
}

function calculProtection(answerValue, questionContainerId) {
  const questions = steps.filter(step => step.dataset.theme === 'protection');
  let result = 0;
  let answeredQuestions = 0;
  let maxPossibleScore = 0;

  questions.forEach(question => {
    /*const questionKey = `protection-${question.dataset.step}`;
    const questionId = question.id || `question-${question.dataset.step}`;
    question.id = questionId;*/

    let questionKey = `wage-${question.dataset.step}`;
    const questionId = question.id || `question-${question.dataset.step}`;
    question.id = questionId;

    if (questionId === 'treasury-investment-supports') {
      questionKey = 'protection-treasury-investment-supports';
    } else if (questionId === 'subscribed-insurances-list') {
      questionKey = 'protection-subscribed-insurances-list';
    }

    if (questionId === 'treasury-investment-supports') {
      let selectedRaw = selectedAnswers[questionKey];
      let selectedValues = Array.isArray(selectedRaw) ? selectedRaw : typeof selectedRaw === 'string' ? [selectedRaw] : [];
      console.log(selectedValues);
      console.log(selectedValues.length);
    
      let score = 0;
      let title = '';
      let displayText = '';
    
      if (selectedValues.length === 0) {
        score = 0;
        title = 'Bon à savoir';
        displayText = 'Vous n’avez pas encore placé votre trésorerie. Il existe plusieurs solutions (assurance vie, SCPI, obligations, etc.) qui permettent d’allier rendement et optimisation fiscale.';
      } else if (selectedValues.length >= 1 && selectedValues.length <= 2) {
        score = 3;
        title = 'Bon début';
        displayText = 'Vous avez placé votre trésorerie sur 1 à 2 supports. Une diversification plus large pourrait améliorer la gestion de vos liquidités.';
      } else if (selectedValues.length > 2) {
        score = 5;
        title = 'Excellente diversification';
        displayText = 'Vous exploitez plusieurs supports pour placer votre trésorerie, ce qui vous permet d’optimiser vos rendements et votre fiscalité.';
      }
    
      result += score;
      answeredQuestions++;
      maxPossibleScore += 5;
    
      const infoTitle = question.querySelector('.opti-sim_info-title');
      const infoText = question.querySelector('.opti-sim_info-text');
      if (infoTitle) infoTitle.textContent = title;
      if (infoText) infoText.textContent = displayText;
    } else if (questionId === 'subscribed-insurances-list') {
      let selectedRaw = selectedAnswers[questionKey];
      let selectedValues = Array.isArray(selectedRaw) ? selectedRaw : typeof selectedRaw === 'string' ? [selectedRaw] : [];
      console.log(selectedValues);
      console.log(selectedValues.length);
    
      let score = 0;
      let title = '';
      let displayText = '';
    
      if (selectedValues.length === 0) {
        score = 0;
        title = 'Bon à savoir';
        displayText = 'Vous n’avez souscrit aucune assurance professionnelle. Cela représente un risque en cas de litige, de sinistre ou de problème juridique.';
      } else if (selectedValues.length >= 1 && selectedValues.length <= 2) {
        score = 3;
        title = 'Bon début';
        displayText = 'Vous avez souscrit entre 1 et 2 assurances. Une couverture plus large pourrait être envisagée selon votre secteur d’activité.';
      } else if (selectedValues.length > 2) {
        score = 5;
        title = 'Très bien';
        displayText = 'Vous avez souscrit plus de 2 assurances professionnelles, ce qui vous protège efficacement contre divers risques liés à votre activité.';
      }
    
      result += score;
      answeredQuestions++;
      maxPossibleScore += 5;
    
      const infoTitle = question.querySelector('.opti-sim_info-title');
      const infoText = question.querySelector('.opti-sim_info-text');
      if (infoTitle) infoTitle.textContent = title;
      if (infoText) infoText.textContent = displayText;
    } else if (questionId === questionContainerId) {
      result = calculThreeAnswersOrganisation(answerValue, result);
      console.log(answerValue, result);
      answeredQuestions++;

      // Gestion des textes d'information spécifiques pour certaines questions
      if (questionId === 'holding-investment-tax-optimization') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bien',
          'Votre holding est bien optimisée et active, ce qui vous permet de maximiser votre fiscalité et votre gestion patrimoniale.',
          'Bon début',
          'Votre holding est en place mais encore sous-exploitée. Il pourrait être intéressant d’approfondir son utilisation pour optimiser davantage votre fiscalité.',
          'Bon à savoir',
          'Vous n’avez pas encore structuré vos investissements avec une holding. Si votre chiffre d’affaires est élevé, cela peut être une solution à considérer.'
        );
      } else if (questionId === 'startup-sme-private-equity-investment') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bien',
          'Investir dans des startups ou des PME vous permet de diversifier votre patrimoine tout en bénéficiant de réductions fiscales attractives.',
          'Bon début',
          'Vous envisagez ces investissements mais ne les avez pas encore mis en place. Il pourrait être intéressant d’explorer ces opportunités plus en détail.',
          'Bon à savoir',
          'Vous n’investissez pas encore dans ce type d’opportunités. Pourtant, elles offrent des avantages fiscaux et un fort potentiel de valorisation à long terme.'
        );
      } else if (questionId === 'passive-income-distribution-plan') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Excellente stratégie',
          'Vous avez mis en place une distribution optimisée de vos revenus passifs, ce qui réduit votre fiscalité et améliore vos gains nets.',
          'Bon début',
          'Vous gérez vos revenus passifs de manière basique. Une optimisation plus poussée pourrait améliorer votre rentabilité après impôts.',
          'Bon à savoir',
          'Vous n’avez pas encore optimisé la distribution de vos revenus passifs. Une meilleure structuration pourrait vous permettre de réduire vos charges fiscales.'
        );
      } else if (questionId === 'investment-diversification-tax-optimization') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bien',
          'Vous avez diversifié vos investissements tout en maximisant les opportunités fiscales, ce qui réduit les risques et améliore votre rendement.',
          'Bon début',
          'Vous avez commencé à diversifier vos investissements, mais il reste encore des opportunités d’optimisation fiscale à explorer.',
          'Bon à savoir',
          'Vos investissements ne sont pas suffisamment diversifiés. Une meilleure répartition pourrait améliorer votre gestion des risques et votre fiscalité.'
        );
      } else if (questionId === 'long-term-investment-capital-gains-tax') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Excellente approche',
          'Vous bénéficiez des régimes fiscaux avantageux sur le long terme (PEA, assurance-vie…), ce qui optimise vos plus-values.',
          'Bon début',
          'Vous avez une approche à long terme mais ne profitez pas encore de toutes les stratégies fiscales disponibles. Il serait intéressant d’explorer d’autres solutions.',
          'Bon à savoir',
          'Vous n’avez pas encore mis en place de stratégie d’investissement à long terme.'
        );
      } else if (questionId === 'supplementary-retirement-plan') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bien',
          'Vous avez mis en place un plan de retraite complémentaire (PER, Madelin, SCPI) avec des versements optimisés, ce qui sécurise votre avenir financier tout en optimisant votre fiscalité.',
          'Bon début',
          'Vous avez un plan de retraite complémentaire, mais sans stratégie précise. Une analyse plus poussée pourrait améliorer vos bénéfices.',
          'Bon à savoir',
          'Vous n’avez pas encore de plan de retraite complémentaire. Il serait intéressant d’explorer des solutions adaptées à votre situation.'
        );
      } else if (questionId === 'health-insurance-family-coverage') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Excellente couverture',
          'Votre mutuelle est optimisée tant en termes de protection que de coût, ce qui vous permet de bénéficier des meilleurs soins sans surcoût.',
          'Bon début',
          'Vous avez une mutuelle, mais elle est soit trop coûteuse, soit avec une couverture moyenne. Une réévaluation pourrait être bénéfique.',
          'Bon à savoir',
          'Vous n’avez pas de mutuelle adaptée. Il est recommandé d’en souscrire une pour couvrir vos besoins de santé et ceux de votre famille.'
        );
      } else if (questionId === 'disability-work-interruption-insurance') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bien',
          'Votre prévoyance couvre efficacement les risques d’arrêt de travail ou d’invalidité avec des indemnités optimisées.',
          'Bon début',
          'Vous avez une prévoyance, mais elle n’a pas été optimisée. Une analyse plus fine pourrait améliorer votre couverture et vos prestations.',
          'Bon à savoir',
          'Vous n’avez pas de prévoyance. En cas de problème de santé, cela peut avoir un impact financier important.'
        );
      } else if (questionId === 'unemployment-protection-strategy') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Excellente anticipation',
          'Vous avez mis en place un dispositif (contrat cadre dirigeant, maintien ARE, cumul emploi) qui vous assure des revenus en cas d’arrêt d’activité.',
          'Bon début',
          'Vous avez quelques protections, mais elles ne sont pas totalement optimisées. Il serait intéressant de mieux sécuriser votre situation.',
          'Bon à savoir',
          'Vous n’avez pas prévu de solution en cas de chômage. Une réflexion sur ce sujet pourrait être utile.'
        );
      } else if (questionId === 'retirement-income-forecast-optimization') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Très bien',
          'Vous savez précisément combien vous toucherez à la retraite et avez mis en place une stratégie d’optimisation adaptée.',
          'Bon début',
          'Vous avez une idée de votre retraite, mais il reste des axes d’amélioration à explorer pour optimiser vos revenus futurs.',
          'Bon à savoir',
          'Vous ne savez pas combien vous toucherez à la retraite. Une étude plus approfondie pourrait vous permettre de mieux préparer votre avenir.'
        );
      } else if (questionId === 'estate-planning-inheritance-tax-optimization') {
        fillInfoTextAnswerCondition(
          answerValue,
          question,
          'Excellente gestion',
          'Vous avez une stratégie optimisée pour transmettre votre patrimoine et réduire les droits de succession (donation, SCI, démembrement…).',
          'Bon début',
          'Vous avez commencé à structurer la transmission de votre patrimoine, mais sans stratégie complète. Une approche plus optimisée pourrait être bénéfique.',
          'Bon à savoir',
          'Vous n’avez pas de stratégie en place pour la transmission de votre patrimoine. Des solutions existent pour réduire les droits de succession et optimiser la transmission à vos proches.'
        );
      }
    }
    // Pour les autres questions (celles qui ne correspondent pas à la question en cours)
    if (selectedAnswers[questionKey] && !['treasury-investment-supports', 'subscribed-insurances-list '].includes(questionId)) {
      const prevAnswer = selectedAnswers[questionKey];
      result = calculThreeAnswersOrganisation(prevAnswer, result);
      answeredQuestions++;
    }
  });

  const resultOptimisation = answeredQuestions > 0 ? (result / (answeredQuestions * 5)) * 100 : 0;
  document.getElementById('protection-result').textContent = Math.round(resultOptimisation);
  updateProgressBar('protection');
}