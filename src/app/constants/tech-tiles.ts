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
    aiEvaluation: 'maula-pistol-works',
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
    aiEvaluation: 'smuggler-outposts',
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
    aiEvaluation: 'imperial-barracks',
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
    aiEvaluation: 'upgrade-carryall-suspensors',
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
    aiEvaluation: 'spice-transport-modules',
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
    aiEvaluation: 'spy-modules',
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
    aiEvaluation: 'spy-network',
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
    aiEvaluation: 'wind-traps',
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
    aiEvaluation: 'heavy-lasguns',
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
      en: '<b>When you place an agent <br>on a {faction:spice} board space:</b><br>{resource:spice}',
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
    aiEvaluation: 'enhanced-sandcrawler-engines',
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
      en: '<b>Reveal turn:</b> <br>{faction:guild} -Connections<br> 2 {resource:shipping}{resource:helper-or}3 {resource:shipping}{resource:shipping}{resource:helper-or} 4+ {resource:victory-point}',
      de: '<b>Aufdeckzug:</b> <br>{faction:guild} -Verbindungen<br> 2 {resource:shipping}{resource:helper-or}3 {resource:shipping}{resource:shipping}{resource:helper-or} 4+ {resource:victory-point}',
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
        type: 'solari',
        amount: 3,
      },
    ],
    aiEvaluation: 'trade-port',
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
    aiEvaluation: 'upgraded-ornithoper-engines',
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
    aiEvaluation: 'barrage-rockets',
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
    aiEvaluation: 'artillery-arsenal',
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
    aiEvaluation: 'ornithopter-hangar',
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
    aiEvaluation: 'shieldbreakers',
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
      en: '<b>Reveal turn:</b> <br>{faction:fremen} -Connections<br> 2 {resource:tech}{resource:helper-or}3 {resource:water}{resource:tech}{resource:helper-or} 4+ {resource:victory-point}',
      de: '<b>Aufdeckzug:</b> <br>{faction:fremen} -Verbindungen<br> 2 {resource:tech}{resource:helper-or}3 {resource:water}{resource:tech}{resource:helper-or} 4+ {resource:victory-point}',
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
        type: 'focus',
      },
    ],
    aiEvaluation: 'botanical-research-station',
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
      en: '<b>Reveal turn:</b> <br>{faction:emperor} -Connections<br> 2 {resource:sword}{resource:sword}{resource:helper-or}3 {resource:sword}{resource:intrigue}{resource:helper-or} 4+ {resource:victory-point}',
      de: '<b>Aufdeckzug:</b> <br>{faction:emperor} -Verbindungen<br> 2 {resource:sword}{resource:sword}{resource:helper-or}3 {resource:sword}{resource:intrigue}{resource:helper-or} 4+ {resource:victory-point}',
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
        type: 'card-draw',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'card-discard',
      },
    ],
    aiEvaluation: 'sardaukar-commando-post',
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
      en: '<b>Reveal turn:</b> <br>{faction:bene} -Connections<br> 2 {resource:intrigue}{resource:helper-or}3 {resource:faction-influence-up-choice}{resource:helper-or} 4+ {resource:victory-point}',
      de: '<b>Aufdeckzug:</b> <br>{faction:bene} -Verbindungen<br> 2 {resource:intrigue}{resource:helper-or}3 {resource:faction-influence-up-choice}{resource:helper-or} 4+ {resource:victory-point}',
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
        type: 'water',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'faction-influence-up-choice',
      },
    ],
    aiEvaluation: 'missionara-protectiva',
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
    aiEvaluation: 'stillsuits-factory',
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
    aiEvaluation: 'spice-refineries',
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
    aiEvaluation: 'ornithopter-squadron',
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
    aiEvaluation: 'gunship',
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
        type: 'helper-trade',
      },
      {
        type: 'troop',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'timing-reveal-turn',
      },
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'water',
      },
      {
        type: 'water',
      },
      {
        type: 'water',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'victory-point',
      },
    ],
    aiEvaluation: 'sietch',
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
        type: 'helper-trade',
      },
      {
        type: 'solari',
        amount: 2,
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'timing-reveal-turn',
      },
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'spice',
        amount: 4,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'victory-point',
      },
    ],
    aiEvaluation: 'guild-bank',
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
        type: 'helper-trade',
      },
      {
        type: 'intrigue',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'timing-reveal-turn',
      },
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'solari',
        amount: 6,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'victory-point',
      },
    ],
    aiEvaluation: 'governor-palace',
  },
  {
    name: {
      en: 'Bene Gesserit Conclave',
      de: 'Bene Gesserit Konklave',
    },
    faction: 'bene',
    costs: 6,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_7.png',
    effectSize: 'medium',
    imagePosition: 'center',
    buyEffects: [
      {
        type: 'faction-influence-up-bene',
      },
    ],
    effects: [
      {
        type: 'timing-round-start',
      },
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'timing-reveal-turn',
      },
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'intrigue-trash',
      },
      {
        type: 'spice',
      },
      {
        type: 'water',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'victory-point',
      },
    ],
    customEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    aiEvaluation: 'bene-gesserit-conclave',
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
    aiEvaluation: 'lighter',
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
        type: 'tech-tile-flip',
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
    aiEvaluation: 'flagship',
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
    aiEvaluation: 'landing-ships',
  },
  {
    name: {
      en: 'Planetary Surveillance',
      de: 'Planetare Überwachung',
    },
    costs: 7,
    imageUrl: '/assets/images/action-backgrounds/surveillance.png',
    effectSize: 'small',
    imagePosition: 'top',
    buyEffects: [
      {
        type: 'card-draw',
      },
      {
        type: 'card-draw',
      },
    ],
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
    customEffect: {
      en: '<br>It costs you {resource:troop} less to conquer<br> enemy locations and enemies {resource:troop} more to conquer your locations.',
      de: '<br>Es kostet dich {resource:troop} weniger, <br>gegnerische Orte zu erobern und Gegner {resource:troop} mehr, deine Orte zu erobern.',
      fontSize: 'small',
    },
    aiEvaluation: 'planetary-surveillance',
  },
];
