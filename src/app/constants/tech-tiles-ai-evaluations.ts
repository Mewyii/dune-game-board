import { Player } from '../models/player';
import { GameState } from '../services/ai/models';

export const TECH_TILE_KEYS = [
  'maula-pistol-works',
  'smuggler-outposts',
  'imperial-barracks',
  'upgrade-carryall-suspensors',
  'spice-transport-modules',
  'spy-modules',
  'spy-network',
  'wind-traps',
  'heavy-lasguns',
  'enhanced-sandcrawler-engines',
  'trade-port',
  'upgraded-ornithoper-engines',
  'barrage-rockets',
  'artillery-arsenal',
  'ornithopter-hangar',
  'shieldbreakers',
  'botanical-research-station',
  'sardaukar-commando-post',
  'missionara-protectiva',
  'stillsuits-factory',
  'spice-refineries',
  'ornithopter-squadron',
  'gunship',
  'sietch',
  'guild-bank',
  'governor-palace',
  'bene-gesserit-conclave',
  'lighter',
  'flagship',
  'landing-ships',
  'planetary-surveillance',
] as const;

export type TechTileAIEvaluationType = (typeof TECH_TILE_KEYS)[number];

type TechTileAiEvaluations = {
  [key in TechTileAIEvaluationType]: (player: Player, gameState: GameState) => number;
};

export const techTileAiEvaluations: TechTileAiEvaluations = {
  'maula-pistol-works': (player, gameState) =>
    0.25 + 0.05 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsRewards.solari,
  'smuggler-outposts': (player, gameState) =>
    0.6 - 0.025 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsRewards.solari,
  'imperial-barracks': (player, gameState) =>
    0.35 +
    0.033 * (gameState.currentRound - 1) +
    0.066 * gameState.playerCardsRewards.solari +
    0.033 * gameState.playerCardsFactions.emperor,
  'upgrade-carryall-suspensors': (player, gameState) => 0.8 - 0.1 * (gameState.currentRound - 1),
  'spice-transport-modules': (player, gameState) => 0.0 + 0.5 * gameState.playerDreadnoughtCount,
  'spy-modules': (player, gameState) => 0.0 + 0.5 * gameState.playerDreadnoughtCount,
  'spy-network': (player, gameState) =>
    0.3 + 0.02 * (gameState.currentRound - 1) + 0.033 * gameState.playerCardsFactions.bene,
  'wind-traps': (player, gameState) =>
    0.65 - 0.075 * (gameState.currentRound - 1) + 0.033 * gameState.playerCardsFactions.fremen,
  'heavy-lasguns': (player, gameState) => 0.0 + 0.5 * gameState.playerDreadnoughtCount,
  'enhanced-sandcrawler-engines': (player, gameState) => 0.85 - 0.125 * (gameState.currentRound - 1),
  'trade-port': (player, gameState) =>
    0.6 - 0.033 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsFactions.guild,
  'upgraded-ornithoper-engines': (player, gameState) =>
    0.25 + 0.025 * gameState.playerCardsBought + 0.025 * gameState.playerCardsTrashed,
  'barrage-rockets': (player, gameState) =>
    0.3 + 0.033 * (gameState.currentRound - 1) + 0.05 * gameState.playerDreadnoughtCount,
  'artillery-arsenal': (player, gameState) =>
    0.7 +
    0.05 * gameState.playerDreadnoughtCount -
    0.033 * (gameState.currentRound - 1) +
    0.025 * gameState.playerCardsRewards.sword,
  'ornithopter-hangar': (player, gameState) =>
    0.3 + 0.05 * (gameState.currentRound - 1) + (player.hasSwordmaster ? 0.1 : 0.0),
  shieldbreakers: (player, gameState) => 0.0 + 0.5 * gameState.playerDreadnoughtCount,
  'botanical-research-station': (player, gameState) =>
    0.4 + 0.015 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsFactions.fremen,
  'sardaukar-commando-post': (player, gameState) =>
    0.5 + 0.01 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsFactions.emperor,
  'missionara-protectiva': (player, gameState) =>
    0.2 + 0.033 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsRewards.water,
  'stillsuits-factory': (player, gameState) =>
    0.3 +
    0.025 * (gameState.currentRound - 1) +
    0.01 * gameState.playerCardsBought +
    0.01 * gameState.playerCardsTrashed +
    0.066 * gameState.playerCardsRewards.solari,
  'spice-refineries': (player, gameState) => 0.65 - 0.05 * (gameState.currentRound - 1),
  'ornithopter-squadron': (player, gameState) =>
    0.25 +
    0.075 * (gameState.currentRound - 1) +
    0.05 * gameState.playerDreadnoughtCount +
    0.025 * gameState.playerCardsRewards.sword,
  gunship: (player, gameState) =>
    0.3 +
    0.033 * (gameState.currentRound - 1) +
    0.075 * gameState.playerDreadnoughtCount +
    0.025 * gameState.playerCardsRewards.sword,
  sietch: (player, gameState) =>
    0.6 +
    0.02 * (gameState.currentRound - 1) +
    0.01 * gameState.playerCardsBought +
    0.01 * gameState.playerCardsTrashed +
    (player.hasCouncilSeat ? 0.1 : 0.0) +
    0.033 * gameState.playerCardsRewards.water +
    0.033 * gameState.playerCardsFactions.fremen,
  'guild-bank': (player, gameState) =>
    0.6 +
    0.02 * (gameState.currentRound - 1) +
    0.01 * gameState.playerCardsBought +
    0.01 * gameState.playerCardsTrashed +
    (player.hasCouncilSeat ? 0.1 : 0.0) +
    0.033 * gameState.playerCardsRewards.spice,
  'governor-palace': (player, gameState) =>
    0.6 +
    0.02 * (gameState.currentRound - 1) +
    0.01 * gameState.playerCardsBought +
    0.01 * gameState.playerCardsTrashed +
    (player.hasSwordmaster ? 0.1 : 0.0) +
    (player.hasCouncilSeat ? 0.1 : 0.0) -
    0.05 * gameState.playerIntrigueCount +
    0.033 * gameState.playerCardsRewards.solari +
    0.033 * gameState.playerCardsFactions.emperor,
  'bene-gesserit-conclave': (player, gameState) =>
    0.6 +
    0.01 * (gameState.currentRound - 1) +
    0.02 * gameState.playerCardsBought +
    0.01 * gameState.playerCardsTrashed +
    (player.hasSwordmaster ? 0.1 : 0.0) +
    0.033 * gameState.playerCardsRewards.water +
    0.033 * gameState.playerCardsFactions.bene,
  lighter: (player, gameState) =>
    0.3 +
    0.1 * gameState.playerDreadnoughtCount +
    0.033 * (gameState.currentRound - 1) +
    0.025 * gameState.playerCardsRewards.sword,
  flagship: (player, gameState) =>
    0.3 +
    0.05 * (gameState.currentRound - 1) +
    (player.hasSwordmaster ? 0.1 : 0.0) +
    0.025 * gameState.playerScore.bene +
    0.025 * gameState.playerScore.emperor +
    0.025 * gameState.playerScore.fremen +
    0.025 * gameState.playerScore.guild,
  'landing-ships': (player, gameState) =>
    0.3 +
    0.02 * (gameState.currentRound - 1) +
    0.05 * gameState.playerDreadnoughtCount +
    0.02 * gameState.playerCardsRewards.sword +
    0.025 * gameState.playerCardsRewards.tech,
  'planetary-surveillance': (player, gameState) => 0.75 - 0.05 * (gameState.currentRound - 1),
};
