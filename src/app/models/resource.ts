export const resourceTypes = ['water', 'spice', 'solari', 'tech', 'focus', 'signet', 'leader-heal', 'persuasion'] as const;

export type ResourceType = (typeof resourceTypes)[number];

export interface Resource {
  type: ResourceType;
  amount?: number;
}
