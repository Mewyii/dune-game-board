import { AIPersonality } from 'src/app/models/ai';

const fighter: AIPersonality = {
  troop: 1.05,
  combat: 1.025,
  dreadnought: 1.025,
  tech: 0.975,
  'faction-influence-up-fremen': 0.975,
  'faction-influence-up-bene': 0.975,
  'faction-influence-up-guild': 0.975,
  'faction-influence-up-emperor': 0.975,
  'council-seat-small': 0.95,
  'council-seat-large': 0.95,
};

const diplomat: AIPersonality = {
  'faction-influence-up-fremen': 1.05,
  'faction-influence-up-bene': 1.05,
  'faction-influence-up-guild': 1.05,
  'faction-influence-up-emperor': 1.05,
  'card-draw': 1.025,
  'council-seat-small': 1.025,
  'council-seat-large': 1.025,
  tech: 0.975,
  combat: 0.975,
  troop: 0.95,
};

const conspirator: AIPersonality = {
  intrigue: 1.05,
  troop: 1.025,
  focus: 1.025,
  'council-seat-small': 0.975,
  'council-seat-large': 0.975,
  combat: 0.975,
  tech: 0.95,
};

const techie: AIPersonality = {
  tech: 1.05,
  spice: 1.025,
  focus: 1.025,
  combat: 0.975,
  troop: 0.975,
  intrigue: 0.95,
};

const commander: AIPersonality = {
  'sword-master': 1.05,
  dreadnought: 1.025,
  'council-seat-small': 1.025,
  'council-seat-large': 1.025,
  'card-draw': 0.975,
  tech: 0.975,
  intrigue: 0.95,
};

const explorer: AIPersonality = {
  foldspace: 1.05,
  'sword-master': 1.025,
  'card-draw': 1.025,
  'faction-influence-up-fremen': 0.975,
  'faction-influence-up-bene': 0.975,
  'faction-influence-up-guild': 0.975,
  'faction-influence-up-emperor': 0.975,
  combat: 0.975,
  'council-seat-small': 0.95,
  'council-seat-large': 0.95,
};

export const aiPersonalities = { default: {}, fighter, diplomat, conspirator, techie, commander, explorer };
