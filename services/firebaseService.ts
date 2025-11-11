
// NOTE: This app uses Firebase for its backend.
// You need to create a Firebase project and a Realtime Database.
// Then, get your Firebase config object and paste it below.
// It should look like this:
/*
const firebaseConfig = {
  apiKey: "AIza....",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
*/
// For this example to run, we are using mock configuration.
// Replace this with your actual Firebase configuration.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "https://hear-me-out-game-default-rtdb.firebaseio.com", // Example URL
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  appId: "YOUR_APP_ID"
};

// This is a mock implementation of Firebase for demonstration purposes as we cannot use a real backend.
// To make this a fully functional multiplayer game, you would replace this mock
// with the actual Firebase SDK.
// For example:
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, onValue, get, child, update } from "firebase/database";
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

import { Game, Player, Assignment } from '../types';
import { GameState, DRAW_TIME_LIMIT_MS } from '../constants';

const dbMock: { games: Record<string, Game> } = { games: {} };

const mockOnValue = (refPath: string, callback: (snapshot: { exists: () => boolean; val: () => any }) => void) => {
  const pathParts = refPath.split('/');
  let data = dbMock as any;
  for (const part of pathParts) {
    if (data && typeof data === 'object' && part in data) {
      data = data[part];
    } else {
      data = null;
      break;
    }
  }

  const snapshot = {
    exists: () => data !== null,
    val: () => data,
  };

  callback(snapshot);

  // Simulate real-time updates for lobby changes (new players)
  if (pathParts.length === 2 && pathParts[0] === 'games') {
      const interval = setInterval(() => {
        const game = dbMock.games[pathParts[1]];
        if(game) {
            const snapshot = {
                exists: () => true,
                val: () => game,
            };
            callback(snapshot);
        } else {
            clearInterval(interval);
        }
      }, 1000);
  }
};


const mockGet = async (refPath: string) => {
  const pathParts = refPath.split('/');
  let data = dbMock as any;
  for (const part of pathParts) {
    if (data && typeof data === 'object' && part in data) {
      data = data[part];
    } else {
      data = null;
      break;
    }
  }
  return {
    exists: () => data !== null,
    val: () => data,
  };
};

const mockSet = async (refPath: string, data: any) => {
  const pathParts = refPath.split('/');
  let current = dbMock as any;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }
  current[pathParts[pathParts.length - 1]] = data;
};

const mockUpdate = async (updates: Record<string, any>) => {
    for (const path in updates) {
        await mockSet(path, updates[path]);
    }
}


export const createGame = async (hostPlayer: Player): Promise<string> => {
  const gameId = Math.random().toString(36).substring(2, 6).toUpperCase();
  const newGame: Game = {
    id: gameId,
    hostId: hostPlayer.id,
    gameState: GameState.Lobby,
    players: {
      [hostPlayer.id]: hostPlayer,
    },
  };
  await mockSet(`games/${gameId}`, newGame);
  dbMock.games[gameId] = newGame;
  return gameId;
};

export const joinGame = async (gameId: string, player: Player): Promise<boolean> => {
  const snapshot = await mockGet(`games/${gameId}`);
  if (!snapshot.exists()) {
    return false;
  }
  await mockSet(`games/${gameId}/players/${player.id}`, player);
  return true;
};

export const onGameStateChange = (gameId: string, callback: (game: Game | null) => void) => {
  mockOnValue(`games/${gameId}`, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  });
  // Normally you'd return an unsubscribe function here
};

export const startGame = async (gameId: string) => {
  await mockSet(`games/${gameId}/gameState`, GameState.SubmittingInventions);
};

export const submitInvention = async (gameId: string, playerId: string, invention: string) => {
    await mockSet(`games/${gameId}/inventions/${playerId}`, invention);
};

export const checkAllInventionsSubmitted = async (gameId: string) => {
    const gameSnapshot = await mockGet(`games/${gameId}`);
    if (gameSnapshot.exists()) {
        const game: Game = gameSnapshot.val();
        const playerCount = Object.keys(game.players).length;
        const inventionCount = game.inventions ? Object.keys(game.inventions).length : 0;
        if (playerCount > 1 && playerCount === inventionCount) {
           await startDrawingPhase(gameId, game);
        }
    }
};

const startDrawingPhase = async (gameId: string, game: Game) => {
    const playerIds = Object.keys(game.players);
    const shuffledPlayerIds = [...playerIds].sort(() => Math.random() - 0.5);
    const assignments: Record<string, Assignment> = {};

    playerIds.forEach((playerId, index) => {
        const assignedInventionOwnerIndex = (index + 1) % playerIds.length;
        const assignedInventionOwnerId = shuffledPlayerIds[assignedInventionOwnerIndex];
        const originalAuthorId = playerIds.find(id => game.inventions![id] === game.inventions![assignedInventionOwnerId])!;

        assignments[shuffledPlayerIds[index]] = {
            invention: game.inventions![assignedInventionOwnerId],
            originalAuthorId: originalAuthorId,
        };
    });
    
    const updates: Record<string, any> = {};
    updates[`games/${gameId}/assignments`] = assignments;
    updates[`games/${gameId}/gameState`] = GameState.DrawingAndPitching;
    updates[`games/${gameId}/roundEndTime`] = Date.now() + DRAW_TIME_LIMIT_MS;

    await mockUpdate(updates);
};

export const submitDrawingAndPitch = async (gameId: string, playerId: string, drawing: string, pitch: string) => {
    const updates: Record<string, any> = {};
    updates[`games/${gameId}/assignments/${playerId}/drawing`] = drawing;
    updates[`games/${gameId}/assignments/${playerId}/pitch`] = pitch;
    await mockUpdate(updates);
};
