import { LanguageString, Reward } from '../models';
import { GameState } from '../services/ai/models';
import { Player } from '../services/player-manager.service';

export interface TechTile {
  name: LanguageString;
  immediateEffect?: Reward[];
  costs: number;
  imageUrl: string;
  aiEvaluation: (player: Player, gameState: GameState) => number;
}

export const techTiles: TechTile[] = [
  {
    name: { de: 'Spionagesatelliten', en: 'Spy Satellites' },
    costs: 4,
    imageUrl: '/assets/images/tech-tiles/spy_satellites.png',
    aiEvaluation: (player, gameState) =>
      0.9 +
      0.025 * (gameState.currentTurn - 1) -
      (gameState.playerScore.bene < 2 ? 0.0 : 0.15) -
      (gameState.playerScore.emperor < 2 ? 0.0 : 0.15) -
      (gameState.playerScore.fremen < 2 ? 0.0 : 0.15) -
      (gameState.playerScore.guild < 2 ? 0.0 : 0.15),
  },
  {
    name: { de: 'Shuttle-Flotte', en: 'Shuttle Fleet' },
    costs: 6,
    imageUrl: '/assets/images/tech-tiles/shuttle_fleet.png',
    aiEvaluation: (player, gameState) => 0.9,
  },
  {
    name: { de: 'Holo-Projektoren', en: 'Holo Projectors' },
    costs: 3,
    imageUrl: '/assets/images/tech-tiles/holo_projectors.png',
    aiEvaluation: (player, gameState) => 0.75 - 0.025 * (gameState.currentTurn - 1),
  },
  {
    name: { de: 'Minimik-Film', en: 'Minimic Film' },
    costs: 2,
    imageUrl: '/assets/images/tech-tiles/minimic_film.png',
    aiEvaluation: (player, gameState) => 0.75,
  },
  {
    name: { de: 'Entsorgungsanlage', en: 'Disposal Facility' },
    costs: 3,
    imageUrl: '/assets/images/tech-tiles/disposal_facility.png',
    aiEvaluation: (player, gameState) => 0.75 - 0.05 * (gameState.currentTurn - 1),
  },
  {
    name: { de: 'Windfallen', en: 'Windtraps' },
    costs: 2,
    imageUrl: '/assets/images/tech-tiles/wind_traps.png',
    aiEvaluation: (player, gameState) => 0.75 - 0.033 * (gameState.currentTurn - 1),
  },
  {
    name: { de: 'Detonationsgeräte', en: 'Detonation Devices' },
    costs: 3,
    imageUrl: '/assets/images/tech-tiles/detonation_devices.png',
    aiEvaluation: (player, gameState) =>
      (gameState.playerCombatUnits.shipsInGarrison > 0 ? 0.66 : 0.1) + 0.033 * (gameState.currentTurn - 1),
  },
  {
    name: { de: 'Trainingsdrohnen', en: 'Training Drones' },
    costs: 3,
    imageUrl: '/assets/images/tech-tiles/training_drones.png',
    aiEvaluation: (player, gameState) => 0.66 - 0.025 * (gameState.currentTurn - 1),
  },
  {
    name: { de: 'Memocorder', en: 'Memocorders' },
    costs: 2,
    imageUrl: '/assets/images/tech-tiles/memocorders.png',
    aiEvaluation: (player, gameState) =>
      0.5 +
      0.025 * gameState.playerScore.bene +
      0.025 * gameState.playerScore.emperor +
      0.025 * gameState.playerScore.fremen +
      0.025 * gameState.playerScore.guild,
  },
  {
    name: { de: 'Artillerie', en: 'Artillery' },
    costs: 1,
    imageUrl: '/assets/images/tech-tiles/artillery.png',
    aiEvaluation: (player, gameState) => 0.5,
  },
  {
    name: { de: 'Invasionschiffe', en: 'Invasion Ships' },
    costs: 5,
    imageUrl: '/assets/images/tech-tiles/invasion_ships.png',
    aiEvaluation: (player, gameState) =>
      (gameState.playerCombatUnits.troopsInGarrison < 3 ? 0.33 : 0.1) + 0.025 * (gameState.currentTurn - 1),
  },
  {
    name: { de: 'Chaumurky', en: 'Chaumurky' },
    costs: 1,
    imageUrl: '/assets/images/tech-tiles/chaumurky.png',
    aiEvaluation: (player, gameState) => 0.1 + 0.05 * (gameState.currentTurn - 1),
  },
  {
    name: { de: 'Limitierte Kampfmittel', en: 'Restricted Ordnance' },
    costs: 4,
    imageUrl: '/assets/images/tech-tiles/restricted_ordnance.png',
    aiEvaluation: (player, gameState) => (player.hasCouncilSeat ? 0.9 : 0.1),
  },
  {
    name: { de: 'Holtzmann-Antrieb', en: 'Holtzman Engine' },
    costs: 6,
    imageUrl: '/assets/images/tech-tiles/holtzman_engine.png',
    aiEvaluation: (player, gameState) => 0.66 + 0.025 * (gameState.currentTurn - 1),
  },
  {
    name: { de: 'Flaggschiff', en: 'Flagship' },
    costs: 8,
    imageUrl: '/assets/images/tech-tiles/flagship.png',
    aiEvaluation: (player, gameState) => 0.33 + 0.05 * (gameState.currentTurn - 1),
  },
];
