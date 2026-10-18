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
    cardAmount: 2,
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
      en: 'Solar Eclipse',
      de: 'Sonnenfinsternis',
    },
    description: {
      en: '<b>Round start</b>: Each player can deploy up to 2 troops.',
      de: '<b>Rundenbeginn</b>: Jeder Spieler kann bis zu 2 Truppen einsetzen.',
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
      en: '<b>Round start</b>: Put 1 bonus spice on all {faction:spice} board spaces.',
      de: '<b>Rundenbeginn</b>: Setze 1 Bonus-Spice auf alle {faction:spice}-Felder.',
    },
    imagePath: 'assets/images/action-backgrounds/spice_field.png',
    cardAmount: 1,
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
    cardAmount: 1,
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
      en: '<b>Round start</b>: Take a look at the top card of your deck or the intrigue deck.',
      de: '<b>Rundenbeginn</b>: Sieh dir die oberste Karte deines Decks oder des Intrigen-Stapels an.',
    },
    imagePath: 'assets/images/action-backgrounds/spice_2.png',
    cardAmount: 1,
    gameModifiers: {
      customActions: [
        {
          id: 'spice-vision-deck-vision',
          action: 'vision-deck',
          currentRoundOnly: true,
        },
      ],
    },
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
      en: 'Delegation of the major houses',
      de: 'Delegationen der großen Häuser',
    },
    description: {
      en: '<b>Round start</b>: <b>Each player</b>: {resource:card-discard}{resource:card-discard}{resource:helper-trade}{resource:faction-influence-up-choice}',
      de: '<b>Rundenbeginn</b>: <b>Jeder Spieler</b>: {resource:card-discard}{resource:card-discard}{resource:helper-trade}{resource:faction-influence-up-choice}',
    },
    imagePath: '/assets/images/action-backgrounds/troops_3.png',
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
            {
              type: 'card-discard',
            },
          ],
        },
        effectConversionRewards: {
          type: 'reward',
          effectRewards: [
            {
              type: 'faction-influence-up-choice',
            },
          ],
        },
      },
    ],
  },
  {
    title: {
      en: 'Intrigues of the Great Houses',
      de: 'Intrigen der großen Häuser',
    },
    description: {
      en: '<b>Round start</b>: <b>Each player</b>: {resource:faction-influence-down-choice}',
      de: '<b>Rundenbeginn</b>: <b>Jeder Spieler</b>: {resource:faction-influence-down-choice}',
    },
    imagePath: '/assets/images/action-backgrounds/conspiracy.png',
    cardAmount: 1,
    immediatePlayerEffects: [
      {
        type: 'reward',
        effectRewards: [
          {
            type: 'faction-influence-down-choice',
          },
        ],
      },
    ],
  },
  {
    title: {
      en: 'Support from Allied Houses',
      de: 'Unterstützung verbündeter Häuser',
    },
    description: {
      en: '<b>Round start</b>: <b>Each player</b>: {resource:card-draw}',
      de: '<b>Rundenbeginn</b>: <b>Jeder Spieler</b>: {resource:card-draw}',
    },
    imagePath: '/assets/images/action-backgrounds/freighter.png',
    cardAmount: 2,
    immediatePlayerEffects: [
      {
        type: 'reward',
        effectRewards: [
          {
            type: 'card-draw',
          },
        ],
      },
    ],
  },
  {
    title: {
      en: 'Communication Failure',
      de: 'Kommunikationsstörung',
    },
    description: {
      en: '{faction:landsraad} board spaces cost an additional {resource:solari}',
      de: '{faction:landsraad}-Felder kosten zusätzlich {resource:solari}',
    },
    imagePath: 'assets/images/action-backgrounds/dune.png',
    cardAmount: 1,
    gameModifiers: {
      fieldCost: [
        {
          id: 'communication-failure-green-field-solari-increase',
          costType: 'solari',
          amount: 1,
          actionType: 'landsraad',
          currentRoundOnly: true,
        },
      ],
    },
  },
];
