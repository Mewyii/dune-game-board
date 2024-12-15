import { FactionType } from '../models';
import { ImperiumCard } from '../models/imperium-card';
import { ImperiumDeckCard } from '../services/cards.service';
import { ImperiumRowModifier, PlayerGameModifiers } from '../services/game-modifier.service';
import { isImperiumDeckCard } from './cards';

export function hasFactionInfluenceModifier(
  playerGameModifier: PlayerGameModifiers | undefined,
  factionType: FactionType | undefined
) {
  if (!playerGameModifier || !playerGameModifier.factionInfluence || !factionType) {
    return false;
  } else {
    return !!playerGameModifier.factionInfluence[factionType];
  }
}

export function getFactionInfluenceModifier(
  playerGameModifier: PlayerGameModifiers | undefined,
  factionType: FactionType | undefined
) {
  if (!playerGameModifier || !playerGameModifier.factionInfluence || !factionType) {
    return false;
  } else {
    return playerGameModifier.factionInfluence[factionType];
  }
}

export function getCardCostModifier(card: ImperiumCard | ImperiumDeckCard, modifiers?: ImperiumRowModifier[]) {
  let result = 0;

  if (!modifiers) {
    return result;
  }

  for (const modifier of modifiers) {
    if (card.faction && modifier.factionType === card.faction) {
      result += modifier.persuasionAmount;
    } else if (isImperiumDeckCard(card) && modifier.cardId === card.id) {
      result += modifier.persuasionAmount;
    }
  }

  return result;
}
