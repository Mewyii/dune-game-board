import { ImperiumCard } from '../../imperium-cards';

export const customCardsCustomExpert: ImperiumCard[] = [
  {
    name: {
      en: 'Foldspace',
      de: 'Faltraum',
    },
    fieldAccess: ['bene', 'emperor', 'fremen', 'guild', 'landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/foldspace.png',
    cardAmount: 10,
    buyEffects: [],
    revealEffects: [],
    customAgentEffect: {
      en: '{resource:card-draw} <br>Trash this card.',
      de: '{resource:card-draw} <br>Entsorge diese Karte.',
      fontSize: 'medium',
    },
  },
];
