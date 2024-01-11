import { ActionType } from '../models';

export function getActionTypePath(actionType: ActionType) {
  switch (actionType) {
    case 'fremen':
      return 'assets/images/action-types/action_type_fremen.png';
    case 'guild':
      return 'assets/images/action-types/action_type_guild.png';
    case 'bene':
      return 'assets/images/action-types/action_type_bene.png';
    case 'emperor':
      return 'assets/images/action-types/action_type_emperor.png';
    case 'town':
      return 'assets/images/action-types/action_type_town.png';
    case 'choam':
    case 'spice':
      return 'assets/images/action-types/action_type_spice.png';
    case 'landsraad':
      return 'assets/images/action-types/action_type_diplomacy.png';
    default:
      return '';
  }
}
