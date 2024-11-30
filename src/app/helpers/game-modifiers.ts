import { ImperiumCard } from '../constants/imperium-cards';
import { FactionType } from '../models';
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

// export function getPlayerImperiumRowModifiers(playerId: number, modifiers: PlayerGameModifiers[]) {
//   const playerModifiers = modifiers.find((x) => x.playerId === playerId);
//   if (playerModifiers && playerModifiers.imperiumRowModifiers) {
//     return playerModifiers.imperiumRowModifiers;
//   } else {
//     return [];
//   }
// }

// export function getPlayerCustomActions(playerId: number, modifiers: PlayerGameModifiers[]) {
//   const playerModifiers = modifiers.find((x) => x.playerId === playerId);
//   if (playerModifiers && playerModifiers.customActions) {
//     return playerModifiers.customActions;
//   } else {
//     return [];
//   }
// }

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
