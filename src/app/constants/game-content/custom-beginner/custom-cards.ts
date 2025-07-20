import { CustomCard } from 'src/app/models/imperium-card';

export const customCardsCustomBeginner: CustomCard[] = [
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
    cardAmount: 2,
  },
  // {
  //   type: 'limited',
  //   name: {
  //     en: 'Imperial Agent',
  //     de: 'Imperialer Agent',
  //   },
  //   faction: 'emperor',
  //   persuasionCosts: 2,
  //   fieldAccess: ['landsraad', 'town'],
  //   imageUrl: '/assets/images/action-backgrounds/mentat_5.png',
  //   buyEffects: [],
  //   agentEffects: [],
  //   revealEffects: [
  //     {
  //       type: 'persuasion',
  //       amount: 2,
  //     },
  //   ],
  //   cardAmount: 2,
  // },
  {
    type: 'limited',
    name: {
      en: 'Bene Gesserit Contact',
      de: 'Bene Gesserit Kontakt',
    },
    faction: 'bene',
    persuasionCosts: 2,
    fieldAccess: ['landsraad', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit.png',
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    cardAmount: 2,
  },
  {
    type: 'unlimited',
    name: {
      en: 'The Spice Must Flow',
      de: 'Das Spice muss fliessen',
    },
    persuasionCosts: 8,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/spice_2.png',
    agentEffects: [],
    revealEffects: [
      {
        type: 'victory-point',
      },
      {
        type: 'trash-self',
      },
    ],
  },
  {
    type: 'foldspace',
    name: {
      en: 'Foldspace',
      de: 'Faltraum',
    },
    faction: 'guild',
    fieldAccess: ['bene', 'emperor', 'fremen', 'guild', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/foldspace.png',
    buyEffects: [],
    revealEffects: [],
    agentEffects: [{ type: 'trash-self' }],
  },
];
