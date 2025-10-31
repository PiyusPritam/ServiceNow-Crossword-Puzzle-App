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
    setCurrentGame(gameData);
    setGameState('playing');
  };

  const handleGameEnd = (results) => {
    setGameState('complete');
  };

  return (
    <div className="crossword-app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="servicenow-logo">ServiceNow</span>
            <span className="game-title">Crossword Challenge</span>
          </h1>
          <div className="header-nav">
            {currentPlayer && (
              <PlayerProfile player={currentPlayer} />
            )}
          </div>
        </div>
      </header>

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
          />
        )}

        {gameState === 'complete' && (
          <div className="game-complete">
            <h2>Game Complete!</h2>
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
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 ServiceNow Crossword Challenge - Built with ServiceNow Platform</p>
      </footer>
    </div>
  );
}