document.getElementById('start-btn').addEventListener('click', () => {
    document.querySelector('.section_opti-sim-hero').classList.add('hide');
    document.querySelector('.section_opti-sim').classList.remove('hide');
  });
  
  let selectedAnswers = {};
  
  // Pour organisation et development, on conserve des totaux fixes,
  // mais pour gestion nous recalculerons le total en fonction des questions "notées".
  const totalQuestionsByTheme = {
    gestion: 13,         // Valeur initiale si nécessaire ailleurs
    organisation: 6,
    development: 6
  };
  
  const nextButton = document.getElementById('next-btn');
  const prevButton = document.getElementById('prev-btn');
  const steps = Array.from(document.querySelectorAll('.opti-sim_question-container'));
  
  // Affecter un numéro de step à chaque question s'il n'est pas défini
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
  
  /* 
    updateProgressBar() se base sur la clé issue de selectedAnswers.
    Pour un thème donné, on parcourt uniquement les questions "notées" (data-point !== "false").
  */
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
  
    const questionsNoPointsSteps = steps
      .filter(step => step.dataset.point === 'false')
      .map(step => step.dataset.step);
    const questionContainer = answerDiv.closest('.opti-sim_question-container');
    const questionTheme = questionContainer.dataset.theme;
    const questionStep = questionContainer.dataset.step;
    const answerValue = answerDiv.dataset.answer;
    const questionInfoWrapper = questionContainer.querySelector('.opti-sim_info-wrapper');
    const questionContainerId = questionContainer.id;
    const currentLeftContainer = document.querySelector(
      `.opti-sim_left-content-container[data-theme='${questionTheme}']`
    );
    const currentLeftThemeWrapper = document.querySelector(
      `.opti-sim_theme-item[data-theme='${questionTheme}']`
    );
  
    // Stocker la réponse avec la clé "theme-step"
    selectedAnswers[`${questionTheme}-${questionStep}`] = answerValue;
  
    questionContainer.querySelectorAll('.opti-sim_answer-item').forEach(div => {
      div.classList.remove('is-selected');
      div.style.color = '#484848';
    });
    answerDiv.classList.add('is-selected');
    answerDiv.style.color = 'white';
  
    currentLeftContainer.classList.add('is-current');
    currentLeftThemeWrapper.classList.add('is-current');
  
    if (questionTheme === 'gestion') {
      calculGestion();
    }
    if (questionTheme === 'organisation') {
      calculOrganisation(answerValue, questionContainer.id);
    }
  
    if (!questionsNoPointsSteps.includes(questionContainer.dataset.step)) {
      updateProgressBar(questionTheme);
      enableNextButton();
      if (questionInfoWrapper) {
        questionInfoWrapper.style.display = 'block';
      }
    } else {
      enableNextButton();
      if (questionInfoWrapper) {
        questionInfoWrapper.style.display = 'block';
      }
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
  
  /* 
    Fonction calculGestion – version révisée.
    Elle parcourt toutes les questions de Gestion,
    utilise une clé du type "gestion-<index+1>",
    filtre les questions "notées" (data-point !== "false") pour déterminer le total,
    cumule les points (5 pour "oui", 3 pour "medium", 0 pour "non"),
    ajoute les points conditionnels,
    calcule le pourcentage "good" en fonction du score obtenu sur le maximum réel attendu,
    met à jour le texte du résultat et la barre de progression.
  */
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
  
  /* 
    Fonction calculOrganisation.
    Elle parcourt toutes les questions du thème "organisation", cumule les points,
    et met à jour le pourcentage ainsi que la barre de progression.
  */
  function calculOrganisation(answerValue, questionContainerId) {
    const questions = steps.filter(step => step.dataset.theme === 'organisation');
    let result = 0;
    let answeredQuestions = 0;
  
    questions.forEach(question => {
      // Utiliser le data-step réel pour construire la clé
      const questionKey = `organisation-${question.dataset.step}`;
      // S'assurer que chaque question a un id
      const questionId = question.id || `question-${question.dataset.step}`;
      question.id = questionId;
  
      if (questionId === questionContainerId) {
        result = calculThreeAnswersOrganisation(answerValue, result);
        answeredQuestions++;
  
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
        }
      } else if (selectedAnswers[questionKey]) {
        const prevAnswer = selectedAnswers[questionKey];
        result = calculThreeAnswersOrganisation(prevAnswer, result);
        answeredQuestions++;
      }
    });
  
    const resultOptimisation = answeredQuestions > 0 ? (result / (answeredQuestions * 5)) * 100 : 0;
    document.getElementById('organisation-result').textContent = Math.round(resultOptimisation);
    updateProgressBar('organisation');
  }