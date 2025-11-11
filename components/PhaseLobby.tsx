import React from 'react';
import { Game, Player } from '../types';
import { startGame } from '../services/firebaseService';
import Spinner from './Spinner';

interface PhaseLobbyProps {
  game: Game;
  player: Player;
  onLeave: () => void;
}

const PhaseLobby: React.FC<PhaseLobbyProps> = ({ game, player, onLeave }) => {
  const [loading, setLoading] = React.useState(false);
  const isHost = game.hostId === player.id;
  const players = Object.values(game.players);
  const canStart = players.length > 1;

  const handleStartGame = async () => {
    if (!isHost || !canStart) return;
    setLoading(true);
    await startGame(game.id);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-800 rounded-lg shadow-2xl p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Game Lobby</h2>
        <button onClick={onLeave} className="text-sm text-slate-400 hover:text-white transition">Leave</button>
      </div>
      
      <div className="text-center bg-slate-900 p-4 rounded-lg">
        <p className="text-slate-400">Room Code</p>
        <p className="text-4xl font-mono tracking-widest text-pink-400">{game.id}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">Players ({players.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* FIX: Explicitly type player object to avoid unknown type error */}
          {players.map((p: Player) => (
            <div key={p.id} className="bg-slate-700 p-3 rounded-md text-center">
              <p className="font-medium truncate">{p.name}</p>
              {p.id === game.hostId && <p className="text-xs text-indigo-400">Host</p>}
            </div>
          ))}
        </div>
      </div>

      {isHost && (
        <div className="text-center pt-4">
          <button
            onClick={handleStartGame}
            disabled={!canStart || loading}
            className="w-full md:w-auto px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-lg transform hover:scale-105 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {loading ? <Spinner /> : 'Start Game'}
          </button>
          {!canStart && <p className="text-slate-400 mt-2 text-sm">Waiting for at least 2 players to start.</p>}
        </div>
      )}

      {!isHost && (
        <div className="text-center text-slate-400 pt-4">
          <p>Waiting for the host to start the game...</p>
        </div>
      )}
    </div>
  );
};

export default PhaseLobby;
