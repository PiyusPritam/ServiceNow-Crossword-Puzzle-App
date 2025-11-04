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
  const [submittedAnswers, setSubmittedAnswers] = useState(new Set()); // Track submitted answers
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
  const [gameSessionId, setGameSessionId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('');
  const [isLoadingSavedGame, setIsLoadingSavedGame] = useState(false);

  useEffect(() => {
    console.log('🎮 GameBoard: Received game prop:', game);
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
      setLoadingProgress('🚀 Initializing quantum matrix...');
      console.log('🎯 GameBoard: Initializing game with config:', game);
      
      // Validate game object
      if (!game || !game.players || game.players.length === 0) {
        throw new Error('Invalid game configuration - missing players');
      }
      
      // Check if this is a saved game
      if (game.savedGameSessionId) {
        console.log('💾 This is a saved game, loading session:', game.savedGameSessionId);
        setIsLoadingSavedGame(true);
        setGameSessionId(game.savedGameSessionId);
        await loadSavedGameState(game.savedGameSessionId);
        return;
      }

      // This is a new game
      console.log('✨ This is a new game');
      setIsLoadingSavedGame(false);
      
      // Carry over cumulative XP from previous games
      const startingXP = game.cumulativeXP || 0;
      const startingLevel = game.playerLevel || 1;
      
      console.log('🎯 Initializing game - Starting XP:', startingXP, 'Starting Level:', startingLevel);
      
      setLoadingProgress('👥 Setting up neural operatives...');
      
      const localPlayers = game.players.map((player, i) => ({
        sys_id: 'local_player_' + i,
        player_name: player.name || `Player ${i + 1}`,
        avatar: player.avatar || 'avatar1',
        avatarIcon: player.avatarIcon || '👤',
        player_order: i,
        score: player.score || 0,
        level: startingLevel,
        experience_points: startingXP,
        coins: player.coins || 100,
        current_streak: player.current_streak || 0,
        best_streak: player.best_streak || 0,
        correct_answers: player.correct_answers || 0,
        incorrect_answers: player.incorrect_answers || 0
      }));
      
      console.log('👥 GameBoard: Initialized players:', localPlayers);
      
      setPlayers(localPlayers);
      setCurrentPlayer(localPlayers[0]);
      setCurrentLevel(startingLevel);
      setCumulativeXP(startingXP);
      
      setLoadingProgress('🧩 Generating crossword matrix...');
      
      // Generate crossword for new game
      const gridData = questionService.generateCrosswordGrid(startingLevel);
      setCrosswordData(gridData);
      
      const difficulty = gridData.difficulty || 'easy';
      setMessage(`🎮 Level ${startingLevel} quantum matrix loaded! (${difficulty.toUpperCase()}) - XP: ${startingXP}`);
      setTimeout(() => setMessage(''), 3000);

      setLoading(false);
    } catch (error) {
      console.error('❌ Error initializing game:', error);
      setMessage('Error initializing game: ' + error.message);
      setLoading(false);
      
      // Show error for 3 seconds then go back to setup
      setTimeout(() => {
        onBackToSetup();
      }, 3000);
    }
  };

  const loadSavedGameState = async (sessionId) => {
    try {
      console.log('💾 GameBoard: Loading saved game state for session:', sessionId);
      
      setLoadingProgress('📡 Connecting to quantum database...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load game session data
      setLoadingProgress('🔍 Retrieving session data...');
      const session = await gameService.getGameSession(sessionId);
      console.log('📊 GameBoard: Loaded session:', session);
      
      if (!session) {
        throw new Error('Game session not found');
      }
      
      setLoadingProgress('👥 Loading player data...');
      const sessionPlayers = await gameService.getGamePlayers(sessionId);
      console.log('👥 GameBoard: Loaded players:', sessionPlayers);
      
      if (!sessionPlayers || sessionPlayers.length === 0) {
        throw new Error('No players found for this saved game');
      }
      
      setLoadingProgress('🎯 Loading game moves...');
      const gameMoves = await gameService.getGameMoves(sessionId);
      console.log('🎯 GameBoard: Loaded moves:', gameMoves);
      
      setLoadingProgress('🧩 Reconstructing crossword matrix...');
      
      // Restore crossword grid from saved data
      let gridData;
      if (session.grid_data) {
        try {
          gridData = JSON.parse(session.grid_data);
          console.log('🧩 GameBoard: Restored grid data from save:', gridData);
          setCrosswordData(gridData);
        } catch (parseError) {
          console.error('❌ Error parsing saved grid data:', parseError);
          throw new Error('Corrupted game data - unable to parse crossword grid');
        }
      } else {
        // Generate new grid if no saved data (fallback)
        console.log('⚠️ GameBoard: No saved grid data, generating new crossword');
        gridData = questionService.generateCrosswordGrid(parseInt(sessionPlayers[0].level) || 1);
        setCrosswordData(gridData);
      }
      
      setLoadingProgress('👤 Processing neural operatives...');
      
      // Filter unique players to avoid duplicates
      const uniquePlayers = [];
      const seenPlayers = new Set();
      
      for (const p of sessionPlayers) {
        const playerKey = `${p.player_name}_${p.player_order}`;
        if (!seenPlayers.has(playerKey)) {
          seenPlayers.add(playerKey);
          uniquePlayers.push(p);
        }
      }
      
      // Helper function to get avatar icon from avatar type
      const getAvatarIcon = (avatarType) => {
        const avatarIcons = {
          'avatar1': '👨‍💻',
          'avatar2': '👩‍💼',
          'avatar3': '📊',
          'avatar4': '⚙️',
          'avatar5': '🎨',
          'avatar6': '👔',
          'avatar7': '🔧',
          'avatar8': '🧠'
        };
        return avatarIcons[avatarType] || '👤';
      };
      
      // Restore player data
      const restoredPlayers = uniquePlayers.map(p => ({
        sys_id: p.sys_id,
        player_name: p.player_name,
        avatar: p.avatar || 'avatar1',
        avatarIcon: getAvatarIcon(p.avatar || 'avatar1'),
        player_order: parseInt(p.player_order) || 0,
        score: parseInt(p.score) || 0,
        level: parseInt(p.level) || 1,
        experience_points: parseInt(p.experience_points) || 0,
        coins: parseInt(p.coins) || 100,
        current_streak: parseInt(p.current_streak) || 0,
        best_streak: parseInt(p.best_streak) || 0,
        correct_answers: parseInt(p.correct_answers) || 0,
        incorrect_answers: parseInt(p.incorrect_answers) || 0
      }));
      
      console.log('✅ GameBoard: Restored players:', restoredPlayers);
      
      if (restoredPlayers.length === 0) {
        throw new Error('No valid players found after processing saved data');
      }
      
      setPlayers(restoredPlayers);
      setCurrentPlayer(restoredPlayers[0]);
      setCurrentPlayerTurn(parseInt(session.current_player_turn) || 0);
      setCurrentLevel(parseInt(restoredPlayers[0].level) || 1);
      setCumulativeXP(parseInt(restoredPlayers[0].experience_points) || 0);
      
      setLoadingProgress('🎯 Restoring game progress...');
      
      // Restore submitted answers from moves
      const submitted = new Set();
      const answers = {};
      
      if (gameMoves && gameMoves.length > 0) {
        gameMoves.forEach(move => {
          const wordKey = `${move.question_number}-${move.direction}`;
          submitted.add(wordKey);
          answers[wordKey] = move.submitted_answer;
          console.log('🎯 GameBoard: Restored move:', wordKey, '=', move.submitted_answer);
        });
      }
      
      setSubmittedAnswers(submitted);
      setUserAnswers(answers);
      
      console.log('✅ GameBoard: Restored submitted answers:', submitted);
      console.log('✅ GameBoard: Restored user answers:', answers);
      
      setLoadingProgress('🎉 Game state fully restored!');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMessage('🔄 Quantum matrix successfully reconstructed!');
      setTimeout(() => setMessage(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Error loading saved game:', error);
      setLoadingProgress(`❌ Matrix error: ${error.message}`);
      
      // Show error for 3 seconds, then go back to setup
      setTimeout(() => {
        setLoading(false);
        setMessage('Failed to load saved game. Returning to setup...');
        setTimeout(() => {
          onBackToSetup();
        }, 2000);
      }, 3000);
    }
  };

  const handleCellClick = useCallback((row, col) => {
    if (!crosswordData || showLevelUpAnimation) return;

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
  }, [crosswordData, showLevelUpAnimation]);

  // Helper function to check if a cell position is part of a submitted word
  const isCellSubmitted = (row, col) => {
    if (!crosswordData) return false;
    
    const allClues = [...(crosswordData.clues.across || []), ...(crosswordData.clues.down || [])];
    
    return allClues.some(clue => {
      const wordKey = `${clue.number}-${clue.direction}`;
      if (!submittedAnswers.has(wordKey)) return false;
      
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

  const handleKeyPress = useCallback((event) => {
    if (!selectedCell || !selectedWord || showLevelUpAnimation) return;

    const wordKey = `${selectedWord.number}-${selectedWord.direction}`;
    
    // Prevent input if answer already submitted
    if (submittedAnswers.has(wordKey)) {
      if (event.key === 'Enter') {
        setMessage('❌ This answer has already been submitted and cannot be changed.');
        setTimeout(() => setMessage(''), 2000);
      }
      return;
    }

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
      
      const newAnswers = { ...userAnswers };
      const currentAnswer = newAnswers[wordKey] || '';
      
      if (currentAnswer.length < selectedWord.length) {
        newAnswers[wordKey] = currentAnswer + letter;
        setUserAnswers(newAnswers);

        // Move cursor to next cell only if it's not submitted and within word bounds
        if (currentAnswer.length + 1 < selectedWord.length) {
          let nextRow = selectedCell.row;
          let nextCol = selectedCell.col;
          
          if (selectedWord.direction === 'across') {
            nextCol = selectedCell.col + 1;
          } else {
            nextRow = selectedCell.row + 1;
          }
          
          // Only move if the next cell is not submitted
          if (!isCellSubmitted(nextRow, nextCol)) {
            setSelectedCell({ row: nextRow, col: nextCol });
          }
        }
      }
    }
  }, [selectedCell, selectedWord, userAnswers, showLevelUpAnimation, submittedAnswers, crosswordData]);

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

  // Check for level up immediately when XP increases
  const checkForLevelUp = (newTotalXP) => {
    console.log('=== CHECKING FOR LEVEL UP ===');
    console.log('Current Level:', currentLevel);
    console.log('Current Total XP:', newTotalXP);
    
    const levelInfo = questionService.calculateLevel(newTotalXP);
    console.log('Calculated Level Info:', levelInfo);
    
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
      console.log('GameBoard: Game complete! Showing stats...');
      
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
        currentLevel: currentLevel,
        currentDifficulty: crosswordData.difficulty || 'easy'
      };
      
      console.log('GameBoard: Completion stats:', stats);
      
      setCompletionStats(stats);
      setGameComplete(true);
      setSelectedCell(null);
      setSelectedWord(null);
      
      setMessage('🎊 All Answers Submitted! Check out your stats!');
    }
  };

  const submitAnswer = async () => {
    if (!selectedWord) return;

    const wordKey = `${selectedWord.number}-${selectedWord.direction}`;
    const userAnswer = userAnswers[wordKey] || '';

    // Check if answer already submitted
    if (submittedAnswers.has(wordKey)) {
      setMessage('❌ This answer has already been submitted and cannot be changed.');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

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
      
      // Mark answer as submitted
      setSubmittedAnswers(prev => new Set([...prev, wordKey]));
      
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

      // Save move to database if game is saved
      if (gameSessionId) {
        try {
          await gameService.submitAnswer({
            game_session: gameSessionId,
            player: currentPlayer.sys_id,
            question_number: selectedWord.number,
            direction: selectedWord.direction,
            submitted_answer: userAnswer,
            is_correct: isCorrect,
            points_earned: points,
            coins_earned: earnedCoins,
            experience_earned: experience,
            move_number: submittedAnswers.size + 1
          });

          // Also update player in database
          await gameService.updatePlayer(currentPlayer.sys_id, {
            score: updatedPlayer.score,
            level: updatedPlayer.level,
            experience_points: updatedPlayer.experience_points,
            coins: updatedPlayer.coins,
            correct_answers: updatedPlayer.correct_answers,
            incorrect_answers: updatedPlayer.incorrect_answers,
            current_streak: updatedPlayer.current_streak,
            best_streak: updatedPlayer.best_streak
          });
        } catch (error) {
          console.error('Error saving move:', error);
        }
      }

      if (isCorrect) {
        setMessage(`🎉 Correct! +${points} points, +${experience} XP, +${earnedCoins} coins`);
        
        // Check for level up immediately after earning XP
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
            
            // Check for completion after auto-fill
            const newAnswers = { ...userAnswers };
            setTimeout(() => {
              checkGameCompletion(newAnswers, newTotalXP);
            }, 500);
            
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
    
    // Reset game state for next crossword
    setGameComplete(false);
    setCompletionStats(null);
    setUserAnswers({});
    setSubmittedAnswers(new Set()); // Reset submitted answers
    setAutoFilledWords(new Set());
    setCurrentPlayerTurn(0);
    setSelectedCell(null);
    setSelectedWord(null);
    setGameSessionId(null); // Clear saved game session
    
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

  const saveGame = async (gameName) => {
    if (saving) return; // Prevent multiple saves
    
    setSaving(true);
    try {
      console.log('GameBoard: Saving game with name:', gameName);
      
      if (!crosswordData) {
        throw new Error('No crossword data to save');
      }

      const sessionData = {
        session_name: gameName,
        difficulty: crosswordData.difficulty || 'easy',
        num_players: players.length,
        questions_per_player: game.questionsPerPlayer || 6,
        status: gameComplete ? 'completed' : 'active',
        current_player_turn: currentPlayerTurn,
        created_by: getCurrentUserId(),
        grid_data: JSON.stringify(crosswordData)
      };

      console.log('GameBoard: Session data to save:', sessionData);

      let sessionId = gameSessionId;
      
      if (!sessionId) {
        console.log('GameBoard: Creating new game session...');
        // Create new game session
        const session = await gameService.createGameSession(sessionData);
        sessionId = session.sys_id;
        setGameSessionId(sessionId);
        console.log('GameBoard: Created session with ID:', sessionId);
        
        // Save all players (prevent duplicates by checking if they already exist)
        for (const [index, player] of players.entries()) {
          console.log(`GameBoard: Saving player ${index + 1}:`, player);
          
          // Only create new player if it doesn't have a real sys_id (i.e., it's a local player)
          if (!player.sys_id || player.sys_id.startsWith('local_player_')) {
            const playerData = {
              user: getCurrentUserId(),
              player_name: player.player_name,
              avatar: player.avatar,
              avatar_icon: player.avatarIcon,
              score: player.score || 0,
              level: player.level || 1,
              experience_points: player.experience_points || 0,
              coins: player.coins || 100,
              correct_answers: player.correct_answers || 0,
              incorrect_answers: player.incorrect_answers || 0,
              current_streak: player.current_streak || 0,
              best_streak: player.best_streak || 0,
              player_order: player.player_order || index
            };
            
            const savedPlayer = await gameService.addPlayerToGame(sessionId, playerData);
            
            // Update the local player object with the real sys_id
            const updatedPlayers = [...players];
            updatedPlayers[index] = {
              ...updatedPlayers[index],
              sys_id: savedPlayer.sys_id
            };
            setPlayers(updatedPlayers);
            
            if (index === 0) {
              setCurrentPlayer({...currentPlayer, sys_id: savedPlayer.sys_id});
            }
          }
        }
        
        console.log('GameBoard: All players saved successfully');
      } else {
        console.log('GameBoard: Updating existing game session...');
        // Update existing session
        await gameService.updateGameSession(sessionId, sessionData);
        
        // Update existing players
        for (const player of players) {
          if (player.sys_id && !player.sys_id.startsWith('local_player_')) {
            console.log('GameBoard: Updating existing player:', player.sys_id);
            await gameService.updatePlayer(player.sys_id, {
              score: player.score,
              level: player.level,
              experience_points: player.experience_points,
              coins: player.coins,
              correct_answers: player.correct_answers,
              incorrect_answers: player.incorrect_answers,
              current_streak: player.current_streak,
              best_streak: player.best_streak
            });
          }
        }
      }

      setMessage(`💾 Quantum matrix archived as "${gameName}"!`);
      setTimeout(() => setMessage(''), 3000);
      
      console.log('GameBoard: Game saved successfully with session ID:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('GameBoard: Error saving game:', error);
      setMessage('❌ Matrix archival failed: ' + error.message);
      setTimeout(() => setMessage(''), 5000);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProgress = async () => {
    try {
      const defaultName = `QuantumMatrix_L${currentLevel}_${new Date().toLocaleDateString().replace(/\//g, '-')}_${Date.now().toString().slice(-4)}`;
      await saveGame(defaultName);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // End game without save dialog - go straight back to setup
  const handleEndGame = () => {
    console.log('GameBoard: Ending game, going back to setup');
    onGameEnd();
  };

  const usePowerUp = async (powerUp) => {
    const cost = { hint: 20, retry: 40 };

    if ((currentPlayer.coins || 0) < cost[powerUp]) {
      setMessage(`💰 Insufficient quantum credits! Need ${cost[powerUp]} coins.`);
      return;
    }

    try {
      switch (powerUp) {
        case 'hint':
          if (selectedWord) {
            const wordKey = `${selectedWord.number}-${selectedWord.direction}`;
            
            // Don't allow hints for submitted answers
            if (submittedAnswers.has(wordKey)) {
              setMessage('❌ Cannot use quantum hints on archived answers.');
              return;
            }
            
            const currentAnswer = userAnswers[wordKey] || '';
            const nextLetter = selectedWord.answer[currentAnswer.length];
            
            if (nextLetter) {
              const newAnswers = { ...userAnswers };
              newAnswers[wordKey] = currentAnswer + nextLetter;
              setUserAnswers(newAnswers);
              setMessage(`💡 Quantum hint activated! Next neural pattern: ${nextLetter}`);
            }
          }
          break;
        
        case 'retry':
          if (selectedWord) {
            const wordKey = `${selectedWord.number}-${selectedWord.direction}`;
            
            // Don't allow retry for submitted answers
            if (submittedAnswers.has(wordKey)) {
              setMessage('❌ Cannot reset archived neural patterns.');
              return;
            }
            
            const newAnswers = { ...userAnswers };
            newAnswers[wordKey] = '';
            setUserAnswers(newAnswers);
            
            setAutoFilledWords(prev => {
              const newSet = new Set(prev);
              newSet.delete(wordKey);
              return newSet;
            });
            
            setMessage('🔄 Neural pattern reset! Matrix ready for new input.');
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

  const isWordSubmitted = (clue) => {
    const wordKey = `${clue.number}-${clue.direction}`;
    return submittedAnswers.has(wordKey);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Show enhanced loading screen with progress for saved games
  if (loading) {
    return (
      <div className="game-loading">
        <div className="loading-spinner"></div>
        <h2 style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '2rem 0 1rem 0'
        }}>
          {isLoadingSavedGame ? '🌌 QUANTUM RECONSTRUCTION 🌌' : '🎮 MATRIX INITIALIZATION 🎮'}
        </h2>
        
        {loadingProgress && (
          <div style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '2rem',
            color: '#4facfe'
          }}>
            {loadingProgress}
          </div>
        )}
        
        <p>
          {isLoadingSavedGame 
            ? '🔄 Reconstructing saved quantum matrix...' 
            : `Loading Level ${currentLevel} ServiceNow quantum crossword...`
          }
        </p>
        <p style={{color: '#00ff88'}}>XP: {cumulativeXP}</p>
        
        <div style={{
          width: '100%',
          maxWidth: '400px',
          height: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          overflow: 'hidden',
          marginTop: '2rem'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            animation: 'energyFlow 2s ease-in-out infinite',
            width: '100%'
          }}></div>
        </div>
      </div>
    );
  }

  if (!crosswordData) {
    return (
      <div className="error-message">
        <h2 style={{color: '#ff6b6b', marginBottom: '1rem'}}>❌ Matrix Reconstruction Failed</h2>
        <p>Unable to load quantum crossword matrix.</p>
        {isLoadingSavedGame && <p>The saved game data may be corrupted or incomplete.</p>}
        <br />
        <button className="btn btn-primary" onClick={onBackToSetup} style={{marginTop: '10px'}}>
          ← Return to Quantum Hub
        </button>
      </div>
    );
  }

  // Level Up Animation Screen
  if (showLevelUpAnimation && levelUpData) {
    return (
      <div className="level-up-screen">
        <div className="level-up-container">
          <div className="level-up-animation">
            <div className="level-up-icon">🚀</div>
            <h1 className="level-up-title">NEURAL EVOLUTION!</h1>
            <div className="level-transition">
              <div className="old-level">Level {levelUpData.oldLevel}</div>
              <div className="level-arrow">→</div>
              <div className="new-level">Level {levelUpData.newLevel}</div>
            </div>
            <p className="level-up-message">Congratulations! Your neural matrix has evolved to Level {levelUpData.newLevel}!</p>
            <div className="level-up-xp">Total Neural Energy: {levelUpData.totalXP} XP</div>
          </div>
        </div>
      </div>
    );
  }

  // Game Completion Screen - Shows stats when all answers are submitted
  if (gameComplete && completionStats) {
    const currentLevelInfo = questionService.calculateLevel(completionStats.currentXP);
    const buttonText = `🎮 Continue Level ${currentLevel} Matrix`;
      
    return (
      <div className="game-complete-screen">
        <div className="completion-container">
          <div className="completion-header">
            <h1>🎊 Quantum Matrix Completed!</h1>
            <p>Neural pattern analysis complete - reviewing performance metrics</p>
          </div>

          <div className="completion-stats">
            <div className="stats-grid">
              <div className="stat-card score-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <h3>Neural Score</h3>
                  <div className="stat-value">{completionStats.totalScore}</div>
                </div>
              </div>

              <div className="stat-card coins-card">
                <div className="stat-icon">🪙</div>
                <div className="stat-info">
                  <h3>Quantum Credits</h3>
                  <div className="stat-value">{completionStats.totalCoins}</div>
                </div>
              </div>

              <div className="stat-card xp-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <h3>Neural Energy</h3>
                  <div className="stat-value">{completionStats.currentXP} XP</div>
                </div>
              </div>

              <div className="stat-card level-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>Evolution Level</h3>
                  <div className="stat-value">Level {currentLevel}</div>
                </div>
              </div>
            </div>

            <div className="accuracy-stats">
              <h3>🎯 Neural Performance Analysis</h3>
              <div className="accuracy-grid">
                <div className="accuracy-item correct">
                  <span className="accuracy-icon">✅</span>
                  <span>Correct Patterns: {completionStats.correctAnswers}</span>
                </div>
                <div className="accuracy-item incorrect">
                  <span className="accuracy-icon">❌</span>
                  <span>Failed Patterns: {completionStats.incorrectAnswers}</span>
                </div>
                <div className="accuracy-item difficulty">
                  <span className="accuracy-icon">🎯</span>
                  <span>Matrix Level: {completionStats.currentDifficulty.toUpperCase()}</span>
                </div>
                <div className="accuracy-item streak">
                  <span className="accuracy-icon">🔥</span>
                  <span>Max Streak: {currentPlayer?.best_streak || 0}</span>
                </div>
              </div>
            </div>

            <div className="detailed-stats">
              <h3>📊 Detailed Neural Metrics</h3>
              <div className="detailed-stats-grid">
                <div className="detail-stat">
                  <span className="detail-label">Patterns Processed:</span>
                  <span className="detail-value">{completionStats.totalQuestions}</span>
                </div>
                <div className="detail-stat">
                  <span className="detail-label">Success Rate:</span>
                  <span className="detail-value">
                    {completionStats.totalQuestions > 0 
                      ? Math.round((completionStats.correctAnswers / completionStats.totalQuestions) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="detail-stat">
                  <span className="detail-label">Score per Pattern:</span>
                  <span className="detail-value">
                    {completionStats.totalQuestions > 0 
                      ? Math.round(completionStats.totalScore / completionStats.totalQuestions)
                      : 0} pts
                  </span>
                </div>
                <div className="detail-stat">
                  <span className="detail-label">Credits per Pattern:</span>
                  <span className="detail-value">
                    {completionStats.totalQuestions > 0 
                      ? Math.round(completionStats.totalCoins / completionStats.totalQuestions)
                      : 0} credits
                  </span>
                </div>
              </div>
            </div>

            <div className="progress-bar-container">
              <h4>🚀 Evolution Progress to Level {currentLevel + 1}</h4>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${(currentLevelInfo.xpProgress / currentLevelInfo.xpNeeded) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="progress-text">
                {currentLevelInfo.xpProgress} / {currentLevelInfo.xpNeeded} Neural Energy 
                {currentLevel >= 10 ? ' (MAXIMUM EVOLUTION ACHIEVED!)' : ` to Level ${currentLevel + 1}`}
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
              className="btn btn-info btn-lg"
              onClick={handleSaveProgress}
              disabled={saving}
            >
              {saving ? '💾 Archiving...' : '💾 Archive Matrix'}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={onBackToSetup}
            >
              🏠 Return to Quantum Hub
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
          title="Return to Quantum Hub"
        >
          ← Quantum Hub
        </button>
        
        <div className="game-header-compact">
          <div className="header-left">
            <h2 className="game-title">🌌 ServiceNow Quantum Matrix - Level {currentLevel} 🌌</h2>
            <div className="game-meta-horizontal">
              <span className={`difficulty-badge difficulty-${crosswordData.difficulty || 'easy'}`}>
                {(crosswordData.difficulty || 'easy').toUpperCase()} MATRIX
              </span>
              <span className="meta-item">⚡ Neural Energy: {cumulativeXP}</span>
              <span className="meta-item">🤖 Operative: {currentPlayer?.player_name}</span>
              {game.roomCode && (
                <span className="meta-item">🌐 Quantum Room: {game.roomCode}</span>
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
      <div className="xp-debug">
        <strong>🧠 NEURAL DEBUG:</strong> Total XP: {cumulativeXP} | Current Level: {currentLevel} | 
        Next Level XP: {levelInfo.xpForNextLevel} | Progress: {levelInfo.xpProgress}/{levelInfo.xpNeeded}
        {levelInfo.level > currentLevel && (
          <span style={{color: '#00ff88', fontWeight: 'bold'}}> → EVOLUTION READY!</span>
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

                const isSubmitted = crosswordData.clues.across.concat(crosswordData.clues.down).some(clue => {
                  if (isWordSubmitted(clue)) {
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
                    } ${isInSelectedWord ? 'highlighted' : ''} ${isAutoFilled ? 'auto-filled' : ''} ${
                      isSubmitted ? 'submitted' : ''
                    }`}
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
                <h3>➡️ Horizontal Patterns ({crosswordData.clues.across?.length || 0})</h3>
                {(crosswordData.clues.across || []).map(clue => {
                  const wordKey = `${clue.number}-across`;
                  const userAnswer = userAnswers[wordKey] || '';
                  const isComplete = userAnswer.length === clue.length;
                  const isSelected = selectedWord?.number === clue.number && selectedWord?.direction === 'across';
                  const isAutoFilledWord = isWordAutoFilled(clue);
                  const isSubmittedWord = isWordSubmitted(clue);
                  
                  return (
                    <div 
                      key={clue.number} 
                      className={`clue ${isSelected ? 'selected' : ''} ${isComplete ? 'complete' : ''} ${
                        isAutoFilledWord ? 'auto-filled' : ''
                      } ${isSubmittedWord ? 'submitted' : ''}`}
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
                        {isSubmittedWord && <span className="submitted-indicator">✅</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="clues-down">
                <h3>⬇️ Vertical Patterns ({crosswordData.clues.down?.length || 0})</h3>
                {(crosswordData.clues.down || []).map(clue => {
                  const wordKey = `${clue.number}-down`;
                  const userAnswer = userAnswers[wordKey] || '';
                  const isComplete = userAnswer.length === clue.length;
                  const isSelected = selectedWord?.number === clue.number && selectedWord?.direction === 'down';
                  const isAutoFilledWord = isWordAutoFilled(clue);
                  const isSubmittedWord = isWordSubmitted(clue);
                  
                  return (
                    <div 
                      key={clue.number} 
                      className={`clue ${isSelected ? 'selected' : ''} ${isComplete ? 'complete' : ''} ${
                        isAutoFilledWord ? 'auto-filled' : ''
                      } ${isSubmittedWord ? 'submitted' : ''}`}
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
                        {isSubmittedWord && <span className="submitted-indicator">✅</span>}
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
                disabled={
                  !selectedWord || 
                  !userAnswers[`${selectedWord?.number}-${selectedWord?.direction}`]?.trim() ||
                  (selectedWord && submittedAnswers.has(`${selectedWord.number}-${selectedWord.direction}`))
                }
              >
                {selectedWord && submittedAnswers.has(`${selectedWord.number}-${selectedWord.direction}`) 
                  ? '📝 Pattern Archived' 
                  : '🚀 Submit Neural Pattern'
                }
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => setShowPowerUps(!showPowerUps)}
              >
                ⚡ Quantum Powers ({currentPlayer?.coins || 0} 🪙)
              </button>
            </div>

            {showPowerUps && (
              <div className="power-ups-menu">
                <h4>⚡ Quantum Enhancement Tools</h4>
                <button 
                  className="btn btn-sm btn-accent"
                  onClick={() => usePowerUp('hint')}
                  disabled={(currentPlayer?.coins || 0) < 20}
                >
                  💡 Neural Hint (20 🪙)
                </button>
                <button 
                  className="btn btn-sm btn-accent"
                  onClick={() => usePowerUp('retry')}
                  disabled={(currentPlayer?.coins || 0) < 40}
                >
                  🔄 Pattern Reset (40 🪙)
                </button>
              </div>
            )}

            <div className="secondary-controls">
              <button 
                className="btn btn-info btn-sm"
                onClick={() => saveGame(`QuantumSave_${Date.now()}`)}
                title="Archive Current Matrix"
                disabled={saving}
              >
                {saving ? '💾 Archiving...' : '💾 Archive Matrix'}
              </button>
              <button 
                className="btn btn-warning" 
                onClick={handleEndGame}
              >
                🏠 Exit to Hub
              </button>
            </div>

            {/* Game Progress Info */}
            <div className="game-progress-info">
              <div className="progress-item">
                <span className="progress-label">Patterns Archived:</span>
                <span className="progress-value">{submittedAnswers.size}</span>
              </div>
              <div className="progress-item">
                <span className="progress-label">Total Neural Patterns:</span>
                <span className="progress-value">
                  {(crosswordData.clues.across?.length || 0) + (crosswordData.clues.down?.length || 0)}
                </span>
              </div>
              <div className="progress-item">
                <span className="progress-label">Patterns Remaining:</span>
                <span className="progress-value">
                  {((crosswordData.clues.across?.length || 0) + (crosswordData.clues.down?.length || 0)) - submittedAnswers.size}
                </span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="xp-progress-card">
            <h3>🧠 Level {currentLevel} Neural Evolution</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(levelInfo.xpProgress / levelInfo.xpNeeded) * 100}%` 
                }}
              ></div>
            </div>
            <div className="progress-text">
              {levelInfo.xpProgress} / {levelInfo.xpNeeded} Neural Energy to Level {currentLevel + 1}
              {currentLevel >= 10 && ' (MAX EVOLUTION!)'}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="leaderboard">
            <h3>🏆 Neural Operative Rankings</h3>
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