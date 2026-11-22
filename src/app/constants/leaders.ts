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
      en: 'Whenever you send an agent to a {faction:fremen} or {faction:spice} board space: {resource:signet}',
      de: 'Immer wenn du einen Agenten zu einem {faction:fremen}- oder {faction:spice}-Feld entsendest: {resource:signet}',
    },
    signetName: {
      en: 'Kwisatz Haderach',
      de: 'Kwisatz Haderach',
    },
    signetDescription: {
      en: 'You may look at the top card of your deck or the intrigue deck.<br>2 {resource:signet}: {resource:card-draw}{resource:troop}{resource:helper-or}4 {resource:signet}:  {resource:card-draw}{resource:agent-lift}',
      de: 'Du kannst dir die oberste Karte deines Decks oder des Intrigenstapels ansehen.<br>2 {resource:signet}: {resource:card-draw}{resource:troop}{resource:helper-or}4 {resource:signet}:  {resource:card-draw}{resource:agent-lift}',
    },
    imageUrl: '/assets/images/leaders/paul_atreides.png',
    type: 'new',
    passiveEffectSize: 'small',
    signetEffectSize: 'medium',
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
      },
      {
        type: 'solari',
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
      en: 'House Atreides',
      de: 'Haus Atreides',
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
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 3,
      },
      {
        type: 'spice',
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
      en: '<b>Reveal Phase</b>: For each location with one of your agents and {resource:signet}: {resource:persuasion;amount:1}<br><br>{faction:landsraad} board space costs are reduced by {resource:signet}.',
      de: '<b>Aufdeckzug</b>: Für jeden Ort mit einem deiner Agenten und {resource:signet}: {resource:persuasion;amount:1}<br><br> Kosten für {faction:landsraad}-Felder sind um {resource:signet} reduziert.',
    },
    signetName: {
      en: 'Inspiring loyalty',
      de: 'Loyalität Inspirierend',
    },
    signetDescription: {
      en: 'Place {resource:signet} on a location with one of your agents or on any {faction:landsraad} board space.',
      de: 'Lege {resource:signet} auf einen Ort mit einem deiner Agenten oder auf ein beliebiges {faction:landsraad}-Feld.',
    },
    imageUrl: '/assets/images/leaders/leto.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 2,
      },
      {
        type: 'solari',
      },
    ],
    passiveEffects: [],
    signetEffects: [],
  },
  {
    name: {
      en: 'Feyd-Rautha Harkonnen',
      de: 'Feyd-Rautha Harkonnen',
    },
    house: {
      en: 'House Harkonnen',
      de: 'Haus Harkonnen',
    },
    passiveName: {
      en: 'Hidden poison',
      de: 'Verstecktes Gift',
    },
    passiveDescription: {
      en: 'During the combat phase, you can do as many times as you like: {resource:signet} {resource:helper-trade} {resource:sword}',
      de: 'Du kannst während der Kampfphase beliebig oft: {resource:signet} {resource:helper-trade} {resource:sword}',
    },
    signetName: {
      en: 'Ruthless ambition',
      de: 'Rücksichtsloser Ehrgeiz',
    },
    signetDescription: {
      en: 'Select a card from the imperium row. Activate its agent effect. Then trash it.',
      de: 'Wähle eine Karte aus der Imperium-Reihe. Aktiviere ihren Agenten-Effekt. Entsorge sie anschließend.',
    },
    imageUrl: '/assets/images/leaders/feyd.png',
    type: 'new',
    passiveEffectSize: 'small',
    signetEffectSize: 'small',
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 2,
      },
      {
        type: 'solari',
      },
    ],
    passiveEffects: [
      {
        type: 'timing-game-start',
      },
      {
        type: 'signet',
      },
      {
        type: 'signet',
      },
      {
        type: 'signet',
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
      en: 'Uncontrolled Aggression',
      de: 'Unkontrollierte Aggression',
    },
    passiveDescription: {
      en: '<b>Game start</b>: {resource:location-control} over Carthag<br><br><b>Round start:</b>: Discard a random card from your hand.',
      de: '<b>Spielbeginn</b>: {resource:location-control} über <b>Carthag</b><br><br><b>Rundenbeginn</b>: Wirf eine zufällige Karte aus deiner Hand ab.',
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
    passiveEffectSize: 'small',
    signetEffectSize: 'medium',
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'medium',
    startingResources: [
      {
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 4,
      },
      {
        type: 'solari',
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
      en: '<b>Round start</b>: You may trash one of the cards in your hand to get {resource:intrigue}{resource:intrigue}. Keep one of them, discard the other.',
      de: '<b>Rundenbeginn</b>: Du kannst eine der Karten auf deiner Hand entsorgen, um {resource:intrigue}{resource:intrigue} zu erhalten. Behalte eine davon, entsorge die andere.',
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
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'medium',
    startingResources: [
      {
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 3,
      },
      {
        type: 'solari',
      },
    ],
    passiveEffects: [],
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
      en: 'Fremen',
      de: 'Fremen',
    },
    passiveName: {
      en: 'Child of the Desert',
      de: 'Kind der Wüste',
    },
    passiveDescription: {
      en: 'The cost of {faction:spice} and {faction:town} board spaces that require {resource:water} are reduced by <b>1</b> for you. You receive {resource:spice} (for {faction:spice} board spaces) or {resource:troop} (for {faction:town} board spaces) less from them.',
      de: '{faction:spice}-Felder und {faction:town}-Felder mit {resource:water}-Kosten sind für dich um <b>1</b> reduziert. Du erhältst von ihnen {resource:spice} ({faction:spice}-Felder) oder {resource:troop} ({faction:town}-Felder) weniger.',
    },
    signetName: {
      en: 'Fremen Bonds',
      de: 'Fremenbande',
    },
    signetDescription: {
      en: 'You may use {resource:signet} as {resource:persuasion;amount:1} to acquire Fremen cards.',
      de: 'Du kannst {resource:signet} als {resource:persuasion;amount:1} verwenden, um Fremen-Karten zu erwerben.',
    },
    imageUrl: '/assets/images/leaders/chani.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'small',
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 2,
      },
      {
        type: 'water',
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
      en: 'Fremen',
      de: 'Fremen',
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
      en: 'The Fremen Ways',
      de: 'Die Wege der Fremen',
    },
    signetDescription: {
      en: 'You may trash {resource:signet} during combat to get {resource:sword}{resource:sword}{resource:sword}{resource:sword}.',
      de: 'Du kannst während der Kampfphase beliebig oft: {resource:signet} {resource:helper-trade} {resource:sword}{resource:sword}{resource:sword}{resource:sword}',
    },
    imageUrl: '/assets/images/leaders/stilgar.png',
    type: 'new',
    passiveEffectSize: 'small',
    signetEffectSize: 'small',
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 2,
      },
      {
        type: 'water',
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
      en: 'Fremen',
      de: 'Fremen',
    },
    passiveName: {
      en: 'Leader of the Fremen',
      de: 'Anführer der Fremen',
    },
    passiveDescription: {
      en: "Don't put a marker on the {faction:fremen}-influence-track. Every time you would gain influence there: {resource:water}<br>You meet all {faction:fremen} influence requirements.",
      de: 'Lege keinen Marker auf die {faction:fremen}-Einflussleiste. Immer wenn du dort Einfluss erhalten würdest: {resource:water}<br>Du erfüllst alle {faction:fremen} Einfluss-Bedingungen.',
    },
    signetName: {
      en: 'Planting the Paradise',
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
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
      },
      {
        type: 'water',
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
      en: 'House Corrino',
      de: 'Haus Corrino',
    },
    passiveName: {
      en: 'Daughter of the Emperor',
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
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 2,
      },
      {
        type: 'solari',
        amount: 2,
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
      en: 'Bene Gesserit Training',
      de: 'Bene Gesserit Ausbildung',
    },
    passiveDescription: {
      en: 'You may pass your 1. turn of each round. If you do: {resource:card-discard}{resource:helper-trade}{resource:card-draw}',
      de: 'Du kannst deinen 1. Zug jeder Runde passen. Tust du das: {resource:card-discard}{resource:helper-trade}{resource:card-draw}',
    },
    signetName: {
      en: 'Hypnotic Seduction',
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
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 2,
      },
      {
        type: 'solari',
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
      en: 'House Fenring',
      de: 'Haus Fenring',
    },
    passiveName: {
      en: 'Agent of the Emperor',
      de: 'Agent des Imperators',
    },
    passiveDescription: {
      en: '',
      de: '',
    },
    signetName: {
      en: 'Orchestrated Weakness',
      de: 'Inszenierte Schwächlichkeit',
    },
    signetDescription: {
      en: 'You may trash {resource:signet} at your reveal turn to get {resource:sword}{resource:sword}{resource:sword}{resource:helper-or}{resource:persuasion;amount:1}{resource:intrigue}.',
      de: 'Entsorge {resource:signet} an deinem Aufdeckzug, um {resource:sword}{resource:sword}{resource:sword}{resource:helper-or}{resource:persuasion;amount:1}{resource:intrigue} zu erhalten.',
    },
    imageUrl: '/assets/images/leaders/hasimir.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'small',
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 2,
      },
      {
        type: 'solari',
        amount: 2,
      },
    ],
    passiveEffects: [
      {
        type: 'timing-game-start',
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
      en: 'Ixian Diplomacy',
      de: 'Ixianische Diplomatie',
    },
    passiveDescription: {
      en: '<b>Reveal turn</b>: You may trash a tech tile to get {resource:faction-influence-up-choice}.',
      de: '<b>Aufdeckzug</b>: Du kannst ein Tech-Plättchen entsorgen, um {resource:faction-influence-up-choice} zu erhalten.',
    },
    signetName: {
      en: 'Inspiring Presence',
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
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 2,
      },
      {
        type: 'solari',
        amount: 2,
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
      en: 'House Vernius',
      de: 'Haus Vernius',
    },
    passiveName: {
      en: 'Earl of Ix',
      de: 'Graf von Ix',
    },
    passiveDescription: {
      en: '<b>Reveal turn</b>: {resource:tech} and {resource:signet}{resource:helper-trade}{resource:sword}{resource:sword}',
      de: '<b>Aufdeckzug</b>: {resource:tech} und {resource:signet}{resource:helper-trade}{resource:sword}{resource:sword}',
    },
    signetName: {
      en: 'Technology Research',
      de: 'Technologieforschung',
    },
    signetDescription: {
      en: 'You may use {resource:signet} as {resource:solari;amount:2} to acquire Tech Tiles.',
      de: 'Du kannst {resource:signet} als {resource:solari;amount:2} verwenden, um Tech-Plättchen zu erwerben.',
    },
    imageUrl: '/assets/images/leaders/rhombur.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'small',
    passiveDescriptionSize: 'large',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 2,
      },
      {
        type: 'solari',
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
      en: 'You cannot acquire any imperium cards other than “The Spice Must Flow.”',
      de: 'Du kannst keine Imperium-Karten außer "Das Spice muss fließen" erwerben.',
    },
    signetName: {
      en: 'Manipulator',
      de: 'Manipulator',
    },
    signetDescription: {
      en: 'Choose a card from the imperium row. Activate its agent effect. You can activate connection effects for {resource:card-discard} each.',
      de: 'Wähle eine Karte aus der Imperium-Reihe. Aktiviere ihren Agenten-Effekt. Du kannst Verbindungs-Effekte für jeweils {resource:card-discard} aktivieren. ',
    },
    imageUrl: '/assets/images/leaders/august.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'leader-heal',
        amount: 3,
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
      en: 'House Metulli',
      de: 'Haus Metulli',
    },
    passiveName: {
      en: 'Struggling House',
      de: 'Bedrängtes Haus',
    },
    passiveDescription: {
      en: '<b>Game start</b>: Place a debt token {resource:troop} on this card. As soon as you have {resource:solari;amount:4}, remove them and the token, and receive {resource:faction-influence-up-choice}.',
      de: '<b>Spielbeginn</b>: Lege einen Schuldenmarker {resource:troop} auf diese Karte. Sobald du {resource:solari;amount:4} besitzt, entferne sie und den Marker und erhalte {resource:faction-influence-up-choice}.',
    },
    signetName: {
      en: 'Thorough Approach',
      de: 'Sorgfältiges Vorgehen',
    },
    signetDescription: {
      en: 'You may trash {resource:signet} when you receive <br>{resource:spice}{resource:helper-or}{resource:water} to gain <b>1</b> more of it.',
      de: 'Du kannst {resource:signet} entsorgen, wenn du <br>{resource:spice}{resource:helper-or}{resource:water} erhältst, um 1 mehr zu erhalten.',
    },
    imageUrl: '/assets/images/leaders/lunara.png',
    type: 'new',
    passiveEffectSize: 'small',
    signetEffectSize: 'small',
    passiveDescriptionSize: 'small',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'leader-heal',
        amount: 3,
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
      en: 'Renowned House',
      de: 'Renommiertes Haus',
    },
    passiveDescription: {
      en: '',
      de: '',
    },
    signetName: {
      en: 'Battle-Hardened',
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
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 3,
      },
      {
        type: 'solari',
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
      en: 'In the Shadows',
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
        type: 'leader-heal',
        amount: 3,
      },
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
      en: 'Forced Recruitment',
      de: 'Zwangsrekrutierung',
    },
    passiveDescription: {
      en: '<b>Reveal turn:</b> You may trash one of your {resource:signet} to gain {resource:troop} or trash 2 {resource:signet} to gain {resource:faction-influence-up-choice}.',
      de: '<b>Aufdeckzug</b>: Du kannst einen deiner {resource:signet} entsorgen, um {resource:troop} zu erhalten oder 2 {resource:signet} entsorgen, um {resource:faction-influence-up-choice} zu erhalten.',
    },
    signetName: {
      en: 'Labour Camps',
      de: 'Arbeitslager',
    },
    signetDescription: {
      en: 'Gain {resource:solari}. Put {resource:signet} on a {faction:town} or {faction:spice} board space with one of your agents. If a player puts an agent there, he receivces {resource:solari}.',
      de: 'Erhalte {resource:solari}. Lege {resource:signet} auf ein {faction:town}- oder {faction:spice}-Feld mit einem deiner Agenten. Wenn ein Spieler dort einen Agenten platziert, erhält er {resource:solari}.',
    },
    imageUrl: '/assets/images/leaders/yuna_2.png',
    type: 'new',
    passiveEffectSize: 'medium',
    signetEffectSize: 'medium',
    passiveDescriptionSize: 'medium',
    signetDescriptionSize: 'small',
    startingResources: [
      {
        type: 'leader-heal',
        amount: 3,
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
      en: 'Equipment Production',
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
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 3,
      },
      {
        type: 'solari',
      },
    ],
    passiveEffects: [
      {
        type: 'timing-reveal-turn',
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
      en: 'Smuggling Connections',
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
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'troop',
        amount: 3,
      },
      {
        type: 'solari',
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
      en: 'Blind but Seeing',
      de: 'Blind und doch Sehend',
    },
    passiveDescription: {
      en: 'Enemy agents on {faction:town} board spaces do not block your agents.<br><b>Reveal turn</b>: For each of your agents on board spaces controlled by an opponent: {resource:persuasion;amount:1}',
      de: 'Gegnerische Agenten blockieren {faction:town}-Felder für dich nicht.<br><b>Aufdeckzug</b>: Für jeden deiner Agenten auf Feldern, die ein Gegner kontrolliert: {resource:persuasion;amount:1}',
    },
    signetName: {
      en: 'Accusing Prophet',
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
        type: 'leader-heal',
        amount: 3,
      },
      {
        type: 'water',
      },
    ],
    passiveEffects: [],
    signetEffects: [],
  },
];
