import { TechTileCard } from '../models/tech-tile';

export const techTiles: TechTileCard[] = [
  {
    name: {
      en: 'Maula Pistol Works',
      de: 'Maula-Pistolen Werk',
    },
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_6.png',
    imagePosition: 'top',
    buyEffects: [],
    customEffect: {
      en: '<b>Reveal turn</b>:<br>{resource:tech-tile-flip} {resource:solari;amount:2}{resource:helper-trade}{resource:sword} for each of your troops in conflict',
      de: '<b>Aufdeckzug</b>:<br>{resource:tech-tile-flip} {resource:solari;amount:2}{resource:helper-trade}{resource:sword} für jede deiner Truppen im Konflikt',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) =>
      0.25 + 0.05 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsRewards.solari,
  },
  {
    name: {
      en: 'Smuggler outposts',
      de: 'Schmuggler-Aussenposten',
    },
    faction: 'guild',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/desert_4.png',
    imagePosition: 'center',
    buyEffects: [
      {
        type: 'foldspace',
      },
    ],
    customEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    effectSize: 'medium',
    effects: [
      {
        type: 'timing-reveal-turn',
      },
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
        type: 'tech',
        amount: 2,
      },
    ],
    aiEvaluation: (player, gameState) =>
      0.6 - 0.025 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsRewards.solari,
  },
  {
    name: {
      en: 'Imperial Barracks',
      de: 'Imperiale Kaserne',
    },
    faction: 'emperor',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/military_camp.png',
    imagePosition: 'center',
    buyEffects: [],
    customEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    effectSize: 'medium',
    effects: [
      {
        type: 'timing-reveal-turn',
      },
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'solari',
      },
      {
        type: 'tech',
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
    aiEvaluation: (player, gameState) =>
      0.35 +
      0.033 * (gameState.currentRound - 1) +
      0.066 * gameState.playerCardsRewards.solari +
      0.033 * gameState.playerCardsFactions.emperor,
  },
  {
    name: {
      en: 'Upgraded Carryall Suspensors',
      de: 'Verbesserte Carryall-Suspensoren',
    },
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/carryall.png',
    imagePosition: 'center',
    buyEffects: [],
    customEffect: {
      en: 'Access to {faction:spice} board spaces costs {resource:water} less.',
      de: 'Der Zugang zu {faction:spice}-Feldern kostet {resource:water} weniger.',
      fontSize: 'medium',
    },
    gameModifiers: {
      fieldCost: [
        {
          id: 'carryall-suspensors',
          actionType: 'spice',
          costType: 'water',
          amount: -1,
        },
      ],
    },
    aiEvaluation: (player, gameState) => 0.8 - 0.1 * (gameState.currentRound - 1),
  },
  {
    name: {
      en: 'Spice transport modules',
      de: 'Spice-Transportmodule',
    },
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/industry.png',
    imagePosition: 'top',
    buyEffects: [],
    customEffect: {
      en: '{resource:tech-tile-flip} {resource:helper-trade} Retreat a {resource:dreadnought} to gain {resource:spice}.',
      de: '{resource:tech-tile-flip} {resource:helper-trade} Ziehe ein {resource:dreadnought} zurück, um {resource:spice} zu erhalten.',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.0 + 0.5 * gameState.playerDreadnoughtCount,
  },
  {
    name: {
      en: 'Spy modules',
      de: 'Spionagemodule',
    },
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_7.png',
    imagePosition: 'bottom',
    buyEffects: [],
    customEffect: {
      en: '{resource:tech-tile-flip} {resource:helper-trade} Retreat a {resource:dreadnought} to gain {resource:tech}.',
      de: '{resource:tech-tile-flip} {resource:helper-trade} Ziehe ein {resource:dreadnought} zurück, um {resource:tech} zu erhalten.',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.0 + 0.5 * gameState.playerDreadnoughtCount,
  },
  {
    name: {
      en: 'Spy Network',
      de: 'Spionage-Netzwerk',
    },
    faction: 'bene',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit.png',
    imagePosition: 'center',
    buyEffects: [],
    customEffect: {
      en: '{resource:tech-tile-flip} {resource:card-discard}{resource:helper-trade}{resource:signet-ring} and pass your turn.',
      de: '{resource:tech-tile-flip} {resource:card-discard}{resource:helper-trade}{resource:signet-ring} und<br> passe deinen Zug.',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) =>
      0.3 + 0.02 * (gameState.currentRound - 1) + 0.033 * gameState.playerCardsFactions.bene,
  },
  {
    name: {
      en: 'Wind Traps',
      de: 'Windfallen',
    },
    faction: 'fremen',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/windtraps.png',
    imagePosition: 'center',
    buyEffects: [],
    customEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    effectSize: 'medium',
    effects: [
      {
        type: 'timing-round-start',
      },
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
        type: 'water',
      },
    ],
    aiEvaluation: (player, gameState) =>
      0.65 - 0.075 * (gameState.currentRound - 1) + 0.033 * gameState.playerCardsFactions.fremen,
  },
  {
    name: {
      en: 'Heavy Lasguns',
      de: 'Schwere Lasguns',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/lasgun.png',
    imagePosition: 'center',
    buyEffects: [],
    customEffect: {
      en: '{resource:tech-tile-flip}{resource:helper-trade}Each opponent {resource:card-discard} for each of your {resource:dreadnought} in combat.',
      de: '{resource:tech-tile-flip}{resource:helper-trade}Jeder Gegner {resource:card-discard} für jedes deiner {resource:dreadnought} im Konflikt.',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.0 + 0.5 * gameState.playerDreadnoughtCount,
  },
  {
    name: {
      en: 'Enhanced Sandcrawler Engines',
      de: 'Verbesserte Sandcrawler- Antriebe',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/sandcrawler_2.png',
    imagePosition: 'center',
    buyEffects: [],
    customEffect: {
      en: '<b>When you place an agent <br>on a {faction:spice}-field:</b><br>{resource:spice}',
      de: '<b>Wenn du einen Agenten auf <br>einem {faction:spice}-Feld platzierst:</b><br>{resource:spice}',
      fontSize: 'small',
    },
    gameModifiers: {
      fieldReward: [
        {
          id: 'sandcrawler-engines',
          actionType: 'spice',
          rewardType: 'spice',
          amount: 1,
        },
      ],
    },
    aiEvaluation: (player, gameState) => 0.85 - 0.125 * (gameState.currentRound - 1),
  },
  {
    name: {
      en: 'Trade Port',
      de: 'Handelshafen',
    },
    faction: 'guild',
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/port.png',
    imagePosition: 'bottom',
    buyEffects: [],
    customEffect: {
      en: '<b>Round start:</b><br>{resource:tech-tile-flip} {resource:tech}{resource:helper-trade}{resource:solari;amount:3}<br><br><b>Reveal turn:</b> <br>{faction:guild} -Connections<br> 2 {resource:shipping}{resource:helper-or}3 {resource:shipping}{resource:shipping}{resource:helper-or} 4+ {resource:victory-point}',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip} {resource:tech}{resource:helper-trade}{resource:solari;amount:3}<br><br><b>Aufdeckzug:</b> <br>{faction:guild} -Verbindungen<br> 2 {resource:shipping}{resource:helper-or}3 {resource:shipping}{resource:shipping}{resource:helper-or} 4+ {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) =>
      0.6 - 0.033 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsFactions.guild,
  },
  {
    name: {
      en: 'Upgraded Ornithoper Engines',
      de: 'Verbesserte Ornithopertriebwerke',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/ornithopter.png',
    imagePosition: 'center',
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
      en: 'Barrage Rockets',
      de: 'Sperrfeuerraketen',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/assault.png',
    imagePosition: 'center',
    buyEffects: [],
    customEffect: {
      en: '{resource:tech-tile-flip} {resource:tech}{resource:helper-trade}Choose any board space. It is blocked this round.<br><br>{resource:tech-tile-flip}{resource:helper-trade}For each of your {resource:dreadnought} in conflict: Each opponent retreats one troop.',
      de: '{resource:tech-tile-flip} {resource:tech}{resource:helper-trade}Wähle ein beliebiges Feld. Es ist für diese Runde blockiert.<br><br>{resource:tech-tile-flip}{resource:helper-trade}Für jedes deiner {resource:dreadnought} im Konflikt: Jeder Gegner zieht einen Trupp zurück.',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) =>
      0.3 + 0.033 * (gameState.currentRound - 1) + 0.05 * gameState.playerDreadnoughtCount,
  },
  {
    name: {
      en: 'Artillery Arsenal',
      de: 'Artillerie-Arsenal',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/infrastructure.png',
    imagePosition: 'top',
    buyEffects: [
      {
        type: 'faction-influence-down-choice',
      },
    ],
    customEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    effectSize: 'medium',
    effects: [
      {
        type: 'timing-reveal-turn',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
    ],
    aiEvaluation: (player, gameState) =>
      0.7 +
      0.05 * gameState.playerDreadnoughtCount -
      0.033 * (gameState.currentRound - 1) +
      0.025 * gameState.playerCardsRewards.sword,
  },
  {
    name: {
      en: 'Ornithopter Hangar',
      de: 'Ornithopter Hangar',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/port_2.png',
    imagePosition: 'center',
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
    effectSize: 'large',
    customEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) => 0.3 + 0.05 * (gameState.currentRound - 1) + (player.hasSwordmaster ? 0.1 : 0.0),
  },
  {
    name: {
      en: 'Shieldbreakers',
      de: 'Schildbrecher',
    },
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/shields.png',
    imagePosition: 'center',
    buyEffects: [],
    customEffect: {
      en: '{resource:tech-tile-flip} {resource:tech}{resource:helper-trade} For each of your {resource:dreadnought} in conflict: {resource:sword}{resource:sword}{resource:sword}{resource:helper-or}Put a {resource:dreadnought} in a garrison of your choice into a timeout until the next round.',
      de: '{resource:tech-tile-flip} {resource:tech}{resource:helper-trade} Für jedes deiner {resource:dreadnought} im Konflikt: {resource:sword}{resource:sword}{resource:sword}{resource:helper-or}Ein {resource:dreadnought} in einer Garnison deiner Wahl setzt bis zum Ende der Runde aus.',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) => 0.0 + 0.5 * gameState.playerDreadnoughtCount,
  },
  {
    name: {
      en: 'Botanical Research Station',
      de: 'Botanische Forschungsstation',
    },
    faction: 'fremen',
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/research_station.png',
    imagePosition: 'center',
    buyEffects: [],
    customEffect: {
      en: '<b>Round start:</b><br>{resource:tech-tile-flip} {resource:tech}{resource:helper-trade}{resource:card-draw}{resource:focus}<br><br><b>Reveal turn:</b> <br>{faction:fremen} -Connections<br> 2 {resource:tech}{resource:helper-or}3 {resource:water}{resource:tech}{resource:helper-or} 4+ {resource:victory-point}',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip} {resource:tech}{resource:helper-trade}{resource:card-draw}{resource:focus}<br><br><b>Aufdeckzug:</b> <br>{faction:fremen} -Verbindungen<br> 2 {resource:tech}{resource:helper-or}3 {resource:water}{resource:tech}{resource:helper-or} 4+ {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) =>
      0.4 + 0.015 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsFactions.fremen,
  },
  {
    name: {
      en: 'Sardaukar Commando Post',
      de: 'Sardaukar Kommando-Posten',
    },
    faction: 'emperor',
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/emperor_camp.png',
    imagePosition: 'top',
    buyEffects: [
      {
        type: 'troop',
      },
    ],
    customEffect: {
      en: '<b>Round start:</b><br>{resource:tech-tile-flip} {resource:card-draw}{resource:helper-trade}{resource:card-discard}<br><br><b>Reveal turn:</b> <br>{faction:emperor} -Connections<br> 2 {resource:sword}{resource:sword}{resource:helper-or}3 {resource:sword}{resource:intrigue}{resource:helper-or} 4+ {resource:victory-point}',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip} {resource:card-draw}{resource:helper-trade}{resource:card-discard}<br><br><b>Aufdeckzug:</b> <br>{faction:emperor} -Verbindungen<br> 2 {resource:sword}{resource:sword}{resource:helper-or}3 {resource:sword}{resource:intrigue}{resource:helper-or} 4+ {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) =>
      0.5 + 0.01 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsFactions.emperor,
  },
  {
    name: {
      en: 'Missionaria Protectiva',
      de: 'Missionaria Protectiva',
    },
    faction: 'bene',
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_3.png',
    imagePosition: 'bottom',
    buyEffects: [],
    customEffect: {
      en: '<b>Round start:</b><br>{resource:tech-tile-flip} {resource:water}{resource:helper-trade}{resource:faction-influence-up-choice}<br><br><b>Reveal turn:</b> <br>{faction:bene} -Connections<br> 2 {resource:intrigue}{resource:helper-or}3 {resource:faction-influence-up-choice}{resource:helper-or} 4+ {resource:victory-point}',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip} {resource:water}{resource:helper-trade}{resource:faction-influence-up-choice}<br><br><b>Aufdeckzug:</b> <br>{faction:bene} -Verbindungen<br> 2 {resource:intrigue}{resource:helper-or}3 {resource:faction-influence-up-choice}{resource:helper-or} 4+ {resource:victory-point}',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) =>
      0.2 + 0.033 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsRewards.water,
  },
  {
    name: {
      en: 'Stillsuits Factory',
      de: 'Destillanzugs-Fabrik',
    },
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_5.png',
    imagePosition: 'center',
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
        type: 'helper-trade',
      },
      {
        type: 'water',
      },
      {
        type: 'card-draw',
      },
    ],
    effectSize: 'large',
    customEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) =>
      0.3 +
      0.025 * (gameState.currentRound - 1) +
      0.01 * gameState.playerCardsBought +
      0.01 * gameState.playerCardsTrashed +
      0.066 * gameState.playerCardsRewards.solari,
  },
  {
    name: {
      en: 'Spice Refineries',
      de: 'Spice Raffinerien',
    },
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/spice_port.png',
    imagePosition: 'center',
    buyEffects: [],
    customEffect: {
      en: 'All {resource:spice} -costs are reduced by 1 (min. 1).',
      de: 'Alle {resource:spice} -Kosten sind um 1 reduziert (min. 1).',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) => 0.65 - 0.05 * (gameState.currentRound - 1),
    gameModifiers: {
      fieldCost: [
        {
          id: 'spice-refineries',
          costType: 'spice',
          amount: -1,
          minCosts: 1,
        },
      ],
      techTiles: [
        {
          id: 'spice-refineries',
          spiceAmount: -1,
          minCosts: 1,
        },
      ],
    },
  },
  {
    name: {
      en: 'Ornithoper Squadron',
      de: 'Ornithopterstaffel',
    },
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/ornithopters.png',
    imagePosition: 'center',
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
    effectSize: 'large',
    customEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) =>
      0.25 +
      0.075 * (gameState.currentRound - 1) +
      0.05 * gameState.playerDreadnoughtCount +
      0.025 * gameState.playerCardsRewards.sword,
  },
  {
    name: {
      en: 'Gunship',
      de: 'Panzerschiff',
    },
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/dreadnought.png',
    imagePosition: 'center',
    buyEffects: [
      {
        type: 'troop',
      },
    ],
    customEffect: {
      en: '<b>Reveal turn:</b><br>{resource:sword}{resource:sword}{resource:helper-or}Remove control of a location where one of your agents is.',
      de: '<b>Aufdeckzug</b>:<br>{resource:sword}{resource:sword}{resource:helper-or}Entferne die Kontrolle über einen Ort, auf dem sich einer deiner Agenten befindet.',
      fontSize: 'small',
    },
    aiEvaluation: (player, gameState) =>
      0.3 +
      0.033 * (gameState.currentRound - 1) +
      0.075 * gameState.playerDreadnoughtCount +
      0.025 * gameState.playerCardsRewards.sword,
  },
  {
    name: {
      en: 'Sietch',
      de: 'Sietch',
    },
    faction: 'fremen',
    costs: 6,
    imageUrl: '/assets/images/action-backgrounds/desert_4.png',
    imagePosition: 'top',
    buyEffects: [
      {
        type: 'faction-influence-up-fremen',
      },
    ],
    customEffect: {
      en: '<b>Round start:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:troop}<br><br><b>Reveal turn:</b><br>{resource:tech-tile-flip} {resource:water}{resource:water}{resource:water}{resource:helper-trade}{resource:victory-point}',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:troop}<br><br><b>Aufdeckzug:</b><br>{resource:tech-tile-flip} {resource:water}{resource:water}{resource:water}{resource:helper-trade}{resource:victory-point}',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) =>
      0.6 +
      0.02 * (gameState.currentRound - 1) +
      0.01 * gameState.playerCardsBought +
      0.01 * gameState.playerCardsTrashed +
      (player.hasCouncilSeat ? 0.1 : 0.0) +
      0.033 * gameState.playerCardsRewards.water +
      0.033 * gameState.playerCardsFactions.fremen,
  },
  {
    name: {
      en: 'Guild Bank',
      de: 'Gilden-Bank',
    },
    faction: 'guild',
    costs: 6,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_13.png',
    imagePosition: 'center',
    buyEffects: [
      {
        type: 'faction-influence-up-guild',
      },
    ],
    customEffect: {
      en: '<b>Round start:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:solari;amount:2}<br><br><b>Reveal turn:</b><br>{resource:tech-tile-flip} {resource:spice;amount:4}{resource:helper-trade}{resource:victory-point}',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:solari;amount:2}<br><br><b>Aufdeckzug:</b><br>{resource:tech-tile-flip} {resource:spice;amount:4}{resource:helper-trade}{resource:victory-point}',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) =>
      0.6 +
      0.02 * (gameState.currentRound - 1) +
      0.01 * gameState.playerCardsBought +
      0.01 * gameState.playerCardsTrashed +
      (player.hasCouncilSeat ? 0.1 : 0.0) +
      0.033 * gameState.playerCardsRewards.spice,
  },
  {
    name: {
      en: "Governor's Palace",
      de: 'Statthalterpalast',
    },
    faction: 'emperor',
    costs: 6,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_12.png',
    imagePosition: 'top',
    buyEffects: [
      {
        type: 'faction-influence-up-emperor',
      },
    ],
    customEffect: {
      en: '<b>Round start:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:intrigue}<br><br><b>Reveal turn:</b><br>{resource:tech-tile-flip} {resource:solari;amount:6}{resource:helper-trade}{resource:victory-point}',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:intrigue}<br><br><b>Aufdeckzug:</b><br>{resource:tech-tile-flip} {resource:solari;amount:6}{resource:helper-trade}{resource:victory-point}',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) =>
      0.6 +
      0.02 * (gameState.currentRound - 1) +
      0.01 * gameState.playerCardsBought +
      0.01 * gameState.playerCardsTrashed +
      (player.hasSwordmaster ? 0.1 : 0.0) +
      (player.hasCouncilSeat ? 0.1 : 0.0) -
      0.05 * gameState.playerIntrigueCount +
      0.033 * gameState.playerCardsRewards.solari +
      0.033 * gameState.playerCardsFactions.emperor,
  },
  {
    name: {
      en: 'Bene Gesserit Conclave',
      de: 'Bene Gesserit Konklave',
    },
    faction: 'bene',
    costs: 6,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_7.png',
    imagePosition: 'center',
    buyEffects: [
      {
        type: 'faction-influence-up-bene',
      },
    ],
    customEffect: {
      en: '<b>Round start:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:card-draw}<br><br><b>Reveal turn</b>: <br>{resource:tech-tile-flip} {resource:water}{resource:spice}{resource:intrigue-trash}{resource:helper-trade}{resource:victory-point}',
      de: '<b>Rundenbeginn:</b><br>{resource:tech-tile-flip}{resource:helper-trade}{resource:card-draw}<br><br><b>Aufdeckzug</b>: <br>{resource:tech-tile-flip} {resource:water}{resource:spice}{resource:intrigue-trash}{resource:helper-trade}{resource:victory-point}',
      fontSize: 'medium',
    },
    aiEvaluation: (player, gameState) =>
      0.6 +
      0.01 * (gameState.currentRound - 1) +
      0.02 * gameState.playerCardsBought +
      0.01 * gameState.playerCardsTrashed +
      (player.hasSwordmaster ? 0.1 : 0.0) +
      0.033 * gameState.playerCardsRewards.water +
      0.033 * gameState.playerCardsFactions.bene,
  },
  {
    name: {
      en: 'Lighter',
      de: 'Leichter',
    },
    costs: 7,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_3.png',
    imagePosition: 'top',
    buyEffects: [
      {
        type: 'troop',
      },
      {
        type: 'troop',
      },
    ],
    customEffect: {
      en: '<br><b>When you win a conflict:</b><br> {resource:location-control}',
      de: '<br><b>Wenn du einen Konflikt <br>gewinnst:</b><br> {resource:location-control}',
      fontSize: 'small',
    },
    effectSize: 'medium',
    effects: [
      {
        type: 'timing-reveal-turn',
      },
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'helper-or',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
    ],
    aiEvaluation: (player, gameState) =>
      0.3 +
      0.1 * gameState.playerDreadnoughtCount +
      0.033 * (gameState.currentRound - 1) +
      0.025 * gameState.playerCardsRewards.sword,
  },
  {
    name: {
      en: 'Flagship',
      de: 'Flaggschiff',
    },
    costs: 9,
    imageUrl: '/assets/images/action-backgrounds/lighter.png',
    imagePosition: 'center',
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
      de: '',
      fontSize: 'medium',
    },
    effectSize: 'medium',
    effects: [
      {
        type: 'timing-reveal-turn',
      },
      {
        type: 'faction-influence-down-choice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'victory-point',
      },
    ],
    aiEvaluation: (player, gameState) =>
      0.3 +
      0.05 * (gameState.currentRound - 1) +
      (player.hasSwordmaster ? 0.1 : 0.0) +
      0.025 * gameState.playerScore.bene +
      0.025 * gameState.playerScore.emperor +
      0.025 * gameState.playerScore.fremen +
      0.025 * gameState.playerScore.guild,
  },
  {
    name: {
      en: 'Landing Ships',
      de: 'Landungsschiffe',
    },
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/landing_ships.png',
    imagePosition: 'bottom',
    buyEffects: [
      {
        type: 'troop',
      },
    ],
    customEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    effectSize: 'medium',
    effects: [
      {
        type: 'timing-reveal-turn',
      },
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'tech',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'combat',
      },
      {
        type: 'sword',
      },
    ],
    aiEvaluation: (player, gameState) =>
      0.3 +
      0.02 * (gameState.currentRound - 1) +
      0.05 * gameState.playerDreadnoughtCount +
      0.02 * gameState.playerCardsRewards.sword +
      0.025 * gameState.playerCardsRewards.tech,
  },
  {
    name: {
      en: 'Planetary Surveillance',
      de: 'Planetare Überwachung',
    },
    costs: 7,
    imageUrl: '/assets/images/action-backgrounds/surveillance.png',
    imagePosition: 'top',
    buyEffects: [
      {
        type: 'card-draw',
      },
      {
        type: 'card-draw',
      },
    ],
    customEffect: {
      en: '<br>It costs you {resource:troop} less to conquer<br> enemy locations and enemies {resource:troop} more to conquer your locations.',
      de: '<br>Es kostet dich {resource:troop} weniger, <br>gegnerische Orte zu erobern und Gegner {resource:troop} mehr, deine Orte zu erobern.',
      fontSize: 'small',
    },
    effectSize: 'small',
    effects: [
      {
        type: 'timing-round-start',
      },
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'tech',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'card-draw',
      },
    ],
    aiEvaluation: (player, gameState) => 0.75 - 0.05 * (gameState.currentRound - 1),
  },
];
