import { LanguageString, StructuredEffect } from '../models';
import { GameEffects } from '../services/game-manager.service';
import { GameModifiers } from '../services/game-modifier.service';

export interface DuneEvent {
  title: LanguageString;
  description: LanguageString;
  imagePath: string;
  cardAmount?: number;
  gameModifiers?: GameModifiers;
  gameEffects?: GameEffects;
  immediatePlayerEffects?: StructuredEffect[];
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
    cardAmount: 3,
  },
  {
    title: {
      en: 'Sandstorms',
      de: 'Sandstürme',
    },
    description: {
      en: '{faction:spice} board spaces cost an additional {resource:water}.',
      de: '{faction:spice}-Felder kosten zusätzlich {resource:water}.',
    },
    imagePath: 'assets/images/action-backgrounds/sandstorm.png',
    cardAmount: 1,
    gameModifiers: {
      fieldCost: [
        {
          id: 'sandstorms-field-water-increase',
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
      en: 'Each player can deploy up to 2 troops.',
      de: 'Jeder Spieler kann bis zu 2 Truppen einsetzen.',
    },
    imagePath: '/assets/images/action-backgrounds/sun.png',
    cardAmount: 1,
    immediatePlayerEffects: [
      {
        type: 'reward',
        effectRewards: [
          {
            type: 'troop-insert',
            amount: 2,
          },
        ],
      },
    ],
  },
  {
    title: {
      en: 'Spice Blows',
      de: 'Spice-Explosionen',
    },
    description: {
      en: 'Put 1 bonus spice on all {faction:spice} board spaces.',
      de: 'Setze 1 Bonus-Spice auf alle {faction:spice}-Felder.',
    },
    imagePath: 'assets/images/action-backgrounds/spice_field.png',
    cardAmount: 2,
    gameEffects: {
      spiceAccumulation: {
        id: 'spice-blows-bonus-spice',
        amount: 1,
      },
    },
  },
  {
    title: {
      en: 'Sandworms',
      de: 'Sandwürmer',
    },
    description: {
      en: '{faction:spice} board spaces yield -1 spice.',
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
      en: '<b>Each player</b>: {resource:card-discard}{resource:helper-trade}{resource:tech}{resource:solari}',
      de: '<b>Jeder Spieler</b>: {resource:card-discard}{resource:helper-trade}{resource:tech}{resource:solari}',
    },
    imagePath: 'assets/images/action-backgrounds/port_4.png',
    cardAmount: 1,
    immediatePlayerEffects: [
      {
        type: 'helper-trade',
        effectCosts: {
          type: 'reward',
          effectRewards: [
            {
              type: 'card-discard',
            },
          ],
        },
        effectConversions: {
          type: 'reward',
          effectRewards: [
            {
              type: 'tech',
            },
            {
              type: 'solari',
            },
          ],
        },
      },
    ],
  },
  {
    title: {
      en: 'Heighliner',
      de: 'Orbitaler Heighliner',
    },
    description: {
      en: 'Draw an additional <b>2</b> cards to the imperium row this round.',
      de: 'Ziehe <b>2</b> zusätzliche Karten für die Imperium-Reihe in dieser Runde.',
    },
    imagePath: '/assets/images/action-backgrounds/highliner_2.png',
    cardAmount: 2,
    gameEffects: {
      imperiumRowCards: {
        id: 'orbital-heighliner-imperium-cards',
        amount: 2,
      },
    },
  },
  {
    title: {
      en: "Muad'Dib",
      de: "Muad'Dib",
    },
    description: {
      en: '{faction:spice} board spaces cost {resource:water} less.',
      de: '{faction:spice}-Felder kosten {resource:water} weniger.',
    },
    imagePath: '/assets/images/action-backgrounds/muaddib.png',
    cardAmount: 1,
    gameModifiers: {
      fieldCost: [
        {
          id: 'muaddib-field-water-decrease',
          costType: 'water',
          amount: -1,
          actionType: 'spice',
          currentRoundOnly: true,
        },
      ],
    },
  },
  {
    title: {
      en: 'Delegation of the major houses',
      de: 'Delegationen der großen Häuser',
    },
    description: {
      en: '<b>Each player</b>: {resource:card-discard}{resource:helper-trade}{resource:troop}{resource:solari;amount:2}',
      de: '<b>Jeder Spieler</b>: {resource:card-discard}{resource:helper-trade}{resource:troop}{resource:solari;amount:2}',
    },
    imagePath: '/assets/images/action-backgrounds/emperor_camp.png',
    cardAmount: 1,
    immediatePlayerEffects: [
      {
        type: 'helper-trade',
        effectCosts: {
          type: 'reward',
          effectRewards: [
            {
              type: 'card-discard',
            },
          ],
        },
        effectConversions: {
          type: 'reward',
          effectRewards: [
            {
              type: 'troop',
            },
            {
              type: 'solari',
              amount: 2,
            },
          ],
        },
      },
    ],
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
    immediatePlayerEffects: [
      {
        type: 'helper-trade',
        effectCosts: {
          type: 'reward',
          effectRewards: [
            {
              type: 'card-discard',
            },
          ],
        },
        effectConversions: {
          type: 'reward',
          effectRewards: [
            {
              type: 'solari',
              amount: 2,
            },
          ],
        },
      },
    ],
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
    immediatePlayerEffects: [
      {
        type: 'helper-trade',
        effectCosts: {
          type: 'reward',
          effectRewards: [
            {
              type: 'card-discard',
            },
          ],
        },
        effectConversions: {
          type: 'reward',
          effectRewards: [
            {
              type: 'water',
            },
          ],
        },
      },
    ],
  },
];
