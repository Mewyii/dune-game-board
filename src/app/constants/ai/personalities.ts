import { AIPersonality } from 'src/app/models/ai';

const fighter: AIPersonality = {
  troops: 1.05,
  'enter-combat': 1.025,
  dreadnought: 1.025,
  tech: 0.975,
  'fremen-alliance': 0.975,
  'bg-alliance': 0.975,
  'guild-alliance': 0.975,
  'emperor-alliance': 0.975,
  'high-council': 0.95,
};

const diplomat: AIPersonality = {
  'fremen-alliance': 1.05,
  'bg-alliance': 1.05,
  'guild-alliance': 1.05,
  'emperor-alliance': 1.05,
  'draw-cards': 1.025,
  'high-council': 1.025,
  tech: 0.975,
  'enter-combat': 0.975,
  troops: 0.95,
};

const conspirator: AIPersonality = {
  intrigues: 1.05,
  troops: 1.025,
  'trim-cards': 1.025,
  'high-council': 0.975,
  'enter-combat': 0.975,
  tech: 0.95,
};

const techie: AIPersonality = {
  tech: 1.05,
  'harvest-accumulated-spice-basin': 1.025,
  'harvest-accumulated-spice-flat': 1.025,
  'trim-cards': 1.025,
  'enter-combat': 0.975,
  troops: 0.975,
  intrigues: 0.95,
};

const commander: AIPersonality = {
  swordmaster: 1.05,
  dreadnought: 1.025,
  'high-council': 1.025,
  'draw-cards': 0.975,
  tech: 0.975,
  intrigues: 0.95,
};

const explorer: AIPersonality = {
  'fold-space': 1.05,
  swordmaster: 1.025,
  'draw-cards': 1.025,
  'fremen-alliance': 0.975,
  'bg-alliance': 0.975,
  'guild-alliance': 0.975,
  'emperor-alliance': 0.975,
  'enter-combat': 0.975,
  'high-council': 0.95,
};

export const aiPersonalities = { default: {}, fighter, diplomat, conspirator, techie, commander, explorer };
