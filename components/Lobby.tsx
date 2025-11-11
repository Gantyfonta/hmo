
import React, { useState } from 'react';
import { createGame, joinGame } from '../services/firebaseService';
import usePlayer from '../hooks/usePlayer';
import Spinner from './Spinner';

interface LobbyProps {
  onCreateGame: (gameId: string) => void;
  onJoinGame: (gameId: string) => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  isPlayerReady: boolean;
}

const Lobby: React.FC<LobbyProps> = ({ onCreateGame, onJoinGame, playerName, setPlayerName, isPlayerReady }) => {
  const { player } = usePlayer();
  const [gameCode, setGameCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!isPlayerReady || !player) return;
    setLoading(true);
    setError('');
    try {
      const newGameId = await createGame(player);
      onCreateGame(newGameId);
    } catch (err) {
      setError('Failed to create game. Please try again.');
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!isPlayerReady || !player || !gameCode) return;
    setLoading(true);
    setError('');
    try {
      const success = await joinGame(gameCode.toUpperCase(), player);
      if (success) {
        onJoinGame(gameCode.toUpperCase());
      } else {
        setError('Game not found. Check the code and try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to join game. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-800 rounded-lg shadow-2xl p-8 space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold text-center text-white">Join the Fun!</h2>
      {error && <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-md">{error}</p>}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
        <input
          id="name"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your display name"
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>

      {isPlayerReady && (
        <div className="space-y-6 animate-fade-in-fast">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-lg transform hover:scale-105 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {loading ? <Spinner /> : 'Create a New Game'}
          </button>

          <div className="flex items-center text-slate-400">
            <hr className="w-full border-slate-600" />
            <span className="px-4 font-semibold">OR</span>
            <hr className="w-full border-slate-600" />
          </div>

          <div className="flex space-x-3">
            <input
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              placeholder="Enter game code"
              maxLength={4}
              className="flex-grow px-4 py-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition uppercase"
            />
            <button
              onClick={handleJoin}
              disabled={loading || !gameCode}
              className="py-3 px-6 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-md shadow-lg transform hover:scale-105 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {loading ? <Spinner /> : 'Join'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lobby;
