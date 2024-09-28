import { LanguageString } from '../models';
import { AIAdjustments } from '../services/ai/models';
import { GameModifiers } from '../services/game-modifier.service';

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
  aiAdjustments?: AIAdjustments;
  gameModifiers?: GameModifiers;
}

export const leaders: Leader[] = [
  {
    name: {
      de: 'stilgar',
      en: 'stilgar',
    },
    house: {
      de: 'fremen',
      en: 'fremen',
    },
    passiveName: {
      de: 'naib',
      en: 'naib',
    },
    passiveDescription: {
      de: 'Du hast Zugang zu Sietch Tabr.',
      en: 'You can access sietch tabr.',
    },
    signetName: {
      de: 'die wege der fremen',
      en: 'the fremen ways',
    },
    signetDescription: {
      de: '{resource:signet-token}. Du kannst ihn jederzeit entsorgen, um {resource:troop} zu erhalten und sie in den Konflikt zu senden.',
      en: '{resource:signet-token}. You may trash it at any time to get {resource:troop} and put it into the conflict.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/stilgar.png',
    playableByAI: true,
    gameModifiers: {
      fieldAccessModifiers: [
        {
          id: 'stilgar-naib',
          fieldId: 'sietch tabr',
        },
      ],
    },
  },
  {
    name: {
      en: 'liet lynes',
      de: 'liet lynes',
    },
    house: {
      en: 'fremen',
      de: 'fremen',
    },
    passiveName: {
      en: 'leader of the fremen',
      de: 'anführer der fremen',
    },
    passiveDescription: {
      en: 'Remove your marker from the {faction:fremen}-track. Every time you would gain influence there: {resource:water}<br>Ignore all {faction:fremen} -Requirements.',
      de: 'Entferne deinen Marker von der {faction:fremen}-Einflussleiste. Immer wenn du dort Einfluss erhalten würdest: {resource:water}<br>Ignoriere alle {faction:fremen} -Anforderungen.',
    },
    signetName: {
      en: 'planting the paradise',
      de: 'pflanzen des paradieses',
    },
    signetDescription: {
      en: '<br>{resource:signet-token}{resource:helper-or}{resource:water}{resource:troop} {resource:helper-trade} {resource:signet-token}{resource:signet-token}{resource:helper-or}{resource:signet-token}{resource:signet-token} {resource:helper-trade} {resource:victory-point}',
      de: '<br>{resource:signet-token}{resource:helper-or}{resource:water}{resource:troop} {resource:helper-trade} {resource:signet-token}{resource:signet-token}{resource:helper-or}{resource:signet-token}{resource:signet-token} {resource:helper-trade} {resource:victory-point}',
    },
    imageUrl: '/assets/images/leaders/liet.png',
    playableByAI: true,
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => (field.actionType === 'fremen' ? 0.025 : 0.0),
    },
    gameModifiers: {
      factionInfluenceModifiers: {
        fremen: {
          id: 'liet',
          noInfluence: true,
          alternateReward: {
            type: 'water',
          },
        },
      },
      fieldAccessModifiers: [
        {
          id: 'liet-fremen',
          factionType: 'fremen',
        },
      ],
    },
    type: 'new',
  },
  {
    name: {
      en: 'chani kynes',
      de: 'chani kynes',
    },
    house: {
      en: 'fremen',
      de: 'fremen',
    },
    passiveName: {
      en: 'fremen bonds',
      de: 'fremenbande',
    },
    passiveDescription: {
      en: '<b>Reveal turn</b>: Fremen cards cost {resource:persuasion;amount:1} less to acquire .',
      de: '<b>Aufdeckzug</b>: Du kannst Fremen-Karten für {resource:persuasion;amount:1} weniger erwerben.',
    },
    signetName: {
      en: 'child of the desert',
      de: 'kind der wüste',
    },
    signetDescription: {
      en: 'Harvesting spice costs {resource:water} less.',
      de: 'Spice zu ernten kostet {resource:water} weniger.',
    },
    imageUrl: '/assets/images/leaders/chani.png',
    playableByAI: true,
    type: 'new',
    gameModifiers: {
      imperiumRowModifiers: [
        {
          id: 'chani',
          factionType: 'fremen',
          persuasionAmount: -1,
        },
      ],
    },
  },
  {
    name: {
      en: 'alia atreides',
      de: 'alia atreides',
    },
    house: {
      en: 'house atreides',
      de: 'haus atreides',
    },
    passiveName: {
      en: 'pre-born',
      de: 'vorgeboren',
    },
    passiveDescription: {
      en: '{resource:card-round-start}. You cannot trash your signet ring. Every time you reveal it, you lose {resource:victory-point}.',
      de: '{resource:card-round-start}. Du kannst deinen Siegelring nicht entsorgen. Jedes Mal, wenn du ihn aufdeckst, verlierst du {resource:victory-point}.',
    },
    signetName: {
      en: 'ego-memories',
      de: 'ego-erinnerungen',
    },
    signetDescription: {
      en: '<br>{resource:card-discard} {resource:card-destroy}',
      de: '<br>{resource:card-discard} {resource:card-destroy}',
    },
    imageUrl: '/assets/images/leaders/alia.png',
    type: 'new',
  },
  {
    name: {
      en: 'the preacher',
      de: 'der prediger',
    },
    house: {
      en: '-',
      de: '-',
    },
    passiveName: {
      en: 'blind but seeing',
      de: 'blind und doch sehend',
    },
    passiveDescription: {
      en: '<b>Reveal turn</b>: Before you reveal, you may put 1 of your cards in play back to your hand.',
      de: '<b>Aufdeckzug</b>: Bevor du aufdeckst, darfst du 1 deiner Karten im Spiel zurück auf deine Hand nehmen.',
    },
    signetName: {
      en: 'accusing prophet',
      de: 'anklagender prophet',
    },
    signetDescription: {
      en: '<br>Every player: {resource:card-discard}',
      de: '<br>Jeder Spieler: {resource:card-discard}',
    },
    imageUrl: '/assets/images/leaders/preacher.png',
    type: 'new',
  },
  {
    name: {
      de: 'prinzessin irulan corrino',
      en: 'princess irulan corrino',
    },
    house: {
      de: 'haus corrino',
      en: 'house corrino',
    },
    passiveName: {
      de: 'tochter des imperators',
      en: 'daughter of the emperor',
    },
    passiveDescription: {
      de: 'Entferne deinen Marker von der {faction:emperor}-Einflussleiste. Immer wenn du dort Einfluss erhalten würdest: {resource:solari}<br>Ignoriere alle {faction:emperor} -Anforderungen.',
      en: 'Remove your marker from the {faction:emperor}-track. Every time you would gain influence there: {resource:solari}<br>Ignore all {faction:emperor} -requirements.',
    },
    signetName: {
      de: 'chronistin',
      en: 'chronicler',
    },
    signetDescription: {
      de: '{resource:card-discard} {resource:helper-trade} {resource:signet-token}. Du kannst ihn entsorgen wenn du einen Agenten platzierst, um {resource:card-draw}{resource:card-draw} zu erhalten.',
      en: '{resource:card-discard} {resource:helper-trade} {resource:signet-token}. You may trash it when you place an agent to get {resource:card-draw}{resource:card-draw}.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/irulan.png',
    playableByAI: true,
    gameModifiers: {
      factionInfluenceModifiers: {
        emperor: {
          id: 'irulan',
          noInfluence: true,
          alternateReward: {
            type: 'solari',
          },
        },
      },
      fieldAccessModifiers: [
        {
          id: 'irulan-emperor',
          factionType: 'emperor',
        },
      ],
    },
  },
  {
    name: {
      de: 'feyd-rautha harkonnen',
      en: 'feyd-rautha harkonnen',
    },
    house: {
      de: 'haus harkonnen',
      en: 'house harkonnen',
    },
    passiveName: {
      de: 'rücksichtsloser ehrgeiz',
      en: 'ruthless ambition',
    },
    passiveDescription: {
      de: 'Spiele mit allen deinen Intrigen aufgedeckt. Immer wenn du eine Intrige ziehst, ziehe eine Zusätzliche und entsorge dann eine davon.',
      en: 'Play with all your intrigues revealed. Every time you would draw an intrigue, draw 2 instead, then trash one of them.',
    },
    signetName: {
      de: 'verstecktes gift',
      en: 'hidden poison',
    },
    signetDescription: {
      de: '{resource:signet-token}. Du kannst ihn während des Kampfes entsorgen, um {resource:sword} zu erhalten.',
      en: '{resource:signet-token}. You may trash it during combat to get {resource:sword}.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/feyd.png',
    playableByAI: true,
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => (field.rewards.some((x) => x.type === 'intrigue') ? 0.05 : 0.0),
    },
  },
  {
    name: {
      de: 'graf hasimir fenring',
      en: 'count hasimir fenring',
    },
    house: {
      de: 'haus fenring',
      en: 'house fenring',
    },
    passiveName: {
      de: 'politischer taktiker',
      en: 'political tactician',
    },
    passiveDescription: {
      de: '<b>Spielbeginn</b>: Mische {resource:foldspace}{resource:foldspace} in dein Deck.',
      en: '<b>Game start</b>: Shuffle {resource:foldspace}{resource:foldspace} into your deck.',
    },
    signetName: {
      de: 'vorgetäuschte schwäche',
      en: 'feigned weakness',
    },
    signetDescription: {
      de: '{resource:card-discard} {resource:helper-trade} {resource:signet-token}. Entsorge ihn an deinem Aufdeckzug, um {resource:sword}{resource:sword}{resource:sword}{resource:helper-or}{resource:intrigue} zu erhalten.',
      en: '{resource:card-discard} {resource:helper-trade} {resource:signet-token}. Trash it at your reveal turn to get {resource:sword}{resource:sword}{resource:sword}{resource:helper-or}{resource:intrigue}.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/hasimir.png',
    playableByAI: true,
  },
  {
    name: {
      en: 'lady margot fenring',
      de: 'lady margot fenring',
    },
    house: {
      en: 'house fenring',
      de: 'haus fenring',
    },
    passiveName: {
      en: 'bene gesserit training',
      de: 'bene gesserit training',
    },
    passiveDescription: {
      en: 'You may pass your 1. turn. If you do, {resource:card-draw}.',
      de: 'Du kannst deinen 1. Zug passen. Tust du das, {resource:card-draw}.',
    },
    signetName: {
      en: 'hypnotic seduction',
      de: 'hypnotische verführung',
    },
    signetDescription: {
      en: 'Place {resource:signet-token} on a card in the imperium row. It costs you {resource:persuasion;amount:1} less and opponents {resource:persuasion;amount:1} more.',
      de: 'Lege {resource:signet-token} auf eine Karte in der Imperium-Reihe. Sie kostet dich {resource:persuasion;amount:1} weniger, Gegner {resource:persuasion;amount:1} mehr.',
    },
    imageUrl: '/assets/images/leaders/margot.png',
    playableByAI: true,
    type: 'new',
    gameModifiers: {
      customActions: [
        {
          id: 'margot-charm',
          action: 'charm',
        },
      ],
    },
  },
  {
    name: {
      de: 'ehrwürdige mutter mohiam',
      en: 'reverend mother mohiam',
    },
    house: {
      de: 'bene gesserit',
      en: 'bene gesserit',
    },
    passiveName: {
      de: 'ehrwürdige mutter',
      en: 'reverend mother',
    },
    passiveDescription: {
      de: 'Entferne deinen Marker von der {faction:bene}-Einflussleiste. Immer wenn du dort Einfluss erhalten würdest: {resource:spice}<br>Ignoriere alle {faction:bene} -Anforderungen.',
      en: 'Remove your marker from the {faction:bene}-track. Every time you would gain influence there: {resource:spice}<br>Ignore all {faction:bene} -requirements.',
    },
    signetName: {
      de: 'wahrsagerin',
      en: 'truthsayer',
    },
    signetDescription: {
      de: 'Du kannst dir die oberste Karte des Intrigen-Stapels sowie des Konflikt-Stapels ansehen.',
      en: 'You may look at the top card of the intrigue deck and the conflict deck.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/mohiam.png',
    playableByAI: true,
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => (field.actionType === 'bene' ? 0.025 : 0.0),
    },
    gameModifiers: {
      factionInfluenceModifiers: {
        bene: {
          id: 'mohiam',
          noInfluence: true,
          alternateReward: {
            type: 'spice',
          },
        },
      },
      customActions: [
        {
          id: 'mohiam-vision-conflict',
          action: 'vision-conflict',
        },
        {
          id: 'mohiam-vision-intrigues',
          action: 'vision-intrigues',
        },
      ],
      fieldAccessModifiers: [
        {
          id: 'mohiam-bene',
          factionType: 'bene',
        },
      ],
    },
  },
  {
    name: {
      en: 'tessia vernius',
      de: 'tessia vernius',
    },
    house: {
      en: 'house vernius',
      de: 'haus vernius',
    },
    passiveName: {
      en: 'ixian gifts',
      de: 'ixianische geschenke',
    },
    passiveDescription: {
      en: '<b>Reveal turn</b>: You may trash 1 tech tile to get {resource:faction-influence-up-choice}.',
      de: '<b>Aufdeckzug</b>: Du kannst 1 Tech-Plättchen entsorgen, um {resource:faction-influence-up-choice} zu erhalten.',
    },
    signetName: {
      en: 'inspiring presence',
      de: 'inspirierende präsenz',
    },
    signetDescription: {
      en: '{resource:card-draw}{resource:helper-or}You can activate the agent effect of one of your handcards.',
      de: '{resource:card-draw}{resource:helper-or}Aktiviere den Agenten-Effekt einer deiner Handkarten.',
    },
    imageUrl: '/assets/images/leaders/tessia.png',
    type: 'new',
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) =>
        field.rewards.some((x) => x.type === 'persuasion') ? 0.025 : 0.0,
    },
  },
  {
    name: {
      en: 'earl rhombur vernius',
      de: 'graf rhombur vernius',
    },
    house: {
      en: 'house vernius',
      de: 'haus vernius',
    },
    passiveName: {
      en: 'earl of ix',
      de: 'graf von ix',
    },
    passiveDescription: {
      en: '<br><b>Reveal turn</b>: {resource:tech}',
      de: '<br><b>Aufdeckzug</b>: {resource:tech}',
    },
    signetName: {
      en: 'enhanced cybernetics',
      de: 'kybernetische upgrades',
    },
    signetDescription: {
      en: '<br>{resource:card-discard} {resource:helper-trade} {resource:card-draw}',
      de: '<br>{resource:card-discard} {resource:helper-trade} {resource:card-draw}',
    },
    imageUrl: '/assets/images/leaders/rhombur.png',
    type: 'new',
  },
  {
    name: {
      en: 'count august metulli',
      de: 'graf august metulli',
    },
    house: {
      en: 'house metulli',
      de: 'haus metulli',
    },
    passiveName: {
      en: 'isolationist',
      de: 'isolationist',
    },
    passiveDescription: {
      en: 'You cannot purchase cards.<br><br><b>Reveal turn</b>: {resource:persuasion;amount:3}{resource:helper-trade}{resource:spice} (any number of times)',
      de: 'Du kannst du keine Karten erwerben.<br><br><b>Aufdeckzug</b>:  {resource:persuasion;amount:3}{resource:helper-trade}{resource:spice} (beliebig oft)',
    },
    signetName: {
      en: 'address to the people',
      de: 'ansprache an das volk',
    },
    signetDescription: {
      en: '<br>{resource:solari} {resource:troop}',
      de: '<br>{resource:solari} {resource:troop}',
    },
    imageUrl: '/assets/images/leaders/august.png',
    type: 'new',
    aiAdjustments: {
      goalEvaluationModifier: () => [{ type: 'high-council', modifier: -0.2 }],
      fieldEvaluationModifier: (player, gameState, field) =>
        field.rewards.some((x) => x.type === 'persuasion') ? -0.05 : 0.0,
    },
  },
  {
    name: {
      de: 'lunara metulli',
      en: 'lunara metulli',
    },
    type: 'new',
    house: {
      de: 'haus metulli',
      en: 'house metulli',
    },
    passiveName: {
      de: 'untergehendes haus',
      en: 'declining house',
    },
    passiveDescription: {
      de: '<b>Spielbeginn</b>: Entferne alle {resource:persuasion;amount:2}-Karten aus deinem Deck.',
      en: '<b>Game start</b>: Remove all {resource:persuasion;amount:2}-cards from your deck.',
    },
    signetName: {
      de: 'sorgfältiges vorgehen',
      en: 'thorough approach',
    },
    signetDescription: {
      de: 'Erhältst du in diesem Zug {resource:solari}/{resource:spice}/{resource:water}, erhalte davon jeweils +1.',
      en: 'If you get {resource:solari}/{resource:spice}/{resource:water} this turn, you get +1 of each.',
    },
    imageUrl: '/assets/images/leaders/lunara.png',
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
      en: '<b>Round start</b>: You may look at the top card of your deck and the intrigue deck.',
      de: '<b>Rundenbeginn</b>: Du kannst dir die oberste Karte deines Decks und des Intrigenstapels ansehen.',
    },
    signetName: {
      en: 'Lisan al Gaib',
      de: 'Lisan al Gaib',
    },
    signetDescription: {
      en: '<br>{resource:card-draw} {resource:helper-or} {resource:troop}',
      de: '<br>{resource:card-draw} {resource:helper-or} {resource:troop}',
    },
    imageUrl: '/assets/images/leaders/paul_muaddib.png',
    type: 'new',
    gameModifiers: {
      customActions: [
        {
          id: 'muadib-vision-deck',
          action: 'vision-deck',
        },
        {
          id: 'muadib-vision-intrigues',
          action: 'vision-intrigues',
        },
      ],
    },
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
      en: '<br>{resource:spice} {resource:helper-trade} {resource:intrigue}',
      de: '<br>{resource:spice} {resource:helper-trade} {resource:intrigue}',
    },
    imageUrl: '/assets/images/leaders/paul_emperor.png',
    type: 'new',
    gameModifiers: {
      customActions: [
        {
          id: 'emperor-paul-vision-deck',
          action: 'vision-deck',
        },
        {
          id: 'emperor-paul-vision-intrigues',
          action: 'vision-intrigues',
        },
        {
          id: 'emperor-paul-vision-conflict',
          action: 'vision-conflict',
        },
      ],
    },
  },
  {
    name: {
      en: 'Tyrant Vladimir Harkonnen',
      de: 'Tyrann Vladimir Harkonnen',
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
      en: '<b>Game start</b>: Search the intrigue deck for any intrigue and add it to your hand. Then shuffle it.',
      de: '<b>Spielbeginn</b>: Durchsuche den Intrigenstapel nach einer beliebigen Intrige und nimm diese auf deine Hand. Mische ihn danach.',
    },
    signetName: {
      en: 'Boundless Greed',
      de: 'Grenzenlose Gier',
    },
    signetDescription: {
      en: '<br>{resource:loose-troop} {resource:helper-trade} {resource:spice}',
      de: '<br>{resource:loose-troop} {resource:helper-trade} {resource:spice}',
    },
    imageUrl: '/assets/images/leaders/vlad.png',
    type: 'new',
    playableByAI: true,
  },
  {
    name: {
      en: 'Leto Atreides I',
      de: 'Leto I. Atreides ',
    },
    house: {
      en: 'House Atreides',
      de: 'Haus Atreides',
    },
    passiveName: {
      en: 'Fair Leader',
      de: 'Gerechter Anführer',
    },
    passiveDescription: {
      en: '<br><b>Reveal turn</b>: {resource:persuasion;amount:1}',
      de: '<br><b>Aufdeckzug</b>: {resource:persuasion;amount:1}',
    },
    signetName: {
      en: 'Landsraad connections',
      de: 'Landsraad-Verbindungen',
    },
    signetDescription: {
      en: '{resource:signet-token}. Trash it so enemy agents dont block your agent at {faction:landsraad} board spaces.',
      de: '{resource:signet-token}. Entsorge ihn, damit gegnerische Agenten deinen Agenten auf {faction:landsraad}-Feldern nicht blockieren.',
    },
    imageUrl: '/assets/images/leaders/leto.png',
    type: 'new',
    playableByAI: true,
  },
];
