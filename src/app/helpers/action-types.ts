import { ActionType } from '../models';

export function getActionTypePath(actionType: ActionType) {
  switch (actionType) {
    case 'fremen':
      return 'assets/images/action-types/action_type_fremen.png';
    case 'guild':
      return 'assets/images/action-types/action_type_guild.png';
    case 'bene':
      return 'assets/images/action-types/action_type_bene.png';
    case 'imperium':
      return 'assets/images/action-types/action_type_emperor.png';
    case 'town':
      return 'assets/images/action-types/action_type_town.png';
    case 'spice':
      return 'assets/images/action-types/action_type_spice.png';
    case 'diplomacy':
      return 'assets/images/action-types/action_type_diplomacy.png';
    default:
      return '';
  }
}
