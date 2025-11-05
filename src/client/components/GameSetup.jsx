import React, { useState, useEffect } from 'react';
import { GameService } from '../services/GameService.js';
import { ErrorService } from '../services/ErrorService.js';
import './GameSetup.css';

export default function GameSetup({ onGameStart }) {
  const [numPlayers, setNumPlayers] = useState(1);
  const [questionsPerPlayer, setQuestionsPerPlayer] = useState(6);
  const [players, setPlayers] = useState([
    { name: '', avatar: 'avatar1', avatarIcon: '👨‍💻' }
  ]);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [showRoomOptions, setShowRoomOptions] = useState(false);
  const [savedGames, setSavedGames] = useState([]);
  const [showSavedGames, setShowSavedGames] = useState(false);
  const [gameService] = useState(() => new GameService());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingGame, setLoadingGame] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('checking');

  useEffect(() => {
    testConnectionAndLoadGames();
  }, []);

  useEffect(() => {
    if (showSavedGames && connectionStatus === 'connected') {
      loadSavedGames();
    }
  }, [showSavedGames, connectionStatus]);

  const testConnectionAndLoadGames = async () => {
    try {
      setConnectionStatus('checking');
      const isConnected = await gameService.testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      
      if (!isConnected) {
        setError('Unable to connect to ServiceNow. Please check your connection.');
        ErrorService.showUserMessage('Connection to ServiceNow failed. Some features may not work.', 'warning');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionStatus('disconnected');
      setError('Connection test failed');
    }
  };

  const getCurrentUserId = () => {
    if (window.g_user && window.g_user.userID) return window.g_user.userID;
    if (window.g_user && window.g_user.sys_id) return window.g_user.sys_id;
    if (window.NOW && window.NOW.user_id) return window.NOW.user_id;
    return 'guest_user_' + Date.now();
  };

  // Helper function to safely extract string values from ServiceNow field objects
  const getFieldValue = (field, defaultValue = '') => {
    if (!field) return defaultValue;
    
    if (typeof field === 'string' || typeof field === 'number') {
      return String(field);
    }
    
    if (field && typeof field === 'object') {
      if (field.display_value !== undefined) {
        return String(field.display_value);
      }
      if (field.value !== undefined) {
        return String(field.value);
      }
    }
    
    return defaultValue;
  };

  // Helper function to safely get status as string
  const getStatusString = (status) => {
    const statusValue = getFieldValue(status, 'active');
    return statusValue.toLowerCase();
  };

  // Helper function to safely get numeric values
  const getNumericValue = (field, defaultValue = 0) => {
    const fieldValue = getFieldValue(field, String(defaultValue));
    const num = parseInt(fieldValue);
    return isNaN(num) ? defaultValue : num;
  };

  const loadSavedGames = async () => {
    if (connectionStatus !== 'connected') {
      setError('Cannot load saved games - not connected to ServiceNow');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const userId = getCurrentUserId();
      console.log('Loading saved games for user:', userId);
      
      const games = await ErrorService.retryWithExponentialBackoff(
        () => gameService.getSavedGames(userId),
        3,
        1000
      );

      setSavedGames(games || []);
      
      if (!games || games.length === 0) {
        console.log('No saved games found for user:', userId);
      } else {
        console.log(`Found ${games.length} saved games`);
      }
    } catch (error) {
      console.error('Error loading saved games:', error);
      const errorMessage = ErrorService.handleLoadError(error);
      setError(errorMessage);
      ErrorService.showUserMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

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

  const loadSavedGame = async (gameSession) => {
    if (connectionStatus !== 'connected') {
      ErrorService.showUserMessage('Cannot load game - not connected to ServiceNow', 'error');
      return;
    }

    setLoadingGame(true);
    setLoadingProgress('Loading game session...');
    
    try {
      console.log('Starting to load saved game:', gameSession);
      
      if (!gameSession || !getFieldValue(gameSession.sys_id)) {
        throw new Error('Invalid game session data');
      }
      
      const sessionId = getFieldValue(gameSession.sys_id);
      
      setLoadingProgress('Retrieving session data...');
      await new Promise(resolve => setTimeout(resolve, 500));

      await ErrorService.retryWithExponentialBackoff(
        () => gameService.getGameSession(sessionId),
        2,
        500
      );
      
      setLoadingProgress('Loading player information...');
      const sessionPlayers = await ErrorService.retryWithExponentialBackoff(
        () => gameService.getGamePlayers(sessionId),
        3,
        1000
      );
      
      console.log('Session players loaded:', sessionPlayers);
      
      if (!sessionPlayers || sessionPlayers.length === 0) {
        throw new Error('No players found for this saved game. The game data may be corrupted.');
      }

      setLoadingProgress('Processing player data...');
      await new Promise(resolve => setTimeout(resolve, 300));

      const uniquePlayers = [];
      const seenPlayers = new Set();
      
      for (const p of sessionPlayers) {
        const playerName = getFieldValue(p.player_name);
        if (!playerName) {
          console.warn('Skipping player with no name:', p);
          continue;
        }
        
        const playerOrder = getNumericValue(p.player_order, 0);
        const playerKey = `${playerName}_${playerOrder}`;
        if (!seenPlayers.has(playerKey)) {
          seenPlayers.add(playerKey);
          uniquePlayers.push(p);
        }
      }

      console.log('Unique players after filtering:', uniquePlayers);

      if (uniquePlayers.length === 0) {
        throw new Error('No valid players found in saved game data');
      }

      setLoadingProgress('Preparing game configuration...');
      await new Promise(resolve => setTimeout(resolve, 300));

      const gameConfig = {
        numPlayers: uniquePlayers.length,
        questionsPerPlayer: Math.max(3, getNumericValue(gameSession.questions_per_player, 6)),
        players: uniquePlayers.map((p, index) => {
          const player = {
            name: getFieldValue(p.player_name) || `Player ${index + 1}`,
            avatar: getFieldValue(p.avatar, 'avatar1'),
            avatarIcon: getAvatarIcon(getFieldValue(p.avatar, 'avatar1')),
            score: Math.max(0, getNumericValue(p.score, 0)),
            level: Math.max(1, getNumericValue(p.level, 1)),
            experience_points: Math.max(0, getNumericValue(p.experience_points, 0)),
            coins: Math.max(0, getNumericValue(p.coins, 100)),
            current_streak: Math.max(0, getNumericValue(p.current_streak, 0)),
            best_streak: Math.max(0, getNumericValue(p.best_streak, 0)),
            correct_answers: Math.max(0, getNumericValue(p.correct_answers, 0)),
            incorrect_answers: Math.max(0, getNumericValue(p.incorrect_answers, 0)),
            sys_id: getFieldValue(p.sys_id)
          };
          
          if (!player.name.trim()) {
            player.name = `Player ${index + 1}`;
          }
          
          return player;
        }),
        playerLevel: Math.max(1, getNumericValue(uniquePlayers[0].level, 1)),
        cumulativeXP: Math.max(0, getNumericValue(uniquePlayers[0].experience_points, 0)),
        savedGameSessionId: sessionId,
        roomCode: null,
        isMultiplayer: uniquePlayers.length > 1,
        difficulty: getFieldValue(gameSession.difficulty, 'easy')
      };

      const validationErrors = ErrorService.validateGameData(gameConfig);
      if (validationErrors.length > 0) {
        throw new Error(`Game validation failed: ${validationErrors.join(', ')}`);
      }

      console.log('Final game config ready:', gameConfig);
      
      setLoadingProgress('Starting game...');
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('All validations passed, starting game!');
      ErrorService.showUserMessage('Game loaded successfully!', 'success', 2000);
      onGameStart(gameConfig);
      
    } catch (error) {
      console.error('Error loading saved game:', error);
      ErrorService.logError(error, 'loadSavedGame', { sessionId: gameSession?.sys_id });
      
      const errorMessage = ErrorService.handleLoadError(error);
      setLoadingProgress(`Error: ${errorMessage}`);
      ErrorService.showUserMessage(errorMessage, 'error', 8000);
      
      setTimeout(() => {
        setLoadingGame(false);
        setLoadingProgress('');
      }, 3000);
    }
  };

  const deleteSavedGame = async (gameId, gameName) => {
    if (connectionStatus !== 'connected') {
      ErrorService.showUserMessage('Cannot delete game - not connected to ServiceNow', 'error');
      return;
    }

    const gameIdValue = getFieldValue(gameId);
    const gameNameValue = getFieldValue(gameName, 'Unnamed Game');

    if (!confirm(`Are you sure you want to delete "${gameNameValue}"?`)) {
      return;
    }

    try {
      await ErrorService.retryWithExponentialBackoff(
        () => gameService.deleteGameSession(gameIdValue),
        2,
        1000
      );
      
      ErrorService.showUserMessage(`Game "${gameNameValue}" deleted successfully`, 'success');
      await loadSavedGames();
    } catch (error) {
      console.error('Error deleting saved game:', error);
      ErrorService.logError(error, 'deleteSavedGame', { gameId: gameIdValue, gameName: gameNameValue });
      
      const errorMessage = ErrorService.handleApiError(error, 'deleting game');
      ErrorService.showUserMessage(errorMessage, 'error');
    }
  };

  const handleNumPlayersChange = (newNum) => {
    setNumPlayers(newNum);
    const newPlayers = [...players];
    
    if (newNum > players.length) {
      for (let i = players.length; i < newNum; i++) {
        newPlayers.push({ name: '', avatar: `avatar${(i % 8) + 1}`, avatarIcon: getDefaultIcon(i) });
      }
    } else {
      newPlayers.splice(newNum);
    }
    
    setPlayers(newPlayers);
  };

  const getDefaultIcon = (index) => {
    const icons = ['👨‍💻', '👩‍💼', '📊', '⚙️', '🎨', '👔', '🔧', '🧠'];
    return icons[index % icons.length];
  };

  const updatePlayer = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const createRoom = () => {
    const newRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(newRoomCode);
    setIsMultiplayer(true);
    setShowRoomOptions(true);
    
    const roomData = {
      code: newRoomCode,
      host: players[0]?.name || 'Host',
      created: new Date().toISOString(),
      questionsPerPlayer,
      players: [players[0]]
    };
    localStorage.setItem(`crossword_room_${newRoomCode}`, JSON.stringify(roomData));
  };

  const joinRoom = () => {
    if (!joinRoomCode.trim()) {
      ErrorService.showUserMessage('Please enter a room code', 'warning');
      return;
    }
    
    const roomData = localStorage.getItem(`crossword_room_${joinRoomCode.toUpperCase()}`);
    if (roomData) {
      const room = JSON.parse(roomData);
      setRoomCode(joinRoomCode.toUpperCase());
      setIsMultiplayer(true);
      setQuestionsPerPlayer(room.questionsPerPlayer);
      room.players.push(players[0]);
      localStorage.setItem(`crossword_room_${joinRoomCode.toUpperCase()}`, JSON.stringify(room));
      ErrorService.showUserMessage(`Joined room ${joinRoomCode.toUpperCase()}!`, 'success');
    } else {
      ErrorService.showUserMessage('Room not found. Please check the room code.', 'error');
    }
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        ErrorService.showUserMessage('Room link copied to clipboard!', 'success');
      }).catch(() => {
        ErrorService.showUserMessage('Could not copy link. Please copy manually: ' + link, 'info', 8000);
      });
    } else {
      ErrorService.showUserMessage('Could not copy link. Please copy manually: ' + link, 'info', 8000);
    }
  };

  const handleStartGame = () => {
    try {
      const validPlayers = players.filter(p => p.name && p.name.trim());
      
      if (validPlayers.length === 0) {
        ErrorService.showUserMessage('Please enter at least one player name', 'warning');
        return;
      }
      
      if (validPlayers.length !== numPlayers) {
        ErrorService.showUserMessage('Please enter names for all players', 'warning');
        return;
      }

      const gameConfig = {
        numPlayers,
        questionsPerPlayer,
        players: validPlayers.map(p => ({
          ...p,
          name: p.name.trim()
        })),
        roomCode: roomCode || null,
        isMultiplayer,
        playerLevel: 1
      };

      const validationErrors = ErrorService.validateGameData(gameConfig);
      if (validationErrors.length > 0) {
        ErrorService.showUserMessage(`Please fix: ${validationErrors.join(', ')}`, 'warning');
        return;
      }

      ErrorService.showUserMessage('Starting new game...', 'success', 2000);
      onGameStart(gameConfig);
    } catch (error) {
      console.error('Error starting game:', error);
      ErrorService.logError(error, 'handleStartGame');
      ErrorService.showUserMessage('Failed to start game. Please try again.', 'error');
    }
  };

  const formatDate = (dateString) => {
    try {
      const dateValue = getFieldValue(dateString);
      if (!dateValue) return 'Unknown date';
      
      return new Date(dateValue).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const avatarOptions = [
    { id: 'avatar1', icon: '👨‍💻', name: 'Developer' },
    { id: 'avatar2', icon: '👩‍💼', name: 'Admin' },
    { id: 'avatar3', icon: '📊', name: 'Analyst' },
    { id: 'avatar4', icon: '⚙️', name: 'Engineer' },
    { id: 'avatar5', icon: '🎨', name: 'Designer' },
    { id: 'avatar6', icon: '👔', name: 'Manager' },
    { id: 'avatar7', icon: '🔧', name: 'Specialist' },
    { id: 'avatar8', icon: '🧠', name: 'Expert' }
  ];

  if (loadingGame) {
    return (
      <div className="game-setup-fullscreen fade-in">
        <div className="setup-container">
          <div className="setup-header">
            <h2>Loading Game Session</h2>
            <p>Retrieving your saved game data...</p>
          </div>
          <div className="setup-content">
            <div className="card">
              <div className="loading-saved-games">
                <div className="loading-spinner"></div>
                <div className="loading-progress-text">
                  {loadingProgress || 'Initializing...'}
                </div>
                <div className="loading-bar-container">
                  <div className="loading-bar"></div>
                </div>
                <p className="loading-description">
                  Please wait while we restore your game progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-setup-fullscreen fade-in">
      <div className="setup-container">
        <div className="setup-header">
          <h2>ServiceNow Crossword Challenge</h2>
          <p>Test your ServiceNow knowledge through interactive crossword puzzles!</p>
          {connectionStatus === 'disconnected' && (
            <div className="connection-warning">
              ⚠️ Connection to ServiceNow lost - some features may not work
            </div>
          )}
        </div>

        <div className="setup-content">
          <div className="card mode-selection-card">
            <div className="card-header">
              <h3>📋 Game Mode</h3>
              {connectionStatus === 'checking' && (
                <div className="connection-status">
                  Connecting...
                </div>
              )}
            </div>
            <div className="card-body">
              <div className="mode-buttons">
                <button 
                  className={`btn ${!showSavedGames ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setShowSavedGames(false)}
                >
                  🆕 New Game
                </button>
                <button 
                  className={`btn ${showSavedGames ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setShowSavedGames(true)}
                  disabled={connectionStatus !== 'connected'}
                  title={connectionStatus !== 'connected' ? 'Requires ServiceNow connection' : ''}
                >
                  📁 Continue Game
                </button>
              </div>
            </div>
          </div>

          {showSavedGames ? (
            <div className="card saved-games-card">
              <div className="card-header">
                <h3>📂 Saved Games</h3>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={loadSavedGames}
                  title="Refresh saved games list"
                  disabled={loading || connectionStatus !== 'connected'}
                >
                  {loading ? '⏳' : '🔄'} Refresh
                </button>
              </div>
              <div className="card-body">
                {connectionStatus !== 'connected' ? (
                  <div className="error-saved-games">
                    <p>❌ Cannot load saved games - ServiceNow connection required</p>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={testConnectionAndLoadGames}
                    >
                      🔄 Retry Connection
                    </button>
                  </div>
                ) : loading ? (
                  <div className="loading-saved-games">
                    <div className="loading-spinner"></div>
                    <p>🔍 Loading saved games...</p>
                  </div>
                ) : error ? (
                  <div className="error-saved-games">
                    <p>❌ Error: {error}</p>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={loadSavedGames}
                    >
                      🔄 Retry Connection
                    </button>
                  </div>
                ) : savedGames.length === 0 ? (
                  <div className="no-saved-games">
                    <p>📋 No saved games found.</p>
                    <p>Start a new game and save your progress to see it here!</p>
                    <p><small>👤 User ID: {getCurrentUserId()}</small></p>
                  </div>
                ) : (
                  <div className="saved-games-list">
                    {savedGames.map(game => {
                      const statusString = getStatusString(game.status);
                      const gameName = getFieldValue(game.session_name, 'Unnamed Game');
                      const difficulty = getFieldValue(game.difficulty, 'easy');
                      const numPlayers = getNumericValue(game.num_players, 1);
                      const createdOn = getFieldValue(game.sys_created_on);
                      const gameId = getFieldValue(game.sys_id);
                      
                      return (
                        <div key={gameId} className="saved-game-item">
                          <div className="game-info">
                            <h4 className="game-name">📋 {gameName}</h4>
                            <div className="game-details">
                              <span className="game-status">
                                Status: <span className={`status-badge status-${statusString}`}>
                                  {statusString.toUpperCase()}
                                </span>
                              </span>
                              <span className="game-difficulty">
                                📈 Difficulty: {difficulty.toUpperCase()}
                              </span>
                              <span className="game-players">
                                👥 Players: {numPlayers}
                              </span>
                              <span className="game-date">
                                📅 Created: {formatDate(createdOn)}
                              </span>
                            </div>
                          </div>
                          <div className="game-actions">
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={() => loadSavedGame(game)}
                              disabled={loadingGame}
                            >
                              {loadingGame ? '⏳ Loading...' : '▶️ Continue'}
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => deleteSavedGame(gameId, gameName)}
                              disabled={loadingGame}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="card config-card">
                <div className="card-header">
                  <h3>⚙️ Game Configuration</h3>
                </div>
                <div className="card-body">
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">👥 Number of Players</label>
                      <select 
                        className="form-control form-select"
                        value={numPlayers}
                        onChange={(e) => handleNumPlayersChange(parseInt(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>{num} Player{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">❓ Questions per Player</label>
                      <select 
                        className="form-control form-select"
                        value={questionsPerPlayer}
                        onChange={(e) => setQuestionsPerPlayer(parseInt(e.target.value))}
                      >
                        {[3, 6, 9, 12, 15].map(num => (
                          <option key={num} value={num}>{num} Questions</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="level-info">
                    <div className="level-description">
                      <h4>📊 Experience System</h4>
                      <p>• Start at <strong>Level 1</strong> with basic ServiceNow knowledge questions</p>
                      <p>• Earn experience points (XP) for correct answers to level up</p>
                      <p>• Higher levels unlock more challenging questions and better rewards</p>
                      <p>• Bonus questions appear randomly for extra points!</p>
                    </div>
                  </div>
                </div>
              </div>

              {numPlayers > 1 && (
                <div className="card multiplayer-card">
                  <div className="card-header">
                    <h3>🌐 Multiplayer Options</h3>
                  </div>
                  <div className="card-body">
                    <div className="multiplayer-controls">
                      <button 
                        className="btn btn-primary"
                        onClick={createRoom}
                        disabled={showRoomOptions}
                      >
                        🏠 Create Room
                      </button>
                      
                      <div className="join-room-section">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter room code"
                          value={joinRoomCode}
                          onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                          maxLength={6}
                        />
                        <button 
                          className="btn btn-secondary"
                          onClick={joinRoom}
                        >
                          🚪 Join Room
                        </button>
                      </div>
                    </div>

                    {showRoomOptions && roomCode && (
                      <div className="room-info">
                        <h4>🏠 Room Code: {roomCode}</h4>
                        <p>Share this code with other players to join your game session</p>
                        <button 
                          className="btn btn-accent btn-sm"
                          onClick={copyRoomLink}
                        >
                          📋 Copy Room Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="card players-card">
                <div className="card-header">
                  <h3>👤 Player Setup</h3>
                </div>
                <div className="card-body">
                  <div className="players-grid">
                    {players.map((player, index) => (
                      <div key={index} className="player-config">
                        <div className="player-header">
                          <h4>👤 Player {index + 1}</h4>
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">🏷️ Name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`Enter Player ${index + 1} name`}
                            value={player.name}
                            onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                            maxLength={50}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">🎭 Avatar & Role</label>
                          <select
                            className="form-control form-select"
                            value={player.avatar}
                            onChange={(e) => {
                              const selectedAvatar = avatarOptions.find(a => a.id === e.target.value);
                              updatePlayer(index, 'avatar', e.target.value);
                              updatePlayer(index, 'avatarIcon', selectedAvatar.icon);
                            }}
                          >
                            {avatarOptions.map(avatar => (
                              <option key={avatar.id} value={avatar.id}>
                                {avatar.icon} {avatar.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="avatar-preview">
                          <div className={`avatar ${player.avatar}`}>
                            <span className="avatar-icon">{player.avatarIcon}</span>
                          </div>
                          <span className="avatar-name">{player.name || `Player ${index + 1}`}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {!showSavedGames && (
          <div className="setup-footer">
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleStartGame}
            >
              🎯 Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}