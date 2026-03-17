import { FactionType } from '../models';

export const FACTION_TYPE_PATHS: Record<FactionType, string> = {
  landsraad: 'assets/images/action-types/action_type_diplomacy.png',
  choam: 'assets/images/action-types/action_type_spice.png',
  emperor: 'assets/images/action-types/action_type_emperor.png',
  guild: 'assets/images/action-types/action_type_guild.png',
  bene: 'assets/images/action-types/action_type_bene.png',
  fremen: 'assets/images/action-types/action_type_fremen.png',
};

export function isActiveFactionType(type: string): type is FactionType {
  return type === 'fremen' || type === 'guild' || type === 'bene' || type === 'emperor';
}

export function isFactionType(type: string): type is FactionType {
  return (
    type === 'fremen' || type === 'guild' || type === 'bene' || type === 'emperor' || type === 'landsraad' || type === 'ix'
  );
}
