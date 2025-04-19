import { ActionType } from '../models';
import { ImperiumCard, LanguageStringAndFontSize } from '../models/imperium-card';
import { CardFactionAndFieldAccess, ImperiumDeckCard } from '../services/cards.service';

interface HasCustomRevealEffect<T> {
  customRevealEffect: LanguageStringAndFontSize;
}

interface HasCustomAgentEffect<T> {
  customAgentEffect: LanguageStringAndFontSize;
}

export function getCardsFieldAccess(cards: ImperiumDeckCard[]): ActionType[] {
  return cards.filter((x) => x.fieldAccess).flatMap((x) => x.fieldAccess!);
}

export function getCardsFactionAndFieldAccess(cards: ImperiumDeckCard[]): CardFactionAndFieldAccess[] {
  return cards
    .filter((x) => x.faction && x.fieldAccess)
    .flatMap((x) => ({ faction: x.faction!, actionType: x.fieldAccess! }));
}

export function isImperiumDeckCard(card: ImperiumCard | ImperiumDeckCard): card is ImperiumDeckCard {
  return 'id' in card;
}

export function hasCustomAgentEffect<T extends ImperiumCard | ImperiumDeckCard>(
  card: T
): card is T & HasCustomAgentEffect<T> {
  return card.customAgentEffect !== undefined && card.customAgentEffect.en !== undefined;
}

export function hasCustomRevealEffect<T extends ImperiumCard | ImperiumDeckCard>(
  card: T
): card is T & HasCustomRevealEffect<T> {
  return card.customRevealEffect !== undefined && card.customRevealEffect.en !== undefined;
}
