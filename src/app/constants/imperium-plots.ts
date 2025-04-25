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
      en: '<b>Endgame</b>: <br>If you have more {resource:spice} than each opponent: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du mehr {resource:spice} hast als jeder Gegner: {resource:victory-point}',
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
      en: '<b>Endgame</b>: <br>If you control <b>3</b> or more locations: <br>{resource:victory-point}',
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
      de: '<b>Finale</b>: <br>Wenn du mehr Truppen hast als jeder Gegner: {resource:victory-point}',
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
      en: '<b>Endgame</b>: <br>If you have <b>4</b> {resource:tech-tile}: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>4</b> {resource:tech-tile} besitzt: {resource:victory-point}',
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
      en: '<b>Endgame</b>: <br>If you have <b>1</b> or less influence on <b>3</b> or more Faction tracks: <br>{resource:victory-point} {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du maximal <b>1</b> Einfluss <br>bei <b>3</b> Einflussleisten hast: <br>{resource:victory-point} {resource:victory-point}',
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
      en: '<b>Endgame</b>: <br>If you have a high council seat, <b>1</b> {resource:dreadnought} and <b>1</b> faction alliance: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du einen Sitz im hohen Rat, <br><b>1</b> {resource:dreadnought} und <b>1</b> Fraktions-Allianz hast: <br>{resource:victory-point}',
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
      en: '<b>Endgame</b>: <br>If you have a high council seat and <b>2</b> or less influence on <b>4</b> Faction tracks: <br>{resource:victory-point} {resource:victory-point} {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du einen Sitz im hohen Rat und maximal <b>2</b> Einfluss bei allen <b>4</b> Einflussleisten hast: <br>{resource:victory-point} {resource:victory-point} {resource:victory-point}',
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
      en: '<b>Endgame</b>: <br>If you have <b>15</b> cards in your deck <br>and <b>4</b> {faction:bene}-influence: <br>{resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>15</b> Karten in deinem Deck und <b>2</b> {faction:bene}-Einfluss hast: <br>{resource:victory-point}',
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
      en: '<b>Endgame</b>: <br>If you control <b>2</b> locations and <br>have <b>4</b> {faction:bene}-influence: <br>{resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>2</b> Orte kontrollierst <br>und <b>4</b> {faction:bene}-Einfluss hast: <br>{resource:victory-point}',
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
      en: '<b>Endgame</b>: <br>If you have {resource:solari;amount:9} and <b>2</b> {faction:emperor}-influence: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du {resource:solari;amount:9} und <b>2</b> {faction:emperor}-Einfluss hast: {resource:victory-point}',
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
      en: '<b>Endgame</b>: <br>If you have <b>2</b> {resource:intrigue} and <b>4</b> {faction:emperor}-influence: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn <b>2</b> {resource:intrigue} und <b>4</b> {faction:emperor}-Einfluss hast: {resource:victory-point}',
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
      en: '<b>Endgame</b>: <br>If you have {resource:water}{resource:water}{resource:water} and <br><b>2</b> {faction:fremen}-influence: <br>{resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du {resource:water}{resource:water}{resource:water} und <b>2</b> {faction:fremen}-Einfluss hast: {resource:victory-point}',
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
      en: '<b>Endgame</b>: <br>If you have <b>3</b> or more troops <br>and <b>4</b> {faction:fremen}-influence: <br>{resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>3</b> oder mehr Truppen <br>und <b>4</b> {faction:fremen}-Einfluss hast: <br>{resource:victory-point}',
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
      en: '<b>Endgame</b>: <br>If you have {resource:spice;amount:6} and <b>2</b> {faction:guild}-influence: {resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du {resource:spice;amount:6} und <b>2</b> {faction:guild}-Einfluss hast: {resource:victory-point}',
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
      en: '<b>Endgame</b>: <br>If you have <b>2</b> {resource:dreadnought} <br>and <b>4</b> {faction:guild}-influence: <br>{resource:victory-point}',
      de: '<b>Finale</b>: <br>Wenn du <b>2</b> {resource:dreadnought} und <b>4</b> {faction:guild}-Einfluss hast: {resource:victory-point}',
      fontSize: 'small',
    },
  },
];
