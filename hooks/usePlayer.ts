
import { useState, useEffect } from 'react';
import { Player } from '../types';

const usePlayer = (): { player: Player | null; setPlayerName: (name: string) => void; isPlayerReady: boolean } => {
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const storedPlayer = localStorage.getItem('hear-me-out-player');
    if (storedPlayer) {
      setPlayer(JSON.parse(storedPlayer));
    } else {
      const newPlayerId = `player_${Math.random().toString(36).substring(2, 11)}`;
      setPlayer({ id: newPlayerId, name: '' });
    }
  }, []);

  const setPlayerName = (name: string) => {
    if (player) {
      const updatedPlayer = { ...player, name };
      setPlayer(updatedPlayer);
      localStorage.setItem('hear-me-out-player', JSON.stringify(updatedPlayer));
    }
  };

  const isPlayerReady = !!player?.name;

  return { player, setPlayerName, isPlayerReady };
};

export default usePlayer;
