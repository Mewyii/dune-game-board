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
      en: 'Sandstorm',
      de: 'Sandsturm',
    },
    description: {
      en: 'For {resource:combat} fields, only 1 instead of 2 units can be sent into the conflict.',
      de: 'Bei {resource:combat}-Feldern kann nur 1 statt 2 Einheiten in den Konflikt geschickt werden.',
    },
    imagePath: 'assets/images/action-backgrounds/sandstorm.png',
    cardAmount: 1,
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
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => (field.actionType === 'spice' ? 0.1 : 0.0),
    },
  },
  {
    title: {
      en: 'Solar Eclipse',
      de: 'Sonnenfinsternis',
    },
    description: {
      en: 'For {resource:combat} fields, 3 instead of 2 units can be sent into the conflict.',
      de: 'Bei {resource:combat}-Feldern können 3 statt 2 Einheiten in den Konflikt geschickt werden.',
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
      en: '<b>Round start</b>: +1 bonus spice on {faction:spice}-fields.',
      de: '<b>Rundenbeginn</b>: +1 Bonus-Spice auf {faction:spice}-Feldern.',
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
      en: '<b>Round start (each player)</b>: Take a look at the top card of your deck, the conflict deck or the intrigue deck.',
      de: '<b>Rundenbeginn(jeder Spieler)</b>: Sieh dir die oberste Karte deines Decks, des Konflikt-Stapels oder des Intrigen-Stapels an.',
    },
    imagePath: '/assets/images/action-backgrounds/vision.png',
    cardAmount: 2,
  },
  {
    title: {
      de: 'Imperiale Delegation',
      en: 'Imperial Delegation',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:intrigue-trash}{resource:solari;amount:2}{resource:helper-trade}{resource:faction-influence-up-emperor}   {resource:helper-or}   {resource:faction-influence-down-emperor} {resource:solari;amount:4}{resource:helper-trade} {resource:victory-point}',
      en: '<b>Reveal turn (each player)</b>:   {resource:intrigue-trash}{resource:solari;amount:2}{resource:helper-trade}{resource:faction-influence-up-emperor}   {resource:helper-or}   {resource:faction-influence-down-emperor} {resource:solari;amount:4}{resource:helper-trade} {resource:victory-point}',
    },
    imagePath: 'assets/images/action-backgrounds/empire_ambassador.png',
    cardAmount: 1,
    aiAdjustments: {
      goalEvaluationModifier: () => [{ type: 'emperor-alliance', modifier: 0.15 }],
    },
  },
  {
    title: {
      de: 'Gilden-Abgesandte',
      en: 'Guild Ambassadors',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:spice;amount:2}{resource:helper-trade}{resource:faction-influence-up-guild}   {resource:helper-or}   {resource:faction-influence-down-guild} {resource:spice;amount:2}{resource:helper-trade} {resource:victory-point}',
      en: '<b>Reveal turn (each player)</b>:   {resource:spice;amount:2}{resource:helper-trade}{resource:faction-influence-up-guild}   {resource:helper-or}   {resource:faction-influence-down-guild} {resource:spice;amount:2}{resource:helper-trade} {resource:victory-point}',
    },
    imagePath: 'assets/images/action-backgrounds/guild_navigators_3.png',
    cardAmount: 1,
    aiAdjustments: {
      goalEvaluationModifier: () => [{ type: 'guild-alliance', modifier: 0.15 }],
    },
  },
  {
    title: {
      de: 'Missionara Protectiva',
      en: 'Missionara Protectiva',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:water}{resource:spice}{resource:helper-trade}{resource:faction-influence-up-bene}   {resource:helper-or}   {resource:faction-influence-down-bene} {resource:persuasion;amount:4}{resource:helper-trade} {resource:victory-point}',
      en: '<b>Reveal turn (each player)</b>:   {resource:water}{resource:spice}{resource:helper-trade}{resource:faction-influence-up-bene}   {resource:helper-or}   {resource:faction-influence-down-bene} {resource:persuasion;amount:4}{resource:helper-trade} {resource:victory-point}',
    },
    imagePath: 'assets/images/action-backgrounds/bene_gesserit_3.png',
    cardAmount: 1,
    aiAdjustments: {
      goalEvaluationModifier: () => [{ type: 'bg-alliance', modifier: 0.15 }],
    },
  },
  {
    title: {
      de: 'Abgefallene Fremen',
      en: 'Renegade Fremen',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:loose-troop}{resource:loose-troop}{resource:helper-trade}{resource:faction-influence-up-fremen}   {resource:helper-or}   {resource:faction-influence-down-fremen} {resource:water}{resource:water}{resource:helper-trade} {resource:victory-point}',
      en: '<b>Reveal turn (each player)</b>:   {resource:loose-troop}{resource:loose-troop}{resource:helper-trade}{resource:faction-influence-up-fremen}   {resource:helper-or}   {resource:faction-influence-down-fremen} {resource:water}{resource:water}{resource:helper-trade} {resource:victory-point}',
    },
    imagePath: 'assets/images/action-backgrounds/fremen_warriors.png',
    cardAmount: 1,
    aiAdjustments: {
      goalEvaluationModifier: () => [{ type: 'fremen-alliance', modifier: 0.15 }],
    },
  },
  {
    title: {
      de: 'Schmuggler',
      en: 'Smugglers',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:spice}{resource:helper-trade}{resource:solari;amount:4}   {resource:helper-or}   {resource:loose-troop} {resource:loose-troop}{resource:helper-trade} {resource:spice;amount:3}',
      en: '<b>Reveal turn (each player)</b>:   {resource:spice}{resource:helper-trade}{resource:solari;amount:4}   {resource:helper-or}   {resource:loose-troop} {resource:loose-troop}{resource:helper-trade} {resource:spice;amount:3}',
    },
    imagePath: 'assets/images/action-backgrounds/smugglers.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'Ixianische Händler',
      en: 'Ixian Merchants',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:solari;amount:1}{resource:helper-trade}{resource:tech-reduced}   {resource:helper-or}   {resource:solari;amount:3}{resource:helper-trade}{resource:tech-reduced-two}',
      en: '<b>Reveal turn (each player)</b>:   {resource:solari;amount:1}{resource:helper-trade}{resource:tech-reduced}   {resource:helper-or}   {resource:solari;amount:3}{resource:helper-trade}{resource:tech-reduced-two}',
    },
    imagePath: 'assets/images/action-backgrounds/industry_2.png',
    cardAmount: 1,
  },
  {
    title: {
      en: 'Conspirators',
      de: 'Verschwörer',
    },
    description: {
      en: '<b>Round start (each player)</b>: {resource:intrigue-trash}',
      de: '<b>Rundenbeginn (jeder Spieler)</b>: {resource:intrigue-trash}',
    },
    imagePath: 'assets/images/action-backgrounds/conspiracy.png',
    cardAmount: 1,
  },
  {
    title: {
      en: 'Assassins',
      de: 'Assassinen',
    },
    description: {
      en: '<b>Round start (each player)</b>: {resource:loose-troop}{resource:loose-troop}',
      de: '<b>Rundenbeginn (jeder Spieler)</b>: {resource:loose-troop}{resource:loose-troop}',
    },
    imagePath: 'assets/images/action-backgrounds/bene_gesserit.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'Saboteure',
      en: 'Saboteurs',
    },
    description: {
      en: '<b>Round start (each player)</b>: {resource:spice;amount:-1}',
      de: '<b>Rundenbeginn (jeder Spieler)</b>: {resource:spice;amount:-1}',
    },
    imagePath: 'assets/images/action-backgrounds/spice_depot.png',
    cardAmount: 1,
  },
  {
    title: {
      en: 'Heighliner',
      de: 'Heighliner',
    },
    description: {
      en: '<b>Reveal turn (each player)</b>: {resource:recruitment-emperor}{resource:recruitment-guild}{resource:recruitment-bene}',
      de: '<b>Aufdeckzug (jeder Spieler)</b>: {resource:recruitment-emperor}{resource:recruitment-guild}{resource:recruitment-bene}',
    },
    imagePath: '/assets/images/action-backgrounds/highliner_2.png',
    cardAmount: 2,
  },
];
