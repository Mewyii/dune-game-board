import { TechTileCard } from '../services/tech-tiles.service';

export const techTiles: TechTileCard[] = [
  {
    name: {
      en: 'Maula Pistol Factory',
      de: 'Maula Pistolen Fabrik',
    },
    faction: 'fremen',
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_6.png',
    buyEffects: [],
    customEffect: {
      en: '',
      de: '<b>Aufdeckzug</b>:<br>{resource:solari;amount:2}{resource:helper-arrow-right}{resource:sword} für jede Truppe im Konflikt',
      fontSize: 'medium',
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
    imageUrl: '/assets/images/action-backgrounds/industry_2 .png',
    buyEffects: [],
    customEffect: {
      en: '',
      de: 'Alle {resource:water}-Kosten sind um 1 reduziert (min. 1).',
      fontSize: 'medium',
    },
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
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/port.png',
    buyEffects: [],
    customEffect: {
      en: '',
      de: '{resource:tech-tile-flip}{resource:card-discard}{resource:helper-arrow-right}{resource:solari;amount:3}.<br><br><b>Aufdeckzug:</b> <br>2 Raumgilden-Karten: {resource:shipping}<br>3 Raumgilden-Karten: {resource:shipping}{resource:shipping}<br>4+ Raumgilden-Karten: {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Ornithopter Hangar',
      de: 'Ornithopter Hangar',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/port_2.png',
    buyEffects: [],
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
        type: 'agent-lift',
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
    imageUrl: '/assets/images/action-backgrounds/spice_port.png',
    buyEffects: [],
    customEffect: {
      en: '',
      de: 'Alle {resource:spice}-Kosten sind um 1 reduziert (min. 1).',
      fontSize: 'medium',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Stillsuits Factory',
      de: 'Destillanzugs-Manufaktur',
    },
    faction: 'fremen',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_5.png',
    buyEffects: [],
    effects: [
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'solari',
        amount: 2,
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'water',
      },
      {
        type: 'card-draw',
      },
    ],
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Lighter',
      de: 'Leichter',
    },
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_3.png',
    buyEffects: [
      {
        type: 'troop',
      },
      {
        type: 'troop',
      },
    ],
    customEffect: {
      en: '',
      de: '<b>Aufdeckzug:</b><br>{resource:sword}{resource:sword}<br><br><b>Wenn du einen Konflikt <br>gewinnst:</b><br> {resource:location-control}',
      fontSize: 'small',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Bene Gesserit Conclave',
      de: 'Bene Gesserit Konklave',
    },
    faction: 'bene',
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_7.png',
    buyEffects: [
      {
        type: 'faction-influence-up-choice',
      },
    ],
    customEffect: {
      en: '',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:helper-arrow-right}{resource:card-draw}<br><br><b>Aufdeckzug</b>: <br>{resource:spice;amount:2}{resource:intrigue-trash}{resource:helper-arrow-right}{resource:victory-point}',
      fontSize: 'medium',
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
      de: '{resource:tech-tile-flip}{resource:helper-arrow-right}Passe deinen Zug.<br><br><b>Aufdeckzug:</b> <br>2 Bene-Gesserit-Karten: {resource:intrigue}<br>3 Bene-Gesserit-Karten: {resource:faction-influence-up-choice}<br>4+ Bene-Gesserit-Karten: {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Enhanced Sandcrawler Engines',
      de: 'Verbesserte Sandcrawler- Antriebe',
    },
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/sandcrawler_2.png',
    buyEffects: [],
    customEffect: {
      en: '',
      de: '<b>Wenn du Spice sammelst:</b><br> Erhalte {resource:spice}',
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
    imageUrl: '/assets/images/action-backgrounds/carryall.png',
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
    customEffect: {
      en: '',
      de: '<b>Wenn du einen Agenten platzierst:</b> <br>{resource:tech-tile-flip}{resource:helper-arrow-right}Behalte die dafür gespielte Karte auf deiner Hand.',
      fontSize: 'small',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Smuggler outposts',
      de: 'Schmuggler-Außenposten',
    },
    faction: 'guild',
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/desert_4.png',
    buyEffects: [],
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
    costs: 8,
    imageUrl: '/assets/images/action-backgrounds/lighter.png',
    buyEffects: [
      {
        type: 'troop',
      },
      {
        type: 'troop',
      },
      {
        type: 'location-control',
      },
    ],
    customEffect: {
      en: '',
      de: '<b>Aufdeckzug:</b><br>{resource:faction-influence-down-choice}{resource:helper-arrow-right} {resource:victory-point}',
      fontSize: 'medium',
    },
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
    imageUrl: '/assets/images/action-backgrounds/arrakeen_13.png',
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
    imageUrl: '/assets/images/action-backgrounds/arrakeen_12.png',
    buyEffects: [
      {
        type: 'faction-influence-up-choice',
      },
    ],
    customEffect: {
      en: '',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:helper-arrow-right}{resource:intrigue}<br><br><b>Aufdeckzug:</b><br>{resource:solari;amount:5} {resource:persuasion;amount:2}{resource:helper-arrow-right} {resource:victory-point}',
      fontSize: 'medium',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Experimental Shields',
      de: 'Experimentelle Schilde',
    },
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/shields.png',
    buyEffects: [],
    customEffect: {
      en: '',
      de: '<b>Nach einem Konflikt:</b> <br>Schlachtschiffe müssen keine Runde aussetzen.',
      fontSize: 'medium',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Heavy Lasguns',
      de: 'Schwere Lasguns',
    },
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/lasgun.png',
    buyEffects: [],
    customEffect: {
      en: '',
      de: '<b>Wenn du ein Schlachtschiff in den Konflikt einsetzt:</b><br>Jeder Gegner verliert eine Einheit.',
      fontSize: 'small',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Sardaukar Commando Post',
      de: 'Sardaukar Kommando-Posten',
    },
    faction: 'emperor',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/emperor_camp.png',
    buyEffects: [],
    customEffect: {
      en: '',
      de: '{resource:tech-tile-flip}{resource:card-discard}{resource:helper-arrow-right}{resource:card-draw}.<br><br><b>Aufdeckzug:</b> <br>2 Imperator-Karten: {resource:sword}{resource:sword}<br>3 Imperator-Karten: {resource:sword}{resource:sword}{resource:intrigue}<br>4+ Imperator-Karten: {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: () => 0,
  },
  {
    name: {
      en: 'Artillery Arsenal',
      de: 'Artillerie-Arsenal',
    },
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/infrastructure.png',
    buyEffects: [
      {
        type: 'faction-influence-down-choice',
      },
    ],
    customEffect: {
      en: '',
      de: '<b>Aufdeckzug:</b><br>{resource:sword}{resource:sword}{resource:sword}<br><br><b>',
      fontSize: 'medium',
    },
    aiEvaluation: () => 0,
  },
];
