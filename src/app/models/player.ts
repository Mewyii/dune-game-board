export type PlayerTurnState = 'agent-placement' | 'reveal' | 'revealed' | 'conflict' | 'done';

export interface Player {
  id: number;
  agents: number;
  turnNumber: number;
  turnState: PlayerTurnState;
  color: string;
  hasSwordmaster?: boolean;
  hasCouncilSeat?: boolean;
  cardsDrawnAtRoundStart: number;
  persuasionGainedThisRound: number;
  persuasionSpentThisRound: number;
  permanentPersuasion: number;
  isAI?: boolean;
}
