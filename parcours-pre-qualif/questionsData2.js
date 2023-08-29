const questionsData = [
    {   
        id: 0, 
        question: "Avez-vous une société ?", 
        questionTree: 0,
        property: "have_society",
        highlight: true, 
        choices: [
            {
                id: 1, 
                value: "Oui", 
                nextQuestion: 1,
                hubspotValue: 'Yes',
            }, 
            {
                id: 2, 
                value: "Non",
                nextQuestion: 6,
                hubspotValue: 'No',
            }
        ]
    }, 
    {
        id: 1,
        question: "Quel est votre statut ?", 
        property: "statut",
        questionTree: 1,
        choices: [
            {
                id: 1, 
                value: "SAS / SASU", 
                nextQuestion: 2,
                hubspotValue: 'SAS / SASU',
            }, 
            {
                id: 2, 
                value: "SARL / EURL", 
                nextQuestion: 2,
                hubspotValue: 'SARL / EURL',
            }, 
            {
                id: 3, 
                value: "EI", 
                nextQuestion: 2,
                hubspotValue: 'EI',
            }, 
            {
                id: 4, 
                value: "Je suis micro-entrepreneur", 
                nextQuestion: "sortie",
                hubspotValue: 'micro-entrepreneur',
            }, 
            {
                id: 5,
                value: "Je suis en micro mais je souhaite créer ma société", 
                nextQuestion: 6,
                hubspotValue: 'Passage de micro à société',
            }
        ]
    },
    {
        id: 2,
        question: "Avez-vous des salariés ?", 
        questionTree: 2,
        precision: true,
        property: "have_employees",
        choices: [
            {
                id: 1, 
                value: "Oui",
                nextQuestion: "sortie",
                hubspotValue: "yes",
            }, 
            {
                id: 2, 
                value: "Non", 
                nextQuestion: 3,
                hubspotValue: "no",
            }, 
            {
                id: 3, 
                value: "Plus tard", 
                nextQuestion: "sortie",
                hubspotValue: "later",
            }, 
            {
                id: 4, 
                value: "Je suis un dirigeant assimilié-salarié (valable pour les SAS / SASU", 
                nextQuestion: 3,
                hubspotValue: "assimilié-salarié",
            }, 
        ]
    },
    { 
        id: 3,
        question: "Quel est votre métier ?", 
        questionTree: 3,
        property: "micro_previous_revenue",
        choices: [
            {
                id: 1, 
                value: "Plus de 91 900€", 
                nextQuestion: "emailForm", 
                image: "💰💰", 
                result: true, 
                resultValue: "above_franchise_threshold_or_private",
                hubspotValue: 'Dépassement du seuil de franchise de TVA',
            }, 
            {
                id: 2, 
                value: "Moins de 91 900€", 
                image: "💰", 
                nextQuestion: 2,
                hubspotValue: 'Franchise de TVA',
            },
            {
                id: 3, 
                value: "C'est ma premère année d'activité", 
                image: "🚀", 
                nextQuestion: 2,
                hubspotValue: "1ère année d'activité",
            }
        ]
    }, 
    {
        id: 4, 
        question: "Vos clients sont majoritairement des", 
        questionTree: 4,
        property: "professional_customers",
        choices: [
            {
                id: 1, 
                value: "Particuliers", 
                nextQuestion: "emailForm", 
                image: "👩‍💼", 
                result: true, 
                resultValue: 'above_franchise_threshold_or_private', 
                hubspotValue: false,
            }, 
            {
                id: 2, 
                value: "Professionnels (autres sociétés)", 
                nextQuestion: "emailForm", 
                image: "🏭", 
                result: true, 
                resultValue: 'professional', 
                hubspotValue: true,
            }
        ]
    }, 
    {
        id: 5, 
        question: "Souhaitez-vous qu'on vous présente notre solution ?", 
        questionTree: 5,
        property: "previous_revenue_above_threshold",
        choices: [
            {
                id: 1, 
                value: "Moins de 188 700€", 
                image: "💰", 
                nextQuestion: 2,
                hubspotValue: false,
            }, 
            {
                id: 2, 
                value: "Plus de 188 700€", 
                nextQuestion: "emailForm", 
                image: "💰💰", 
                result: true,
                resultValue: "previous_revenue_above_threshold", 
                hubspotValue: true,
            }
        ]
    },
    {
        id: 6,
        question: "Quand souhaitez-vous commencer la création ?", 
        questionTree: 6,
        property: "creation_start",
        choices: [
            {
                id: 1, 
                value: "Tout de suite", 
                nextQuestion: 7,
                hubspotValue: 'Franchise de TVA',
            }, 
            {
                id: 2, 
                value: "Entre 36 800€ et 39 100€ de CA", 
                image: "💰💰", 
                nextQuestion: 8,
                hubspotValue: 'Seuil majoré de TVA',
            }, 
            {
                id: 3, 
                value: "Plus de 39 100€ de CA", 
                image: "💰💰💰", 
                nextQuestion: 4,
                hubspotValue: 'Dépassement du seuil de franchise de TVA',
            }, 
            {
                id: 4, 
                value: "Plus de 77 700€ de CA", 
                image: "💰💰💰💰", 
                nextQuestion: 9,
                hubspotValue: 'Dépassement du seuil maximal',
            }
        ]
    },
    {
        id: 7,
        question: "Vos charges représentent", 
        questionTree: 7,
        precision: true,
        property: "over_allowance_threshold",
        choices: [
            {
                id: 1, 
                value: "Plus de 34% de votre CA", 
                nextQuestion: "emailForm", 
                result: true, 
                resultValue: 'over_allowance_threshold_50', 
                hubspotValue: true,
            }, 
            {
                id: 2, 
                value: "Moins de 34% de votre CA", 
                nextQuestion: "emailForm", 
                result: true, 
                resultValue: 'under_allowance_threshold_50', 
                hubspotValue: false,
            }
        ]
    },
    { 
        id: 8,
        question: "L'année dernière vous avez réalisé", 
        questionTree: 8,
        property: "micro_previous_revenue",
        choices: [
            {
                id: 1, 
                value: "Plus de 36 800€", 
                nextQuestion: "emailForm", 
                image: "💰💰", 
                result: true, 
                resultValue: 'above_franchise_threshold_or_private', 
                hubspotValue: "Dépassement du seuil de franchise de TVA",
            }, 
            {
                id: 2, 
                value: "Moins de 36 800€", 
                image: "💰", 
                nextQuestion: 7,
                hubspotValue: "Franchise de TVA",
            },
            {
                id: 3, 
                value: "C'est ma premère année d'activité", 
                image: "🚀", 
                nextQuestion: 7,
                hubspotValue: "1ère année d'activité",
            }
        ]
    }, 
    {
        id: 9, 
        question: "L'année dernière vous avez réalisé ", 
        questionTree: 9,
        property: "previous_revenue_above_threshold",
        choices: [
            {
                id: 1, 
                value: "Moins de 77 700€", 
                image: "💰", 
                nextQuestion: 7,
                hubspotValue: false
            }, 
            {
                id: 2, 
                value: "Plus de 77 700€", 
                nextQuestion: "emailForm", 
                image: "💰💰", 
                result: true,
                resultValue: "previous_revenue_above_threshold", 
                hubspotValue: true
            }
        ]
    }
];