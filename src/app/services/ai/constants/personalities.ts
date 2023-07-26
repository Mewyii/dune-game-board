import { AIPersonality } from '../models';

const fighter: AIPersonality = {
  'get-troops': 1.2,
  'enter-combat': 1.1,
  warship: 1.1,
  tech: 0.9,
  'fremen-alliance': 0.9,
  'bg-alliance': 0.9,
  'guild-alliance': 0.9,
  'emperor-alliance': 0.9,
  'high-council': 0.8,
};

const diplomat: AIPersonality = {
  'fremen-alliance': 1.2,
  'bg-alliance': 1.2,
  'guild-alliance': 1.2,
  'emperor-alliance': 1.2,
  'draw-cards': 1.1,
  'high-council': 1.1,
  tech: 0.9,
  'enter-combat': 0.9,
  'get-troops': 0.8,
};

const conspirator: AIPersonality = {
  intrigues: 1.2,
  'get-troops': 1.1,
  'trim-deck': 1.1,
  'high-council': 0.9,
  'enter-combat': 0.9,
  tech: 0.8,
};

const techie: AIPersonality = {
  tech: 1.2,
  'harvest-accumulated-spice-basin': 1.1,
  'harvest-accumulated-spice-flat': 1.1,
  'trim-deck': 1.1,
  'enter-combat': 0.9,
  'get-troops': 0.9,
  intrigues: 0.8,
};

const commander: AIPersonality = {
  swordmaster: 1.2,
  warship: 1.1,
  'high-council': 1.1,
  'draw-cards': 0.9,
  tech: 0.9,
  intrigues: 0.8,
};

const explorer: AIPersonality = {
  'fold-space': 1.2,
  swordmaster: 1.1,
  'draw-cards': 1.1,
  'fremen-alliance': 0.9,
  'bg-alliance': 0.9,
  'guild-alliance': 0.9,
  'emperor-alliance': 0.9,
  'enter-combat': 0.9,
  'high-council': 0.8,
};

export const aiPersonalities = { default: {}, fighter, diplomat, conspirator, techie, commander, explorer };
