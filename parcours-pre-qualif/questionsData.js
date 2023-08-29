const questionsData = [
    {
        id: 0,
        question: 'Avez-vous une société ?',
        questionTree: 0,
        dependsOnForme: true,
        nextQuestionForme: 2,
        dependsOnCreation: true,
        nextQuestionCreation: 7,
        choices: [
            {
                id: 1, 
                value: 'Oui',
                nextQuestion: 1
            },
            {
                id: 2,
                value: 'Non',
                nextQuestion: 7
            }
        ]
    },
    {
        id: 1,
        question: 'Quel est votre statut ?',
        questionTree: 1,
        choices: [
            {
                id: 1,
                value: 'SAS / SASU',
                nextQuestion: 2
            },
            {
                id: 2,
                value: 'SARL / EURL',
                nextQuestion: 2
            },
            {
                id: 3,
                value: 'EI',
                nextQuestion: 2
            },
            {
                id: 4,
                value: 'Je suis micro-entrepreneur',
                nextQuestion: 'end'
            },
            {
                id: 5,
                value: 'Je suis en micro mais je souhaite passer en société',
                nextQuestion: 6
            }
        ]
    },
    {
        id: 2,
        question: 'Avez-vous des salariés ?',
        questionTree: 2,
        choices: [
            {
                id: 1,
                value: 'Oui',
                nextQuestion: 'end'
            },
            {
                id: 2,
                value: 'Non',
                nextQuestion: 3
            },
            {
                id: 3,
                value: 'Plus tard',
                nextQuestion: 'end'
            },
            {
                id: 4,
                value: 'Je suis un dirigeant assimilié-salarié',
                nextQuestion: 3
            }
        ]
    },
    {
        id: 3,
        question: 'Quel est votre métier ?',
        questionTree: 3,
        dependsOnMetiers: true,
        nextQuestionMetiers: 4,
        choices: [
            {
                id: 1,
                value: 'Consultant informatique',
                nextQuestion: 4
            },
            {
                id: 2,
                value: 'Développeur',
                nextQuestion: 4
            },
            {
                id: 3,
                value: 'Graphiste / Designer',
                nextQuestion: 4
            },
            {
                id: 4,
                value: 'Coach',
                nextQuestion: 4
            },
            {
                id: 5,
                value: 'Avocat individuel (en contrat de collaboration)',
                nextQuestion: 4
            },
            {
                id: 6,
                value: 'Architecte',
                nextQuestion: 4
            },
            {
                id: 7,
                value: 'Agent immobilier',
                nextQuestion: 4
            },
            {
                id: 8,
                value: 'VTC',
                nextQuestion: 'end'
            },
            {
                id: 9,
                value: 'E-commerçant',
                nextQuestion: 'end'
            },
            {
                id: 10,
                value: 'Achat / revente',
                nextQuestion: 'end'
            },
            {
                id: 11,
                value: 'Bâtiment',
                nextQuestion: 'end'
            },
            {
                id: 12,
                value: 'Location de voitures / location immobilière',
                nextQuestion: 'end'
            },
            {
                id: 13,
                value: 'Restaurateur',
                nextQuestion: 'end'
            },
            {
                id: 14,
                value: 'Autre',
                nextQuestion: 'end'
            }
        ]
    },
    {
        id: 4,
        question: 'Quel est votre besoin ?',
        questionTree: 4,
        choices: [
            {
                id: 1,
                value: 'Je n\'ai jamais eu d\'EC et j\'en cherche un',
                nextQuestion: 5
            },
            {
                id: 2,
                value: 'J\'ai un EC mais je souhaite changer',
                nextQuestion: 5
            },
            {
                id: 3,
                value: 'Je souhaite rattraper ma compte (moins de 2 exercies comptables)',
                nextQuestion: 5
            },
            {
                id: 4,
                value: 'Je souhaite rattraper ma compta (plus de 2 exercices comptables)',
                nextQuestion: 'end'
            },
            {
                id: 5,
                value: 'Je souhaite avoir des conseils d\'un expert spécialisé sur mon activité',
                nextQuestion: 5
            },
            {
                id: 6,
                value: 'Autre',
                nextQuestion: 5
            }
        ]
    },
    {
        id: 5,
        question: 'Comment avez-vous connu Acasi ?',
        questionTree: 2,
        choices: [
            {
                id: 1,
                value: 'Publicité sur internet',
                nextQuestion: 6
            },
            {
                id: 2,
                value: 'Moteurs de recherche',
                nextQuestion: 6
            },
            {
                id: 3,
                value: 'Site spécialisé',
                nextQuestion: 6
            },
            {
                id: 4,
                value: 'Bouche à oreille',
                nextQuestion: 6
            },
            {
                id: 5,
                value: 'Vidéo, podcast, réseaux sociaux',
                nextQuestion: 6
            },
            {
                id: 6,
                value: 'Évènement Acasi',
                nextQuestion: 6
            },
            {
                id: 7,
                value: 'Autre',
                nextQuestion: 6
            }
        ]
    },
    {
        id: 6,
        question: 'Souahitez-vous qu\'on vous présente notre solution ?',
        questionTree: 6,
        dependsOnBtnRDV: true,
        nextQuestionRDV: 'link rdv calendly',
        choices: [
            {
                id: 1,
                value: 'Oui',
                nextQuestion: 'link rdv calendly'
            },
            {
                id: 2,
                value: 'Non, pas pour le moment',
                nextQuestion: 'link signup'
            }
        ]
    },
    {
        id: 7,
        question: 'Quand souhaitez-vous commencer la création ?',
        questionTree: 7,
        choices: [
            {
                id: 1,
                value: 'Tout de suite',
                nextQuestion: 8
            },
            {
                id: 2,
                value: 'Dans 6 mois',
                nextQuestion: 8
            },
            {
                id: 3,
                value: 'Dans 1 an',
                nextQuestion: 8
            }
        ]
    },
    {
        id: 8,
        question: 'Quel est votre métier ?',
        questionTree: 8,
        dependsOnMetiers: true,
        nextQuestionMetiers: 9,
        choices: [
            {
                id: 1,
                value: 'Consultant informatique',
                nextQuestion: 9
            },
            {
                id: 2,
                value: 'Développeur',
                nextQuestion: 9
            },
            {
                id: 3,
                value: 'Graphiste / Designer',
                nextQuestion: 9
            },
            {
                id: 4,
                value: 'Coach',
                nextQuestion: 9
            },
            {
                id: 5,
                value: 'Avocat individuel (en contrat de collaboration)',
                nextQuestion: 9
            },
            {
                id: 6,
                value: 'Architecte',
                nextQuestion: 9
            },
            {
                id: 7,
                value: 'Agent immobilier',
                nextQuestion: 9
            },
            {
                id: 8,
                value: 'VTC',
                nextQuestion: 'end'
            },
            {
                id: 9,
                value: 'E-commerçant',
                nextQuestion: 'end'
            },
            {
                id: 10,
                value: 'Achat / revente',
                nextQuestion: 'end'
            },
            {
                id: 11,
                value: 'Bâtiment',
                nextQuestion: 'end'
            },
            {
                id: 12,
                value: 'Location de voitures / location immobilière',
                nextQuestion: 'end'
            },
            {
                id: 13,
                value: 'Restaurateur',
                nextQuestion: 'end'
            },
            {
                id: 14,
                value: 'Autre',
                nextQuestion: 'end'
            }
        ]
    },
    {
        id: 9,
        question: 'Quelle forme sociale souhaitez-vous créer ?',
        questionTree: 9,
        choices: [
            {
                id: 1,
                value: 'SAS',
                nextQuestion: 'link singup'
            },
            {
                id: 2,
                value: 'SASU',
                nextQuestion: 'link signup'
            },
            {
                id: 3,
                value: 'SARL',
                nextQuestion: 'link singup'
            },
            {
                id: 4,
                value: 'EURL',
                nextQuestion: 'link signup'
            },
            {
                id: 5,
                value: 'micro',
                nextQuestion: 'end'
            },
            {
                id: 6,
                value: 'J\'ai besoin de conseils',
                nextQuestion: 'link signup'
            }
        ]
    }
]