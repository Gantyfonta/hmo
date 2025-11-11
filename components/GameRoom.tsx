
import React from 'react';
import useGame from '../hooks/useGame';
import { Player } from '../types';
import { GameState } from '../constants';
import PhaseLobby from './PhaseLobby';
import PhaseSubmitInvention from './PhaseSubmitInvention';
import PhaseDrawAndPitch from './PhaseDrawAndPitch';
import Spinner from './Spinner';

interface GameRoomProps {
  gameId: string;
  player: Player;
  onLeave: () => void;
}

const GameRoom: React.FC<GameRoomProps> = ({ gameId, player, onLeave }) => {
  const { game, loading, error } = useGame(gameId);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner />
        <p className="mt-4 text-slate-400">Joining game room...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{error}</p>
        <button onClick={onLeave} className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md">
          Back to Lobby
        </button>
      </div>
    );
  }

  if (!game) {
    return <div className="text-center text-slate-400">Game not found.</div>;
  }
  
  const renderGamePhase = () => {
    switch (game.gameState) {
      case GameState.Lobby:
        return <PhaseLobby game={game} player={player} onLeave={onLeave} />;
      case GameState.SubmittingInventions:
        return <PhaseSubmitInvention game={game} player={player} />;
      case GameState.DrawingAndPitching:
        return <PhaseDrawAndPitch game={game} player={player} />;
      // ... other phases would go here
      default:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold">Game Over!</h2>
            <p>Thanks for playing!</p>
            <button onClick={onLeave} className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md">Play Again</button>
          </div>
        )
    }
  };

  return <div className="w-full max-w-5xl animate-fade-in">{renderGamePhase()}</div>;
};

export default GameRoom;
