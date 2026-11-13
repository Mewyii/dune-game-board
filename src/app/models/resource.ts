export const resourceTypes = [
  'water',
  'spice',
  'solari',
  'focus',
  'signet',
  'persuasion',
  'leader-heal',
  'leadermarker',
] as const;

export type ResourceType = (typeof resourceTypes)[number];

export interface Resource {
  type: ResourceType;
  amount?: number;
}
