
export enum GameState {
  Lobby = 'LOBBY',
  SubmittingInventions = 'SUBMITTING_INVENTIONS',
  DrawingAndPitching = 'DRAWING_PITCHING',
  Presenting = 'PRESENTING',
  GameOver = 'GAME_OVER',
}

export const DRAW_TIME_LIMIT_MS = 60 * 1000; // 1 minute
