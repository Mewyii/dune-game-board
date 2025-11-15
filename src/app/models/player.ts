import { Resource } from './resource';

export type PlayerTurnState = 'agent-placement' | 'reveal' | 'revealed' | 'conflict' | 'done';

export interface Player {
  id: number;
  agents: number;
  turnNumber: number;
  turnState: PlayerTurnState;
  resources: Resource[];
  color: string;
  hasSwordmaster?: boolean;
  hasCouncilSeat?: boolean;
  signetTokenCount: number;
  focusTokens: number;
  cardsDrawnAtRoundStart: number;
  tech: number;
  persuasionGainedThisRound: number;
  persuasionSpentThisRound: number;
  permanentPersuasion: number;
  isAI?: boolean;
}
