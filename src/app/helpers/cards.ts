import { ActionType } from '../models';
import { CardFactionAndFieldAccess, ImperiumDeckCard } from '../services/cards.service';

export function getCardsFieldAccess(cards: ImperiumDeckCard[]): ActionType[] {
  return cards.filter((x) => x.fieldAccess).flatMap((x) => x.fieldAccess!);
}

export function getCardsFactionAndFieldAccess(cards: ImperiumDeckCard[]): CardFactionAndFieldAccess[] {
  return cards
    .filter((x) => x.faction && x.fieldAccess)
    .flatMap((x) => ({ faction: x.faction!, actionType: x.fieldAccess! }));
}
