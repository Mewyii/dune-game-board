import { LanguageString, Resource } from '../models';

export interface Leader {
  name: LanguageString;
  type: 'old' | 'new';
  house: LanguageString;
  passiveName: LanguageString;
  passiveDescription: LanguageString;
  signetName: LanguageString;
  signetDescription: LanguageString;
  imageUrl: string;
  playableByAI?: boolean;
  aiFieldAccessModifier?: AiFieldAccessModifier;
}

interface AiFieldAccessModifier {
  resources?: Resource[];
  directFieldAccess?: string[];
}

export const leaders: Leader[] = [
  {
    name: { de: 'stilgar', en: 'stilgar' },
    house: { de: 'fremen', en: 'fremen' },
    passiveName: { de: 'naib', en: 'naib' },
    passiveDescription: { de: 'Du hast Zugang zu Sietch Tabr.', en: 'You can access sietch tabr.' },
    signetName: { de: 'die wege der fremen', en: 'the fremen ways' },
    signetDescription: {
      de: 'Erhalte einen Siegel-Spielstein. Du kannst ihn jederzeit entsorgen um {resource:troops} und sie in den Konflikt zu senden.',
      en: 'Obtain a signet-token. You may trash it at any time to {resource:troops} and put it into the conflict.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/stilgar.png',
    playableByAI: true,
    aiFieldAccessModifier: {
      directFieldAccess: ['sietch tabr'],
    },
  },
  {
    name: { de: 'liet lynes', en: 'liet lynes' },
    house: { de: 'fremen', en: 'fremen' },
    passiveName: { de: 'anführer der fremen', en: 'leader of the fremen' },
    passiveDescription: {
      de: 'Du beginnst mit maximalem Einfluss bei den Fremen. Immer wenn ein Gegner einen Agenten zu einem <br>{faction:fremen}-Feld entsendet, verlierst du 1.',
      en: 'You start with maximum fremen influence. Whenever an opponent sends an agent to a {faction:fremen} board space, you lose 1.',
    },
    signetName: { de: 'pflanzen des paradieses', en: 'planting the paradise' },
    signetDescription: {
      de: '{resource:currency} {resource:helper-arrow-right} {resource:water}{resource:separator}{resource:water}{resource:water}{resource:water} {resource:helper-arrow-right} {resource:victory-point}',
      en: '{resource:currency} {resource:helper-arrow-right} {resource:water}{resource:separator}{resource:water}{resource:water}{resource:water} {resource:helper-arrow-right} {resource:victory-point}',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/liet.png',
    playableByAI: true,
  },
  {
    name: { de: 'chani kynes', en: 'chani kynes' },
    house: { de: 'fremen', en: 'fremen' },
    passiveName: { de: 'sayyadina', en: 'sayyadina' },
    passiveDescription: {
      de: '<b>Aufdeckzug</b>: Du kannst Fremen-Karten für {resource:conviction} weniger erwerben.',
      en: '<b>Reveal turn</b>: Fremen cards cost {resource:conviction} less to acquire .',
    },
    signetName: { de: 'kind der wüste', en: 'child of the desert' },
    signetDescription: {
      de: 'Der Zugang zu jedem Feld kostet {resource:water} weniger.',
      en: 'Accessing any board spaces costs {resource:water} less.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/chani.png',
    playableByAI: true,
    aiFieldAccessModifier: {
      resources: [{ type: 'water', amount: 1 }],
    },
  },
  {
    name: { de: 'alia atreides', en: 'alia atreides' },
    house: { de: 'haus atreides', en: 'house atreides' },
    passiveName: { de: 'vorgeboren', en: 'pre-born' },
    passiveDescription: {
      de: '{resource:card-round-start}. Du kannst deinen Siegelring nicht entsorgen. Jedes Mal, wenn du ihn aufdeckst, verlierst du {resource:victory-point}.',
      en: '{resource:card-round-start}. You cannot trash your signet ring. Every time you reveal it, you lose {resource:victory-point}.',
    },
    signetName: { de: 'ego-erinnerungen', en: 'ego-memories' },
    signetDescription: {
      de: '{resource:card-discard} {resource:card-destroy}',
      en: '{resource:card-discard} {resource:card-destroy}',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/alia.png',
  },
  {
    name: { de: 'der prediger', en: 'the preacher' },
    house: { de: '-', en: '-' },
    passiveName: { de: 'blind und doch sehend', en: 'blind but seeing' },
    passiveDescription: {
      de: 'Einmal pro Runde darfst du 1 Karte aus dem Spiel zurück auf deine Hand nehmen.',
      en: 'Once each round, you may add 1 card in play back to your hand.',
    },
    signetName: { de: 'anklagender prophet', en: 'accusing prophet' },
    signetDescription: {
      de: 'Jeder Spieler {resource:card-discard}.',
      en: 'Every player {resource:card-discard}.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/preacher.png',
  },
  {
    name: { de: 'prinzessin irulan corrino', en: 'princess irulan corrino' },
    house: { de: 'haus corrino', en: 'house corrino' },
    passiveName: { de: 'tochter des imperators', en: 'daughter of the emperor' },
    passiveDescription: {
      de: 'Entferne deinen Marker von der Imperator-Einflussleiste. Jedes Mal, wenn du Imperator-Einfluss erhalten würdest, erhältst du {resource:currency}.',
      en: 'Remove your marker from the emperor influence track. Every time you would gain emperor influence, get {resource:currency}.',
    },
    signetName: { de: 'chronistin', en: 'chronicler' },
    signetDescription: {
      de: 'Erhalte einen Siegel-Spielstein. Du kannst ihn jederzeit entsorgen um: <br/>Runde 1-4 {resource:card-draw}{resource:separator}R 5+ {resource:card-draw}{resource:card-draw}.',
      en: 'Obtain a signet-token. You may trash it at any time to: <br/>round 1-4 {resource:card-draw}{resource:separator}r 5+ {resource:card-draw}{resource:card-draw}.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/irulan.png',
    playableByAI: true,
  },
  {
    name: { de: 'feyd-rautha harkonnen', en: 'feyd-rautha harkonnen' },
    house: { de: 'haus harkonnen', en: 'house harkonnen' },
    passiveName: { de: 'rücksichtsloser ehrgeiz', en: 'ruthless ambition' },
    passiveDescription: {
      de: 'Spiele mit allen deinen Intrigen aufgedeckt. Jedes Mal, wenn du eine Intrige ziehst, ziehe stattdessen 2 und entsorge dann eine davon.',
      en: 'Play with all your intrigues revealed. Every time you would draw an intrigue, draw 2 instead, then trash one of them.',
    },
    signetName: { de: 'verstecktes gift', en: 'hidden poison' },
    signetDescription: {
      de: 'Erhalte einen Siegel-Spielstein. Du kannst ihn jederzeit entsorgen, um 1 gegnerische Truppe im Kampf zu vernichten.',
      en: 'Obtain a signet-token. You may trash it at any time to destroy 1 enemy troop in combat.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/feyd.png',
    playableByAI: true,
  },
  {
    name: { de: 'graf hasimir fenring', en: 'count hasimir fenring' },
    house: { de: 'haus fenring', en: 'house fenring' },
    passiveName: { de: 'politischer taktiker', en: 'political tactician' },
    passiveDescription: {
      de: 'Du beginnst mit {resource:foldspace}{resource:foldspace} in deinem Deck.',
      en: 'You begin with {resource:foldspace}{resource:foldspace} in your deck.',
    },
    signetName: { de: 'vorgetäuschte schwäche', en: 'feigned weakness' },
    signetDescription: {
      de: 'Du kannst {resource:card-discard} um einen Siegel-Spielstein zu erhalten. Entsorge ihn an deinem Aufdeckzug um {resource:attack-value}{resource:attack-value}{resource:separator}{resource:intrigue}.',
      en: 'You may {resource:card-discard} to obtain a signet-token. Trash it at your reveal turn to {resource:attack-value}{resource:attack-value}{resource:separator}{resource:intrigue}.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/hasimir.png',
    playableByAI: true,
  },
  {
    name: { de: 'lady margot fenring', en: 'lady margot fenring' },
    house: { de: 'haus fenring', en: 'house fenring' },
    passiveName: { de: 'bene gesserit training', en: 'bene gesserit training' },
    passiveDescription: {
      de: 'Du kannst deinen 1. Zug passen. Tust du das, {resource:card-draw}.',
      en: 'You may pass your 1. turn. If you do, {resource:card-draw}.',
    },
    signetName: { de: 'hypnotische verführung', en: 'hypnotic seduction' },
    signetDescription: {
      de: 'Lege einen Siegel-Spielstein auf eine Karte in der Imperium-Reihe. Sie kostet dich {resource:conviction} weniger, Gegner {resource:conviction} mehr.',
      en: 'Place a signet-token on a card in the imperium row. It costs you {resource:conviction} less and enemies {resource:conviction} more.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/margot.png',
    playableByAI: true,
  },
  {
    name: { de: 'ehrwürdige mutter mohiam', en: 'reverend mother mohiam' },
    house: { de: 'bene gesserit', en: 'bene gesserit' },
    passiveName: { de: 'ehrwürdige mutter', en: 'reverend mother' },
    passiveDescription: {
      de: 'Du beginnst mit maximalem Einfluss bei den Bene Gesserit. Immer wenn ein Gegner einen Agenten zu einem <br>{faction:bene}-Feld entsendet, verlierst du 1.',
      en: 'You start with maximum bene gesserit influence. Whenever an opponent sends an agent to a {faction:bene} board space, you lose 1.',
    },
    signetName: { de: 'wahrsagerin', en: 'truthsayer' },
    signetDescription: {
      de: 'Du kannst dir die oberste Karte des Intrigen-Stapels ansehen.</br>{resource:intrigue}{resource:separator}{resource:spice}',
      en: 'You may look at the top card of the intrigue deck.</br>{resource:intrigue}{resource:separator}{resource:spice}',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/mohiam.png',
    playableByAI: true,
  },
  {
    name: { de: 'paul atreides', en: 'paul atreides' },
    type: 'old',
    house: { de: '', en: '' },
    passiveName: { de: '', en: '' },
    passiveDescription: { de: '', en: '' },
    signetName: { de: '', en: '' },
    signetDescription: { de: '', en: '' },
    imageUrl: '/assets/images/leaders/old/paul.jpg',
    playableByAI: true,
  },
  {
    name: { de: 'herzog leto atreides', en: 'duke leto atreides' },
    type: 'old',
    house: { de: '', en: '' },
    passiveName: { de: '', en: '' },
    passiveDescription: { de: '', en: '' },
    signetName: { de: '', en: '' },
    signetDescription: { de: '', en: '' },
    imageUrl: '/assets/images/leaders/old/leto.jpg',
    playableByAI: true,
    aiFieldAccessModifier: {
      resources: [{ type: 'currency', amount: 1 }],
    },
  },
  {
    name: { de: 'graf ilban richese', en: 'count ilban richese' },
    type: 'old',
    house: { de: '', en: '' },
    passiveName: { de: '', en: '' },
    passiveDescription: { de: '', en: '' },
    signetName: { de: '', en: '' },
    signetDescription: { de: '', en: '' },
    imageUrl: '/assets/images/leaders/old/ilban.jpg',
    playableByAI: true,
  },
  {
    name: { de: 'helena richese', en: 'helena richese' },
    type: 'old',
    house: { de: '', en: '' },
    passiveName: { de: '', en: '' },
    passiveDescription: { de: '', en: '' },
    signetName: { de: '', en: '' },
    signetDescription: { de: '', en: '' },
    imageUrl: '/assets/images/leaders/old/helena.jpg',
  },
  {
    name: { de: 'baron vladimir harkonnen', en: 'baron vladimir harkonnen' },
    type: 'old',
    house: { de: '', en: '' },
    passiveName: { de: '', en: '' },
    passiveDescription: { de: '', en: '' },
    signetName: { de: '', en: '' },
    signetDescription: { de: '', en: '' },
    imageUrl: '/assets/images/leaders/old/vlad.jpg',
    playableByAI: true,
  },
  {
    name: { de: 'glossu "die bestie" rabban', en: 'glossu "the beast" rabban' },
    type: 'old',
    house: { de: '', en: '' },
    passiveName: { de: '', en: '' },
    passiveDescription: { de: '', en: '' },
    signetName: { de: '', en: '' },
    signetDescription: { de: '', en: '' },
    imageUrl: '/assets/images/leaders/old/rabban.jpg',
    playableByAI: true,
  },
  {
    name: { de: 'gräfin ariana thorvald', en: 'countess ariana thorvald' },
    type: 'old',
    house: { de: '', en: '' },
    passiveName: { de: '', en: '' },
    passiveDescription: { de: '', en: '' },
    signetName: { de: '', en: '' },
    signetDescription: { de: '', en: '' },
    imageUrl: '/assets/images/leaders/old/ariana.jpg',
    playableByAI: true,
  },
  {
    name: { de: 'graf memnon thorvald', en: 'count memnon thorvald' },
    type: 'old',
    house: { de: '', en: '' },
    passiveName: { de: '', en: '' },
    passiveDescription: { de: '', en: '' },
    signetName: { de: '', en: '' },
    signetDescription: { de: '', en: '' },
    imageUrl: '/assets/images/leaders/old/memnon.jpg',
    playableByAI: true,
  },
  // {
  //   name: 'count hundro moritani',
  //   type: 'old',
  //   house: '',
  //   passiveName: '?',
  //   passiveDescription: ' ',
  //   signetName: '?',
  //   signetDescription: ' ',
  //   imageUrl: '/assets/images/leaders/old/hundro.jpg',
  // },
  {
    name: { de: '"prinzessin" yuna moritani', en: '"princess" yuna moritani' },
    type: 'old',
    house: { de: '', en: '' },
    passiveName: { de: '', en: '' },
    passiveDescription: { de: '', en: '' },
    signetName: { de: '', en: '' },
    signetDescription: { de: '', en: '' },
    imageUrl: '/assets/images/leaders/old/yuna.jpg',
    playableByAI: true,
  },
  {
    name: { de: 'erzherzog  armand ecaz', en: 'archduke armand ecaz' },
    type: 'old',
    house: { de: '', en: '' },
    passiveName: { de: '', en: '' },
    passiveDescription: { de: '', en: '' },
    signetName: { de: '', en: '' },
    signetDescription: { de: '', en: '' },
    imageUrl: '/assets/images/leaders/old/armand.jpg',
  },
  // {
  //   name: 'ilesa ecaz',
  //   type: 'old',
  //   house: '',
  //   passiveName: '?',
  //   passiveDescription: ' ',
  //   signetName: '?',
  //   signetDescription: ' ',
  //   imageUrl: '/assets/images/leaders/old/ilesa.jpg',
  // },
  {
    name: { de: 'tessia vernius', en: 'tessia vernius' },
    type: 'new',
    house: { de: 'haus vernius', en: 'house vernius' },
    passiveName: { de: 'ixianische geschenke', en: 'ixian gifts' },
    passiveDescription: {
      de: '<b>Aufdeckzug</b>: Du kannst 1 Tech-Plättchen entsorgen, um {resource:faction-influence-choice}.',
      en: '<b>Reveal turn</b>: You may trash 1 tech tiles to {resource:faction-influence-choice}.',
    },
    signetName: { de: 'inspirierende präsenz', en: 'inspiring presence' },
    signetDescription: {
      de: 'Du kannst den Agenten-Effekt der im nächsten Zug von dir ausgespielten Karte doppelt aktivieren.',
      en: 'You can activate the agent effect of the card you play next turn twice.',
    },
    imageUrl: '/assets/images/leaders/tessia.png',
  },
  {
    name: { de: 'graf rhombur vernius', en: 'earl rhombur vernius' },
    type: 'new',
    house: { de: 'haus vernius', en: 'house vernius' },
    passiveName: { de: 'graf von ix', en: 'earl of ix' },
    passiveDescription: {
      de: '<b>Aufdeckzug</b>: {resource:tech}',
      en: '<b>Reveal turn</b>: {resource:tech}',
    },
    signetName: { de: 'kybernetische erweiterungen', en: 'enhanced cybernetics' },
    signetDescription: {
      de: '{resource:card-discard} dann {resource:card-draw}.',
      en: '{resource:card-discard} then {resource:card-draw}.',
    },
    imageUrl: '/assets/images/leaders/rhombur.png',
    playableByAI: true,
  },
  {
    name: { de: 'graf august metulli', en: 'count august metulli' },
    type: 'new',
    house: { de: 'haus metulli', en: 'house metulli' },
    passiveName: { de: 'isolationist', en: 'isolationist' },
    passiveDescription: {
      de: '<b>Aufdeckzug</b>: Du kannst du keine Karten aus der Imperium-Reihe erwerben. Du kannst {resource:conviction}{resource:conviction} {resource:helper-arrow-right} {resource:currency}.',
      en: '<b>Reveal turn</b>: You cannot purchase cards from the imperium row. You can instead {resource:conviction}{resource:conviction} {resource:helper-arrow-right} {resource:currency}.',
    },
    signetName: { de: 'ansprache an das volk', en: 'address to the people' },
    signetDescription: {
      de: '{resource:conviction} und {resource:troops}.',
      en: '{resource:conviction} and {resource:troops}.',
    },
    imageUrl: '/assets/images/leaders/august.png',
    playableByAI: true,
  },
  {
    name: { de: 'lunara metulli', en: 'lunara metulli' },
    type: 'new',
    house: { de: 'haus metulli', en: 'house metulli' },
    passiveName: { de: 'untergehendes haus', en: 'declining house' },
    passiveDescription: {
      de: 'Du beginnst das Spiel ohne überzeugendes Argument in deinem Deck.',
      en: 'You start the game without a convincing argument in your deck.',
    },
    signetName: { de: 'sorgfältiges vorgehen', en: 'thorough approach' },
    signetDescription: {
      de: 'Wenn du in diesem Zug {resource:currency}, {resource:spice} oder {resource:water} erhältst, erhältst du davon 1 mehr.',
      en: 'If you get {resource:currency}, {resource:spice} or {resource:water} this turn, you get 1 more.',
    },
    imageUrl: '/assets/images/leaders/lunara.png',
  },
];
