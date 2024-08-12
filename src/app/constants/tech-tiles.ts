import { TechTileCard } from '../services/tech-tiles.service';

export const techTiles: TechTileCard[] = [
  {
    name: {
      en: 'Maula Pistol Factory',
      de: 'Maula Pistolen Fabrik',
    },
    faction: 'fremen',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/industry_2.png',
    buyEffects: [],
    customEffect: {
      en: '',
      de: '<b>Aufdeckzug</b>: +{resource:sword} für jede Truppe im Konflikt.',
      fontSize: 'small',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Wind Traps',
      de: 'Windfallen',
    },
    faction: 'fremen',
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/industry_2.png',
    buyEffects: [],
    effects: [],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Space Port',
      de: 'Raumhafen',
    },
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/troops.png',
    buyEffects: [
      {
        type: 'foldspace',
      },
    ],
    effects: [
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'card-discard',
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'foldspace',
      },
    ],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Trade Port',
      de: 'Handelshafen',
    },
    faction: 'guild',
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/spice_port.png',
    buyEffects: [],
    effects: [],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Ornithopter Hangar',
      de: 'Ornithopter Hangar',
    },
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/port_2.png',
    buyEffects: [],
    effects: [
      {
        type: 'card-round-start',
      },
    ],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Spice Refineries',
      de: 'Spice Raffinerien',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_4.png',
    buyEffects: [],
    effects: [],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Stillsuits Factory',
      de: 'Destillanzugs-Manufaktur',
    },
    faction: 'fremen',
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_2.png',
    buyEffects: [],
    effects: [
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'solari',
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'water',
      },
    ],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Lighter',
      de: 'Leichter',
    },
    costs: 6,
    imageUrl: '/assets/images/action-backgrounds/ship.png',
    buyEffects: [
      {
        type: 'troop',
      },
      {
        type: 'troop',
      },
      {
        type: 'troop',
      },
    ],
    effects: [],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Imperial Testing Station',
      de: 'Imperiale Teststation',
    },
    faction: 'emperor',
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/research_station.png',
    buyEffects: [],
    effects: [],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Bene Gesserit Conclave',
      de: 'Bene Gesserit Konklave',
    },
    faction: 'bene',
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/industry_2.png',
    buyEffects: [
      {
        type: 'faction-influence-up-choice',
      },
    ],
    customEffect: {
      en: '',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:helper-arrow-right}{resource:card-draw}<br><br><b>Aufdeckzug</b>: <br>{resource:spice;amount:2}{resource:intrigue-trash}{resource:helper-arrow-right}{resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Imperial Barracks',
      de: 'Imperiale Kaserne',
    },
    faction: 'emperor',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/military_camp.png',
    buyEffects: [],
    effects: [
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'solari',
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'troop',
      },
      {
        type: 'troop',
      },
    ],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Spy Network',
      de: 'Spionage-Netzwerk',
    },
    faction: 'bene',
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit.png',
    buyEffects: [],
    customEffect: {
      en: '',
      de: 'Du kannst deinen ersten Zug passen.<br><br><b>Aufdeckzug:</b> <br>2 Bene-Gesserit-Karten: {resource:intrigue}<br>3 Bene-Gesserit-Karten: {resource:faction-influence-up-choice}<br>4+ Bene-Gesserit-Karten: {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Embassy on Caladan ',
      de: 'Botschaft auf Caladan',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/caladan.png',
    buyEffects: [],
    effects: [],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Embassy on Giedi Prime',
      de: 'Botschaft auf Giedi Primus',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/giedi_prime.png',
    buyEffects: [],
    effects: [],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Enhanced Sandcrawler Engines',
      de: 'Verbesserte Sandcrawler- Antriebe',
    },
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/sandcrawler.png',
    buyEffects: [],
    customEffect: {
      en: '',
      de: 'Immer wenn du Spice sammelst, erhalte 1 mehr.',
      fontSize: 'medium',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Upgraded Carryall Suspensors',
      de: 'Verbesserte Carryall-Suspensoren',
    },
    costs: 2,
    imageUrl: '',
    buyEffects: [],
    customEffect: {
      en: '',
      de: 'Spice zu sammeln kostet dich {resource:water} weniger.',
      fontSize: 'medium',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Upgraded Ornithoper Engines',
      de: 'Verbesserte Ornithopertriebwerke',
    },
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/ornithopter.png',
    buyEffects: [],
    effects: [],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Smuggler outposts',
      de: 'Schmuggler-Außenposten',
    },
    faction: 'guild',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/desert_4.png',
    buyEffects: [],
    effects: [
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'spice',
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'shipping',
      },
    ],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Flagship',
      de: 'Flaggschiff',
    },
    costs: 7,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_3.png',
    buyEffects: [
      {
        type: 'victory-point',
      },
    ],
    effects: [],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Ornithoper Squadron',
      de: 'Ornithopterstaffel',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/ornithopters.png',
    buyEffects: [
      {
        type: 'troop',
      },
      {
        type: 'troop',
      },
    ],
    effects: [
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'combat',
      },
    ],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Guild Bank',
      de: 'Gilden-Bank',
    },
    faction: 'guild',
    costs: 5,
    imageUrl: '',
    buyEffects: [
      {
        type: 'faction-influence-up-choice',
      },
    ],
    customEffect: {
      en: '',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:helper-arrow-right}{resource:solari;amount:2}<br><br><b>Aufdeckzug:</b><br>Entsorge 2 "Das Spice muss fließen"-Karten für {resource:victory-point}.',
      fontSize: 'small',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Missionaria Protectiva',
      de: 'Missionaria Protectiva',
    },
    faction: 'bene',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_3.png',
    buyEffects: [
      {
        type: 'faction-influence-up-fremen',
      },
    ],
    effects: [
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'spice',
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'card-destroy',
      },
    ],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: "Governor's Palace",
      de: 'Statthalterpalast',
    },
    faction: 'emperor',
    costs: 5,
    imageUrl: '',
    buyEffects: [
      {
        type: 'faction-influence-up-choice',
      },
    ],
    customEffect: {
      en: '',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:helper-arrow-right}{resource:intrigue}<br><br><b>Aufdeckzug:</b><br>{resource:solari;amount:5} {resource:persuasion;amount:2}{resource:helper-arrow-right} {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: () => 0,
  },
];
