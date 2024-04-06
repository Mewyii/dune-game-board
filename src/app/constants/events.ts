import { LanguageString } from '../models';

export interface DuneEvent {
  title: LanguageString;
  description: LanguageString;
  imagePath: string;
  cardAmount?: number;
}

export const duneEvents: DuneEvent[] = [
  {
    title: {
      en: 'clear sky',
      de: 'klarer himmel',
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
      de: 'sandstürme',
      en: 'sandstorms',
    },
    description: {
      de: 'Es kann kein Spice gesammelt werden. <br>Die Kampfstärke aller Einheiten ist auf 1 reduziert.',
      en: 'Spice can not be harvested. <br>The combat strength of all units is reduced to 1.',
    },
    imagePath: 'assets/images/action-backgrounds/sandstorm.png',
    cardAmount: 3,
  },
  {
    title: {
      de: 'spice-explosionen',
      en: 'spice explosions',
    },
    description: {
      de: '<b>Rundenbeginn</b>: +1 Bonus-Spice auf Spice-Feldern.',
      en: '<b>Round start</b>: +1 bonus spice on spice fields.',
    },
    imagePath: 'assets/images/action-backgrounds/spice_field.png',
    cardAmount: 6,
  },
  {
    title: {
      de: 'sandwürmer',
      en: 'sandworms',
    },
    description: {
      de: 'Spice zu sammeln bringt -1 Spice ein.',
      en: 'Spice fields yield -1 spice.',
    },
    imagePath: 'assets/images/action-backgrounds/sandworm.png',
    cardAmount: 3,
  },
  {
    title: {
      de: 'Imperiale Delegation',
      en: 'Imperial Delegation',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:intrigue-trash} {resource:solari}{resource:helper-arrow-right}{resource:faction-influence-up-emperor}   {resource:separator}   {resource:faction-influence-down-emperor} {resource:solari} {resource:persuasion;amount:2}{resource:helper-arrow-right} {resource:victory-point}',
      en: '<b>Reveal turn (each player)</b>:   {resource:intrigue-trash} {resource:solari}{resource:helper-arrow-right}{resource:faction-influence-up-emperor}   {resource:separator}   {resource:faction-influence-down-emperor} {resource:solari} {resource:persuasion;amount:2}{resource:helper-arrow-right} {resource:victory-point}',
    },
    imagePath: 'assets/images/action-backgrounds/empire_ambassador.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'Gilden-Abgesandte',
      en: 'Guild Ambassadors',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:spice} {resource:solari}{resource:helper-arrow-right}{resource:faction-influence-up-guild}   {resource:separator}   {resource:faction-influence-down-guild} {resource:spice} {resource:persuasion;amount:1}{resource:helper-arrow-right} {resource:victory-point}',
      en: '<b>Reveal turn (each player)</b>:   {resource:spice} {resource:solari}{resource:helper-arrow-right}{resource:faction-influence-up-guild}   {resource:separator}   {resource:faction-influence-down-guild} {resource:spice} {resource:persuasion;amount:1}{resource:helper-arrow-right} {resource:victory-point}',
    },
    imagePath: 'assets/images/action-backgrounds/highliner.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'Missionara Protectiva',
      en: 'Missionara Protectiva',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:water} {resource:solari}{resource:helper-arrow-right}{resource:faction-influence-up-bene}   {resource:separator}   {resource:faction-influence-down-bene} {resource:persuasion;amount:3}{resource:helper-arrow-right} {resource:victory-point}',
      en: '<b>Reveal turn (each player)</b>:   {resource:water} {resource:solari}{resource:helper-arrow-right}{resource:faction-influence-up-bene}   {resource:separator}   {resource:faction-influence-down-bene} {resource:persuasion;amount:3}{resource:helper-arrow-right} {resource:victory-point}',
    },
    imagePath: 'assets/images/action-backgrounds/bene_gesserit_3.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'abgefallene fremen',
      en: 'Renegade Fremen',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:loose-troop}{resource:loose-troop}{resource:helper-arrow-right}{resource:faction-influence-up-fremen}   {resource:separator}   {resource:faction-influence-down-fremen} {resource:water} {resource:persuasion;amount:1}{resource:helper-arrow-right} {resource:victory-point}',
      en: '<b>Reveal turn (each player)</b>:   {resource:loose-troop}{resource:loose-troop}{resource:helper-arrow-right}{resource:faction-influence-up-fremen}   {resource:separator}   {resource:faction-influence-down-fremen} {resource:water} {resource:persuasion;amount:1}{resource:helper-arrow-right} {resource:victory-point}',
    },
    imagePath: 'assets/images/action-backgrounds/fremen_warriors.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'Pilger',
      en: 'Pilgrims',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>: Erhalte {resource:solari;amount:2} für jedes {faction:town}-Feld, auf dem sich einer deiner Agenten befindet.',
      en: '<b>Reveal turn (each player)</b>: Gain {resource:solari;amount:2} for each {faction:town}-field with one of your agents on it.',
    },
    imagePath: 'assets/images/action-backgrounds/faithful.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'Schmuggler',
      en: 'Smugglers',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:spice}{resource:helper-arrow-right}{resource:solari;amount:4}   {resource:separator}   {resource:loose-troop} {resource:loose-troop}{resource:helper-arrow-right} {resource:spice;amount:2}',
      en: '<b>Reveal turn (each player)</b>:   {resource:loose-troop}{resource:loose-troop}{resource:helper-arrow-right}{resource:faction-influence-up-fremen}   {resource:separator}   {resource:faction-influence-down-fremen} {resource:water} {resource:persuasion;amount:2}{resource:helper-arrow-right} {resource:victory-point}',
    },
    imagePath: 'assets/images/action-backgrounds/smugglers.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'Landraad-Abgeordnete',
      en: 'Landsraad representatives',
    },
    description: {
      de: 'Jedes mal, wenn du einen Agenten auf einem {faction:landsraad}-Feld <br>platzierst: {resource:card-draw}',
      en: 'Every time you send an agent to a {faction:landsraad}-field: {resource:card-draw}',
    },
    imagePath: 'assets/images/action-backgrounds/empire_ambassador_2.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'Ixianische Händler',
      en: 'Ixian Merchants',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>:   {resource:solari;amount:2}{resource:helper-arrow-right}{resource:tech-reduced-two}   {resource:separator}   <br>Entsorge 2 Techplättchen {resource:helper-arrow-right} {resource:victory-point}',
      en: '<b>Reveal turn (each player)</b>:   {resource:solari;amount:2}{resource:helper-arrow-right}{resource:tech-reduced-two}   {resource:separator}   <br>Trash 2 techtiles {resource:helper-arrow-right} {resource:victory-point}',
    },
    imagePath: 'assets/images/action-backgrounds/industry_2.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'Verschwörer',
      en: 'Conspirators',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>: Verliere {resource:intrigue}{resource:intrigue}{resource:separator}{resource:victory-point}.',
      en: '<b>Reveal turn (each player)</b>: Lose {resource:intrigue}{resource:intrigue}{resource:separator}{resource:victory-point}.',
    },
    imagePath: 'assets/images/action-backgrounds/conspiracy.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'Assassinen',
      en: 'Assassins',
    },
    description: {
      de: '<b>Aufdeckzug (jeder Spieler)</b>: Verliere {resource:troop}{resource:troop}{resource:separator}{resource:victory-point}.',
      en: '<b>Reveal turn (each player)</b>: Lose {resource:troop}{resource:troop}{resource:separator}{resource:victory-point}.',
    },
    imagePath: 'assets/images/action-backgrounds/bene_gesserit.png',
    cardAmount: 1,
  },
];
