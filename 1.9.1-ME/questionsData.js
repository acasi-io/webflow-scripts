const questionsData = [
    {   
        id: 0, 
        question: "Quel est votre type d'activité ?", 
        questionTree: 0,
        property: "company_creation_activity",
        highlight: true, 
        choices: [
            {
                id: 1, 
                value: "Vente de marchandises", 
                image: "🏠", 
                nextQuestion: 1,
                hubspotValue: 'Achat/Vente',
            }, 
            {
                id: 2, 
                value: "Prestation de services",
                image: "👩‍💻", 
                nextQuestion: 6,
                hubspotValue: 'Services',
            }
        ]
    }, 
    {
        id: 1,
        question: "Cette année, vous allez réaliser", 
        property: "estimated_revenue",
        questionTree: 1,
        choices: [
            {
                id: 1, 
                value: "Moins de 91 900€ de CA", 
                image: "💰", 
                nextQuestion: 2,
                hubspotValue: 'Franchise de TVA',
            }, 
            {
                id: 2, 
                value: "Entre 91 900€ et 101 000€ de CA", 
                image: "💰💰", 
                nextQuestion: 3,
                hubspotValue: 'Seuil majoré de TVA',
            }, 
            {
                id: 3, 
                value: "Plus de 101 000€ de CA", 
                image: "💰💰💰", 
                nextQuestion: 4,
                hubspotValue: 'Sortie de la franchise de TVA',
            }, 
            {
                id: 4, 
                value: "Plus de 188 700€ de CA", 
                image: "💰💰💰💰", 
                nextQuestion: 5,
                hubspotValue: 'Dépassement du seuil maximal',
            }
        ]
    },
    {
        id: 2,
        question: "Vos charges représentent", 
        questionTree: 2,
        property: "over_allowance_threshold",
        choices: [
            {
                id: 1, 
                value: "Plus de 34% de votre CA", 
                nextQuestion: "emailForm", 
                result: true, 
                hubspotValue: true,
            }, 
            {
                id: 2, 
                value: "Moins de 34% de votre CA", 
                nextQuestion: "emailForm", 
                result: true, 
                hubspotValue: false,
            }
        ]
    },
    { 
        id: 3,
        question: "L'année dernière vous avez réalisé", 
        questionTree: 3,
        property: "previous_revenue",
        choices: [
            {
                id: 1, 
                value: "Plus de 91 900€", 
                nextQuestion: "emailForm", 
                image: "💰💰", 
                result: true, 
                resultValue: "Plus de 91 900€",
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
                hubspotValue: false,
            }, 
            {
                id: 2, 
                value: "Professionnels (autres sociétés)", 
                nextQuestion: "emailForm", 
                image: "🏭", 
                result: true, 
                hubspotValue: true,
            }
        ]
    }, 
    {
        id: 5, 
        question: "L'année dernière vous avez réalisé", 
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
                hubspotValue: true,
            }
        ]
    },
    {
        id: 6,
        question: "Cette année, vous allez réaliser", 
        questionTree: 6,
        property: "estimated_revenue",
        choices: [
            {
                id: 1, 
                value: "Moins de 36 800€ de CA", 
                image: "💰", 
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
        property: "over_allowance_threshold",
        choices: [
            {
                id: 1, 
                value: "Plus de 50% de votre CA", 
                nextQuestion: "emailForm", 
                result: true, 
                hubspotValue: true,
            }, 
            {
                id: 2, 
                value: "Moins de 50% de votre CA", 
                nextQuestion: "emailForm", 
                result: true, 
                hubspotValue: false,
            }
        ]
    },
    { 
        id: 8,
        question: "L'année dernière vous avez réalisé", 
        questionTree: 8,
        property: "previous_revenue",
        choices: [
            {
                id: 1, 
                value: "Plus de 36 800€", 
                nextQuestion: "emailForm", 
                image: "💰💰", 
                result: true, 
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
                hubspotValue: true
            }
        ]
    }
];