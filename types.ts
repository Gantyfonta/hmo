import { GameState } from './constants';

export interface Player {
  id: string;
  name: string;
}

export interface InventionSubmission {
  playerId: string;
  invention: string;
}

export interface Assignment {
  invention: string;
  drawing?: string;
  pitch?: string;
  originalAuthorId: string;
}

export interface Game {
  id: string;
  hostId: string;
  gameState: GameState;
  players: Record<string, Player>;
  inventions?: Record<string, string>;
  assignments?: Record<string, Assignment>;
  roundEndTime?: number;
  presentationOrder?: string[];
  currentPresenterIndex?: number;
}
