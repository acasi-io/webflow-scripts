const questionsData = [
    {   
        id: 0, 
        question: "Quel est votre statut actuel ?", 
        theme: "Votre statut",
        property: "status",
        highlight: true, 
        questionTree: 0, 
        choices: [
            {
                id: 1, 
                value: "Salarié",
                image: "💼", 
                hubspotValue: 'Salarié',
                nextQuestion: 1
            }, 
            {
                id: 2, 
                value: "Bénéficiaire du chômage",
                image: "🌴", 
                hubspotValue: 'Chômage',
                nextQuestion: 1
            }, 
            {
                id: 3, 
                value: "Micro-entrepreneur", 
                image: "🚗", 
                hubspotValue: 'Micro',
                nextQuestion: 1
            }, 
            {
                id: 4, 
                value: "Entrepreneur (EI, SAS/SASU, SARL/EURL)", 
                image: "🚀", 
                hubspotValue: 'Entrepreneur',
                nextQuestion: 1
            }
        ]
    }, 
    {
        id: 1,
        question: "Vous vous lancez seul ou à plusieurs ?", 
        theme: "Votre statut",
        property: "multiple_shareholders",
        questionTree: 1, 
        choices: [
            {
                id: 1, 
                value: "Je souhaite créer une société seul", 
                image: "👩",
                result: true, 
                hubspotValue: false,
                nextQuestion: 2
            }, 
            {
                id: 2, 
                value: "Je souhaite créer une société à plusieurs", 
                image: "👱‍♀️👩👨",
                result: true, 
                hubspotValue: true,
                nextQuestion: 2
            }
        ]
    },
    {
        id: 2,
        question: "Comptez-vous embaucher des salariés ?", 
        theme: "Votre projet",
        property: "with_employees",
        questionTree: 2, 
        choices: [
            {
                id: 1, 
                value: "Oui", 
                image: "✅",
                hubspotValue: true,
                nextQuestion: 3
            }, 
            {
                id: 2, 
                value: "Non", 
                image: "❌",
                hubspotValue: false,
                nextQuestion: 3
            }
        ]
    },
    { 
        id: 3,
        question: "Quelle est la nature de votre projet ?", 
        theme: "Votre projet",
        property: "company_creation_activity",
        questionTree: 3, 
        choices: [
            {
                id: 1, 
                value: "Profession réglementée (avocats, médecins...)", 
                image: "👩‍⚕️",
                hubspotValue: 'Profession réglementée',
                nextQuestion: 4
            }, 
            {
                id: 2, 
                value: "Prestation de service / conseil", 
                image: "👩‍💻",
                hubspotValue: 'Services',
                nextQuestion: 4
            },
            {
                id: 3, 
                value: "Vente de biens et de marchandises", 
                image: "🏠",
                hubspotValue: 'Achat/Vente',
                nextQuestion: 4
            }, 
            {
                id: 4, 
                value: "Artisanat", 
                image: "🚕",
                hubspotValue: 'Artisanat',
                nextQuestion: 4
            }, 
            {
                id: 5, 
                value: "Autre",
                hubspotValue: 'Autre',
                nextQuestion: 4
            }
        ]
    }, 
    {
        id: 4, 
        question: "Quel chiffre d'affaires envisagez-vous ?", 
        theme: "Données financières",
        property: "estimated_revenue",
        questionTree: 4, 
        choices: [
            {
                id: 1, 
                value: "Moins de 77 700€ par an",
                image: "💰",
                result: true,
                hubspotValue: 'En dessous du seuil maximal pour une ME',
                nextQuestion: 5
            }, 
            {
                id: 2, 
                value: "Plus de 77 700€ par an", 
                image: "💰💰",
                hubspotValue: 'Au dessus du seuil maximal pour une ME',
                nextQuestion: 5
            }
        ]
    },
    {
        id: 5,
        question: "Combien de charges prévoyez-vous ?", 
        theme: "Données financières",
        property: "estimated_charges",
        questionTree: 5, 
        choices: [
            {
                id: 1, 
                value: "10% du chiffre d'affaires",
                hubspotValue: '10%',
                nextQuestion: 6
            }, 
            {
                id: 2, 
                value: "20% du chiffre d'affaires",
                hubspotValue: '20%',
                nextQuestion: 6
            }, 
            {
                id: 3, 
                value: "40% du chiffre d'affaires",
                hubspotValue: '40%',
                nextQuestion: 6
            }, 
            {
                id: 4, 
                value: "Plus de 50% du chiffre d'affaires",
                hubspotValue: 'Plus de 50%',
                nextQuestion: 6
            }
        ]
    },
    {
        id: 6, 
        question: "Combien souhaitez-vous vous rémunérer ?", 
        theme: "Rémunération du dirigeant",
        property: "revenue_type",
        questionTree: 6, 
        choices: [
            {
                id: 1, 
                value: "Je souhaite me verser un salaire tous les mois", 
                result: true, 
                hubspotValue: 'Salaire',
                nextQuestion: 'emailForm'
            }, 
            {
                id: 2, 
                value: "Je souhaite me rémunérer en dividendes 1 fois par an", 
                result: true,
                hubspotValue: 'Dividendes',
                nextQuestion: 'emailForm'
            }
        ]
    }
]; 