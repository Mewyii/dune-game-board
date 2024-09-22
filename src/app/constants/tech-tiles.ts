import { TechTileCard } from '../services/tech-tiles.service';

export const techTiles: TechTileCard[] = [
  {
    name: {
      en: 'Maula Pistol Works',
      de: 'Maula Pistolen Werk',
    },
    faction: 'fremen',
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_6.png',
    buyEffects: [],
    customEffect: {
      en: '<b>Reveal turn</b>:<br>{resource:solari;amount:2}{resource:helper-trade}{resource:sword} for each troop in conflict',
      de: '<b>Aufdeckzug</b>:<br>{resource:solari;amount:2}{resource:helper-trade}{resource:sword} für jede Truppe im Konflikt',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.3 + 0.05 * (gameState.currentRound - 1),
  },
  {
    name: {
      en: 'Wind Traps',
      de: 'Windfallen',
    },
    faction: 'fremen',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/windtraps.png',
    buyEffects: [],
    customEffect: {
      en: '<b>Round start:</b><br>{resource:water}',
      de: '<b>Rundenbeginn:</b><br>{resource:water}',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.8 - 0.1 * (gameState.currentRound - 1),
  },
  {
    name: {
      en: 'Stillsuits Factory',
      de: 'Destillanzugs-Fabrik',
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
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'water',
      },
      {
        type: 'card-draw',
      },
    ],
    aiEvaluation: (player, gameState) => 0.6,
  },
  {
    name: {
      en: 'Smuggler outposts',
      de: 'Schmuggler-Aussenposten',
    },
    faction: 'guild',
    costs: 1,
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
        type: 'helper-trade',
      },
      {
        type: 'shipping',
      },
    ],
    aiEvaluation: (player, gameState) => 0.2,
  },
  {
    name: {
      en: 'Trade Port',
      de: 'Handelshafen',
    },
    faction: 'guild',
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/port.png',
    buyEffects: [],
    customEffect: {
      en: '{resource:tech-tile-flip}{resource:card-discard}{resource:helper-trade}{resource:solari;amount:3}.<br><br><b>Reveal turn:</b> <br>2 Spacing Guild cards: {resource:shipping}<br>3 Spacing Guild cards: {resource:shipping}{resource:shipping}<br>4+ Spacing Guild cards: {resource:victory-point}',
      de: '{resource:tech-tile-flip}{resource:card-discard}{resource:helper-trade}{resource:solari;amount:3}.<br><br><b>Aufdeckzug:</b> <br>2 Raumgilden-Karten: {resource:shipping}<br>3 Raumgilden-Karten: {resource:shipping}{resource:shipping}<br>4+ Raumgilden-Karten: {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) => 0.6 + 0.05 * gameState.playerCardsBought + 0.05 * gameState.playerCardsTrashed,
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
      en: '<b>Round start:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:solari;amount:2}<br><br><b>Reveal turn:</b><br>Trash 2 "The Spice Must Flow" cards for {resource:victory-point}.',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:solari;amount:2}<br><br><b>Aufdeckzug:</b><br>Entsorge 2 "Das Spice muss fließen"-Karten für {resource:victory-point}.',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) =>
      0.7 + 0.025 * gameState.playerCardsBought + 0.025 * gameState.playerCardsTrashed + (player.hasCouncilSeat ? 0.1 : 0.0),
  },
  {
    name: {
      en: 'Sardaukar Commando Post',
      de: 'Sardaukar Kommando-Posten',
    },
    faction: 'emperor',
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/emperor_camp.png',
    buyEffects: [],
    customEffect: {
      en: '{resource:tech-tile-flip}{resource:card-discard}{resource:helper-trade}{resource:card-draw}.<br><br><b>Reveal turn:</b> <br>2 Emperor cards: {resource:sword}{resource:sword}<br>3 Emperor cards: {resource:sword}{resource:sword}{resource:intrigue}<br>4+ Emperor cards: {resource:victory-point}',
      de: '{resource:tech-tile-flip}{resource:card-discard}{resource:helper-trade}{resource:card-draw}.<br><br><b>Aufdeckzug:</b> <br>2 Imperator-Karten: {resource:sword}{resource:sword}<br>3 Imperator-Karten: {resource:sword}{resource:sword}{resource:intrigue}<br>4+ Imperator-Karten: {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) => 0.7 + 0.025 * gameState.playerCardsBought - 0.05 * gameState.playerCardsTrashed,
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
        type: 'helper-trade',
      },
      {
        type: 'troop',
      },
      {
        type: 'troop',
      },
    ],
    aiEvaluation: (player, gameState) => 0.6,
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
      en: '<b>Round start:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:intrigue}<br><br><b>Reveal turn:</b><br>{resource:solari;amount:5} {resource:persuasion;amount:2}{resource:helper-trade} {resource:victory-point}',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:intrigue}<br><br><b>Aufdeckzug:</b><br>{resource:solari;amount:5} {resource:persuasion;amount:2}{resource:helper-trade} {resource:victory-point}',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) =>
      0.7 +
      0.025 * gameState.playerCardsBought +
      0.025 * gameState.playerCardsTrashed +
      (player.hasSwordmaster ? 0.1 : 0.0) +
      (player.hasCouncilSeat ? 0.1 : 0.0),
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
      en: '{resource:tech-tile-flip}{resource:helper-trade}Pass your turn.<br><br><b>Aufdeckzug:</b> <br>2 Bene-Gesserit-cards: {resource:intrigue}<br>3 Bene-Gesserit-cards: {resource:faction-influence-up-choice}<br>4+ Bene-Gesserit-cards: {resource:victory-point}',
      de: '{resource:tech-tile-flip}{resource:helper-trade}Passe deinen Zug.<br><br><b>Aufdeckzug:</b> <br>2 Bene-Gesserit-Karten: {resource:intrigue}<br>3 Bene-Gesserit-Karten: {resource:faction-influence-up-choice}<br>4+ Bene-Gesserit-Karten: {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) =>
      0.5 - 0.05 * (gameState.currentRound - 1) + 0.05 * gameState.playerCardsBought + 0.05 * gameState.playerCardsTrashed,
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
        type: 'helper-trade',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'card-destroy',
      },
    ],
    aiEvaluation: (player, gameState) => 0.6 - 0.05 * gameState.playerCardsBought - 0.05 * gameState.playerCardsTrashed,
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
      en: '<b>Round start:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:card-draw}<br><br><b>Reveal turn</b>: <br>{resource:spice;amount:2}{resource:intrigue-trash}{resource:helper-trade}{resource:victory-point}',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:card-draw}<br><br><b>Aufdeckzug</b>: <br>{resource:spice;amount:2}{resource:intrigue-trash}{resource:helper-trade}{resource:victory-point}',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) =>
      0.6 + 0.05 * gameState.playerCardsBought + 0.05 * gameState.playerCardsTrashed + (player.hasSwordmaster ? 0.1 : 0.0),
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
        type: 'helper-trade',
      },
      {
        type: 'agent-lift',
      },
    ],
    aiEvaluation: (player, gameState) => 0.4 + 0.05 * (gameState.currentRound - 1),
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
      en: 'All {resource:spice} -costs are reduced by 1 (min. 1).',
      de: 'Alle {resource:spice} -Kosten sind um 1 reduziert (min. 1).',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.7 - 0.05 * (gameState.currentRound - 1),
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
      en: '<b>Reveal turn:</b><br>{resource:sword}{resource:sword}<br><br><b>When you win a conflict:</b><br> {resource:location-control}',
      de: '<b>Aufdeckzug:</b><br>{resource:sword}{resource:sword}<br><br><b>Wenn du einen Konflikt <br>gewinnst:</b><br> {resource:location-control}',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) => 0.7 + 0.1 * gameState.playerDreadnoughtCount,
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
      en: '<b>When you harvest spice:</b><br>{resource:spice}',
      de: '<b>Wenn du Spice sammelst:</b><br>{resource:spice}',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.8 - 0.15 * (gameState.currentRound - 1),
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
      en: 'Harvesting spice costs you {resource:water} less.',
      de: 'Spice zu sammeln kostet dich {resource:water} weniger.',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.8 - 0.15 * (gameState.currentRound - 1),
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
      en: '<b>When you place an agent:</b> <br>{resource:tech-tile-flip}{resource:helper-trade}Keep the played card in your hand.',
      de: '<b>Wenn du einen Agenten platzierst:</b> <br>{resource:tech-tile-flip}{resource:helper-trade}Behalte die dafür gespielte Karte auf deiner Hand.',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) => 0.1 + 0.1 * gameState.playerCardsBought + 0.1 * gameState.playerCardsTrashed,
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
      en: '<b>Reveal turn:</b><br>{resource:faction-influence-down-choice}{resource:helper-trade} {resource:victory-point}',
      de: '<b>Aufdeckzug:</b><br>{resource:faction-influence-down-choice}{resource:helper-trade} {resource:victory-point}',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) =>
      0.3 +
      0.05 * gameState.playerScore.bene +
      0.05 * gameState.playerScore.emperor +
      0.05 * gameState.playerScore.fremen +
      0.05 * gameState.playerScore.guild,
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
        type: 'helper-trade',
      },
      {
        type: 'combat',
      },
    ],
    aiEvaluation: (player, gameState) => 0.2 + 0.05 * (gameState.currentRound - 1),
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
      en: '<b>After a conflict:</b> <br>Dreadnoughts have no timeout.',
      de: '<b>Nach einem Konflikt:</b> <br>Schlachtschiffe müssen keine Runde aussetzen.',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.0 + 0.4 * gameState.playerDreadnoughtCount,
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
      en: '<b>When you send a dreadnought into the conflict:</b><br>Each opponent loses a unit.',
      de: '<b>Wenn du ein Schlachtschiff in den Konflikt einsetzt:</b><br>Jeder Gegner verliert eine Einheit.',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.0 + 0.4 * gameState.playerDreadnoughtCount,
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
      en: '<b>Reveal turn:</b><br>{resource:sword}{resource:sword}{resource:sword}<br><br><b>',
      de: '<b>Aufdeckzug:</b><br>{resource:sword}{resource:sword}{resource:sword}<br><br><b>',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.6 - 0.05 * (gameState.currentRound - 1),
  },
];
