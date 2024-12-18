import { TechTileCard } from '../models/tech-tile';

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
    aiEvaluation: (player, gameState) => 0.25 + 0.05 * (gameState.currentRound - 1),
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
    costs: 4,
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
    aiEvaluation: (player, gameState) =>
      0.4 + 0.025 * (gameState.currentRound - 1) + 0.01 * gameState.playerCardsBought + 0.01 * gameState.playerCardsTrashed,
  },
  {
    name: {
      en: 'Smuggler outposts',
      de: 'Schmuggler-Aussenposten',
    },
    faction: 'guild',
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/desert_4.png',
    buyEffects: [],
    customEffect: {
      en: '<b>Round start:</b><br>{resource:tech-tile-flip}{resource:card-discard}{resource:helper-trade}{resource:shipping}<br><br><b>Reveal turn:</b> <br>{resource:tech}',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:card-discard}{resource:helper-trade}{resource:shipping}<br><br><b>Aufdeckzug:</b> <br>{resource:tech}',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.5 - 0.05 * (gameState.currentRound - 1),
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
      en: '{resource:tech-tile-flip}{resource:card-discard}{resource:helper-trade}{resource:solari;amount:3}<br><br><b>Reveal turn:</b> <br>{faction:guild} -Connections<br> 2 {resource:shipping}{resource:helper-or}3 {resource:shipping}{resource:shipping}{resource:helper-or} 4+ {resource:victory-point}',
      de: '{resource:tech-tile-flip}{resource:card-discard}{resource:helper-trade}{resource:solari;amount:3}<br><br><b>Aufdeckzug:</b> <br>{faction:guild} -Verbindungen<br> 2 {resource:shipping}{resource:helper-or}3 {resource:shipping}{resource:shipping}{resource:helper-or} 4+ {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) =>
      0.6 - 0.033 * (gameState.currentRound - 1) + 0.01 * gameState.playerCardsBought + 0.01 * gameState.playerCardsTrashed,
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
      en: '<b>Round start:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:solari;amount:2}<br><br><b>Reveal turn:</b><br>{resource:spice;amount:3}{resource:loose-troop}{resource:helper-trade}{resource:victory-point}',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:solari;amount:2}<br><br><b>Aufdeckzug:</b><br>{resource:spice;amount:3}{resource:loose-troop}{resource:helper-trade}{resource:victory-point}',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) =>
      0.6 +
      0.02 * (gameState.currentRound - 1) +
      0.01 * gameState.playerCardsBought +
      0.01 * gameState.playerCardsTrashed +
      (player.hasCouncilSeat ? 0.1 : 0.0),
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
      en: '{resource:tech-tile-flip}{resource:card-discard}{resource:helper-trade}{resource:card-draw}.<br><br><b>Reveal turn:</b> <br>{faction:emperor} -Connections<br> 2 {resource:sword}{resource:sword}{resource:helper-or}3 {resource:sword}{resource:intrigue}{resource:helper-or} 4+ {resource:victory-point}',
      de: '{resource:tech-tile-flip}{resource:card-discard}{resource:helper-trade}{resource:card-draw}.<br><br><b>Aufdeckzug:</b> <br>{faction:emperor} -Verbindungen<br> 2 {resource:sword}{resource:sword}{resource:helper-or}3 {resource:sword}{resource:intrigue}{resource:helper-or} 4+ {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) =>
      0.5 - 0.01 * (gameState.currentRound - 1) + 0.01 * gameState.playerCardsBought + 0.01 * gameState.playerCardsTrashed,
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
    customEffect: {
      en: '<b>Round start:</b><br>{resource:tech-tile-flip}{resource:solari}{resource:helper-trade}{resource:troop}{resource:troop}',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:solari}{resource:helper-trade}{resource:troop}{resource:troop}',
      fontSize: 'medium',
    },
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
      0.6 +
      0.02 * (gameState.currentRound - 1) +
      0.01 * gameState.playerCardsBought +
      0.01 * gameState.playerCardsTrashed +
      (player.hasSwordmaster ? 0.1 : 0.0) +
      (player.hasCouncilSeat ? 0.1 : 0.0) -
      0.05 * gameState.playerIntrigueCount,
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
      en: '{resource:tech-tile-flip}{resource:helper-trade}Pass your turn.<br><br><b>Aufdeckzug:</b> <br>{faction:bene} -Connections<br> 2 {resource:intrigue}{resource:helper-or}3 {resource:faction-influence-up-choice}{resource:helper-or} 4+ {resource:victory-point}',
      de: '{resource:tech-tile-flip}{resource:helper-trade}Passe deinen Zug.<br><br><b>Aufdeckzug:</b> <br>{faction:bene} -Verbindungen<br> 2 {resource:intrigue}{resource:helper-or}3 {resource:faction-influence-up-choice}{resource:helper-or} 4+ {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) =>
      0.25 + 0.01 * (gameState.currentRound - 1) + 0.01 * gameState.playerCardsBought + 0.01 * gameState.playerCardsTrashed,
  },
  {
    name: {
      en: 'Missionaria Protectiva',
      de: 'Missionaria Protectiva',
    },
    faction: 'bene',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_3.png',
    customEffect: {
      en: '<b>Round start:</b><br>{resource:water}{resource:helper-trade}{resource:faction-influence-up-choice}',
      de: '<b>Rundenbeginn:</b><br>{resource:water}{resource:helper-trade}{resource:faction-influence-up-choice}',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.7,
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
      en: '<b>Round start:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:card-draw}<br><br><b>Reveal turn</b>: <br>{resource:spice;amount:3}{resource:intrigue-trash}{resource:helper-trade}{resource:victory-point}',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:card-draw}<br><br><b>Aufdeckzug</b>: <br>{resource:spice;amount:3}{resource:intrigue-trash}{resource:helper-trade}{resource:victory-point}',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) =>
      0.6 +
      0.01 * (gameState.currentRound - 1) +
      0.02 * gameState.playerCardsBought +
      0.01 * gameState.playerCardsTrashed +
      (player.hasSwordmaster ? 0.1 : 0.0),
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
    aiEvaluation: (player, gameState) => 0.3 + 0.05 * (gameState.currentRound - 1) + (player.hasSwordmaster ? 0.1 : 0.0),
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
    aiEvaluation: (player, gameState) => 0.7 - 0.075 * (gameState.currentRound - 1),
    gameModifiers: {
      fieldCost: [{ id: 'spice-refineries', costType: 'spice', amount: -1 }],
    },
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
    aiEvaluation: (player, gameState) => 0.4 + 0.1 * gameState.playerDreadnoughtCount + 0.033 * (gameState.currentRound - 1),
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
      en: '<b>When you place an agent on a {faction:spice}-field:</b><br>{resource:spice}',
      de: '<b>Wenn du einen Agenten auf einem {faction:spice}-Feld platzierst:</b><br>{resource:spice}',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.8 - 0.125 * (gameState.currentRound - 1),
    gameModifiers: {
      fieldReward: [{ id: 'sandcrawler-engines', actionType: 'spice', rewardType: 'spice', amount: 1 }],
    },
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
      en: 'Access to {faction:spice} board spaces costs {resource:water} less.',
      de: 'Der Zugang zu {faction:spice}-Feldern kostet {resource:water} weniger.',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.8 - 0.125 * (gameState.currentRound - 1),
    gameModifiers: {
      fieldCost: [{ id: 'carryall-suspensors', actionType: 'spice', costType: 'water', amount: -1 }],
    },
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
    aiEvaluation: (player, gameState) => 0.25 + 0.025 * gameState.playerCardsBought + 0.025 * gameState.playerCardsTrashed,
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
      0.25 +
      0.033 * (gameState.currentRound - 1) +
      (player.hasSwordmaster ? 0.1 : 0.0) +
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
    aiEvaluation: (player, gameState) => 0.25 + 0.075 * (gameState.currentRound - 1),
  },
  {
    name: {
      en: 'Experimental Shields',
      de: 'Experimentelle Schilde',
    },
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/shields.png',
    buyEffects: [],
    customEffect: {
      en: '<b>After the combat phase:</b> <br>Dreadnoughts have no timeout.',
      de: '<b>Nach der Kampf-Phase:</b> <br>Schlachtschiffe müssen keine Runde aussetzen.',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.0 + 0.5 * gameState.playerDreadnoughtCount,
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
      en: 'Barrage Rockets',
      de: 'Sperrfeuerraketen',
    },
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/assault.png',
    buyEffects: [],
    customEffect: {
      en: '{resource:tech-tile-flip}{resource:helper-trade}Choose any board space. It is blocked this round.<br><br><b>Reveal turn</b>: <br>{resource:sword}{resource:sword}',
      de: '{resource:tech-tile-flip}{resource:helper-trade}Wähle ein beliebiges Feld. Es ist für diese Runde blockiert.<br><br><b>Aufdeckzug</b>: <br>{resource:sword}{resource:sword}',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) =>
      0.2 + 0.025 * (gameState.currentRound - 1) + 0.05 * gameState.playerDreadnoughtCount,
  },
  {
    name: {
      en: 'Artillery Arsenal',
      de: 'Artillerie-Arsenal',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/infrastructure.png',
    buyEffects: [
      {
        type: 'faction-influence-down-choice',
      },
    ],
    customEffect: {
      en: '<b>Reveal turn:</b><br>{resource:sword}{resource:sword}{resource:sword}{resource:sword}<br><br><b>',
      de: '<b>Aufdeckzug:</b><br>{resource:sword}{resource:sword}{resource:sword}{resource:sword}<br><br><b>',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) =>
      0.7 + 0.05 * gameState.playerDreadnoughtCount - 0.025 * (gameState.currentRound - 1),
  },
  {
    name: {
      en: 'Gunship',
      de: 'Panzerschiff',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/dreadnought.png',
    buyEffects: [],
    customEffect: {
      en: '<b>Reveal turn:</b><br>{resource:sword}{resource:sword}{resource:helper-or}Remove control of a location where one of your agents is.',
      de: '<b>Aufdeckzug</b>:<br>{resource:sword}{resource:sword}{resource:helper-or}Entferne die Kontrolle über einen Ort, auf dem sich einer deiner Agenten befindet.',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.3 + 0.033 * (gameState.currentRound - 1),
  },
];
