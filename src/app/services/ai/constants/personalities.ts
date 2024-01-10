import { AIPersonality } from '../models';

const fighter: AIPersonality = {
  'get-troops': 1.1,
  'enter-combat': 1.05,
  warship: 1.05,
  tech: 0.95,
  'fremen-alliance': 0.95,
  'bg-alliance': 0.95,
  'guild-alliance': 0.95,
  'emperor-alliance': 0.95,
  'high-council': 0.9,
};

const diplomat: AIPersonality = {
  'fremen-alliance': 1.1,
  'bg-alliance': 1.1,
  'guild-alliance': 1.1,
  'emperor-alliance': 1.1,
  'draw-cards': 1.05,
  'high-council': 1.05,
  tech: 0.95,
  'enter-combat': 0.95,
  'get-troops': 0.9,
};

const conspirator: AIPersonality = {
  intrigues: 1.1,
  'get-troops': 1.05,
  'trim-deck': 1.05,
  'high-council': 0.95,
  'enter-combat': 0.95,
  tech: 0.9,
};

const techie: AIPersonality = {
  tech: 1.1,
  'harvest-accumulated-spice-basin': 1.05,
  'harvest-accumulated-spice-flat': 1.05,
  'trim-deck': 1.05,
  'enter-combat': 0.95,
  'get-troops': 0.95,
  intrigues: 0.9,
};

const commander: AIPersonality = {
  swordmaster: 1.1,
  warship: 1.05,
  'high-council': 1.05,
  'draw-cards': 0.95,
  tech: 0.95,
  intrigues: 0.9,
};

const explorer: AIPersonality = {
  'fold-space': 1.1,
  swordmaster: 1.05,
  'draw-cards': 1.05,
  'fremen-alliance': 0.95,
  'bg-alliance': 0.95,
  'guild-alliance': 0.95,
  'emperor-alliance': 0.95,
  'enter-combat': 0.95,
  'high-council': 0.9,
};

export const aiPersonalities = { default: {}, fighter, diplomat, conspirator, techie, commander, explorer };
