export interface Leader {
  name: string;
  house: string;
  passiveName: string;
  passiveDescription: string;
  signetName: string;
  signetDescription: string;
  imageUrl: string;
}

export const leaders: Leader[] = [
  {
    name: 'stilgar',
    house: 'fremen',
    passiveName: 'naib',
    passiveDescription: 'You can access sietch tabr.',
    signetName: 'the fremen ways',
    signetDescription: 'Put 1 troop from your storage into combat.',
    imageUrl: '/assets/images/leaders/stilgar.png',
  },
  {
    name: 'liet lynes',
    house: 'fremen',
    passiveName: 'leader of the fremen',
    passiveDescription:
      'You start with the maximum fremen influence. Every time an opponent gains fremen influence, you lose 1.',
    signetName: 'planting the paradise',
    signetDescription: '3 Water -> 1 VP',
    imageUrl: '/assets/images/leaders/liet.png',
  },
  {
    name: 'chani kynes',
    house: 'fremen',
    passiveName: 'sayyadina',
    passiveDescription: 'Fremen cards cost 1 less persuasion to buy.',
    signetName: 'child of the desert',
    signetDescription: 'Fields cost 1 less water to access.',
    imageUrl: '/assets/images/leaders/chani.png',
  },
  {
    name: 'alia atreides',
    house: 'house atreides',
    passiveName: 'pre-born',
    passiveDescription:
      'Draw 1 additional card at the start of each round. Every time you reveal your signet ring, lose 1 victory point.',
    signetName: 'ego-Memories',
    signetDescription: 'Discard 2 cards. Trash 1 card.',
    imageUrl: '/assets/images/leaders/alia.png',
  },
  {
    name: 'the preacher',
    house: '-',
    passiveName: 'blind but seeing',
    passiveDescription: 'Once each round, you may add 1 card in play to your hand.',
    signetName: 'accusing prophet',
    signetDescription: 'A player of your choice discards 1 card.',
    imageUrl: '/assets/images/leaders/preacher.png',
  },
  {
    name: 'princess irulan corrino',
    house: 'house corrino',
    passiveName: 'daughter of the emperor',
    passiveDescription:
      'Remove your marker from the emperor track. Every time you would gain emperor influence, trash 1 card.',
    signetName: 'chronicler',
    signetDescription: 'Draw an intrigue face down. You may trash it at any time to draw 2 cards.',
    imageUrl: '/assets/images/leaders/irulan.png',
  },
  {
    name: 'feyd-rautha harkonnen',
    house: 'house harkonnen',
    passiveName: 'ruthless ambition',
    passiveDescription:
      'Play with all your intrigues revealed. Every time you would draw an intrigue, draw 2 instead, then trash one of them. ',
    signetName: 'hidden poison',
    signetDescription: 'Draw an intrigue face down. You may trash it at any time to destroy 1 enemy troop in combat.',
    imageUrl: '/assets/images/leaders/feyd.png',
  },
  {
    name: 'count hasimir fenring',
    house: 'house fenring',
    passiveName: 'political tactician',
    passiveDescription: '',
    signetName: 'feigned weakness',
    signetDescription: '',
    imageUrl: '/assets/images/leaders/hasimir.png',
  },
  {
    name: 'lady margot fenring',
    house: 'house fenring',
    passiveName: 'bene gesserit training',
    passiveDescription: '',
    signetName: 'hypnotic seduction',
    signetDescription: '',
    imageUrl: '/assets/images/leaders/margot.png',
  },
];
