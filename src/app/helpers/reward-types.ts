import { RewardType } from '../models';

export function getRewardTypePath(rewardType: RewardType) {
  switch (rewardType) {
    case 'solari':
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
    case 'troop':
      return 'assets/images/reward-markers/marker_troop.png';
    case 'troop-sardaukar':
      return 'assets/images/reward-markers/marker_troop_sardaukar.png';
    case 'troop-fremen':
      return 'assets/images/reward-markers/marker_troop_fremen.png';
    case 'loose-troop':
      return 'assets/images/reward-markers/marker_troop_delete.png';
    case 'intrigue':
      return 'assets/images/reward-markers/marker_intrigue.png';
    case 'intrigue-trash':
      return 'assets/images/reward-markers/marker_intrigue_delete.png';
    case 'foldspace':
      return 'assets/images/reward-markers/marker_foldspace.png';
    case 'victory-point':
      return 'assets/images/reward-markers/marker_victory_point.png';
    case 'sword':
      return 'assets/images/reward-markers/marker_sword.png';
    case 'persuasion':
      return 'assets/images/reward-markers/marker_conviction.png';
    case 'spice-accumulation':
      return 'assets/images/reward-markers/marker_spice_extra.png';
    case 'council-seat-small':
      return 'assets/images/reward-markers/marker_high_council_2.png';
    case 'council-seat-large':
      return 'assets/images/reward-markers/marker_high_council.png';
    case 'combat':
      return 'assets/images/reward-markers/marker_battle_2.png';
    case 'mentat':
      return 'assets/images/reward-markers/marker_mentat_2.png';
    case 'sword-master':
      return 'assets/images/reward-markers/marker_agent.png';
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
    case 'dreadnought':
      return 'assets/images/reward-markers/marker_ship.png';
    case 'helper-arrow-down':
      return 'assets/images/reward-markers/marker_helper_arrow_down.png';
    case 'helper-arrow-right':
      return 'assets/images/reward-markers/marker_helper_arrow_right.png';
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
    case 'faction-influence-up-choice':
      return 'assets/images/reward-markers/marker_faction_influence_choice.png';
    case 'faction-influence-up-emperor':
      return 'assets/images/reward-markers/marker_faction_influence_emperor.png';
    case 'faction-influence-up-guild':
      return 'assets/images/reward-markers/marker_faction_influence_guild.png';
    case 'faction-influence-up-bene':
      return 'assets/images/reward-markers/marker_faction_influence_bene.png';
    case 'faction-influence-up-fremen':
      return 'assets/images/reward-markers/marker_faction_influence_fremen.png';
    case 'faction-influence-up-twice-choice':
      return 'assets/images/reward-markers/marker_faction_influence_choice_twice.png';
    case 'faction-influence-down-choice':
      return 'assets/images/reward-markers/marker_faction_influence_down.png';
    case 'faction-influence-down-emperor':
      return 'assets/images/reward-markers/marker_faction_influence_down_emperor.png';
    case 'faction-influence-down-guild':
      return 'assets/images/reward-markers/marker_faction_influence_down_guild.png';
    case 'faction-influence-down-bene':
      return 'assets/images/reward-markers/marker_faction_influence_down_bene.png';
    case 'faction-influence-down-fremen':
      return 'assets/images/reward-markers/marker_faction_influence_down_fremen.png';
    case 'agent':
      return 'assets/images/reward-markers/marker_agent.png';
    case 'agent-lift':
      return 'assets/images/reward-markers/marker_agent_lift.png';
    case 'signet-ring':
      return 'assets/images/reward-markers/marker_signet_ring.png';
    case 'signet-token':
      return 'assets/images/reward-markers/marker_signet_token.png';
    case 'tech-tile-flip':
      return 'assets/images/reward-markers/marker_tech_tile_flip.png';
    case 'location-control':
      return 'assets/images/reward-markers/marker_location_control.png';
    default:
      return '';
  }
}
