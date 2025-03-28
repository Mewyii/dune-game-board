import { LanguageString } from '../models';
import { AIAdjustments } from '../services/ai/models';
import { GameModifiers } from '../services/game-modifier.service';

export interface DuneEvent {
  title: LanguageString;
  description: LanguageString;
  imagePath: string;
  cardAmount?: number;
  aiAdjustments?: AIAdjustments;
  gameModifiers?: GameModifiers;
}

export const duneEvents: DuneEvent[] = [
  {
    title: {
      en: 'Clear Sky',
      de: 'Klarer Himmel',
    },
    description: {
      en: 'No effect.',
      de: 'Kein Effekt.',
    },
    imagePath: 'assets/images/action-backgrounds/sky.png',
    cardAmount: 2,
  },
  {
    title: {
      en: 'Sandstorms',
      de: 'Sandstürme',
    },
    description: {
      en: '{faction:spice}-fields cost an additional {resource:water}.',
      de: '{faction:spice}-Felder kosten zusätzlich {resource:water}.',
    },
    imagePath: 'assets/images/action-backgrounds/sandstorm.png',
    cardAmount: 1,
    gameModifiers: {
      fieldCost: [
        {
          id: 'sandstorms-field-block',
          costType: 'water',
          amount: 1,
          actionType: 'spice',
          currentRoundOnly: true,
        },
      ],
    },
  },
  {
    title: {
      en: 'Grandmother Storm',
      de: 'Urgroßmuttersturm',
    },
    description: {
      en: '{faction:spice}-fields are blocked.',
      de: '{faction:spice}-Felder sind blockiert.',
    },
    imagePath: 'assets/images/action-backgrounds/sandstorm.png',
    cardAmount: 1,
    gameModifiers: {
      fieldBlock: [
        {
          id: 'sandstorms-field-block',
          actionType: 'spice',
          currentRoundOnly: true,
        },
      ],
    },
  },
  {
    title: {
      en: 'Spice gusts',
      de: 'Spice-Winde',
    },
    description: {
      en: 'When a player places an agent on a <br>{faction:spice} board space: {resource:card-draw}',
      de: 'Wenn ein Spieler einen Agenten auf einem <br>{faction:spice} -Feld platziert: {resource:card-draw}',
    },
    imagePath: 'assets/images/action-backgrounds/spice_2.png',
    cardAmount: 1,
    gameModifiers: {
      fieldReward: [
        {
          id: 'spice-gusts',
          rewardType: 'card-draw',
          amount: 1,
          actionType: 'spice',
          currentRoundOnly: true,
        },
      ],
    },
  },
  {
    title: {
      en: 'Solar Eclipse',
      de: 'Sonnenfinsternis',
    },
    description: {
      en: 'Each player can put up to 2 troops into the conflict.',
      de: 'Jeder Spieler darf bis zu 2 Truppen in den Konflikt entsenden.',
    },
    imagePath: '/assets/images/action-backgrounds/sun.png',
    cardAmount: 1,
  },
  {
    title: {
      en: 'Spice Explosions',
      de: 'Spice-Explosionen',
    },
    description: {
      en: 'Put 1 bonus spice on all {faction:spice}-fields.',
      de: 'Setze 1 Bonus-Spice auf alle {faction:spice}-Felder.',
    },
    imagePath: 'assets/images/action-backgrounds/spice_field.png',
    cardAmount: 2,
  },
  {
    title: {
      en: 'Sandworms',
      de: 'Sandwürmer',
    },
    description: {
      en: '{faction:spice}-fields yield -1 spice.',
      de: '{faction:spice}-Felder bringen -1 Spice ein.',
    },
    imagePath: 'assets/images/action-backgrounds/sandworm.png',
    cardAmount: 2,
    gameModifiers: {
      fieldReward: [
        {
          id: 'sandworms-reduced-spice',
          actionType: 'spice',
          rewardType: 'spice',
          amount: -1,
          currentRoundOnly: true,
        },
      ],
    },
  },
  {
    title: {
      en: 'Spice Visions',
      de: 'Spice Visionen',
    },
    description: {
      en: '<b>Round start</b>: Take a look at the top card of your deck, the conflict deck or the intrigue deck.',
      de: '<b>Rundenbeginn</b>: Sieh dir die oberste Karte deines Decks, des Konflikt-Stapels oder des Intrigen-Stapels an.',
    },
    imagePath: '/assets/images/action-backgrounds/vision.png',
    cardAmount: 2,
  },
  {
    title: {
      en: 'Ixian Merchants',
      de: 'Ixianische Händler',
    },
    description: {
      en: '<b>Each player</b>: {resource:card-discard}{resource:helper-trade}{resource:tech}',
      de: '<b>Jeder Spieler</b>: {resource:card-discard}{resource:helper-trade}{resource:tech}',
    },
    imagePath: 'assets/images/action-backgrounds/port_4.png',
    cardAmount: 1,
  },
  {
    title: {
      en: 'Heighliner',
      de: 'Orbitaler Heighliner',
    },
    description: {
      en: 'Ziehe <b>3</b> zusätzliche Karten für die Imperium-Reihe in dieser Runde.',
      de: 'Ziehe <b>3</b> zusätzliche Karten für die Imperium-Reihe in dieser Runde.',
    },
    imagePath: '/assets/images/action-backgrounds/highliner_2.png',
    cardAmount: 2,
  },
  {
    title: {
      en: "Muad'Dib",
      de: "Muad'Dib",
    },
    description: {
      en: '{faction:spice}-fields cost {resource:water} less.',
      de: '{faction:spice}-Felder kosten {resource:water} weniger.',
    },
    imagePath: '/assets/images/action-backgrounds/muaddib.png',
    cardAmount: 1,
  },
  {
    title: {
      en: 'Delegation of the major houses',
      de: 'Delegationen der großen Häuser',
    },
    description: {
      en: '<b>Each player</b>: {resource:card-discard}{resource:helper-trade}{resource:troop}{resource:solari}',
      de: '<b>Jeder Spieler</b>: {resource:card-discard}{resource:helper-trade}{resource:troop}{resource:solari}',
    },
    imagePath: '/assets/images/action-backgrounds/emperor_camp.png',
    cardAmount: 1,
  },
  {
    title: {
      en: 'Delegations of the minor houses',
      de: 'Delegationen der kleinen Häuser',
    },
    description: {
      en: '<b>Each player</b>: {resource:card-discard}{resource:helper-trade}{resource:solari;amount:2}',
      de: '<b>Jeder Spieler</b>: {resource:card-discard}{resource:helper-trade}{resource:solari;amount:2}',
    },
    imagePath: '/assets/images/action-backgrounds/freighter.png',
    cardAmount: 1,
  },
  {
    title: {
      en: 'CHOAM merchant fleet',
      de: 'MAFEA-Handelsflotte',
    },
    description: {
      en: '<b>Each player</b>: {resource:card-discard}{resource:helper-trade}{resource:water}',
      de: '<b>Jeder Spieler</b>: {resource:card-discard}{resource:helper-trade}{resource:water}',
    },
    imagePath: '/assets/images/action-backgrounds/troops.png',
    cardAmount: 1,
  },
];
