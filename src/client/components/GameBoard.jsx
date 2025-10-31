import React, { useState, useEffect, useCallback } from 'react';
import { GameService } from '../services/GameService.js';
import { QuestionService } from '../services/QuestionService.js';
import './GameBoard.css';

export default function GameBoard({ game, onGameEnd, currentPlayer, setCurrentPlayer }) {
  const [gameService] = useState(() => new GameService());
  const [questionService] = useState(() => new QuestionService());
  
  const [crosswordData, setCrosswordData] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState(0);
  const [players, setPlayers] = useState([]);
  const [gameSession, setGameSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [coins, setCoins] = useState(0);
  const [showPowerUps, setShowPowerUps] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, [game]);

  const getCurrentUserId = () => {
    // Try different ways to get the current user ID in ServiceNow
    if (window.g_user && window.g_user.userID) {
      return window.g_user.userID;
    } else if (window.g_user && window.g_user.sys_id) {
      return window.g_user.sys_id;
    } else if (window.NOW && window.NOW.user_id) {
      return window.NOW.user_id;
    }
    // Fallback to a default user ID for testing
    return 'guest_user_' + Date.now();
  };

  const initializeGame = async () => {
    try {
      setLoading(true);
      console.log('Initializing game with config:', game);
      
      const currentUserId = getCurrentUserId();
      console.log('Current user ID:', currentUserId);
      
      // Create local players first
      const localPlayers = game.players.map((player, i) => ({
        sys_id: 'local_player_' + i,
        player_name: player.name,
        avatar: player.avatar,
        player_order: i,
        score: 0,
        level: 1,
        experience_points: 0,
        coins: 100,
        current_streak: 0,
        best_streak: 0,
        correct_answers: 0,
        incorrect_answers: 0
      }));
      
      console.log('Created players:', localPlayers);
      setPlayers(localPlayers);
      setCurrentPlayer(localPlayers[0]);
      
      // Use sample questions WITHOUT difficulty filter to ensure we get all questions
      console.log('Loading ALL sample questions...');
      const sampleQuestions = questionService.getSampleQuestions(); // NO difficulty parameter!
      console.log('Sample questions loaded:', sampleQuestions);
      
      const gridData = questionService.generateCrosswordGrid(sampleQuestions);
      console.log('Generated grid data:', gridData);
      setCrosswordData(gridData);
      
      setMessage('🎮 Game loaded with sample ServiceNow questions!');
      setTimeout(() => setMessage(''), 3000);

      setLoading(false);
    } catch (error) {
      console.error('Error initializing game:', error);
      setMessage('Error initializing game: ' + error.message);
      setLoading(false);
    }
  };

  const handleCellClick = useCallback((row, col) => {
    if (!crosswordData) return;

    const cell = crosswordData.grid[row][col];
    if (!cell || cell === '') return; // Only allow clicking on word cells (marked with '_')

    setSelectedCell({ row, col });

    // Find the word that contains this cell
    const findWord = (clues) => {
      return clues.find(clue => {
        if (clue.direction === 'across') {
          return row === clue.startRow && 
                 col >= clue.startCol && 
                 col < clue.startCol + clue.length;
        } else {
          return col === clue.startCol && 
                 row >= clue.startRow && 
                 row < clue.startRow + clue.length;
        }
      });
    };

    const acrossWord = findWord(crosswordData.clues.across || []);
    const downWord = findWord(crosswordData.clues.down || []);

    // Prefer across over down, or toggle if same cell clicked again
    let newSelectedWord = acrossWord || downWord;
    if (selectedWord && newSelectedWord && selectedWord.number === newSelectedWord.number && selectedWord.direction === newSelectedWord.direction) {
      // Toggle between across and down if both exist
      newSelectedWord = (selectedWord.direction === 'across' && downWord) ? downWord : acrossWord || downWord;
    }

    console.log('Selected word:', newSelectedWord); // Debug log
    setSelectedWord(newSelectedWord);
  }, [crosswordData, selectedWord]);

  const handleKeyPress = useCallback((event) => {
    if (!selectedCell || !selectedWord) return;

    const { key } = event;

    if (key === 'Escape') {
      setSelectedCell(null);
      setSelectedWord(null);
      return;
    }

    if (key === 'Enter') {
      submitAnswer();
      return;
    }

    if (key === 'Backspace') {
      // Move to previous cell and clear
      const newAnswers = { ...userAnswers };
      const wordKey = `${selectedWord.number}-${selectedWord.direction}`;
      
      if (newAnswers[wordKey]) {
        newAnswers[wordKey] = newAnswers[wordKey].slice(0, -1);
        setUserAnswers(newAnswers);
      }
      return;
    }

    if (key === 'Tab') {
      event.preventDefault();
      moveToNextWord();
      return;
    }

    // Handle letter input
    if (/^[A-Za-z0-9]$/.test(key)) {
      const letter = key.toUpperCase();
      const wordKey = `${selectedWord.number}-${selectedWord.direction}`;
      
      const newAnswers = { ...userAnswers };
      const currentAnswer = newAnswers[wordKey] || '';
      
      if (currentAnswer.length < selectedWord.length) {
        newAnswers[wordKey] = currentAnswer + letter;
        setUserAnswers(newAnswers);

        // Auto-advance to next cell within word
        if (currentAnswer.length + 1 < selectedWord.length) {
          // Move to next cell in current word
          if (selectedWord.direction === 'across') {
            setSelectedCell({ row: selectedCell.row, col: selectedCell.col + 1 });
          } else {
            setSelectedCell({ row: selectedCell.row + 1, col: selectedCell.col });
          }
        }
      }
    }
  }, [selectedCell, selectedWord, userAnswers]);

  const moveToNextWord = () => {
    if (!crosswordData) return;

    const allClues = [...(crosswordData.clues.across || []), ...(crosswordData.clues.down || [])];
    const currentIndex = allClues.findIndex(clue => 
      clue.number === selectedWord?.number && clue.direction === selectedWord?.direction
    );

    if (currentIndex >= 0 && currentIndex < allClues.length - 1) {
      const nextClue = allClues[currentIndex + 1];
      setSelectedWord(nextClue);
      setSelectedCell({ row: nextClue.startRow, col: nextClue.startCol });
    }
  };

  const submitAnswer = async () => {
    if (!selectedWord) return;

    const wordKey = `${selectedWord.number}-${selectedWord.direction}`;
    const userAnswer = userAnswers[wordKey] || '';

    if (!userAnswer.trim()) {
      setMessage('Please enter an answer before submitting.');
      return;
    }

    try {
      const isCorrect = questionService.validateAnswer(userAnswer, selectedWord.answer);
      const points = questionService.calculatePoints(game.difficulty, isCorrect);
      const experience = questionService.calculateExperience(isCorrect);
      
      console.log('Answer validation:', { userAnswer, correctAnswer: selectedWord.answer, isCorrect });
      
      // Update current player stats
      const updatedPlayer = {
        ...currentPlayer,
        score: (currentPlayer.score || 0) + points,
        experience_points: (currentPlayer.experience_points || 0) + experience,
        correct_answers: isCorrect ? (currentPlayer.correct_answers || 0) + 1 : (currentPlayer.correct_answers || 0),
        incorrect_answers: !isCorrect ? (currentPlayer.incorrect_answers || 0) + 1 : (currentPlayer.incorrect_answers || 0),
        current_streak: isCorrect ? (currentPlayer.current_streak || 0) + 1 : 0
      };

      const earnedCoins = questionService.calculateCoins(points, updatedPlayer.current_streak);
      updatedPlayer.coins = (currentPlayer.coins || 100) + earnedCoins;
      updatedPlayer.best_streak = Math.max(updatedPlayer.best_streak || 0, updatedPlayer.current_streak);

      console.log('Updated player stats:', updatedPlayer);

      setCurrentPlayer(updatedPlayer);
      
      // Update players array
      const updatedPlayers = players.map(p => 
        p.sys_id === currentPlayer.sys_id ? updatedPlayer : p
      );
      setPlayers(updatedPlayers);

      // Show result message
      if (isCorrect) {
        setMessage(`🎉 Correct! +${points} points, +${earnedCoins} coins`);
      } else {
        setMessage(`❌ Incorrect. The answer was: ${selectedWord.answer}`);
      }

      // Move to next player
      const nextPlayerIndex = (currentPlayerTurn + 1) % players.length;
      setCurrentPlayerTurn(nextPlayerIndex);
      setCurrentPlayer(updatedPlayers[nextPlayerIndex]);

      // Clear selection
      setTimeout(() => {
        setSelectedCell(null);
        setSelectedWord(null);
        setMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error submitting answer:', error);
      setMessage('Error submitting answer: ' + error.message);
    }
  };

  const usePowerUp = async (powerUp) => {
    const cost = {
      hint: 20,
      change_question: 30,
      retry: 40
    };

    if ((currentPlayer.coins || 0) < cost[powerUp]) {
      setMessage(`💰 Not enough coins! Need ${cost[powerUp]} coins.`);
      return;
    }

    try {
      switch (powerUp) {
        case 'hint':
          if (selectedWord) {
            const wordKey = `${selectedWord.number}-${selectedWord.direction}`;
            const currentAnswer = userAnswers[wordKey] || '';
            const nextLetter = selectedWord.answer[currentAnswer.length];
            
            if (nextLetter) {
              const newAnswers = { ...userAnswers };
              newAnswers[wordKey] = currentAnswer + nextLetter;
              setUserAnswers(newAnswers);
              setMessage(`💡 Hint used! Next letter: ${nextLetter}`);
            }
          }
          break;
        
        case 'change_question':
          setMessage('🔄 Question changed! (Feature coming soon)');
          break;
        
        case 'retry':
          if (selectedWord) {
            const wordKey = `${selectedWord.number}-${selectedWord.direction}`;
            const newAnswers = { ...userAnswers };
            newAnswers[wordKey] = '';
            setUserAnswers(newAnswers);
            setMessage('🔄 Answer cleared! Try again.');
          }
          break;
      }

      // Deduct coins
      const updatedPlayer = {
        ...currentPlayer,
        coins: (currentPlayer.coins || 0) - cost[powerUp]
      };

      setCurrentPlayer(updatedPlayer);
      setShowPowerUps(false);

    } catch (error) {
      console.error('Error using power-up:', error);
      setMessage('Error using power-up: ' + error.message);
    }
  };

  // Helper function to get the letter for any cell from all user answers
  const getCellLetter = (row, col) => {
    if (!crosswordData) return '';

    // Check all clues to see if this cell is part of any word
    const allClues = [...(crosswordData.clues.across || []), ...(crosswordData.clues.down || [])];
    
    for (const clue of allClues) {
      let isPartOfWord = false;
      let cellIndex = -1;
      
      if (clue.direction === 'across') {
        if (row === clue.startRow && col >= clue.startCol && col < clue.startCol + clue.length) {
          isPartOfWord = true;
          cellIndex = col - clue.startCol;
        }
      } else {
        if (col === clue.startCol && row >= clue.startRow && row < clue.startRow + clue.length) {
          isPartOfWord = true;
          cellIndex = row - clue.startRow;
        }
      }
      
      if (isPartOfWord) {
        const wordKey = `${clue.number}-${clue.direction}`;
        const userAnswer = userAnswers[wordKey] || '';
        if (cellIndex >= 0 && cellIndex < userAnswer.length) {
          return userAnswer[cellIndex];
        }
      }
    }
    
    return '';
  };

  // Event listener for keyboard input
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (loading) {
    return (
      <div className="game-loading">
        <div className="loading-spinner"></div>
        <p>Loading your ServiceNow crossword challenge...</p>
      </div>
    );
  }

  if (!crosswordData) {
    return <div className="error-message">Failed to load crossword data.</div>;
  }

  console.log('Rendering with crossword data:', crosswordData); // Debug log

  return (
    <div className="game-board fade-in">
      {/* Compact Horizontal Game Header */}
      <div className="game-header-compact">
        <div className="header-left">
          <h2 className="game-title">ServiceNow Crossword</h2>
          <div className="game-meta-horizontal">
            <span className={`difficulty-badge difficulty-${game.difficulty}`}>
              {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
            </span>
            <span className="meta-item">Turn: {currentPlayerTurn + 1}</span>
            <span className="meta-item">Player: {currentPlayer?.player_name}</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="player-profile-horizontal">
            <div className={`player-avatar-small avatar ${currentPlayer?.avatar || 'avatar1'}`}>
              {currentPlayer?.player_name?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <div className="player-stats-horizontal">
              <span className="stat-horizontal">
                <span className="stat-icon">🏆</span>
                <span className="stat-value">{currentPlayer?.level || 1}</span>
              </span>
              <span className="stat-horizontal">
                <span className="stat-icon">🪙</span>
                <span className="stat-value">{currentPlayer?.coins || 0}</span>
              </span>
              <span className="stat-horizontal">
                <span className="stat-icon">⭐</span>
                <span className="stat-value">{currentPlayer?.score || 0}</span>
              </span>
              <span className="stat-horizontal">
                <span className="stat-icon">🔥</span>
                <span className="stat-value">{currentPlayer?.current_streak || 0}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="game-message">
          {message}
        </div>
      )}

      {/* Debug Info */}
      <div className="debug-info" style={{ fontSize: '0.8rem', color: '#666', padding: '8px', background: '#f5f5f5', marginBottom: '8px', borderRadius: '4px' }}>
        <strong>Debug:</strong> Across: {crosswordData.clues.across?.length || 0}, Down: {crosswordData.clues.down?.length || 0}
        {selectedWord && <span> | Selected: {selectedWord.number}-{selectedWord.direction} ({selectedWord.answer})</span>}
        <span> | Answers: {Object.keys(userAnswers).length}</span>
      </div>

      {/* Main Game Content */}
      <div className="game-content">
        {/* Crossword Grid */}
        <div className="crossword-section">
          <div className="crossword-grid" style={{ gridTemplateRows: `repeat(${crosswordData.gridSize}, 1fr)`, gridTemplateColumns: `repeat(${crosswordData.gridSize}, 1fr)` }}>
            {crosswordData.grid.map((row, rowIndex) => 
              row.map((cell, colIndex) => {
                const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                const isInSelectedWord = selectedWord && (
                  (selectedWord.direction === 'across' && 
                   rowIndex === selectedWord.startRow && 
                   colIndex >= selectedWord.startCol && 
                   colIndex < selectedWord.startCol + selectedWord.length) ||
                  (selectedWord.direction === 'down' && 
                   colIndex === selectedWord.startCol && 
                   rowIndex >= selectedWord.startRow && 
                   rowIndex < selectedWord.startRow + selectedWord.length)
                );

                // Get the letter for this cell from ALL user answers (not just selected word)
                const displayLetter = getCellLetter(rowIndex, colIndex);

                const isEmpty = cell === '';
                const isWordCell = cell === '_';

                return (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className={`grid-cell ${isEmpty ? 'empty' : 'filled'} ${isWordCell ? 'word-cell' : ''} ${
                      isSelected ? 'selected' : ''
                    } ${isInSelectedWord ? 'highlighted' : ''}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    <span className="cell-content">
                      {displayLetter || (isWordCell ? '' : cell)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Clues and Controls */}
        <div className="game-sidebar">
          <div className="clues-section">
            <div className="clues-container">
              <div className="clues-across">
                <h3>Across ({crosswordData.clues.across?.length || 0})</h3>
                {(crosswordData.clues.across || []).map(clue => {
                  const wordKey = `${clue.number}-across`;
                  const userAnswer = userAnswers[wordKey] || '';
                  const isComplete = userAnswer.length === clue.length;
                  const isSelected = selectedWord?.number === clue.number && selectedWord?.direction === 'across';
                  
                  return (
                    <div 
                      key={clue.number} 
                      className={`clue ${isSelected ? 'selected' : ''} ${isComplete ? 'complete' : ''}`}
                      onClick={() => {
                        setSelectedWord(clue);
                        setSelectedCell({ row: clue.startRow, col: clue.startCol });
                      }}
                    >
                      <span className="clue-number">{clue.number}.</span>
                      <span className="clue-text">{clue.text}</span>
                      <span className="clue-progress">({userAnswer.length}/{clue.length})</span>
                    </div>
                  );
                })}
                {(!crosswordData.clues.across || crosswordData.clues.across.length === 0) && (
                  <p className="no-clues">No across clues available</p>
                )}
              </div>

              <div className="clues-down">
                <h3>Down ({crosswordData.clues.down?.length || 0})</h3>
                {(crosswordData.clues.down || []).map(clue => {
                  const wordKey = `${clue.number}-down`;
                  const userAnswer = userAnswers[wordKey] || '';
                  const isComplete = userAnswer.length === clue.length;
                  const isSelected = selectedWord?.number === clue.number && selectedWord?.direction === 'down';
                  
                  return (
                    <div 
                      key={clue.number} 
                      className={`clue ${isSelected ? 'selected' : ''} ${isComplete ? 'complete' : ''}`}
                      onClick={() => {
                        setSelectedWord(clue);
                        setSelectedCell({ row: clue.startRow, col: clue.startCol });
                      }}
                    >
                      <span className="clue-number">{clue.number}.</span>
                      <span className="clue-text">{clue.text}</span>
                      <span className="clue-progress">({userAnswer.length}/{clue.length})</span>
                    </div>
                  );
                })}
                {(!crosswordData.clues.down || crosswordData.clues.down.length === 0) && (
                  <p className="no-clues">No down clues available</p>
                )}
              </div>
            </div>
          </div>

          {/* Game Controls */}
          <div className="game-controls">
            <div className="primary-controls">
              <button 
                className="btn btn-primary"
                onClick={submitAnswer}
                disabled={!selectedWord || !userAnswers[`${selectedWord?.number}-${selectedWord?.direction}`]?.trim()}
              >
                Submit Answer
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => setShowPowerUps(!showPowerUps)}
              >
                Power-Ups ({currentPlayer?.coins || 0} 🪙)
              </button>
            </div>

            {showPowerUps && (
              <div className="power-ups-menu">
                <h4>Power-Ups</h4>
                <button 
                  className="btn btn-sm btn-accent"
                  onClick={() => usePowerUp('hint')}
                  disabled={(currentPlayer?.coins || 0) < 20}
                >
                  Hint (20 🪙)
                </button>
                <button 
                  className="btn btn-sm btn-accent"
                  onClick={() => usePowerUp('change_question')}
                  disabled={(currentPlayer?.coins || 0) < 30}
                >
                  Change Question (30 🪙)
                </button>
                <button 
                  className="btn btn-sm btn-accent"
                  onClick={() => usePowerUp('retry')}
                  disabled={(currentPlayer?.coins || 0) < 40}
                >
                  Retry (40 🪙)
                </button>
              </div>
            )}

            <div className="secondary-controls">
              <button className="btn btn-warning" onClick={() => onGameEnd()}>
                End Game
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="leaderboard">
            <h3>Leaderboard</h3>
            {players
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .map((player, index) => (
                <div 
                  key={player.sys_id || index} 
                  className={`player-rank ${currentPlayer?.sys_id === player.sys_id ? 'current' : ''}`}
                >
                  <div className="rank-info">
                    <span className="rank">#{index + 1}</span>
                    <div className={`player-avatar avatar ${player.avatar || 'avatar1'}`}>
                      {player.player_name?.charAt(0)?.toUpperCase() || (index + 1)}
                    </div>
                  </div>
                  <div className="player-info">
                    <span className="player-name">{player.player_name}</span>
                    <span className="player-score">{player.score || 0} pts</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}