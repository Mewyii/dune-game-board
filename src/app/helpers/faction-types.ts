import { FactionType } from '../models';

export function getFactionTypePath(actionType: FactionType) {
  switch (actionType) {
    case 'fremen':
      return 'assets/images/action-types/action_type_fremen.png';
    case 'guild':
      return 'assets/images/action-types/action_type_guild.png';
    case 'bene':
      return 'assets/images/action-types/action_type_bene.png';
    case 'emperor':
      return 'assets/images/action-types/action_type_emperor.png';
    case 'landsraad':
      return 'assets/images/action-types/action_type_diplomacy.png';
    case 'choam':
      return 'assets/images/action-types/action_type_spice.png';
    default:
      return '';
  }
}

export function isActiveFactionType(type: string): type is FactionType {
  return type === 'fremen' || type === 'guild' || type === 'bene' || type === 'emperor';
}

export function isFactionType(type: string): type is FactionType {
  return (
    type === 'fremen' || type === 'guild' || type === 'bene' || type === 'emperor' || type === 'landsraad' || type === 'ix'
  );
}
