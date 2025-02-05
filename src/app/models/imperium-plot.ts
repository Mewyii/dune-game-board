import { ActiveFactionType } from './faction';
import { LanguageString } from './language';

export interface LanguageStringAndFontSize extends LanguageString {
  fontSize?: 'medium' | 'small';
}

export interface ImperiumPlot {
  name: LanguageString;
  faction?: ActiveFactionType;
  persuasionCosts?: number;
  plotDescription?: LanguageStringAndFontSize;
  imageUrl?: string;
  cardAmount?: number;
}
