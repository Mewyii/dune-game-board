import { AIGoals } from './goals';

export type AIPersonality = Partial<Record<AIGoals, number>>;
