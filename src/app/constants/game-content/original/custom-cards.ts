import { CustomCard } from 'src/app/models/imperium-card';

export const customCardsOriginal: CustomCard[] = [
  {
    type: 'limited',
    name: {
      en: 'Arrakis Liason',
      de: 'Arrakis Kontakt',
    },
    faction: 'fremen',
    persuasionCosts: 2,
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/stillsuits.png',
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    cardAmount: 8,
  },
  {
    type: 'unlimited',
    name: {
      en: 'The Spice Must Flow',
      de: 'Das Spice muss fliessen',
    },
    persuasionCosts: 9,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/spice_2.png',
    buyEffects: [
      {
        type: 'victory-point',
      },
    ],
    agentEffects: [],
    revealEffects: [
      {
        type: 'spice',
        amount: 1,
      },
    ],
  },
  {
    type: 'foldspace',
    name: {
      en: 'Foldspace',
      de: 'Faltraum',
    },
    fieldAccess: ['bene', 'emperor', 'fremen', 'guild', 'landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/foldspace.png',
    buyEffects: [],
    revealEffects: [],
    customAgentEffect: {
      en: '{resource:card-draw} <br>Trash this card.',
      de: '{resource:card-draw} <br>Entsorge diese Karte.',
      fontSize: 'medium',
    },
  },
];
