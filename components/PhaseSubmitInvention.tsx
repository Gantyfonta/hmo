import React, { useState, useEffect } from 'react';
import { Game, Player } from '../types';
import { submitInvention, checkAllInventionsSubmitted } from '../services/firebaseService';
import Spinner from './Spinner';

interface PhaseSubmitInventionProps {
  game: Game;
  player: Player;
}

const PhaseSubmitInvention: React.FC<PhaseSubmitInventionProps> = ({ game, player }) => {
  const [invention, setInvention] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      if(game.inventions && game.inventions[player.id]) {
          setIsSubmitted(true);
      }
      if (game.hostId === player.id) {
          checkAllInventionsSubmitted(game.id);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.inventions, game.id, player.id, game.hostId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invention.trim()) return;
    setLoading(true);
    await submitInvention(game.id, player.id, invention);
    setIsSubmitted(true);
    setLoading(false);
  };

  const submittedCount = game.inventions ? Object.keys(game.inventions).length : 0;
  const totalPlayers = Object.keys(game.players).length;

  if (isSubmitted) {
    return (
      <div className="text-center w-full max-w-2xl mx-auto bg-slate-800 rounded-lg shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-white">Your idea is in!</h2>
        <p className="text-slate-300 text-lg">"{game.inventions?.[player.id]}"</p>
        <div className="space-y-4 pt-4">
          <Spinner />
          <p className="text-slate-400">Waiting for other players...</p>
          <div className="w-full bg-slate-700 rounded-full h-4">
             <div 
                className="bg-indigo-600 h-4 rounded-full transition-all duration-500" 
                style={{ width: `${(submittedCount / totalPlayers) * 100}%` }}
             ></div>
          </div>
          <p className="text-sm text-slate-500">{submittedCount} of {totalPlayers} submitted</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-800 rounded-lg shadow-2xl p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Come up with a useless invention!</h2>
      </div>

      <p className="text-center text-slate-400">Think of something completely pointless. The sillier, the better!</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={invention}
          onChange={(e) => setInvention(e.target.value)}
          placeholder="e.g., A solar-powered flashlight"
          rows={3}
          className="w-full p-4 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-lg"
        />
        <button
          type="submit"
          disabled={!invention.trim() || loading}
          className="w-full flex justify-center items-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-lg transform hover:scale-105 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {loading ? <Spinner /> : 'Submit Invention'}
        </button>
      </form>
    </div>
  );
};

export default PhaseSubmitInvention;