export interface Point {
  x: number;
  y: number;
}

export interface Track {
  id: string;
  title: string;
  url: string;
  duration: string;
}

export enum GameState {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}
