import { RewardType } from '../models';

export function getRewardTypePath(rewardType: RewardType) {
  switch (rewardType) {
    case 'currency':
      return 'assets/images/reward-markers/marker_coin.png';
    case 'spice':
      return 'assets/images/reward-markers/marker_spice.png';
    case 'water':
      return 'assets/images/reward-markers/marker_water.png';
    case 'card-draw':
      return 'assets/images/reward-markers/marker_card_draw.png';
    case 'card-discard':
      return 'assets/images/reward-markers/marker_card_discard.png';
    case 'card-destroy':
      return 'assets/images/reward-markers/marker_card_delete.png';
    case 'card-draw-or-destroy':
      return 'assets/images/reward-markers/marker_card_draw_or_delete.png';
    case 'troops':
      return 'assets/images/reward-markers/marker_troop.png';
    case 'intrigue':
      return 'assets/images/reward-markers/marker_intrigue.png';
    case 'foldspace':
      return 'assets/images/reward-markers/marker_foldspace.png';
    case 'victory-point':
      return 'assets/images/reward-markers/marker_victory_point.png';
    case 'attack-value':
      return 'assets/images/reward-markers/marker_sword.png';
    case 'conviction':
      return 'assets/images/reward-markers/marker_conviction.png';
    case 'extra-spice':
      return 'assets/images/reward-markers/marker_spice_extra.png';
    case 'council-seat-small':
      return 'assets/images/reward-markers/marker_high_council_2.png';
    case 'council-seat-large':
      return 'assets/images/reward-markers/marker_high_council.png';
    case 'troop-insert':
      return 'assets/images/reward-markers/marker_battle_2.png';
    case 'mentat':
      return 'assets/images/reward-markers/marker_mentat_2.png';
    case 'sword-master':
      return 'assets/images/reward-markers/marker_swordmaster.png';
    case 'intrigue-draw':
      return 'assets/images/reward-markers/marker_intrigue_draw.png';
    case 'tech':
      return 'assets/images/reward-markers/marker_tech.png';
    case 'tech-reduced':
      return 'assets/images/reward-markers/marker_tech_reduced.png';
    case 'tech-reduced-two':
      return 'assets/images/reward-markers/marker_tech_reduced_2.png';
    case 'tech-reduced-three':
      return 'assets/images/reward-markers/marker_tech_reduced_3.png';
    case 'ship':
      return 'assets/images/reward-markers/marker_ship.png';
    case 'helper-arrow-down':
      return 'assets/images/reward-markers/marker_helper_arrow_down.png';
    case 'placeholder':
      return 'assets/images/reward-markers/marker_placeholder.png';
    case 'separator':
      return 'assets/images/reward-markers/marker_separator.png';
    case 'separator-horizontal':
      return 'assets/images/reward-markers/marker_separator_horizontal.png';
    case 'control-spice':
      return 'assets/images/reward-markers/marker_control_spice.png';
    case 'card-round-start':
      return 'assets/images/reward-markers/marker_card_round_start.png';
    case 'shipping':
      return 'assets/images/reward-markers/marker_shipping.png';
    case 'buildup':
      return 'assets/images/reward-markers/marker_planet.png';
    default:
      return '';
  }
}