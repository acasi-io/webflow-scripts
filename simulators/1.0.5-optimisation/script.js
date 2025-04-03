document.getElementById('start-btn').addEventListener('click', () => {
  document.querySelector('.section_opti-sim-hero').classList.add('hide');
  document.querySelector('.section_opti-sim').classList.remove('hide');
});

let selectedAnswers = {};

const totalQuestionsByTheme = {
  gestion: 13,
  organisation: 10,
  development: 8
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

  console.log(
    `updateProgressBar [${questionTheme}]: answeredQuestions=${answeredQuestions}/${totalQuestions}, totalPoints=${totalPoints}, maxPoints=${maxPoints}`
  );
  console.log(
    `goodPercentage=${goodPercentage}%, progressPercentage=${progressPercentage}%, badPercentage=${badPercentage}%`
  );

  const progressBar = document.querySelector(
    `.opti-sim_theme-item[data-theme="${questionTheme}"] .opti-sim_progress-bar-wrapper`
  );
  if (!progressBar) {
    console.warn("Aucun élément progressBar trouvé pour le thème:", questionTheme);
    return;
  }
  const goodBar = progressBar.querySelector('.opti-sim_progress-bar.is-good');
  const badBar = progressBar.querySelector('.opti-sim_progress-bar.is-bad');
  if (!goodBar || !badBar) {
    console.warn("Les éléments goodBar ou badBar sont introuvables pour le thème:", questionTheme);
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
  const currentIndex = getStepIndex(activeStep);
  const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
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
    const questionKey = `development-${question.dataset.step}`;
    const questionId = question.id || `question-${question.dataset.step}`;
    question.id = questionId;

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
      }
    }
    // Pour les autres questions (celles qui ne correspondent pas à la question en cours)
    else if (selectedAnswers[questionKey]) {
      const prevAnswer = selectedAnswers[questionKey];
      result = calculThreeAnswersOrganisation(prevAnswer, result);
      answeredQuestions++;
    }
  });

  const resultOptimisation = answeredQuestions > 0 ? (result / (answeredQuestions * 5)) * 100 : 0;
  document.getElementById('development-result').textContent = Math.round(resultOptimisation);
  updateProgressBar('development');
}
