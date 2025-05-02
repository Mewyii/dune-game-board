import { Effect, EffectReward, LanguageString } from '../models';
import { EffectSizeType } from '../models/imperium-card';

export interface Leader {
  name: LanguageString;
  type: 'new';
  house: LanguageString;
  startingResources: EffectReward[];
  passiveName: LanguageString;
  passiveEffects?: Effect[];
  passiveEffectSize?: EffectSizeType;
  passiveDescription: LanguageString;
  signetName: LanguageString;
  signetEffects?: Effect[];
  signetEffectSize?: EffectSizeType;
  signetDescription: LanguageString;
  imageUrl: string;
}

export const leaders: Leader[] = [
  {
    name: {
      en: 'Stilgar',
      de: 'Stilgar',
    },
    house: {
      en: 'fremen',
      de: 'fremen',
    },
    passiveName: {
      en: 'Naib of Sietch Tabr',
      de: 'Naib von Sietch Tabr',
    },
    passiveDescription: {
      en: 'You have access to Sietch Tabr.',
      de: 'Du hast Zugang zu Sietch Tabr.',
    },
    signetName: {
      en: 'The fremen ways',
      de: 'Die Wege der Fremen',
    },
    signetDescription: {
      en: '{resource:loose-troop}{resource:helper-trade}{resource:signet-token}. You may trash it at any time to get {resource:sword}{resource:sword}{resource:sword}.',
      de: '{resource:loose-troop}{resource:helper-trade}{resource:signet-token}. Du kannst es jederzeit entsorgen, um {resource:sword}{resource:sword}{resource:sword} zu erhalten.',
    },
    imageUrl: '/assets/images/leaders/stilgar.png',
    type: 'new',
    passiveEffectSize: 'small',
    signetEffectSize: 'small',
    startingResources: [
      {
        type: 'water',
      },
      {
        type: 'troop',
      },
    ],
    passiveEffects: [
      {
        type: 'timing-game-start',
      },
      {
        type: 'faction-influence-up-fremen',
      },
    ],
    signetEffects: [],
  },
  {
    name: {
      en: 'Liet Kynes',
      de: 'Liet Kynes',
    },
    house: {
      en: 'fremen',
      de: 'fremen',
    },
    passiveName: {
      en: 'Leader of the fremen',
      de: 'Anführer der Fremen',
    },
    passiveDescription: {
      en: "Don't put a marker on the {faction:fremen}-influence-track. Every time you would gain influence there: {resource:troop}<br>Ignore all {faction:fremen} -requirements.",
      de: 'Lege keinen Marker auf die {faction:fremen}-Einflussleiste. Immer wenn du dort Einfluss erhalten würdest: {resource:troop}<br>Ignoriere alle {faction:fremen} -Bedingungen.',
    },
    signetName: {
      en: 'Planting the paradise',
      de: 'Pflanzen des Paradieses',
    },
    signetDescription: {
      en: '{resource:signet-token} {resource:helper-or} {resource:water}{resource:loose-troop}{resource:helper-trade}{resource:signet-token;amount:2} {resource:helper-or} {resource:signet-token;amount:3}{resource:helper-trade}{resource:victory-point}',
      de: '{resource:signet-token} {resource:helper-or} {resource:water}{resource:loose-troop}{resource:helper-trade}{resource:signet-token;amount:2} {resource:helper-or} {resource:signet-token;amount:3}{resource:helper-trade}{resource:victory-point}',
    },
    imageUrl: '/assets/images/leaders/liet.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    startingResources: [
      {
        type: 'water',
      },
      {
        type: 'troop',
      },
    ],
    passiveEffects: [],
    signetEffects: [],
  },
  {
    name: {
      en: 'Chani Kynes',
      de: 'Chani Kynes',
    },
    house: {
      en: 'fremen',
      de: 'fremen',
    },
    passiveName: {
      en: 'Fremen bonds',
      de: 'Fremenbande',
    },
    passiveDescription: {
      en: 'Fremen cards cost {resource:persuasion;amount:1} less to acquire (min. 1).',
      de: 'Du kannst Fremen-Karten für {resource:persuasion;amount:1} weniger erwerben (min. 1).',
    },
    signetName: {
      en: 'Child of the desert',
      de: 'Kind der Wüste',
    },
    signetDescription: {
      en: '{resource:signet-token}. You may trash it to reduce {resource:water}-costs of {faction:spice} board spaces by <b>1</b> this turn.',
      de: '{resource:signet-token}. Du kannst es entsorgen, um {resource:water}-Kosten für {faction:spice}-Felder in diesem Zug um <b>1</b> zu reduzieren.',
    },
    imageUrl: '/assets/images/leaders/chani.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'small',
    startingResources: [
      {
        type: 'water',
      },
      {
        type: 'troop',
      },
    ],
    passiveEffects: [],
    signetEffects: [],
  },
  {
    name: {
      en: 'Alia Atreides',
      de: 'Alia Atreides',
    },
    house: {
      en: 'house atreides',
      de: 'haus atreides',
    },
    passiveName: {
      en: 'Pre-born',
      de: 'Vorgeboren',
    },
    passiveDescription: {
      en: 'You can not trash your {resource:signet-ring}-cards. Every time you reveal or discard them: {resource:faction-influence-down-choice}',
      de: 'Du kannst deine {resource:signet-ring}-Karten nicht entsorgen. Jedes Mal, wenn du sie aufdeckst oder abwirfst: {resource:faction-influence-down-choice}',
    },
    signetName: {
      en: 'Ego-memories',
      de: 'Ego-Erinnerungen',
    },
    signetDescription: {
      en: '',
      de: '',
    },
    imageUrl: '/assets/images/leaders/alia.png',
    type: 'new',
    passiveEffectSize: 'small',
    signetEffectSize: 'medium',
    startingResources: [
      {
        type: 'spice',
      },
      {
        type: 'troop',
        amount: 3,
      },
    ],
    passiveEffects: [
      {
        type: 'timing-round-start',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'card-draw',
      },
    ],
    signetEffects: [
      {
        type: 'spice',
        amount: -1,
      },
      {
        type: 'helper-or',
      },
      {
        type: 'card-discard',
      },
      {
        type: 'card-discard',
      },
    ],
  },
  {
    name: {
      en: 'The Preacher',
      de: 'Der Prediger',
    },
    house: {
      en: '-',
      de: '-',
    },
    passiveName: {
      en: 'Blind but seeing',
      de: 'Blind und doch Sehend',
    },
    passiveDescription: {
      en: '<b>Reveal turn</b>: Before you reveal, you may put <b>1</b> of your cards in play back to your hand.',
      de: '<b>Aufdeckzug</b>: Bevor du aufdeckst, darfst du <b>1</b> deiner Karten im Spiel zurück auf deine Hand nehmen.',
    },
    signetName: {
      en: 'Accusing prophet',
      de: 'Anklagender Prophet',
    },
    signetDescription: {
      en: 'Each player: {resource:card-discard}',
      de: 'Jeder Spieler: {resource:card-discard}',
    },
    imageUrl: '/assets/images/leaders/preacher.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    startingResources: [
      {
        type: 'water',
      },
    ],
    passiveEffects: [],
    signetEffects: [],
  },
  {
    name: {
      de: 'Prinzessin Irulan Corrino',
      en: 'Princess Irulan Corrino',
    },
    house: {
      de: 'haus corrino',
      en: 'house corrino',
    },
    passiveName: {
      de: 'Tochter des Imperators',
      en: 'Daughter of the emperor',
    },
    passiveDescription: {
      en: "Don't put a marker on the {faction:emperor}-influence-track. Every time you would gain influence there: {resource:solari}<br>Ignore all {faction:emperor} -requirements.",
      de: 'Lege keinen Marker auf die {faction:emperor}-Einflussleiste. Immer wenn du dort Einfluss erhalten würdest: {resource:solari}<br>Ignoriere alle {faction:emperor} -Bedingungen.',
    },
    signetName: {
      de: 'Chronistin',
      en: 'Chronicler',
    },
    signetDescription: {
      en: 'Place {resource:signet-token} on a board space that has one of your agents on it. Trash it when you place an agent there the next time to get {resource:card-draw}{resource:card-draw}.',
      de: 'Lege {resource:signet-token} auf ein Feld mit einem deiner Agenten. Entsorge es, wenn du dort das nächste Mal einen Agenten platzierst, um {resource:card-draw}{resource:card-draw} zu erhalten.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/irulan.png',

    startingResources: [
      {
        type: 'solari',
        amount: 2,
      },
      {
        type: 'troop',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Feyd-Rautha Harkonnen',
      de: 'Feyd-Rautha Harkonnen',
    },
    house: {
      en: 'house harkonnen',
      de: 'haus harkonnen',
    },
    passiveName: {
      en: 'Ruthless ambition',
      de: 'Rücksichtsloser Ehrgeiz',
    },
    passiveDescription: {
      en: 'Every time you draw an intrigue card you may: {resource:solari}{resource:helper-trade}{resource:intrigue-trash}{resource:intrigue}',
      de: 'Immer wenn du eine Intrige erhältst, kannst du: {resource:solari}{resource:helper-trade}{resource:intrigue-trash}{resource:intrigue}',
    },
    signetName: {
      en: 'Hidden poison',
      de: 'Verstecktes Gift',
    },
    signetDescription: {
      en: ' {resource:signet-token}. You may trash it during combat to get {resource:sword}.',
      de: '{resource:signet-token}. Du kannst es während des Kampfes entsorgen, um {resource:sword} zu erhalten.',
    },
    imageUrl: '/assets/images/leaders/feyd.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'small',
    startingResources: [
      {
        type: 'solari',
      },
      {
        type: 'troop',
        amount: 4,
      },
    ],
    passiveEffects: [],
    signetEffects: [],
  },
  {
    name: {
      en: 'Count Hasimir Fenring',
      de: 'Graf Hasimir Fenring',
    },
    house: {
      en: 'house fenring',
      de: 'haus fenring',
    },
    passiveName: {
      en: 'Agent of the emperor',
      de: 'Agent des Imperators',
    },
    passiveDescription: {
      en: '',
      de: '',
    },
    signetName: {
      en: 'Orchestrated weakness',
      de: 'Inszenierte Schwächlichkeit',
    },
    signetDescription: {
      en: '{resource:card-discard}{resource:helper-trade}{resource:signet-token}. Trash it at your reveal turn to get {resource:sword}{resource:sword}{resource:sword}{resource:helper-or}{resource:intrigue}.',
      de: '{resource:card-discard}{resource:helper-trade}{resource:signet-token}. Entsorge es an deinem Aufdeckzug, um {resource:sword}{resource:sword}{resource:sword}{resource:helper-or}{resource:intrigue} zu erhalten.',
    },
    imageUrl: '/assets/images/leaders/hasimir.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'small',
    startingResources: [
      {
        type: 'solari',
        amount: 2,
      },
      {
        type: 'troop',
        amount: 2,
      },
    ],
    passiveEffects: [
      {
        type: 'timing-game-start',
      },
      {
        type: 'foldspace',
      },
      {
        type: 'faction-influence-up-emperor',
      },
    ],
    signetEffects: [],
  },
  {
    name: {
      en: 'Lady Margot Fenring',
      de: 'Lady Margot Fenring',
    },
    house: {
      en: 'house fenring',
      de: 'haus fenring',
    },
    passiveName: {
      en: 'Bene gesserit training',
      de: 'Bene Gesserit Ausbildung',
    },
    passiveDescription: {
      en: 'You may pass your 1. turn of each round. If you do: {resource:card-discard}{resource:helper-trade}{resource:card-draw}',
      de: 'Du kannst deinen 1. Zug jeder Runde passen. Tust du das: {resource:card-discard}{resource:helper-trade}{resource:card-draw}',
    },
    signetName: {
      en: 'Hypnotic seduction',
      de: 'Hypnotische Verführung',
    },
    signetDescription: {
      en: 'Place {resource:signet-token} on a card of the imperium row. It costs you {resource:persuasion;amount:1} less and opponents {resource:persuasion;amount:1} more.',
      de: 'Lege {resource:signet-token} auf eine Karte der Imperium-Reihe. Sie kostet dich {resource:persuasion;amount:1} weniger, Gegner {resource:persuasion;amount:1} mehr.',
    },
    imageUrl: '/assets/images/leaders/margot.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    startingResources: [
      {
        type: 'solari',
        amount: 2,
      },
      {
        type: 'troop',
        amount: 2,
      },
    ],
    passiveEffects: [],
    signetEffects: [],
  },
  {
    name: {
      en: 'Tessia Vernius',
      de: 'Tessia Vernius',
    },
    house: {
      en: 'house vernius',
      de: 'haus vernius',
    },
    passiveName: {
      en: 'Ixian gifts',
      de: 'Ixianische Geschenke',
    },
    passiveDescription: {
      en: '<b>Reveal turn</b>: You may trash 1 tech tile to get {resource:faction-influence-up-choice}.',
      de: '<b>Aufdeckzug</b>: Du kannst 1 Tech-Plättchen entsorgen, um {resource:faction-influence-up-choice} zu erhalten.',
    },
    signetName: {
      en: 'Inspiring presence',
      de: 'Inspirierende Präsenz',
    },
    signetDescription: {
      en: '{resource:card-draw}{resource:helper-or}You can activate the agent effect of one of your handcards.',
      de: '{resource:card-draw}{resource:helper-or}Aktiviere den Agenten-Effekt einer deiner Handkarten.',
    },
    imageUrl: '/assets/images/leaders/tessia.png',
    type: 'new',
    startingResources: [
      {
        type: 'tech',
      },
      {
        type: 'troop',
        amount: 3,
      },
    ],
  },
  {
    name: {
      en: 'Earl Rhombur Vernius',
      de: 'Graf Rhombur Vernius',
    },
    house: {
      en: 'house vernius',
      de: 'haus vernius',
    },
    passiveName: {
      en: 'Cybernetic implants',
      de: 'Kybernetische Implantate',
    },
    passiveDescription: {
      en: 'You may at any time: {resource:signet-token;amount:3}{resource:helper-trade}{resource:agent-lift}',
      de: 'Du kannst jederzeit: {resource:signet-token;amount:3}{resource:helper-trade}{resource:agent-lift}',
    },
    signetName: {
      en: 'Earl of ix',
      de: 'Graf von Ix',
    },
    signetDescription: {
      en: '',
      de: '',
    },
    imageUrl: '/assets/images/leaders/rhombur.png',
    type: 'new',
    passiveEffectSize: 'small',
    signetEffectSize: 'large',
    startingResources: [
      {
        type: 'tech',
      },
      {
        type: 'troop',
        amount: 3,
      },
    ],
    passiveEffects: [
      {
        type: 'timing-round-start',
      },
      {
        type: 'signet-token',
      },
    ],
    signetEffects: [
      {
        type: 'tech',
      },
    ],
  },
  {
    name: {
      en: 'Count August Metulli',
      de: 'Graf August Metulli',
    },
    house: {
      en: 'house metulli',
      de: 'haus metulli',
    },
    passiveName: {
      en: 'Isolationist',
      de: 'Isolationist',
    },
    passiveDescription: {
      en: '<b>Reveal turn</b>: You cannot acquire cards. You receive a {resource:signet-token} for each {resource:persuasion}.',
      de: '<b>Aufdeckzug</b>: Du kannst keine Karten erwerben. Du erhältst für jede {resource:persuasion} ein {resource:signet-token}.',
    },
    signetName: {
      en: 'Manipulator',
      de: 'Manipulator',
    },
    signetDescription: {
      en: 'You may choose any card in play or in the imperium row and pay {resource:signet-token} equal to its {resource:persuasion} cost. Activate its agent effect.',
      de: 'Wähle eine beliebige Karte im Spiel oder in der Imperium-Reihe. Zahle {resource:signet-token} entsprechend ihrer {resource:persuasion}-Kosten, um ihren Agenten-Effekt zu aktivieren.',
    },
    imageUrl: '/assets/images/leaders/august.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    startingResources: [
      {
        type: 'signet-token',
        amount: 2,
      },
      {
        type: 'troop',
        amount: 2,
      },
    ],
    passiveEffects: [],
    signetEffects: [],
  },
  {
    name: {
      en: 'Lunara Metulli',
      de: 'Lunara Metulli',
    },
    house: {
      en: 'house metulli',
      de: 'haus metulli',
    },
    passiveName: {
      en: 'Struggling house',
      de: 'Bedrängtes Haus',
    },
    passiveDescription: {
      en: '',
      de: '',
    },
    signetName: {
      en: 'Thorough approach',
      de: 'Sorgfältiges Vorgehen',
    },
    signetDescription: {
      en: '{resource:signet-token}. Trash it when you receive {resource:solari} or {resource:spice}, {resource:water} to get <b>1</b> more of it.',
      de: '{resource:signet-token}. Entsorge es, wenn du {resource:solari}, {resource:spice} oder {resource:water} erhältst, um davon <b>1</b> mehr zu erhalten.',
    },
    imageUrl: '/assets/images/leaders/lunara.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'small',
    startingResources: [
      {
        type: 'signet-token',
      },
      {
        type: 'troop',
        amount: 3,
      },
    ],
    passiveEffects: [
      {
        type: 'timing-round-start',
      },
      {
        type: 'solari',
        amount: -1,
      },
      {
        type: 'helper-or',
      },
      {
        type: 'card-discard',
      },
    ],
    signetEffects: [],
  },
  {
    name: {
      en: 'Paul Atreides',
      de: 'Paul Atreides',
    },
    house: {
      en: 'House Atreides',
      de: 'Haus Atreides',
    },
    passiveName: {
      en: 'Atreides training',
      de: 'Atreides-Ausbildung',
    },
    passiveDescription: {
      en: '',
      de: '',
    },
    signetName: {
      en: 'Dreams',
      de: 'Träume',
    },
    signetDescription: {
      en: 'You may look at the top card of your deck or the conflict deck.',
      de: 'Du kannst dir die oberste Karte deines Decks oder des Konfliktstapels ansehen.',
    },
    imageUrl: '/assets/images/leaders/paul_atreides.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    startingResources: [
      {
        type: 'solari',
      },
      {
        type: 'troop',
        amount: 3,
      },
    ],
    passiveEffects: [
      {
        type: 'timing-round-start',
      },
      {
        type: 'card-discard',
      },
      {
        type: 'card-draw',
      },
    ],
    signetEffects: [],
  },
  {
    name: {
      en: "Paul Muad'Dib",
      de: "Paul Muad'Dib",
    },
    house: {
      en: 'House Atreides',
      de: 'Haus Atreides',
    },
    passiveName: {
      en: 'Visions',
      de: 'Visionen',
    },
    passiveDescription: {
      en: '<b>Round start</b>: You may look at the top card of your deck and the conflict deck.',
      de: '<b>Rundenbeginn</b>: Du kannst dir die oberste Karte deines Decks und des Konfliktstapels ansehen.',
    },
    signetName: {
      en: 'Lisan al Gaib',
      de: 'Lisan al Gaib',
    },
    signetDescription: {
      en: '',
      de: '',
    },
    imageUrl: '/assets/images/leaders/paul_muaddib.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'large',
    startingResources: [
      {
        type: 'water',
      },
      {
        type: 'troop',
        amount: 2,
      },
    ],
    passiveEffects: [],
    signetEffects: [
      {
        type: 'card-draw',
      },
      {
        type: 'helper-or',
      },
      {
        type: 'troop',
      },
    ],
  },
  {
    name: {
      en: 'Emperor Paul Atreides',
      de: 'Imperator Paul Atreides',
    },
    house: {
      en: 'House Atreides',
      de: 'Haus Atreides',
    },
    passiveName: {
      en: 'Prescience',
      de: 'Vorwissen',
    },
    passiveDescription: {
      en: 'You may look at the top card of your deck, the intrigue deck as well as the conflict deck at any time.',
      de: 'Du kannst dir jederzeit die oberste Karte deines Decks, des Intrigen- sowie des Konflikt-Stapels ansehen.',
    },
    signetName: {
      en: 'Careful planning',
      de: 'Umsichtige Planung',
    },
    signetDescription: {
      en: '',
      de: '',
    },
    imageUrl: '/assets/images/leaders/paul_emperor.png',
    type: 'new',
    startingResources: [
      {
        type: 'spice',
      },
      {
        type: 'troop',
        amount: 3,
      },
    ],
    passiveEffectSize: 'medium',
    signetEffectSize: 'large',
    passiveEffects: [],
    signetEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'intrigue',
      },
    ],
  },
  {
    name: {
      en: 'Baron Vladimir Harkonnen',
      de: 'Baron Vladimir Harkonnen',
    },
    house: {
      en: 'House Harkonnen',
      de: 'Haus Harkonnen',
    },
    passiveName: {
      en: 'Conspirator',
      de: 'Verschwörer',
    },
    passiveDescription: {
      en: '',
      de: '',
    },
    signetName: {
      en: 'Boundless greed',
      de: 'Grenzenlose Gier',
    },
    signetDescription: {
      en: '',
      de: '',
    },
    imageUrl: '/assets/images/leaders/vlad.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'large',
    startingResources: [
      {
        type: 'solari',
      },
      {
        type: 'troop',
        amount: 4,
      },
    ],
    passiveEffects: [
      {
        type: 'timing-game-start',
      },
      {
        type: 'intrigue',
      },
      {
        type: 'intrigue',
      },
      {
        type: 'intrigue',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'intrigue-trash',
      },
    ],
    signetEffects: [
      {
        type: 'loose-troop',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'spice',
      },
    ],
  },
  {
    name: {
      en: 'Duke Leto Atreides',
      de: 'Herzog Leto Atreides ',
    },
    house: {
      en: 'House Atreides',
      de: 'Haus Atreides',
    },
    passiveName: {
      en: 'Fair leader',
      de: 'Gerechter Anführer',
    },
    passiveDescription: {
      en: '',
      de: '',
    },
    signetName: {
      en: 'Inspiring loyalty',
      de: 'Loyalität Inspirierend',
    },
    signetDescription: {
      en: 'Place {resource:signet-token} on a location that has one of your agents on it. If there are <b>3</b> or more {resource:signet-token}, take control of it.',
      de: 'Lege {resource:signet-token} auf einen Ort mit einem deiner Agenten. Sind dort <b>3</b> oder mehr {resource:signet-token}, übernimm die Kontrolle über ihn.',
    },
    imageUrl: '/assets/images/leaders/leto.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    startingResources: [
      {
        type: 'solari',
      },
      {
        type: 'troop',
        amount: 3,
      },
    ],
    passiveEffects: [
      {
        type: 'timing-reveal-turn',
      },
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
    signetEffects: [],
  },
  {
    name: {
      en: 'Count Glossu Rabban',
      de: 'Graf Glossu Rabban',
    },
    house: {
      en: 'House Harkonnen',
      de: 'Haus Harkonnen',
    },
    passiveName: {
      en: 'Uncontrolled aggression',
      de: 'Unkontrollierte Agression',
    },
    passiveDescription: {
      en: '<b>Round start</b>: Trash one of your handcards.',
      de: '<b>Rundenbeginn</b>: Entsorge eine der Karten auf deiner Hand.',
    },
    signetName: {
      en: 'Oppression',
      de: 'Unterdrückung',
    },
    signetDescription: {
      en: '{resource:solari}{resource:helper-or}Receive the bonus of up to <b>2</b> locations under your control.',
      de: '{resource:solari}{resource:helper-or}Erhalte den Bonus von bis zu <b>2</b> Orten unter deiner Kontrolle.',
    },
    imageUrl: '/assets/images/leaders/rabban.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    startingResources: [
      {
        type: 'spice',
      },
      {
        type: 'troop',
        amount: 4,
      },
    ],
    passiveEffects: [],
    signetEffects: [],
  },
  {
    name: {
      en: 'Archduke Armand Ecaz',
      de: 'Erzherzog Armand Ecaz',
    },
    house: {
      en: 'House Ecaz',
      de: 'Haus Ecaz',
    },
    passiveName: {
      en: 'Renowned house',
      de: 'Renommiertes Haus',
    },
    passiveDescription: {
      en: '',
      de: '',
    },
    signetName: {
      en: 'Battle-hardened',
      de: 'Kriegserfahren',
    },
    signetDescription: {
      en: 'You may deploy or retreat one of your troops.',
      de: 'Du kannst eine deiner Truppen einsetzen oder zurückziehen.',
    },
    imageUrl: '/assets/images/leaders/armand.png',
    type: 'new',
    startingResources: [
      {
        type: 'solari',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 3,
      },
    ],
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    passiveEffects: [
      {
        type: 'timing-game-start',
      },
      {
        type: 'faction-influence-up-choice',
      },
    ],
    signetEffects: [],
  },
  {
    name: {
      en: 'Eva Moritani',
      de: 'Eva Moritani',
    },
    house: {
      en: 'House Moritani',
      de: 'Haus Moritani',
    },
    passiveName: {
      en: 'Forced recruitment',
      de: 'Zwangsrekrutierung',
    },
    passiveDescription: {
      en: '<b>Reveal turn:</b> Trash any amount of times one of your {resource:signet-token} to gain {resource:troop}.',
      de: '<b>Aufdeckzug:</b> Entsorge beliebig viele deiner {resource:signet-token}, um dafür jeweils {resource:troop} zu erhalten.',
    },
    signetName: {
      en: 'Labour camps',
      de: 'Arbeitslager',
    },
    signetDescription: {
      en: 'Place {resource:signet-token} on a board space that has one of your agents on it. If you have troops in combat: {resource:spice}',
      de: 'Lege {resource:signet-token} auf ein {faction:town}-Feld mit einem deiner Agenten. Wenn ein Spieler dort einen Agent platziert, erhältst du und der Spieler jeweils {resource:solari}.',
    },
    imageUrl: '/assets/images/leaders/yuna_2.png',
    type: 'new',
    startingResources: [
      {
        type: 'troop',
      },
    ],
  },
  {
    name: {
      en: 'Dara Moritani',
      de: 'Dara Moritani',
    },
    house: {
      en: 'House Moritani',
      de: 'Haus Moritani',
    },
    passiveName: {
      en: 'In the shadows',
      de: 'In den Schatten',
    },
    passiveDescription: {
      en: "Enemy agents don't block board spaces for you.",
      de: 'Gegnerische Agenten blockieren Felder für dich nicht.',
    },
    signetName: {
      en: 'Extortion',
      de: 'Erpressung',
    },
    signetDescription: {
      en: 'For each board space that has one <br>of your agents and an enemy agent on it: {resource:spice}',
      de: 'Für jedes Feld, auf dem sich einer deiner Agenten und ein gegnerischer Agent befindet: {resource:spice}',
    },
    imageUrl: '/assets/images/leaders/dara.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    startingResources: [
      {
        type: 'solari',
      },
    ],
    passiveEffects: [],
    signetEffects: [],
  },
  {
    name: {
      en: 'Earl Memnon Thorvald',
      de: 'Graf Memnon Thorvald',
    },
    house: {
      en: 'House Thorvald',
      de: 'Haus Thorvald',
    },
    passiveName: {
      en: 'Landsraad-support',
      de: 'Landsraad-Unterstützung',
    },
    passiveDescription: {
      en: 'Every time you send an agent to a {faction:landsraad} board space: {resource:solari}{resource:helper-trade}{resource:troop}',
      de: 'Immer wenn du einen Agenten zu einem {faction:landsraad}-Feld entsendest: {resource:solari}{resource:helper-trade}{resource:troop}',
    },
    signetName: {
      en: 'Smuggling connections',
      de: 'Schmuggler-Verbindungen',
    },
    signetDescription: {
      en: '',
      de: '',
    },
    imageUrl: '/assets/images/leaders/memnon.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'large',
    startingResources: [
      {
        type: 'solari',
      },
      {
        type: 'troop',
        amount: 3,
      },
    ],
    passiveEffects: [],
    signetEffects: [
      {
        type: 'solari',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Countess Ariana Thorvald',
      de: 'Gräfin Ariana Thorvald',
    },
    house: {
      en: 'House Thorvald',
      de: 'Haus Thorvald',
    },
    passiveName: {
      en: 'Spice-receptive',
      de: 'Spice-Empfänglich',
    },
    passiveDescription: {
      en: '',
      de: '',
    },
    signetName: {
      en: 'Equipment production',
      de: 'Ausrüstungsproduktion',
    },
    signetDescription: {
      en: '',
      de: '',
    },
    imageUrl: '/assets/images/leaders/ariana_4.png',
    type: 'new',
    startingResources: [
      {
        type: 'solari',
      },
      {
        type: 'troop',
        amount: 3,
      },
    ],
    passiveEffectSize: 'medium',
    signetEffectSize: 'large',
    passiveEffects: [
      {
        type: 'timing-round-start',
      },
      {
        type: 'spice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'focus',
      },
    ],
    signetEffects: [
      {
        type: 'water',
      },
    ],
  },
];
