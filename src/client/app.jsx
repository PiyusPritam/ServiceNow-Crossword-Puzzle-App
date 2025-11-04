import React, { useState, useEffect } from 'react';
import GameSetup from './components/GameSetup.jsx';
import GameBoard from './components/GameBoard.jsx';
import PlayerProfile from './components/PlayerProfile.jsx';
import './app.css';

export default function App() {
  const [gameState, setGameState] = useState('setup'); // setup, playing, paused, complete
  const [currentGame, setCurrentGame] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const handleGameStart = (gameData) => {
    console.log('App: Starting game with data:', gameData);
    setCurrentGame(gameData);
    setGameState('playing');
  };

  const handleGameEnd = (results) => {
    console.log('App: Game ended with results:', results);
    // Instead of showing a completion screen, go directly back to setup
    handleBackToSetup();
  };

  const handleBackToSetup = () => {
    console.log('App: Going back to setup');
    setGameState('setup');
    setCurrentGame(null);
    setCurrentPlayer(null);
  };

  return (
    <div className="crossword-app">
      <main className="app-main">
        {gameState === 'setup' && (
          <GameSetup onGameStart={handleGameStart} />
        )}
        
        {gameState === 'playing' && (
          <GameBoard 
            game={currentGame}
            onGameEnd={handleGameEnd}
            currentPlayer={currentPlayer}
            setCurrentPlayer={setCurrentPlayer}
            onBackToSetup={handleBackToSetup}
          />
        )}

        {gameState === 'complete' && (
          <div className="game-complete">
            <h2>Game Complete!</h2>
            <div className="complete-actions">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setGameState('setup');
                  setCurrentGame(null);
                  setCurrentPlayer(null);
                }}
              >
                Start New Game
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 ServiceNow Crossword Challenge - Built with ServiceNow Platform</p>
      </footer>
    </div>
  );
}