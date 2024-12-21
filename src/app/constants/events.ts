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
    cardAmount: 2,
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
          id: 'sandworms-recued-spice',
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
      de: 'Imperiale Delegation',
      en: 'Imperial Delegation',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:intrigue-trash} {resource:solari}{resource:helper-trade}{resource:faction-influence-up-emperor}   {resource:helper-or}   {resource:faction-influence-down-emperor} {resource:solari} {resource:persuasion;amount:2}{resource:helper-trade} {resource:victory-point}',
      en: '<b>Reveal turn (each player)</b>:   {resource:intrigue-trash} {resource:solari}{resource:helper-trade}{resource:faction-influence-up-emperor}   {resource:helper-or}   {resource:faction-influence-down-emperor} {resource:solari} {resource:persuasion;amount:2}{resource:helper-trade} {resource:victory-point}',
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
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:spice} {resource:solari}{resource:helper-trade}{resource:faction-influence-up-guild}   {resource:helper-or}   {resource:faction-influence-down-guild} {resource:spice} {resource:persuasion;amount:1}{resource:helper-trade} {resource:victory-point}',
      en: '<b>Reveal turn (each player)</b>:   {resource:spice} {resource:solari}{resource:helper-trade}{resource:faction-influence-up-guild}   {resource:helper-or}   {resource:faction-influence-down-guild} {resource:spice} {resource:persuasion;amount:1}{resource:helper-trade} {resource:victory-point}',
    },
    imagePath: 'assets/images/action-backgrounds/highliner.png',
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
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:water} {resource:solari}{resource:helper-trade}{resource:faction-influence-up-bene}   {resource:helper-or}   {resource:faction-influence-down-bene} {resource:persuasion;amount:3}{resource:helper-trade} {resource:victory-point}',
      en: '<b>Reveal turn (each player)</b>:   {resource:water} {resource:solari}{resource:helper-trade}{resource:faction-influence-up-bene}   {resource:helper-or}   {resource:faction-influence-down-bene} {resource:persuasion;amount:3}{resource:helper-trade} {resource:victory-point}',
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
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:loose-troop}{resource:loose-troop}{resource:helper-trade}{resource:faction-influence-up-fremen}   {resource:helper-or}   {resource:faction-influence-down-fremen} {resource:water} {resource:persuasion;amount:1}{resource:helper-trade} {resource:victory-point}',
      en: '<b>Reveal turn (each player)</b>:   {resource:loose-troop}{resource:loose-troop}{resource:helper-trade}{resource:faction-influence-up-fremen}   {resource:helper-or}   {resource:faction-influence-down-fremen} {resource:water} {resource:persuasion;amount:1}{resource:helper-trade} {resource:victory-point}',
    },
    imagePath: 'assets/images/action-backgrounds/fremen_warriors.png',
    cardAmount: 1,
    aiAdjustments: {
      goalEvaluationModifier: () => [{ type: 'fremen-alliance', modifier: 0.15 }],
    },
  },
  {
    title: {
      en: 'Pilgrims',
      de: 'Pilger',
    },
    description: {
      en: '<b>Reveal turn (each player)</b>: Gain {resource:solari;amount:2} for each {faction:town}-field with one of your agents on it.',
      de: '<b>Aufdeckzug (jeder Spieler)</b>: Erhalte {resource:solari;amount:2} für jedes {faction:town}-Feld, auf dem sich einer deiner Agenten befindet.',
    },
    imagePath: 'assets/images/action-backgrounds/faithful.png',
    cardAmount: 1,
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => (field.actionType === 'town' ? 0.1 : 0.0),
    },
  },
  {
    title: {
      de: 'Schmuggler',
      en: 'Smugglers',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:spice}{resource:helper-trade}{resource:solari;amount:4}   {resource:helper-or}   {resource:loose-troop} {resource:loose-troop}{resource:helper-trade} {resource:spice;amount:2}',
      en: '<b>Reveal turn (each player)</b>:   {resource:loose-troop}{resource:loose-troop}{resource:helper-trade}{resource:faction-influence-up-fremen}   {resource:helper-or}   {resource:faction-influence-down-fremen} {resource:water} {resource:persuasion;amount:2}{resource:helper-trade} {resource:victory-point}',
    },
    imagePath: 'assets/images/action-backgrounds/smugglers.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'Landraad-Abgeordnete',
      en: 'Landsraad Representatives',
    },
    description: {
      de: 'Jedes mal, wenn du einen Agenten auf einem {faction:landsraad}-Feld <br>platzierst: {resource:card-draw}',
      en: 'Every time you send an agent to a {faction:landsraad}-field: {resource:card-draw}',
    },
    imagePath: 'assets/images/action-backgrounds/empire_ambassador_2.png',
    cardAmount: 1,
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => (field.actionType === 'landsraad' ? 0.1 : 0.0),
    },
  },
  {
    title: {
      de: 'Ixianische Händler',
      en: 'Ixian Merchants',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:solari;amount:2}{resource:helper-trade}{resource:tech-reduced-two}   {resource:helper-or}   <br>Entsorge 2 Techplättchen {resource:helper-trade} {resource:victory-point}',
      en: '<b>Reveal turn (each player)</b>:   {resource:solari;amount:2}{resource:helper-trade}{resource:tech-reduced-two}   {resource:helper-or}   <br>Trash 2 techtiles {resource:helper-trade} {resource:victory-point}',
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
      en: '<b>Reveal turn (each player)</b>: Lose {resource:intrigue}{resource:intrigue}{resource:helper-or}{resource:victory-point}.',
      de: '<b>Aufdeckzug (jeder Spieler)</b>: Verliere {resource:intrigue}{resource:intrigue}{resource:helper-or}{resource:victory-point}.',
    },
    imagePath: 'assets/images/action-backgrounds/conspiracy.png',
    cardAmount: 1,
    aiAdjustments: {
      goalEvaluationModifier: () => [{ type: 'intrigues', modifier: 0.1 }],
    },
  },
  {
    title: {
      en: 'Assassins',
      de: 'Assassinen',
    },
    description: {
      en: '<b>Reveal turn (each player)</b>: Lose {resource:troop}{resource:troop}{resource:helper-or}{resource:victory-point}.',
      de: '<b>Aufdeckzug (jeder Spieler)</b>: Verliere {resource:troop}{resource:troop}{resource:helper-or}{resource:victory-point}.',
    },
    imagePath: 'assets/images/action-backgrounds/bene_gesserit.png',
    cardAmount: 1,
    aiAdjustments: {
      goalEvaluationModifier: () => [{ type: 'troops', modifier: 0.1 }],
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
];
