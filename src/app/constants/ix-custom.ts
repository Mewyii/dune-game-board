import { ActionField } from '../models';

export const ix: ActionField = {
  title: { de: 'aufrüstung', en: 'upgrade' },
  actionType: 'landsraad',
  costs: [{ type: 'currency', amount: 4 }],
  rewards: [
    { type: 'ship' },
    { type: 'separator', width: 10, iconHeight: 55 },
    { type: 'tech-reduced-three' },
    { type: 'battle-insert' },
  ],
  pathToImage: 'assets/images/action-backgrounds/industry_2.png',
  isBattlefield: false,
  hasRewardOptions: true,
  customWidth: 'fit-content',
};
