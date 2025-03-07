import { ImperiumPlot } from '../models/imperium-plot';

export const imperiumPlots: ImperiumPlot[] = [
  {
    name: {
      en: 'Control over the Spice',
      de: 'Kontrolle über das Spice',
    },
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/spice.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you have more spice than each opponent: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du mehr Spice besitzt als jeder Gegner: {resource:victory-point}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Control over the supply routes',
      de: 'Kontrolle der Versorgungsrouten',
    },
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/troops.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you control <b>3</b> or more locations: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>3</b> oder mehr Orte kontrollierst: {resource:victory-point}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Military supremacy',
      de: 'Militärische Vorherrschaft',
    },
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/troops_3.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you have more troops than each opponent: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du mehr Truppen besitzt als jeder Gegner: {resource:victory-point}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Alliance with IX',
      de: 'Bündnis mit IX',
    },
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/spaceship_landing.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you have <b>4</b> or more tech tiles: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>4</b> oder mehr Tech-Plättchen besitzt: {resource:victory-point}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Against the old order',
      de: 'Gegen die alte Ordnung',
    },
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/lighter_2.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you have <b>1</b> or less influence on 3 or more Faction tracks: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>1</b> oder weniger Einfluss bei 3 oder mehr Einflussleisten hast: {resource:victory-point}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Shift in power',
      de: 'Verschiebung der Macht',
    },
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/ceremony_4.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you have a high council seat, <b>1</b> or more {resource:dreadnought} and <b>1</b> or more faction alliances: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du einen Sitz im hohen Rat, <b>1</b> oder mehr {resource:dreadnought} und <b>1</b> oder mehr Fraktions-Allianzen hast: {resource:victory-point}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Landsraad leadership',
      de: 'Landsraad-Führerschaft',
    },
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/signet_ring.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you have a high council seat and <b>2</b> or less influence on 4 Faction tracks: {resource:victory-point} {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du einen Sitz im hohen Rat und <b>2</b> oder weniger Einfluss bei 4 Einflussleisten hast: {resource:victory-point} {resource:victory-point}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Eyes everywhere',
      de: 'Augen überall',
    },
    faction: 'bene',
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_15.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you have <b>15</b> or more cards in your deck and <b>4</b> or more {faction:bene}-influence: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>15</b> oder mehr Karten in deinem Deck und <b>2</b> oder mehr {faction:bene}-Einfluss hast: {resource:victory-point}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Control over the religion',
      de: 'Kontrolle über die Religion',
    },
    faction: 'bene',
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/sayadina.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you control <b>2</b> or more locations and have <b>4</b> or more {faction:bene}-influence: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>2</b> oder mehr Orte kontrollierst und <b>4</b> oder mehr {faction:bene}-Einfluss hast: {resource:victory-point}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'CHOAM Directorship',
      de: 'MAFEA-Vorsitz',
    },
    faction: 'emperor',
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/meeting_4.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you have <b>9</b> or more solari and <b>2</b> or more {faction:emperor}-influence: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>9</b> oder mehr Solari und <b>2</b> oder mehr {faction:emperor}-Einfluss hast: {resource:victory-point}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Favorite of the Emperor',
      de: 'Favorit des Imperators',
    },
    faction: 'emperor',
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/emperor_3.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you have <b>2</b> or more intrigues and <b>4</b> or more {faction:emperor}-influence: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>2</b> oder mehr Intrigen und <b>4</b> oder mehr {faction:emperor}-Einfluss hast: {resource:victory-point}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Greening of Arrakis',
      de: 'Ergrünung von Arrakis',
    },
    faction: 'fremen',
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/ecological_testing_station.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you have <b>3</b> or more water and <b>2</b> or more {faction:fremen}-influence: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>3</b> oder mehr Wasser und <b>2</b> oder mehr {faction:fremen}-Einfluss hast: {resource:victory-point}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Desert power',
      de: 'Wüstenmacht',
    },
    faction: 'fremen',
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/worm_assault.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you have <b>3</b> or more troops and <b>4</b> or more {faction:fremen}-influence: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>3</b> oder mehr Truppen und <b>4</b> oder mehr {faction:fremen}-Einfluss hast: {resource:victory-point}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Navigators Network',
      de: 'Netzwerk der Navigatoren',
    },
    faction: 'guild',
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/highliner_2.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you have <b>6</b> or more spice and <b>2</b> or more {faction:guild}-influence: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>6</b> oder mehr Spice und <b>2</b> oder mehr {faction:guild}-Einfluss hast: {resource:victory-point}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Trade blockade',
      de: 'Handelsblockade',
    },
    faction: 'guild',
    persuasionCosts: 0,
    imageUrl: '/assets/images/action-backgrounds/spaceship_fleet.png',
    cardAmount: 1,
    plotDescription: {
      en: '<b>Endgame</b>: <br>If you have <b>2</b> {resource:dreadnought} and <b>4</b> or more {faction:guild}-influence: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>2</b> {resource:dreadnought} und <b>4</b> oder mehr {faction:guild}-Einfluss hast: {resource:victory-point}',
      fontSize: 'small',
    },
  },
];
