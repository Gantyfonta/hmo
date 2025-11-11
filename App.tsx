
import React, { useState, useCallback } from 'react';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';
import usePlayer from './hooks/usePlayer';

const App: React.FC = () => {
  const [gameId, setGameId] = useState<string | null>(null);
  const { player, setPlayerName, isPlayerReady } = usePlayer();

  const handleCreateGame = useCallback((newGameId: string) => {
    setGameId(newGameId);
  }, []);
  
  const handleJoinGame = useCallback((joinedGameId: string) => {
    setGameId(joinedGameId);
  }, []);

  const handleLeaveGame = useCallback(() => {
    setGameId(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-gradient-to-br from-slate-900 to-indigo-900">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Hear Me Out
        </h1>
        <p className="text-slate-400 mt-2 text-lg">The game of terrible inventions and terrific pitches.</p>
      </header>
      <main className="w-full flex-grow flex items-center justify-center">
        {gameId && player ? (
          <GameRoom gameId={gameId} player={player} onLeave={handleLeaveGame} />
        ) : (
          <Lobby 
            onJoinGame={handleJoinGame} 
            onCreateGame={handleCreateGame} 
            playerName={player?.name || ''}
            setPlayerName={setPlayerName}
            isPlayerReady={isPlayerReady}
          />
        )}
      </main>
    </div>
  );
};

export default App;
