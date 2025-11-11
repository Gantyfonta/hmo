import React, { useState } from 'react';
import { Game, Player } from '../types';
import { advancePresenter, endGame } from '../services/firebaseService';
import Spinner from './Spinner';

interface PhasePresentingProps {
  game: Game;
  player: Player;
  onLeave: () => void;
}

const PhasePresenting: React.FC<PhasePresentingProps> = ({ game, player, onLeave }) => {
  const [loading, setLoading] = useState(false);
  const {
    presentationOrder,
    currentPresenterIndex = 0,
    players,
    assignments,
    hostId,
  } = game;

  const isHost = player.id === hostId;

  if (!presentationOrder || !assignments) {
    return (
      <div className="text-center">
        <Spinner />
        <p className="mt-4 text-slate-400">Getting presentations ready...</p>
      </div>
    );
  }

  const presenterId = presentationOrder[currentPresenterIndex];
  
  if (!presenterId) {
      // This can happen if all presentations are done and state is about to change
      return (
        <div className="text-center w-full max-w-2xl mx-auto bg-slate-800 rounded-lg shadow-2xl p-8 space-y-6">
          <h2 className="text-4xl font-bold text-white">That's a wrap!</h2>
          <p className="text-slate-300 text-lg">Thanks for playing "Hear Me Out!".</p>
          <button onClick={onLeave} className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md text-lg font-semibold">
              Back to Lobby
          </button>
        </div>
      );
  }

  const presenter = players[presenterId];
  const assignment = assignments[presenterId];
  const originalAuthor = players[assignment.originalAuthorId];

  const isLastPresenter = currentPresenterIndex >= presentationOrder.length - 1;

  const handleNext = async () => {
    if (!isHost) return;
    setLoading(true);
    if (isLastPresenter) {
      await endGame(game.id);
    } else {
      await advancePresenter(game.id);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-800 rounded-lg shadow-2xl p-4 md:p-8 space-y-6">
      <div className="text-center bg-slate-900 p-4 rounded-lg">
        <p className="text-sm text-slate-400">Presenting the invention:</p>
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          {assignment.invention}
        </h2>
        <div className="text-xs text-slate-500 mt-2">
          <span>(Idea by: {originalAuthor.name})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-center">The Vision</h3>
          <div className="bg-slate-700 rounded-lg p-2 aspect-square">
            <img src={assignment.drawing} alt={`Drawing for ${assignment.invention}`} className="w-full h-full object-contain rounded-md" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-center">The Pitch</h3>
          <div className="bg-slate-700 rounded-lg p-4 h-full min-h-[200px] md:aspect-square overflow-y-auto">
            <p className="text-slate-300 whitespace-pre-wrap">{assignment.pitch || "No pitch provided."}</p>
          </div>
        </div>
      </div>
      
      <div className="text-center pt-4">
        <p className="text-lg font-semibold">Presented by: {presenter.name}</p>
      </div>

      <div className="h-16 flex items-center justify-center">
        {isHost ? (
          <button
            onClick={handleNext}
            disabled={loading}
            className="w-full md:w-auto px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-lg transform hover:scale-105 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {loading ? <Spinner /> : (isLastPresenter ? 'Finish Game' : 'Next Presentation')}
          </button>
        ) : (
          <p className="text-slate-400">Waiting for the host, {players[hostId]?.name}, to continue...</p>
        )}
      </div>
    </div>
  );
};

export default PhasePresenting;
