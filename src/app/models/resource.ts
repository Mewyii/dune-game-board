export const resourceTypes = ['water', 'spice', 'solari', 'tech', 'focus', 'signet', 'leader-heal'] as const;

export type ResourceType = (typeof resourceTypes)[number];

export interface Resource {
  type: ResourceType;
  amount?: number;
}
