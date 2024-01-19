import { LanguageString, Resource } from '../models';

export interface Leader {
  name: LanguageString;
  type: 'new';
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
      de: '{resource:signet-token}. Du kannst ihn jederzeit entsorgen, um {resource:troop} zu erhalten und sie in den Konflikt zu senden.',
      en: '{resource:signet-token}. You may trash it at any time to get {resource:troop} and put it into the conflict.',
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
      de: 'Entferne deinen Marker von der {faction:fremen}-Einflussleiste. Immer wenn du dort Einfluss erhalten würdest: {resource:water}',
      en: 'Remove your marker from the {faction:fremen}-track. Every time you would gain influence there: {resource:water}',
    },
    signetName: { de: 'pflanzen des paradieses', en: 'planting the paradise' },
    signetDescription: {
      de: '{resource:signet-token}{resource:separator}{resource:water}{resource:troop} {resource:helper-arrow-right} {resource:signet-token}{resource:signet-token}{resource:separator}{resource:signet-token}{resource:signet-token} {resource:helper-arrow-right} {resource:victory-point}',
      en: '{resource:signet-token}{resource:separator}{resource:water}{resource:troop} {resource:helper-arrow-right} {resource:signet-token}{resource:signet-token}{resource:separator}{resource:signet-token}{resource:signet-token} {resource:helper-arrow-right} {resource:victory-point}',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/liet.png',
    playableByAI: true,
  },
  {
    name: { de: 'chani kynes', en: 'chani kynes' },
    house: { de: 'fremen', en: 'fremen' },
    passiveName: { de: 'fremenbande', en: 'fremen bonds' },
    passiveDescription: {
      de: '<b>Aufdeckzug</b>: Du kannst Fremen-Karten für {resource:persuasion} weniger erwerben.',
      en: '<b>Reveal turn</b>: Fremen cards cost {resource:persuasion} less to acquire .',
    },
    signetName: { de: 'kind der wüste', en: 'child of the desert' },
    signetDescription: {
      de: 'Spice zu ernten kostet {resource:water} weniger.',
      en: 'Harvesting spice costs {resource:water} less.',
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
      de: '<b>Aufdeckzug</b>: Bevor du aufdeckst, darfst du 1 deiner Karten im Spiel zurück auf deine Hand nehmen.',
      en: '<b>Reveal turn</b>: Before you reveal, you may add 1 of your cards in play back to your hand.',
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
      de: 'Entferne deinen Marker von der {faction:emperor}-Einflussleiste. Immer wenn du dort Einfluss erhalten würdest: {resource:currency}',
      en: 'Remove your marker from the {faction:emperor}-track. Every time you would gain influence there: {resource:currency}',
    },
    signetName: { de: 'chronistin', en: 'chronicler' },
    signetDescription: {
      de: '{resource:card-discard} {resource:helper-arrow-right} {resource:signet-token}. Du kannst ihn entsorgen wenn du einen Agenten platzierst, um {resource:card-draw}{resource:card-draw} zu erhalten.',
      en: '{resource:card-discard} {resource:helper-arrow-right} {resource:signet-token}. You may trash it when you place an agent to get {resource:card-draw}{resource:card-draw}.',
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
      de: 'Spiele mit allen deinen Intrigen aufgedeckt. Immer wenn du eine Intrige ziehst, ziehe eine Zusätzliche und entsorge dann eine davon.',
      en: 'Play with all your intrigues revealed. Every time you would draw an intrigue, draw 2 instead, then trash one of them.',
    },
    signetName: { de: 'verstecktes gift', en: 'hidden poison' },
    signetDescription: {
      de: '{resource:signet-token}. Du kannst ihn während des Kampfes entsorgen, um {resource:sword} zu erhalten.',
      en: '{resource:signet-token}. You may trash it during combat to get {resource:sword}.',
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
      de: '{resource:card-discard} {resource:helper-arrow-right} {resource:signet-token}. Entsorge ihn an deinem Aufdeckzug, um {resource:sword}{resource:sword}{resource:separator}{resource:intrigue} zu erhalten.',
      en: '{resource:card-discard} {resource:helper-arrow-right} {resource:signet-token}. Trash it at your reveal turn to get {resource:sword}{resource:sword}{resource:separator}{resource:intrigue}.',
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
      de: 'Lege {resource:signet-token} auf eine Karte in der Imperium-Reihe. Sie kostet dich {resource:persuasion} weniger, Gegner {resource:persuasion} mehr.',
      en: 'Place {resource:signet-token} on a card in the imperium row. It costs you {resource:persuasion} less and enemies {resource:persuasion} more.',
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
      de: 'Entferne deinen Marker von der {faction:bene}-Einflussleiste. Immer wenn du dort Einfluss erhalten würdest: {resource:spice}',
      en: 'Remove your marker from the {faction:bene}-track. Every time you would gain influence there: {resource:spice}',
    },
    signetName: { de: 'wahrsagerin', en: 'truthsayer' },
    signetDescription: {
      de: 'Du kannst dir die oberste Karte des Intrigen-Stapels sowie des Konflikt-Stapels ansehen.',
      en: 'You may look at the top card of the intrigue deck and the conflict deck.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/mohiam.png',
    playableByAI: true,
  },
  {
    name: { de: 'tessia vernius', en: 'tessia vernius' },
    type: 'new',
    house: { de: 'haus vernius', en: 'house vernius' },
    passiveName: { de: 'ixianische geschenke', en: 'ixian gifts' },
    passiveDescription: {
      de: '<b>Aufdeckzug</b>: Du kannst 1 Tech-Plättchen entsorgen, um {resource:faction-influence-choice} zu erhalten.',
      en: '<b>Reveal turn</b>: You may trash 1 tech tile to get {resource:faction-influence-choice}.',
    },
    signetName: { de: 'inspirierende präsenz', en: 'inspiring presence' },
    signetDescription: {
      de: 'Du kannst den Agenten-Effekt einer deiner Handkarten aktivieren.',
      en: 'You can activate the agent effect of one of your handcards.',
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
      de: '{resource:card-discard} {resource:helper-arrow-right} {resource:card-draw}',
      en: '{resource:card-discard} {resource:helper-arrow-right} {resource:card-draw}',
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
      de: '<b>Aufdeckzug</b>: Du kannst du keine Karten aus der Imperium-Reihe erwerben. Du kannst {resource:persuasion}{resource:persuasion} {resource:helper-arrow-right} {resource:currency}.',
      en: '<b>Reveal turn</b>: You cannot purchase cards from the imperium row. You can instead {resource:persuasion}{resource:persuasion} {resource:helper-arrow-right} {resource:currency}.',
    },
    signetName: { de: 'ansprache an das volk', en: 'address to the people' },
    signetDescription: {
      de: '{resource:signet-token}. Entsorge ihn an deinem Aufdeckzug, um {resource:persuasion} {resource:troop} zu erhalten.',
      en: '{resource:signet-token}. Trash it at your reveal turn to get {resource:persuasion} {resource:troop}.',
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
      de: '<b>Spielbeginn</b>: Entferne alle überzeugenden Argumente aus deinem Deck.',
      en: '<b>Game start</b>: Remove all convincing arguments from your deck.',
    },
    signetName: { de: 'sorgfältiges vorgehen', en: 'thorough approach' },
    signetDescription: {
      de: 'Wenn du in diesem Zug {resource:currency}, {resource:spice} oder {resource:water} erhältst, erhältst du davon 1 mehr.',
      en: 'If you get {resource:currency}, {resource:spice} or {resource:water} this turn, you get 1 more.',
    },
    imageUrl: '/assets/images/leaders/lunara.png',
  },
];
