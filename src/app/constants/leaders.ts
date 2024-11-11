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
      de: 'Naib von Sietch Tabr',
      en: 'Naib of Sietch Tabr',
    },
    passiveDescription: {
      de: 'Du beginnst das Spiel mit 2 {faction:fremen}-Einfluss.',
      en: 'You start the game with 2 {faction:fremen}-influence.',
    },
    signetName: {
      de: 'die wege der fremen',
      en: 'the fremen ways',
    },
    signetDescription: {
      de: '{resource:loose-troop}{resource:helper-trade}{resource:signet-token}. Du kannst es jederzeit entsorgen, um {resource:sword}{resource:sword}{resource:sword} zu erhalten.',
      en: '{resource:loose-troop}{resource:helper-trade}{resource:signet-token}. You may trash it at any time to get {resource:sword}{resource:sword}{resource:sword}.',
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
      en: 'Liet Kynes',
      de: 'Liet Kynes',
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
      en: 'Dont put a marker on the {faction:fremen}-influence-track. Every time you would gain influence there: {resource:water}<br>Ignore all {faction:fremen} -requirements.',
      de: 'Lege keinen Marker auf die {faction:fremen}-Einflussleiste. Immer wenn du dort Einfluss erhalten würdest: {resource:water}<br>Ignoriere alle {faction:fremen} -Anforderungen.',
    },
    signetName: {
      en: 'planting the paradise',
      de: 'pflanzen des paradieses',
    },
    signetDescription: {
      en: '{resource:signet-token}{resource:helper-or}{resource:water}{resource:loose-troop} {resource:helper-trade} {resource:signet-token}{resource:signet-token}{resource:helper-or}{resource:signet-token}{resource:signet-token} {resource:helper-trade} {resource:victory-point}',
      de: '{resource:signet-token}{resource:helper-or}{resource:water}{resource:loose-troop} {resource:helper-trade} {resource:signet-token}{resource:signet-token}{resource:helper-or}{resource:signet-token}{resource:signet-token} {resource:helper-trade} {resource:victory-point}',
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
      en: 'Access to {faction:spice} board spaces costs {resource:water} less.',
      de: 'Der Zugang zu {faction:spice}-Feldern kostet {resource:water} weniger.',
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
      en: '{resource:card-round-start}{resource:card-round-start}. You can not trash your {resource:signet-ring}-cards. Every time you reveal them: {resource:faction-influence-down-choice}',
      de: '{resource:card-round-start}{resource:card-round-start}. Du kannst deine {resource:signet-ring}-Karten nicht entsorgen. Jedes Mal, wenn du sie aufdeckst: {resource:faction-influence-down-choice}',
    },
    signetName: {
      en: 'ego-memories',
      de: 'ego-erinnerungen',
    },
    signetDescription: {
      en: 'If this field is a {faction:town} field: {resource:card-discard}<br>If not: {resource:card-discard}{resource:card-discard}{resource:card-discard}',
      de: 'Wenn dieses Feld ein {faction:town}-Feld ist: {resource:card-discard}<br>Wenn nicht: {resource:card-discard}{resource:card-discard}{resource:card-discard}',
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
      en: 'Every player: {resource:card-discard}',
      de: 'Jeder Spieler: {resource:card-discard}',
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
      en: 'Dont put a marker on the {faction:emperor}-influence-track. Every time you would gain influence there: {resource:solari}<br>Ignore all {faction:emperor} -requirements.',
      de: 'Lege keinen Marker auf die {faction:emperor}-Einflussleiste. Immer wenn du dort Einfluss erhalten würdest: {resource:solari}<br>Ignoriere alle {faction:emperor} -Anforderungen.',
    },
    signetName: {
      de: 'chronistin',
      en: 'chronicler',
    },
    signetDescription: {
      de: '{resource:card-discard} {resource:helper-trade} {resource:signet-token}. Du kannst es entsorgen wenn du einen Agenten platzierst, um {resource:card-draw}{resource:card-draw} zu erhalten.',
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
      de: '{resource:signet-token}. Du kannst es während des Kampfes entsorgen, um {resource:sword} zu erhalten.',
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
      de: 'Agent des Imperators',
      en: 'political tactician',
    },
    passiveDescription: {
      de: 'Du beginnst das Spiel mit 1 {faction:emperor}-Einfluss und 2 {resource:foldspace}-Karten in deinem Deck.',
      en: 'You start the game with 1 {faction:emperor}-influence and 2 {resource:foldspace}-cards in your deck.',
    },
    signetName: {
      de: 'Inszenierte Schwächlichkeit',
      en: 'Orchestrated Weakness',
    },
    signetDescription: {
      de: '{resource:card-discard} {resource:helper-trade} {resource:signet-token}. Entsorge es an deinem Aufdeckzug, um {resource:sword}{resource:sword}{resource:sword}{resource:helper-or}{resource:intrigue} zu erhalten.',
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
      de: 'Bene Gesserit Ausbildung',
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
      en: 'Place {resource:signet-token} on a card of the imperium row. It costs you {resource:persuasion;amount:1} less and opponents {resource:persuasion;amount:1} more.',
      de: 'Lege {resource:signet-token} auf eine Karte der Imperium-Reihe. Sie kostet dich {resource:persuasion;amount:1} weniger, Gegner {resource:persuasion;amount:1} mehr.',
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
    playableByAI: true,
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
      en: '<b>Reveal turn</b>: {resource:tech}',
      de: '<b>Aufdeckzug</b>: {resource:tech}',
    },
    signetName: {
      en: 'enhanced cybernetics',
      de: 'kybernetische upgrades',
    },
    signetDescription: {
      en: '{resource:card-discard} {resource:helper-trade} {resource:card-draw}',
      de: '{resource:card-discard} {resource:helper-trade} {resource:card-draw}',
    },
    imageUrl: '/assets/images/leaders/rhombur.png',
    type: 'new',
    playableByAI: true,
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
      en: 'You may choose any card in play and pay {resource:signet-token} equal to its {resource:persuasion} cost. Activate its agent effect.',
      de: 'Du kannst eine beliebige Karte im Spiel wählen und {resource:signet-token} entsprechend ihrer {resource:persuasion}-Kosten bezahlen. Aktiviere ihren Agenten-Effekt.',
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
      de: 'Erhältst du in diesem Zug {resource:solari}, {resource:spice} oder {resource:water}, erhalte davon jeweils +1.',
      en: 'If you receive {resource:solari}, {resource:spice} or {resource:water} this turn, you get +1 of each.',
    },
    imageUrl: '/assets/images/leaders/lunara.png',
    playableByAI: true,
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
      en: 'Atreides Training',
      de: 'Atreides-Ausbildung',
    },
    passiveDescription: {
      en: '<b>Round start</b>: {resource:card-draw}{resource:helper-trade}{resource:card-discard}',
      de: '<b>Rundenbeginn</b>: {resource:card-draw}{resource:helper-trade}{resource:card-discard}',
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
    playableByAI: true,
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
      en: '{resource:card-draw} {resource:helper-or} {resource:troop}',
      de: '{resource:card-draw} {resource:helper-or} {resource:troop}',
    },
    imageUrl: '/assets/images/leaders/paul_muaddib.png',
    type: 'new',
    playableByAI: true,
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
      en: '{resource:spice} {resource:helper-trade} {resource:intrigue}',
      de: '{resource:spice} {resource:helper-trade} {resource:intrigue}',
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
      en: '<b>Game start</b>: Search the intrigue deck for two intrigues of your choice and add them to your hand. Then shuffle.',
      de: '<b>Spielbeginn</b>: Durchsuche den Intrigenstapel nach zwei beliebigen Intrigen und nimm diese auf deine Hand. Mische ihn danach.',
    },
    signetName: {
      en: 'Boundless Greed',
      de: 'Grenzenlose Gier',
    },
    signetDescription: {
      en: '{resource:loose-troop} {resource:helper-trade} {resource:spice}',
      de: '{resource:loose-troop} {resource:helper-trade} {resource:spice}',
    },
    imageUrl: '/assets/images/leaders/vlad.png',
    type: 'new',
    playableByAI: true,
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
      en: 'Fair Leader',
      de: 'Gerechter Anführer',
    },
    passiveDescription: {
      en: '<b>Reveal turn</b>: {resource:persuasion;amount:1}',
      de: '<b>Aufdeckzug</b>: {resource:persuasion;amount:1}',
    },
    signetName: {
      en: 'inspiring loyalty',
      de: 'Loyalität Inspirierend',
    },
    signetDescription: {
      en: 'Place {resource:signet-token} on this location. If there are 3 or more {resource:signet-token}, take control of it.',
      de: 'Lege {resource:signet-token} auf diesen Ort. Sind dort 3 oder mehr {resource:signet-token}, übernimm die Kontrolle über ihn.',
    },
    imageUrl: '/assets/images/leaders/leto.png',
    type: 'new',
    playableByAI: true,
    gameModifiers: {
      customActions: [
        {
          id: 'leto-inspiring-loyalty',
          action: 'location-change-buildup',
        },
      ],
    },
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
      en: '{resource:solari}{resource:helper-or}Receive the bonus of all board spaces under your control.',
      de: '{resource:solari}{resource:helper-or}Erhalte den Bonus aller Felder unter deiner Kontrolle.',
    },
    imageUrl: '/assets/images/leaders/rabban.png',
    type: 'new',
    playableByAI: true,
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
      en: '<b>Game start</b>: {resource:solari;amount:2} {resource:troop}',
      de: '<b>Spielbeginn</b>: {resource:solari;amount:2} {resource:troop}',
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
    playableByAI: true,
  },
  {
    name: {
      en: 'Yuna Moritani',
      de: 'Yuna Moritani',
    },
    house: {
      en: 'House Moritani',
      de: 'Haus Moritani',
    },
    passiveName: {
      en: 'Pariah Warlord',
      de: 'Geächtete Kriegsherrin',
    },
    passiveDescription: {
      en: '<b>Round start</b>: Trash one of your handcards.',
      de: 'Alle {faction:landsraad}-Felder Kosten zusätzlich {resource:solari}.<br><br><b>Aufdeckzug:</b> {resource:solari;amount:2}{resource:helper-trade}{resource:troop}{resource:troop}',
    },
    signetName: {
      en: 'Pillage',
      de: 'Plündern',
    },
    signetDescription: {
      en: 'If you have troops in combat: {resource:solari;amount:2}',
      de: 'Wenn du Truppen in der Schlacht hast: {resource:solari;amount:2}',
    },

    imageUrl: '/assets/images/leaders/yuna_2.png',
    type: 'new',
    playableByAI: true,
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
      en: 'Uncontrolled Aggression',
      de: 'In den Schatten',
    },
    passiveDescription: {
      en: '<b>Round start</b>: Trash one of your handcards.',
      de: 'Du beginnst das Spiel ohne Einheiten. <br><br>Gegnerische Agenten blockieren Felder für dich nicht.',
    },
    signetName: {
      en: 'Oppression',
      de: 'Erpressung',
    },
    signetDescription: {
      en: '{resource:spice}',
      de: 'Wenn sich auf diesem Feld ein gegnerischer Agent befindet: {resource:spice}',
    },
    imageUrl: '/assets/images/leaders/dara.png',
    type: 'new',
    playableByAI: true,
  },
];
