import { FactionType } from '../models';
import { PlayerGameModifiers } from '../services/game-modifier.service';

export function hasFactionInfluenceModifier(
  playerGameModifier: PlayerGameModifiers | undefined,
  factionType: FactionType | undefined
) {
  if (!playerGameModifier || !playerGameModifier.factionInfluenceModifier || !factionType) {
    return false;
  } else {
    return !!playerGameModifier.factionInfluenceModifier[factionType];
  }
}

export function getFactionInfluenceModifier(
  playerGameModifier: PlayerGameModifiers | undefined,
  factionType: FactionType | undefined
) {
  if (!playerGameModifier || !playerGameModifier.factionInfluenceModifier || !factionType) {
    return false;
  } else {
    return playerGameModifier.factionInfluenceModifier[factionType];
  }
}
