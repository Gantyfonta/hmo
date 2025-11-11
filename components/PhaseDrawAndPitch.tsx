import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Game, Player, Assignment } from '../types';
import { submitDrawingAndPitch } from '../services/firebaseService';
import DrawingCanvas from './DrawingCanvas';
import Timer from './Timer';
import Spinner from './Spinner';

interface PhaseDrawAndPitchProps {
  game: Game;
  player: Player;
}

const PhaseDrawAndPitch: React.FC<PhaseDrawAndPitchProps> = ({ game, player }) => {
  const [pitch, setPitch] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<{ getImageData: () => string }>(null);

  const assignment = game.assignments?.[player.id];

  useEffect(() => {
    if (assignment?.drawing && assignment?.pitch) {
      setIsSubmitted(true);
    }
  }, [assignment]);

  const handleSubmit = useCallback(async () => {
    if (!canvasRef.current) return;
    setLoading(true);
    const drawingData = canvasRef.current.getImageData();
    await submitDrawingAndPitch(game.id, player.id, drawingData, pitch);
    setIsSubmitted(true);
    setLoading(false);
  }, [game.id, player.id, pitch]);
  
  if (!assignment) {
    return <div>Error: No assignment found for you.</div>;
  }
  
  // FIX: Explicitly type assignment object 'a' to avoid unknown type error.
  const submittedCount = game.assignments ? Object.values(game.assignments).filter((a: Assignment) => a.drawing).length : 0;
  const totalPlayers = Object.keys(game.players).length;

  if (isSubmitted) {
    return (
      <div className="text-center w-full max-w-2xl mx-auto bg-slate-800 rounded-lg shadow-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-white">Pitch Submitted!</h2>
        <p className="text-slate-300 text-lg">Nice work! Get ready for the presentation.</p>
        <div className="space-y-4 pt-4">
          <Spinner />
          <p className="text-slate-400">Waiting for other players to finish...</p>
          <div className="w-full bg-slate-700 rounded-full h-4">
             <div 
                className="bg-pink-600 h-4 rounded-full transition-all duration-500" 
                style={{ width: `${(submittedCount / totalPlayers) * 100}%` }}
             ></div>
          </div>
          <p className="text-sm text-slate-500">{submittedCount} of {totalPlayers} finished</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-slate-800 rounded-lg shadow-2xl p-4 md:p-8 space-y-4">
      <div className="bg-slate-900 p-4 rounded-lg text-center">
        <p className="text-sm text-slate-400">You need to draw and pitch:</p>
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          {assignment.invention}
        </h2>
      </div>

      <div className="flex justify-center">
        {game.roundEndTime && <Timer endTime={game.roundEndTime} onTimeUp={handleSubmit} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <h3 className="text-lg font-semibold">Draw It</h3>
            <DrawingCanvas ref={canvasRef} />
        </div>
        <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold">Pitch It</h3>
            <textarea
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Write your amazing sales pitch here..."
              className="flex-grow w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-base"
            />
        </div>
      </div>
       <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex justify-center items-center py-3 mt-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-lg transform hover:scale-105 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {loading ? <Spinner /> : 'I\'m Done!'}
        </button>
    </div>
  );
};

export default PhaseDrawAndPitch;
