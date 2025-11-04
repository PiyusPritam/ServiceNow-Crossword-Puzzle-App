import React, { useState, useEffect } from 'react';
import GameSetup from './components/GameSetup.jsx';
import GameBoard from './components/GameBoard.jsx';
import PlayerProfile from './components/PlayerProfile.jsx';
import './app.css';

export default function App() {
  const [gameState, setGameState] = useState('setup'); // setup, playing, paused, complete
  const [currentGame, setCurrentGame] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  // Navigate to ServiceNow homepage
  const navigateToHome = () => {
    if (window.location.hostname.includes('service-now.com')) {
      // On ServiceNow instance, go to main page
      window.location.href = '/nav_to.do?uri=%2Fhome.do';
    } else {
      // For development/local, just reload or go to a default page
      window.location.href = '/';
    }
  };

  const handleGameStart = (gameData) => {
    setCurrentGame(gameData);
    setGameState('playing');
  };

  const handleGameEnd = (results) => {
    setGameState('complete');
  };

  const handleBackToSetup = () => {
    setGameState('setup');
    setCurrentGame(null);
    setCurrentPlayer(null);
  };

  return (
    <div className="crossword-app">
      {/* Back to Home Button */}
      <div className="app-nav">
        <button 
          className="btn-home"
          onClick={navigateToHome}
          title="Back to ServiceNow Home"
        >
          🏠 ServiceNow Home
        </button>
      </div>

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
              <button 
                className="btn btn-secondary"
                onClick={navigateToHome}
              >
                Back to ServiceNow Home
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