import React, { useState, useEffect, useCallback } from 'react';
import { GameService } from '../services/GameService.js';
import { QuestionService } from '../services/QuestionService.js';
import './GameBoard.css';

export default function GameBoard({ game, onGameEnd, currentPlayer, setCurrentPlayer, onBackToSetup }) {
  const [gameService] = useState(() => new GameService());
  const [questionService] = useState(() => new QuestionService());
  
  const [crosswordData, setCrosswordData] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState(0);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showPowerUps, setShowPowerUps] = useState(false);
  const [autoFilledWords, setAutoFilledWords] = useState(new Set());
  const [gameComplete, setGameComplete] = useState(false);
  const [completionStats, setCompletionStats] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [cumulativeXP, setCumulativeXP] = useState(0);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);

  useEffect(() => {
    initializeGame();
  }, [game]);

  const getCurrentUserId = () => {
    if (window.g_user && window.g_user.userID) return window.g_user.userID;
    if (window.g_user && window.g_user.sys_id) return window.g_user.sys_id;
    if (window.NOW && window.NOW.user_id) return window.NOW.user_id;
    return 'guest_user_' + Date.now();
  };

  const initializeGame = async () => {
    try {
      setLoading(true);
      
      // Carry over cumulative XP from previous games
      const startingXP = game.cumulativeXP || 0;
      const startingLevel = game.playerLevel || 1;
      
      console.log('Initializing game - Starting XP:', startingXP, 'Starting Level:', startingLevel);
      
      const localPlayers = game.players.map((player, i) => ({
        sys_id: 'local_player_' + i,
        player_name: player.name,
        avatar: player.avatar,
        avatarIcon: player.avatarIcon,
        player_order: i,
        score: 0,
        level: startingLevel,
        experience_points: startingXP,
        coins: 100,
        current_streak: 0,
        best_streak: 0,
        correct_answers: 0,
        incorrect_answers: 0
      }));
      
      setPlayers(localPlayers);
      setCurrentPlayer(localPlayers[0]);
      setCurrentLevel(startingLevel);
      setCumulativeXP(startingXP);
      
      const gridData = questionService.generateCrosswordGrid(startingLevel);
      setCrosswordData(gridData);
      
      const difficulty = gridData.difficulty || 'easy';
      setMessage(`🎮 Level ${startingLevel} crossword loaded! (${difficulty.toUpperCase()}) - XP: ${startingXP}`);
      setTimeout(() => setMessage(''), 3000);

      setLoading(false);
    } catch (error) {
      console.error('Error initializing game:', error);
      setMessage('Error initializing game: ' + error.message);
      setLoading(false);
    }
  };

  const handleCellClick = useCallback((row, col) => {
    if (!crosswordData || gameComplete || showLevelUpAnimation) return;

    const cell = crosswordData.grid[row][col];
    if (!cell || cell === '') return;

    setSelectedCell({ row, col });

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

    const newSelectedWord = acrossWord || downWord;
    setSelectedWord(newSelectedWord);
  }, [crosswordData, gameComplete, showLevelUpAnimation]);

  const handleKeyPress = useCallback((event) => {
    if (!selectedCell || !selectedWord || gameComplete || showLevelUpAnimation) return;

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

        if (currentAnswer.length + 1 < selectedWord.length) {
          if (selectedWord.direction === 'across') {
            setSelectedCell({ row: selectedCell.row, col: selectedCell.col + 1 });
          } else {
            setSelectedCell({ row: selectedCell.row + 1, col: selectedCell.col });
          }
        }
      }
    }
  }, [selectedCell, selectedWord, userAnswers, gameComplete, showLevelUpAnimation]);

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

  const autoFillCorrectAnswer = (word, correctAnswer) => {
    const wordKey = `${word.number}-${word.direction}`;
    setAutoFilledWords(prev => new Set([...prev, wordKey]));
    
    let currentIndex = 0;
    const fillInterval = setInterval(() => {
      if (currentIndex < correctAnswer.length) {
        setUserAnswers(prev => ({
          ...prev,
          [wordKey]: correctAnswer.substring(0, currentIndex + 1)
        }));
        currentIndex++;
      } else {
        clearInterval(fillInterval);
        setTimeout(() => {
          setMessage(`✅ Answer revealed: ${correctAnswer}`);
          setTimeout(() => setMessage(''), 2000);
        }, 500);
      }
    }, 150);
  };

  // FIXED: Check for level up immediately when XP increases
  const checkForLevelUp = (newTotalXP) => {
    console.log('=== CHECKING FOR LEVEL UP ===');
    console.log('Current Level:', currentLevel);
    console.log('Current Total XP:', newTotalXP);
    
    const levelInfo = questionService.calculateLevel(newTotalXP);
    console.log('Calculated Level Info:', levelInfo);
    
    // FIXED: Simply check if calculated level is higher than current level
    if (levelInfo.level > currentLevel) {
      console.log('LEVEL UP DETECTED!', currentLevel, '->', levelInfo.level);
      
      setLevelUpData({
        oldLevel: currentLevel,
        newLevel: levelInfo.level,
        totalXP: newTotalXP
      });
      setShowLevelUpAnimation(true);
      
      // Auto-advance level after animation
      setTimeout(() => {
        setCurrentLevel(levelInfo.level);
        setShowLevelUpAnimation(false);
        setLevelUpData(null);
        
        // Update player level
        const updatedPlayer = {
          ...currentPlayer,
          level: levelInfo.level,
          experience_points: newTotalXP
        };
        setCurrentPlayer(updatedPlayer);
        
        // Award level-up bonus coins
        const levelUpBonus = 100;
        updatedPlayer.coins = (updatedPlayer.coins || 100) + levelUpBonus;
        setCurrentPlayer(updatedPlayer);
        
        setMessage(`🚀 Welcome to Level ${levelInfo.level}! +${levelUpBonus} bonus coins!`);
        setTimeout(() => setMessage(''), 4000);
      }, 3000); // 3 second animation
      
      return true;
    }
    
    console.log('No level up needed');
    return false;
  };

  const checkGameCompletion = (updatedAnswers, newTotalXP) => {
    if (questionService.isGameComplete(updatedAnswers, crosswordData.clues)) {
      // Calculate completion stats
      const totalQuestions = [...(crosswordData.clues.across || []), ...(crosswordData.clues.down || [])].length;
      const correctAnswers = currentPlayer.correct_answers || 0;
      const incorrectAnswers = currentPlayer.incorrect_answers || 0;
      const totalScore = currentPlayer.score || 0;
      const totalCoins = currentPlayer.coins || 0;
      
      // Check current level info
      const levelInfo = questionService.calculateLevel(newTotalXP);
      console.log('Game completion - Level info:', levelInfo);
      
      const stats = {
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        totalScore,
        totalCoins,
        currentXP: newTotalXP,
        levelInfo,
        currentLevel: currentLevel, // Use the current level from state
        currentDifficulty: crosswordData.difficulty || 'easy'
      };
      
      setCompletionStats(stats);
      setGameComplete(true);
      setSelectedCell(null);
      setSelectedWord(null);
      
      setMessage('🎊 Crossword Complete! Ready for next challenge!');
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
      console.log('=== SUBMITTING ANSWER ===');
      console.log('Selected word:', selectedWord);
      console.log('User answer:', userAnswer);
      console.log('Correct answer:', selectedWord.answer);
      
      const isCorrect = questionService.validateAnswer(userAnswer, selectedWord.answer);
      const difficulty = selectedWord.difficulty || crosswordData.difficulty || 'easy';
      const points = questionService.calculatePoints(difficulty, isCorrect);
      const experience = questionService.calculateExperience(isCorrect, difficulty);
      
      console.log('Answer correct:', isCorrect);
      console.log('Points earned:', points);
      console.log('XP earned:', experience);
      
      // Calculate new cumulative XP
      const newTotalXP = cumulativeXP + experience;
      console.log('Old XP:', cumulativeXP, 'New XP:', newTotalXP);
      setCumulativeXP(newTotalXP);
      
      const updatedPlayer = {
        ...currentPlayer,
        score: (currentPlayer.score || 0) + points,
        experience_points: newTotalXP, // Use cumulative XP
        correct_answers: isCorrect ? (currentPlayer.correct_answers || 0) + 1 : (currentPlayer.correct_answers || 0),
        incorrect_answers: !isCorrect ? (currentPlayer.incorrect_answers || 0) + 1 : (currentPlayer.incorrect_answers || 0),
        current_streak: isCorrect ? (currentPlayer.current_streak || 0) + 1 : 0
      };

      const earnedCoins = questionService.calculateCoins(points, updatedPlayer.current_streak);
      updatedPlayer.coins = (currentPlayer.coins || 100) + earnedCoins;
      updatedPlayer.best_streak = Math.max(updatedPlayer.best_streak || 0, updatedPlayer.current_streak);

      setCurrentPlayer(updatedPlayer);
      
      const updatedPlayers = players.map(p => 
        p.sys_id === currentPlayer.sys_id ? updatedPlayer : p
      );
      setPlayers(updatedPlayers);

      if (isCorrect) {
        setMessage(`🎉 Correct! +${points} points, +${experience} XP, +${earnedCoins} coins`);
        
        // FIXED: Check for level up immediately after earning XP
        const leveledUp = checkForLevelUp(newTotalXP);
        
        if (!leveledUp) {
          // Check if game is complete after this correct answer (only if no level up)
          const newAnswers = { ...userAnswers };
          setTimeout(() => {
            checkGameCompletion(newAnswers, newTotalXP);
          }, 1000);
          
          // Move to next player after correct answer
          const nextPlayerIndex = (currentPlayerTurn + 1) % players.length;
          setCurrentPlayerTurn(nextPlayerIndex);
          setCurrentPlayer(updatedPlayers[nextPlayerIndex]);
          
          setTimeout(() => {
            setSelectedCell(null);
            setSelectedWord(null);
            if (!questionService.isGameComplete(newAnswers, crosswordData.clues)) {
              setMessage('');
            }
          }, 2000);
        }
        
      } else {
        setMessage(`❌ Incorrect! The correct answer is: ${selectedWord.answer}`);
        
        setTimeout(() => {
          autoFillCorrectAnswer(selectedWord, selectedWord.answer);
          
          setTimeout(() => {
            const nextPlayerIndex = (currentPlayerTurn + 1) % players.length;
            setCurrentPlayerTurn(nextPlayerIndex);
            setCurrentPlayer(updatedPlayers[nextPlayerIndex]);
            
            setSelectedCell(null);
            setSelectedWord(null);
          }, selectedWord.answer.length * 150 + 1000);
          
        }, 1500);
      }

    } catch (error) {
      console.error('Error submitting answer:', error);
      setMessage('Error submitting answer: ' + error.message);
    }
  };

  const continueGame = () => {
    // Always continue with current level and cumulative XP
    startNextCrossword(currentLevel, cumulativeXP);
  };

  const startNextCrossword = (level, totalXP) => {
    console.log('Starting next crossword - Level:', level, 'Total XP:', totalXP);
    
    const gameConfig = {
      ...game,
      playerLevel: level,
      cumulativeXP: totalXP,
      players: players.map(p => ({
        ...p,
        level: level,
        experience_points: totalXP
      }))
    };
    
    // Reset game state for next crossword
    setGameComplete(false);
    setCompletionStats(null);
    setUserAnswers({});
    setAutoFilledWords(new Set());
    setCurrentPlayerTurn(0);
    setSelectedCell(null);
    setSelectedWord(null);
    
    // Generate new crossword for the level
    setLoading(true);
    setTimeout(() => {
      const gridData = questionService.generateCrosswordGrid(level);
      setCrosswordData(gridData);
      
      const difficulty = gridData.difficulty || 'easy';
      setMessage(`🎮 Level ${level} - New crossword loaded! (${difficulty.toUpperCase()}) - Total XP: ${totalXP}`);
      setTimeout(() => setMessage(''), 3000);
      
      setLoading(false);
    }, 500);
  };

  const usePowerUp = async (powerUp) => {
    const cost = { hint: 20, retry: 40 };

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
        
        case 'retry':
          if (selectedWord) {
            const wordKey = `${selectedWord.number}-${selectedWord.direction}`;
            const newAnswers = { ...userAnswers };
            newAnswers[wordKey] = '';
            setUserAnswers(newAnswers);
            
            setAutoFilledWords(prev => {
              const newSet = new Set(prev);
              newSet.delete(wordKey);
              return newSet;
            });
            
            setMessage('🔄 Answer cleared! Try again.');
          }
          break;
      }

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

  const getCellLetter = (row, col) => {
    if (!crosswordData) return '';

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
        break;
      }
    }
    
    return '';
  };

  const isWordAutoFilled = (clue) => {
    const wordKey = `${clue.number}-${clue.direction}`;
    return autoFilledWords.has(wordKey);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (loading) {
    return (
      <div className="game-loading">
        <div className="loading-spinner"></div>
        <p>Loading Level {currentLevel} ServiceNow crossword...</p>
        <p>XP: {cumulativeXP}</p>
      </div>
    );
  }

  if (!crosswordData) {
    return <div className="error-message">Failed to load crossword data.</div>;
  }

  // Level Up Animation Screen
  if (showLevelUpAnimation && levelUpData) {
    return (
      <div className="level-up-screen">
        <div className="level-up-container">
          <div className="level-up-animation">
            <div className="level-up-icon">🚀</div>
            <h1 className="level-up-title">LEVEL UP!</h1>
            <div className="level-transition">
              <div className="old-level">Level {levelUpData.oldLevel}</div>
              <div className="level-arrow">→</div>
              <div className="new-level">Level {levelUpData.newLevel}</div>
            </div>
            <p className="level-up-message">Congratulations! You've reached Level {levelUpData.newLevel}!</p>
            <div className="level-up-xp">Total XP: {levelUpData.totalXP}</div>
          </div>
        </div>
      </div>
    );
  }

  // Game Completion Screen
  if (gameComplete && completionStats) {
    const currentLevelInfo = questionService.calculateLevel(completionStats.currentXP);
    const buttonText = `🎮 Continue Level ${currentLevel}`;
      
    return (
      <div className="game-complete-screen">
        <div className="completion-container">
          <div className="completion-header">
            <h1>🎊 Crossword Complete!</h1>
          </div>

          <div className="completion-stats">
            <div className="stats-grid">
              <div className="stat-card score-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <h3>Total Score</h3>
                  <div className="stat-value">{completionStats.totalScore}</div>
                </div>
              </div>

              <div className="stat-card coins-card">
                <div className="stat-icon">🪙</div>
                <div className="stat-info">
                  <h3>Coins Earned</h3>
                  <div className="stat-value">{completionStats.totalCoins}</div>
                </div>
              </div>

              <div className="stat-card xp-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <h3>Total XP</h3>
                  <div className="stat-value">{completionStats.currentXP} XP</div>
                </div>
              </div>

              <div className="stat-card level-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>Current Level</h3>
                  <div className="stat-value">Level {currentLevel}</div>
                </div>
              </div>
            </div>

            <div className="accuracy-stats">
              <h3>Performance Summary</h3>
              <div className="accuracy-grid">
                <div className="accuracy-item correct">
                  <span className="accuracy-icon">✅</span>
                  <span>Correct: {completionStats.correctAnswers}</span>
                </div>
                <div className="accuracy-item incorrect">
                  <span className="accuracy-icon">❌</span>
                  <span>Incorrect: {completionStats.incorrectAnswers}</span>
                </div>
                <div className="accuracy-item difficulty">
                  <span className="accuracy-icon">🎯</span>
                  <span>Difficulty: {completionStats.currentDifficulty.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="progress-bar-container">
              <h4>Progress to Level {currentLevel + 1}</h4>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${(currentLevelInfo.xpProgress / currentLevelInfo.xpNeeded) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="progress-text">
                {currentLevelInfo.xpProgress} / {currentLevelInfo.xpNeeded} XP 
                {currentLevel >= 10 ? ' (MAX LEVEL!)' : ` to Level ${currentLevel + 1}`}
              </div>
            </div>
          </div>

          <div className="completion-actions">
            <button 
              className="btn btn-primary btn-lg"
              onClick={continueGame}
            >
              {buttonText}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={onBackToSetup}
            >
              🏠 Back to Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Current level info for display
  const levelInfo = questionService.calculateLevel(cumulativeXP);

  return (
    <div className="game-board fade-in">
      {/* Back Button and Header */}
      <div className="game-header-with-back">
        <button 
          className="btn-back"
          onClick={onBackToSetup}
          title="Back to Game Setup"
        >
          ← Back to Setup
        </button>
        
        <div className="game-header-compact">
          <div className="header-left">
            <h2 className="game-title">ServiceNow Crossword - Level {currentLevel}</h2>
            <div className="game-meta-horizontal">
              <span className={`difficulty-badge difficulty-${crosswordData.difficulty || 'easy'}`}>
                {(crosswordData.difficulty || 'easy').toUpperCase()}
              </span>
              <span className="meta-item">XP: {cumulativeXP}</span>
              <span className="meta-item">Player: {currentPlayer?.player_name}</span>
              {game.roomCode && (
                <span className="meta-item">Room: {game.roomCode}</span>
              )}
            </div>
          </div>
          
          <div className="header-right">
            <div className="player-profile-horizontal">
              <div className={`player-avatar-small avatar ${currentPlayer?.avatar || 'avatar1'}`}>
                <span className="avatar-icon">{currentPlayer?.avatarIcon || '👤'}</span>
              </div>
              <div className="player-stats-horizontal">
                <span className="stat-horizontal">
                  <span className="stat-icon">🏆</span>
                  <span className="stat-value">{currentLevel}</span>
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
      </div>

      {/* Message Display */}
      {message && (
        <div className="game-message">
          {message}
        </div>
      )}

      {/* TESTING: XP Debug Info */}
      <div className="xp-debug" style={{
        background: '#f0f8ff',
        border: '2px solid #4CAF50',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '0.9rem'
      }}>
        <strong>XP DEBUG:</strong> Total XP: {cumulativeXP} | Current Level: {currentLevel} | 
        Next Level XP: {levelInfo.xpForNextLevel} | Progress: {levelInfo.xpProgress}/{levelInfo.xpNeeded}
        {levelInfo.level > currentLevel && (
          <span style={{color: 'red', fontWeight: 'bold'}}> → LEVEL UP AVAILABLE!</span>
        )}
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

                const displayLetter = getCellLetter(rowIndex, colIndex);
                const isEmpty = cell === '';
                const isWordCell = cell === '_';

                const isAutoFilled = crosswordData.clues.across.concat(crosswordData.clues.down).some(clue => {
                  if (isWordAutoFilled(clue)) {
                    if (clue.direction === 'across') {
                      return rowIndex === clue.startRow && 
                             colIndex >= clue.startCol && 
                             colIndex < clue.startCol + clue.length;
                    } else {
                      return colIndex === clue.startCol && 
                             rowIndex >= clue.startRow && 
                             rowIndex < clue.startRow + clue.length;
                    }
                  }
                  return false;
                });

                return (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className={`grid-cell ${isEmpty ? 'empty' : 'filled'} ${isWordCell ? 'word-cell' : ''} ${
                      isSelected ? 'selected' : ''
                    } ${isInSelectedWord ? 'highlighted' : ''} ${isAutoFilled ? 'auto-filled' : ''}`}
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
                  const isAutoFilledWord = isWordAutoFilled(clue);
                  
                  return (
                    <div 
                      key={clue.number} 
                      className={`clue ${isSelected ? 'selected' : ''} ${isComplete ? 'complete' : ''} ${isAutoFilledWord ? 'auto-filled' : ''}`}
                      onClick={() => {
                        setSelectedWord(clue);
                        setSelectedCell({ row: clue.startRow, col: clue.startCol });
                      }}
                    >
                      <div className="clue-header">
                        <span className="clue-number">{clue.number}.</span>
                        <span className="clue-text">{clue.text}</span>
                        <span className="clue-progress">({userAnswer.length}/{clue.length})</span>
                        {isAutoFilledWord && <span className="auto-fill-indicator">🤖</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="clues-down">
                <h3>Down ({crosswordData.clues.down?.length || 0})</h3>
                {(crosswordData.clues.down || []).map(clue => {
                  const wordKey = `${clue.number}-down`;
                  const userAnswer = userAnswers[wordKey] || '';
                  const isComplete = userAnswer.length === clue.length;
                  const isSelected = selectedWord?.number === clue.number && selectedWord?.direction === 'down';
                  const isAutoFilledWord = isWordAutoFilled(clue);
                  
                  return (
                    <div 
                      key={clue.number} 
                      className={`clue ${isSelected ? 'selected' : ''} ${isComplete ? 'complete' : ''} ${isAutoFilledWord ? 'auto-filled' : ''}`}
                      onClick={() => {
                        setSelectedWord(clue);
                        setSelectedCell({ row: clue.startRow, col: clue.startCol });
                      }}
                    >
                      <div className="clue-header">
                        <span className="clue-number">{clue.number}.</span>
                        <span className="clue-text">{clue.text}</span>
                        <span className="clue-progress">({userAnswer.length}/{clue.length})</span>
                        {isAutoFilledWord && <span className="auto-fill-indicator">🤖</span>}
                      </div>
                    </div>
                  );
                })}
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

          {/* XP Progress */}
          <div className="xp-progress-card">
            <h3>Level {currentLevel} Progress</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(levelInfo.xpProgress / levelInfo.xpNeeded) * 100}%` 
                }}
              ></div>
            </div>
            <div className="progress-text">
              {levelInfo.xpProgress} / {levelInfo.xpNeeded} XP to Level {currentLevel + 1}
              {currentLevel >= 10 && ' (MAX LEVEL!)'}
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
                      <span className="avatar-icon">{player.avatarIcon || '👤'}</span>
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