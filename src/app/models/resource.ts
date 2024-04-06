export const resourceTypes = ['water', 'spice', 'solari'] as const;

export type ResourceType = (typeof resourceTypes)[number];

export interface Resource {
  type: ResourceType;
  amount?: number;
}
