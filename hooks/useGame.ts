
import { useState, useEffect } from 'react';
import { onGameStateChange } from '../services/firebaseService';
import { Game } from '../types';

const useGame = (gameId: string | null) => {
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!gameId) {
      setGame(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = onGameStateChange(gameId, (gameData) => {
      if (gameData) {
        setGame(gameData);
        setError(null);
      } else {
        setError("Game not found or has been deleted.");
        setGame(null);
      }
      setLoading(false);
    });

    // The real Firebase SDK returns an unsubscribe function.
    // Our mock doesn't, but in a real app this is how you'd clean up.
    // return () => unsubscribe();
  }, [gameId]);

  return { game, loading, error };
};

export default useGame;
