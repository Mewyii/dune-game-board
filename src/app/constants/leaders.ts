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
  passiveDescriptionSize?: EffectSizeType;
  signetName: LanguageString;
  signetEffects?: Effect[];
  signetEffectSize?: EffectSizeType;
  signetDescription: LanguageString;
  signetDescriptionSize?: EffectSizeType;
  imageUrl: string;
}

export const leaders: Leader[] = [
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
      en: 'Atreides-training',
      de: 'Atreides-Ausbildung',
    },
    passiveDescription: {
      en: "Enemy agents don't block {faction:fremen} board spaces for you.",
      de: 'Gegnerische Agenten blockieren {faction:fremen}-Felder für dich nicht. ',
    },
    signetName: {
      en: 'Kwisatz Haderach',
      de: 'Kwisatz Haderach',
    },
    signetDescription: {
      en: 'You may look at the top card of the intrigue or conflict deck.<br>{faction:fremen} 2 Influence: {resource:card-draw}{resource:troop}{resource:helper-or}4 Influence:  {resource:card-draw}{resource:agent-lift}',
      de: 'Du kannst dir die oberste Karte des Intrigen- oder Konfliktstapels ansehen.<br>{faction:fremen} 2 Einfluss: {resource:card-draw}{resource:troop}{resource:helper-or}4 Einfluss:  {resource:card-draw}{resource:agent-lift}',
    },
    imageUrl: '/assets/images/leaders/paul_atreides.png',
    type: 'new',
    passiveEffectSize: 'small',
    signetEffectSize: 'medium',
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'solari',
      },
      {
        type: 'troop',
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
        type: 'helper-trade',
      },
      {
        type: 'card-draw',
      },
    ],
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
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'medium',
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
      en: 'Place {resource:signet} on a location that has one of your agents on it OR remove <b>2</b> or your {resource:signet} from a location to take control of it.',
      de: 'Lege {resource:signet} auf einen Ort mit einem deiner Agenten ODER entferne <b>2</b> deiner {resource:signet} von einem Ort, um die Kontrolle über ihn zu übernehmen.',
    },
    imageUrl: '/assets/images/leaders/leto.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'small',
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
      en: '<b>Round start</b>: You may trash one of the cards in your hand to get {resource:intrigue}{resource:intrigue}. Keep one of them, discard the other.',
      de: '<b>Rundenbeginn</b>: Du kannst eine der Karten auf deiner Hand entsorgen, um {resource:intrigue}{resource:intrigue} zu erhalten. Behalte eine davon, entsorge die andere.',
    },
    signetName: {
      en: 'Hidden poison',
      de: 'Verstecktes Gift',
    },
    signetDescription: {
      en: 'You may trash {resource:signet} during combat to get {resource:sword}.',
      de: 'Du kannst {resource:signet} während des Kampfes entsorgen, um {resource:sword} zu erhalten.',
    },
    imageUrl: '/assets/images/leaders/feyd.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'small',
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'small',
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
        type: 'signet',
      },
    ],
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
      en: '<b>Game start</b>: {resource:location-control-choice} (only Carthag, Arrakeen or imperial basin)<br><b>Round start</b>: Trash one of your handcards.',
      de: '<b>Spielbeginn</b>: {resource:location-control-choice} (nur Carthag, Arrakeen oder Imperiales Becken)<br><b>Rundenbeginn</b>: Entsorge eine der Karten auf deiner Hand.',
    },
    signetName: {
      en: 'Oppression',
      de: 'Unterdrückung',
    },
    signetDescription: {
      en: 'Receive the bonus of up to <b>2</b> locations under your control.',
      de: 'Erhalte den Bonus von bis zu <b>2</b> Orten unter deiner Kontrolle.',
    },
    imageUrl: '/assets/images/leaders/rabban.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'medium',
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
    signetEffects: [],
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
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'medium',
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
      en: 'Chani Kynes',
      de: 'Chani Kynes',
    },
    house: {
      en: 'fremen',
      de: 'fremen',
    },
    passiveName: {
      en: 'Child of the desert',
      de: 'Kind der Wüste',
    },
    passiveDescription: {
      en: '{faction:spice} fields cost you {resource:water} less. You receive {resource:spice} less from them.',
      de: '{faction:spice}-Felder kosten dich {resource:water} weniger. Du erhältst von ihnen {resource:spice} weniger.',
    },
    signetName: {
      en: 'Fremen bonds',
      de: 'Fremenbande',
    },
    signetDescription: {
      en: 'You may trash {resource:signet} on your reveal turn to reduce the costs of a fremen card by <b>1</b>.',
      de: 'Du kannst {resource:signet} als {resource:persuasion} verwenden, um Fremen-Karten zu erwerben.',
    },
    imageUrl: '/assets/images/leaders/chani.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'small',
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'small',
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
        type: 'signet',
      },
    ],
  },
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
      en: 'You may trash {resource:signet} during combat to get {resource:sword}{resource:sword}{resource:sword}.',
      de: 'Du kannst {resource:signet} während des Kampfes entsorgen, um {resource:sword}{resource:sword}{resource:sword} zu erhalten.',
    },
    imageUrl: '/assets/images/leaders/stilgar.png',
    type: 'new',
    passiveEffectSize: 'small',
    signetEffectSize: 'small',
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'water',
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
        type: 'faction-influence-up-fremen',
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
        type: 'signet',
      },
    ],
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
      en: "Don't put a marker on the {faction:fremen}-influence-track. Every time you would gain influence there: {resource:water}<br>You meet all {faction:fremen} influence requirements.",
      de: 'Lege keinen Marker auf die {faction:fremen}-Einflussleiste. Immer wenn du dort Einfluss erhalten würdest: {resource:water}<br>Du erfüllst alle {faction:fremen} Einfluss-Bedingungen.',
    },
    signetName: {
      en: 'Planting the paradise',
      de: 'Pflanzen des Paradieses',
    },
    signetDescription: {
      en: '{resource:signet} {resource:helper-or} {resource:water}{resource:water}{resource:helper-trade}{resource:signet;amount:3} {resource:helper-or} {resource:signet;amount:3}{resource:helper-trade}{resource:victory-point}',
      de: '{resource:signet} {resource:helper-or} {resource:water}{resource:water}{resource:helper-trade}{resource:signet;amount:3} {resource:helper-or} {resource:signet;amount:3}{resource:helper-trade}{resource:victory-point}',
    },
    imageUrl: '/assets/images/leaders/liet.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'large',
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
      en: 'Princess Irulan Corrino',
      de: 'Prinzessin Irulan Corrino',
    },
    house: {
      en: 'house corrino',
      de: 'haus corrino',
    },
    passiveName: {
      en: 'Daughter of the emperor',
      de: 'Tochter des Imperators',
    },
    passiveDescription: {
      en: "Don't put a marker on the {faction:emperor}-influence-track. Every time you would gain influence there: {resource:solari}<br>You meet all {faction:emperor} influence requirements.",
      de: 'Lege keinen Marker auf die {faction:emperor}-Einflussleiste. Immer wenn du dort Einfluss erhalten würdest: {resource:solari}<br>Du erfüllst alle {faction:emperor} Einfluss-Bedingungen.',
    },
    signetName: {
      en: 'Chronicler',
      de: 'Chronistin',
    },
    signetDescription: {
      en: 'Place {resource:signet} on a board space that has one of your agents on it. Trash it when you place an agent there the next time to get {resource:card-draw}{resource:card-draw}.',
      de: 'Lege {resource:signet} auf ein Feld mit einem deiner Agenten. Entsorge es, wenn du dort das nächste Mal einen Agenten platzierst, um {resource:card-draw}{resource:card-draw} zu erhalten.',
    },
    imageUrl: '/assets/images/leaders/irulan.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'solari',
        amount: 2,
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
      en: 'Place {resource:signet} on a card of the imperium row. It costs you {resource:persuasion;amount:1} less and opponents {resource:persuasion;amount:1} more.',
      de: 'Lege {resource:signet} auf eine Karte der Imperium-Reihe. Sie kostet dich {resource:persuasion;amount:1} weniger, Gegner {resource:persuasion;amount:1} mehr.',
    },
    imageUrl: '/assets/images/leaders/margot.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'medium',
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
      en: 'You may trash {resource:signet} at your reveal turn to get {resource:sword}{resource:sword}{resource:helper-or}{resource:intrigue}.',
      de: 'Du kannst {resource:signet} an deinem Aufdeckzug entsorgen, um {resource:sword}{resource:sword}{resource:helper-or}{resource:intrigue} zu erhalten.',
    },
    imageUrl: '/assets/images/leaders/hasimir.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'small',
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'small',
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
    signetEffects: [
      {
        type: 'card-discard',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'signet',
      },
    ],
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
      en: '<b>Reveal turn</b>: You may trash ein tech tile to get {resource:faction-influence-up-choice}.',
      de: '<b>Aufdeckzug</b>: Du kannst ein Tech-Plättchen entsorgen, um {resource:faction-influence-up-choice} zu erhalten.',
    },
    signetName: {
      en: 'Inspiring presence',
      de: 'Inspirierende Präsenz',
    },
    signetDescription: {
      en: '',
      de: '',
    },
    imageUrl: '/assets/images/leaders/tessia.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'small',
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'medium',
    startingResources: [
      {
        type: 'tech',
      },
      {
        type: 'troop',
        amount: 3,
      },
    ],
    passiveEffects: [],
    signetEffects: [
      {
        type: 'card-return-to-hand',
        amount: 1,
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
      en: '',
      de: '',
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
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'medium',
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
        type: 'signet',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'timing-turn-start',
      },
      {
        type: 'signet',
        amount: 3,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'helper-or',
      },
      {
        type: 'signet',
        amount: 4,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'agent-lift',
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
      en: 'You cannot acquire cards.<br><br><b>Reveal turn</b>: Receive a {resource:signet} for each {resource:persuasion}.',
      de: '<b>Aufdeckzug</b>: Du kannst keine Karten erwerben. Erhalte für jeden deiner {resource:victory-point} und für jeden deiner {resource:persuasion} ein {resource:signet}.',
    },
    signetName: {
      en: 'Manipulator',
      de: 'Manipulator',
    },
    signetDescription: {
      en: 'You may choose any card in play or in the imperium row and pay {resource:signet} equal to its {resource:persuasion} cost. Activate its agent effect.',
      de: 'Wähle eine beliebige Karte im Spiel oder in der Imperium-Reihe. Zahle {resource:signet} entsprechend ihrer {resource:persuasion}-Kosten, um ihren Agenten-Effekt zu aktivieren.',
    },
    imageUrl: '/assets/images/leaders/august.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'signet',
        amount: 5,
      },
      {
        type: 'troop',
        amount: 3,
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
      en: '<b>Game start</b>: Place a debt marker ({resource:troop}) on this space. Whenever you have {resource:solari;amount:2}, remove it and the marker.',
      de: '<b>Spielbeginn</b>: Lege einen Schuldenmarker ({resource:troop}) auf dieses Feld. Sobald du {resource:solari;amount:2} hast, entferne sie und den Marker.',
    },
    signetName: {
      en: 'Thorough approach',
      de: 'Sorgfältiges Vorgehen',
    },
    signetDescription: {
      en: 'You may trash {resource:signet} when you receive {resource:solari}, {resource:spice}, {resource:water} to get <b>1</b> more of it.',
      de: 'Du kannst {resource:signet} entsorgen, wenn du <br>{resource:solari}{resource:helper-or}{resource:spice}{resource:helper-or}{resource:water} erhältst, um 1 mehr zu erhalten.',
    },
    imageUrl: '/assets/images/leaders/lunara.png',
    type: 'new',
    passiveEffectSize: 'small',
    signetEffectSize: 'small',
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'signet',
      },
      {
        type: 'troop',
        amount: 3,
      },
    ],
    passiveEffects: [],
    signetEffects: [
      {
        type: 'signet',
      },
    ],
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
      en: '',
      de: '',
    },
    imageUrl: '/assets/images/leaders/armand.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'small',
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'medium',
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
    passiveEffects: [
      {
        type: 'timing-game-start',
      },
      {
        type: 'faction-influence-up-choice',
      },
    ],
    signetEffects: [
      {
        type: 'troop-insert-or-retreat',
        amount: 1,
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
      en: "Enemy agents don't block board spaces for you.<br><br>All {faction:landsraad} board spaces cost you {resource:solari;amount:2} more.",
      de: 'Gegnerische Agenten blockieren Felder für dich nicht.<br><br>{faction:landsraad}-Felder kosten dich zusätzlich {resource:solari;amount:2}.',
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
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'medium',
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
      en: '<b>Reveal turn:</b> You may trash one of your {resource:signet} to gain {resource:troop}.',
      de: '<b>Aufdeckzug:</b> Du kannst eines deiner {resource:signet} entsorgen, um dafür {resource:troop} zu erhalten.',
    },
    signetName: {
      en: 'Labour camps',
      de: 'Arbeitslager',
    },
    signetDescription: {
      en: 'Place {resource:signet} on a board space that has one of your agents on it. If a player places an agent there, you and this player gain {resource:solari}.',
      de: 'Lege {resource:signet} auf ein {faction:town}-Feld mit einem deiner Agenten. Wenn ein Spieler dort einen Agent platziert, erhältst du und der Spieler jeweils {resource:solari}.',
    },
    imageUrl: '/assets/images/leaders/yuna_2.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'troop',
      },
    ],
    passiveEffects: [],
    signetEffects: [],
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
    imageUrl: '/assets/images/leaders/ariana.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'large',
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'medium',
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
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'medium',
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
      en: 'Enemy agents on {faction:town} board spaces do not block your agents.<br><b>Reveal turn</b>: For each of your {resource:agent} on {faction:town} board spaces: {resource:persuasion;amount:1}{resource:helper-or}{resource:focus}',
      de: 'Gegnerische Agenten blockieren {faction:town}-Felder für dich nicht.<br><b>Aufdeckzug</b>: Für jeden deiner Agenten auf Feldern, die ein Gegner kontrolliert: {resource:persuasion;amount:1}',
    },
    signetName: {
      en: 'Accusing prophet',
      de: 'Anklagender Prophet',
    },
    signetDescription: {
      en: 'If an opponent controls this board space, they must {resource:card-discard}. Otherwise, gain {resource:focus}.',
      de: 'Wenn ein Gegner dieses Feld kontrolliert, muss er {resource:card-discard}. Erhalte ansonsten {resource:focus}.',
    },
    imageUrl: '/assets/images/leaders/preacher.png',
    type: 'new',
    passiveEffectSize: 'small',
    signetEffectSize: 'small',
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'medium',
    startingResources: [
      {
        type: 'water',
      },
    ],
    passiveEffects: [],
    signetEffects: [],
  },
];
