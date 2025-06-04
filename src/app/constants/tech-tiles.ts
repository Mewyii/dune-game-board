import { TechTileCard } from '../models/tech-tile';

export const techTiles: TechTileCard[] = [
  {
    name: {
      en: 'Spice transport modules',
      de: 'Spice-Transportmodule',
    },
    costs: 1,
    imageUrl: '/assets/images/action-backgrounds/industry.png',
    effectSize: 'medium',
    imagePosition: 'top',
    buyEffects: [],
    effects: [],
    customEffect: {
      en: '{resource:tech-tile-flip} {resource:helper-trade} Retreat a {resource:dreadnought} to gain {resource:spice}.',
      de: '{resource:tech-tile-flip} {resource:helper-trade} Ziehe ein {resource:dreadnought} zurück, um {resource:spice} zu erhalten.',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Spy modules',
      de: 'Spionagemodule',
    },
    costs: 1,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_7.png',
    effectSize: 'medium',
    imagePosition: 'bottom',
    buyEffects: [],
    effects: [],
    customEffect: {
      en: '{resource:tech-tile-flip} {resource:helper-trade} Retreat a {resource:dreadnought} to gain {resource:tech}.',
      de: '{resource:tech-tile-flip} {resource:helper-trade} Ziehe ein {resource:dreadnought} zurück, um {resource:tech} zu erhalten.',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Landing Ships',
      de: 'Landungsschiffe',
    },
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/landing_ships.png',
    effectSize: 'medium',
    imagePosition: 'bottom',
    buyEffects: [],
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
        type: 'combat',
      },
    ],
    customEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Wind Traps',
      de: 'Windfallen',
    },
    faction: 'fremen',
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/windtraps.png',
    effectSize: 'medium',
    imagePosition: 'center',
    buyEffects: [],
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
    customEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Personal Suspensors',
      de: 'Persönliche Suspensoren',
    },
    faction: 'emperor',
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/jet_packs.png',
    effectSize: 'medium',
    imagePosition: 'bottom',
    buyEffects: [],
    effects: [
      {
        type: 'timing-round-start',
      },
      {
        type: 'troop-insert',
        amount: 1,
      },
    ],
    customEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Smuggler outposts',
      de: 'Schmuggler-Aussenposten',
    },
    faction: 'guild',
    costs: 2,
    imageUrl: '/assets/images/action-backgrounds/desert_4.png',
    effectSize: 'medium',
    imagePosition: 'center',
    buyEffects: [
      {
        type: 'foldspace',
      },
    ],
    effects: [
      {
        type: 'timing-reveal-turn',
      },
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
        type: 'tech',
        amount: 2,
      },
    ],
    customEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
  },
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
  },
  {
    name: {
      en: 'Imperial Barracks',
      de: 'Imperiale Kaserne',
    },
    faction: 'emperor',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/military_camp.png',
    effectSize: 'medium',
    imagePosition: 'center',
    buyEffects: [],
    effects: [
      {
        type: 'timing-reveal-turn',
      },
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
  },
  {
    name: {
      en: 'Spy Network',
      de: 'Spionage-Netzwerk',
    },
    faction: 'bene',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit.png',
    effectSize: 'medium',
    imagePosition: 'center',
    buyEffects: [],
    effects: [],
    customEffect: {
      en: '{resource:tech-tile-flip} {resource:card-discard}{resource:helper-trade}{resource:signet-ring} and pass your turn.',
      de: '{resource:tech-tile-flip} {resource:card-discard}{resource:helper-trade}{resource:signet-ring} und<br> passe deinen Zug.',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Satellite Control',
      de: 'Satellitenkontrolle',
    },
    faction: 'guild',
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/dune.png',
    effectSize: 'medium',
    imagePosition: 'top',
    buyEffects: [],
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
        type: 'enemies-card-discard',
      },
    ],
    customEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Heavy Lasguns',
      de: 'Schwere Lasguns',
    },
    costs: 3,
    imageUrl: '/assets/images/action-backgrounds/lasgun.png',
    effectSize: 'medium',
    imagePosition: 'center',
    buyEffects: [],
    effects: [],
    customEffect: {
      en: '{resource:tech-tile-flip}{resource:helper-trade}Each opponent {resource:card-discard} for each of your {resource:dreadnought} in combat.',
      de: '{resource:tech-tile-flip}{resource:helper-trade}Jeder Gegner {resource:card-discard} für jedes deiner {resource:dreadnought} im Konflikt.',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Trade Port',
      de: 'Handelshafen',
    },
    faction: 'guild',
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/port.png',
    effectSize: 'small',
    imagePosition: 'bottom',
    buyEffects: [],
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
        amount: 4,
      },
    ],
    customEffect: {
      en: '<b>Reveal turn:</b> <br>{faction:guild} -Connections<br> 1 {resource:solari}{resource:helper-or}2 {resource:shipping}{resource:helper-or} 3+ {resource:shipping}{resource:shipping}',
      de: '<b>Aufdeckzug:</b> <br>{faction:guild} -Verbindungen<br> 1 {resource:solari}{resource:helper-or}2 {resource:shipping}{resource:helper-or} 3+ {resource:shipping}{resource:shipping}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Enhanced Sandcrawler Engines',
      de: 'Verbesserte Sandcrawler- Antriebe',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/tech.png',
    effectSize: 'medium',
    imagePosition: 'top',
    buyEffects: [],
    effects: [],
    customEffect: {
      en: '<b>When you place an agent <br>on a {faction:spice} board space:</b><br>{resource:spice}',
      de: '<b>Wenn du einen Agenten auf <br>einem {faction:spice}-Feld platzierst:</b><br>{resource:spice}',
      fontSize: 'small',
    },
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
  },
  {
    name: {
      en: 'Barrage Rockets',
      de: 'Sperrfeuerraketen',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/assault.png',
    effectSize: 'medium',
    imagePosition: 'center',
    buyEffects: [],
    effects: [],
    customEffect: {
      en: '{resource:tech-tile-flip}{resource:helper-trade}Put {resource:troop} on <b>1</b> board space of your choice. It is blocked for this round.<br><br>{resource:tech-tile-flip}{resource:helper-trade}For each of your {resource:dreadnought} in conflict: Each opponent retreats one troop.',
      de: '{resource:tech-tile-flip}{resource:helper-trade}Lege {resource:troop} auf <b>1</b> Feld deiner Wahl. Es ist für diese Runde blockiert.<br><br>{resource:tech-tile-flip}{resource:helper-trade}Für jedes deiner {resource:dreadnought} im Konflikt: Jeder Gegner zieht einen Trupp zurück.',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Artillery Arsenal',
      de: 'Artillerie-Arsenal',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/infrastructure.png',
    effectSize: 'medium',
    imagePosition: 'top',
    buyEffects: [
      {
        type: 'faction-influence-down-choice',
      },
    ],
    effects: [
      {
        type: 'timing-reveal-turn',
      },
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'helper-trade',
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
    customEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
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
  },
  {
    name: {
      en: 'Botanical Research Station',
      de: 'Botanische Forschungsstation',
    },
    faction: 'fremen',
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/research_station.png',
    effectSize: 'small',
    imagePosition: 'center',
    buyEffects: [],
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
    customEffect: {
      en: '<b>Reveal turn:</b> <br>{faction:fremen} -Connections<br> 1 {resource:tech}{resource:helper-or}2 {resource:water}{resource:tech}{resource:helper-or} 3+ {resource:tech}{resource:tech}',
      de: '<b>Aufdeckzug:</b> <br>{faction:fremen} -Verbindungen<br> 1 {resource:tech}{resource:helper-or}2 {resource:water}{resource:tech}{resource:helper-or} 3+ {resource:tech}{resource:tech}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Sardaukar Commando Post',
      de: 'Sardaukar Kommando-Posten',
    },
    faction: 'emperor',
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/emperor_camp.png',
    effectSize: 'small',
    imagePosition: 'top',
    buyEffects: [
      {
        type: 'troop',
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
        type: 'card-draw',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'card-discard',
      },
    ],
    customEffect: {
      en: '<b>Reveal turn:</b> <br>{faction:emperor} -Connections<br> 1 {resource:sword}{resource:helper-or}2 {resource:sword}{resource:sword}{resource:helper-or} 3+ {resource:sword}{resource:sword}{resource:intrigue}',
      de: '<b>Aufdeckzug:</b> <br>{faction:emperor} -Verbindungen<br> 1 {resource:sword}{resource:helper-or}2 {resource:sword}{resource:sword}{resource:helper-or} 3+ {resource:sword}{resource:sword}{resource:intrigue}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Missionaria Protectiva',
      de: 'Missionaria Protectiva',
    },
    faction: 'bene',
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_3.png',
    effectSize: 'small',
    imagePosition: 'bottom',
    buyEffects: [],
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
    customEffect: {
      en: '<b>Reveal turn:</b> <br>{faction:bene} -Connections<br> 1 {resource:intrigue-trash}{resource:intrigue}{resource:helper-or}2 {resource:intrigue}{resource:helper-or} 3+ {resource:faction-influence-up-choice}',
      de: '<b>Aufdeckzug:</b> <br>{faction:bene} -Verbindungen<br> 1 {resource:intrigue-trash}{resource:intrigue}{resource:helper-or}2 {resource:intrigue}{resource:helper-or} 3+ {resource:faction-influence-up-choice}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Spice Refineries',
      de: 'Spice Raffinerien',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/spice_port.png',
    effectSize: 'medium',
    imagePosition: 'center',
    buyEffects: [],
    effects: [],
    customEffect: {
      en: 'All {resource:spice} -costs are reduced by 1 (min. 1).',
      de: 'Alle {resource:spice} -Kosten sind um 1 reduziert (min. 1).',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Ornithoper Squadron',
      de: 'Ornithopterstaffel',
    },
    costs: 4,
    imageUrl: '/assets/images/action-backgrounds/ornithopters.png',
    effectSize: 'medium',
    imagePosition: 'center',
    buyEffects: [
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
        type: 'troop-insert-or-retreat',
        amount: 2,
      },
    ],
    customEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Shieldbreakers',
      de: 'Schildbrecher',
    },
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/shields.png',
    effectSize: 'medium',
    imagePosition: 'center',
    buyEffects: [],
    effects: [],
    customEffect: {
      en: '{resource:tech-tile-flip} {resource:tech}{resource:helper-trade} For each of your {resource:dreadnought} in conflict: {resource:sword}{resource:sword}{resource:sword}{resource:helper-or}Put a {resource:dreadnought} in a garrison of your choice into a timeout until the next round.',
      de: '{resource:tech-tile-flip} {resource:tech}{resource:helper-trade} Für jedes deiner {resource:dreadnought} im Konflikt: {resource:sword}{resource:sword}{resource:sword}{resource:helper-or}Ein {resource:dreadnought} in einer Garnison deiner Wahl setzt bis zum Ende der Runde aus.',
      fontSize: 'small',
    },
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
  },
  {
    name: {
      en: 'Gunship',
      de: 'Panzerschiff',
    },
    costs: 5,
    imageUrl: '/assets/images/action-backgrounds/dreadnought.png',
    effectSize: 'medium',
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
        type: 'timing-reveal-turn',
      },
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
    ],
    customEffect: {
      en: '{resource:tech-tile-flip}{resource:helper-trade}Remove an enemy <br>agent from a board space. It is no longer available for this round.',
      de: '{resource:tech-tile-flip}{resource:helper-trade}Entferne einen gegnerischen Agenten von einem Feld. Er ist für diese Runde nicht mehr verfügbar.',
      fontSize: 'small',
    },
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
  },
  {
    name: {
      en: 'Lighter',
      de: 'Leichter',
    },
    costs: 6,
    imageUrl: '/assets/images/action-backgrounds/arrakeen_3.png',
    effectSize: 'medium',
    imagePosition: 'top',
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
        type: 'timing-reveal-turn',
      },
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'persuasion',
        amount: 3,
      },
      {
        type: 'helper-or',
      },
      {
        type: 'tech-tile-flip',
      },
      {
        type: 'helper-trade',
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
    customEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
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
  },
];
