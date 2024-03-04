import { LanguageString, Resource } from '../models';
import { AIVariableValues } from '../services/ai/ai.manager';

export interface Conflict {
  name: LanguageString;
  aiEvaluation: AIVariableValues;
  lvl: 1 | 2 | 3;
  row: number;
  column: number;
}

export const conflicts: Conflict[] = [
  {
    name: { de: 'Wüstenkraft', en: 'desert power' },
    aiEvaluation: 'good',
    lvl: 2,
    row: 1,
    column: 1,
  },
  {
    name: { de: 'Raub der Lagerbestände', en: 'raid stockpiles' },
    aiEvaluation: 'okay',
    lvl: 2,
    row: 1,
    column: 2,
  },
  {
    name: { de: 'Heimlichtuerei', en: 'cloak and dagger' },
    aiEvaluation: 'okay',
    lvl: 2,
    row: 1,
    column: 3,
  },
  {
    name: { de: 'Machenschaften', en: 'machinations' },
    aiEvaluation: 'good',
    lvl: 2,
    row: 1,
    column: 4,
  },
  {
    name: { de: 'Sortieren des Chaos', en: 'sort trough the chaos' },
    aiEvaluation: 'good',
    lvl: 2,
    row: 1,
    column: 5,
  },
  {
    name: { de: 'Schrecklicher Zweck', en: 'terrible purpose' },
    aiEvaluation: 'good',
    lvl: 2,
    row: 1,
    column: 6,
  },
  {
    name: { de: 'Gildenbanküberfall', en: 'guild bank raid' },
    aiEvaluation: 'okay',
    lvl: 2,
    row: 2,
    column: 1,
  },
  {
    name: { de: 'Belagerung von Arrakeen', en: 'siege of arrakeen' },
    aiEvaluation: 'good',
    lvl: 2,
    row: 2,
    column: 2,
  },
  {
    name: { de: 'Belagerung von Carthag', en: 'siege of carthag' },
    aiEvaluation: 'good',
    lvl: 2,
    row: 2,
    column: 3,
  },
  {
    name: { de: 'Imperiales Becken sichern', en: 'secure imperial basin' },
    aiEvaluation: 'good',
    lvl: 2,
    row: 2,
    column: 4,
  },
  {
    name: { de: 'Handelsmonopol', en: 'trade monopoly' },
    aiEvaluation: 'bad',
    lvl: 2,
    row: 2,
    column: 5,
  },
  {
    name: { de: 'Schlacht um das Imperiale Becken', en: 'battle for imperial basin' },
    aiEvaluation: 'good',
    lvl: 3,
    row: 1,
    column: 1,
  },
  {
    name: { de: 'Große Vision', en: 'grand vision' },
    aiEvaluation: 'bad',
    lvl: 3,
    row: 1,
    column: 2,
  },
  {
    name: { de: 'Schlacht um Carthag', en: 'battle for carthag' },
    aiEvaluation: 'good',
    lvl: 3,
    row: 1,
    column: 3,
  },
  {
    name: { de: 'Schlacht um Arrakeen', en: 'battle for arrakeen' },
    aiEvaluation: 'good',
    lvl: 3,
    row: 2,
    column: 1,
  },
  {
    name: { de: 'Wirtschaftliche Überlegenheit', en: 'economic supremacy' },
    aiEvaluation: 'okay',
    lvl: 3,
    row: 2,
    column: 2,
  },
];
