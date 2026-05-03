import { Player } from '../models/player';

export function getPlayerPersuasion(player: Player) {
  return player.permanentPersuasion + player.persuasionGainedThisRound - player.persuasionSpentThisRound;
}
