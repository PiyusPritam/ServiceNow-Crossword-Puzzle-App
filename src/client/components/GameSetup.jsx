import React, { useState, useEffect } from 'react';
import { GameService } from '../services/GameService.js';
import './GameSetup.css';

export default function GameSetup({ onGameStart }) {
  const [numPlayers, setNumPlayers] = useState(1); // Default to single player
  const [questionsPerPlayer, setQuestionsPerPlayer] = useState(6); // Reduced for faster games
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

  useEffect(() => {
    if (showSavedGames) {
      loadSavedGames();
    }
  }, [showSavedGames]);

  const getCurrentUserId = () => {
    if (window.g_user && window.g_user.userID) return window.g_user.userID;
    if (window.g_user && window.g_user.sys_id) return window.g_user.sys_id;
    if (window.NOW && window.NOW.user_id) return window.NOW.user_id;
    return 'guest_user_' + Date.now();
  };

  const loadSavedGames = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userId = getCurrentUserId();
      console.log('Loading saved games for user:', userId);
      
      // Use the REST API to get saved games
      const response = await fetch(`/api/now/table/x_1599224_servicen_game_sessions?sysparm_query=created_by=${userId}^ORstatus!=cancelled&sysparm_display_value=all&sysparm_limit=20&sysparm_order_by=sys_created_onDESC`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-UserToken': window.g_ck || ''
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Saved games result:', result);
        setSavedGames(result.result || []);
        
        if (!result.result || result.result.length === 0) {
          console.log('No saved games found');
        }
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to load saved games: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error loading saved games:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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

  const loadSavedGame = async (gameSession) => {
    setLoadingGame(true);
    setLoadingProgress('Initializing game load...');
    
    try {
      console.log('🎮 Starting to load saved game:', gameSession);
      
      setLoadingProgress('Fetching session data...');
      await new Promise(resolve => setTimeout(resolve, 500)); // Visual feedback
      
      // Get players for this session
      setLoadingProgress('Loading players...');
      const sessionPlayers = await gameService.getGamePlayers(gameSession.sys_id);
      console.log('📊 Session players loaded:', sessionPlayers);
      
      if (sessionPlayers.length === 0) {
        setLoadingProgress('No players found!');
        await new Promise(resolve => setTimeout(resolve, 1000));
        throw new Error('No players found for this saved game');
      }

      setLoadingProgress('Processing player data...');
      await new Promise(resolve => setTimeout(resolve, 300));

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

      console.log('✅ Unique players after filtering:', uniquePlayers);

      if (uniquePlayers.length === 0) {
        setLoadingProgress('No valid players found!');
        await new Promise(resolve => setTimeout(resolve, 1000));
        throw new Error('No valid players found for this saved game');
      }

      setLoadingProgress('Building game configuration...');
      await new Promise(resolve => setTimeout(resolve, 300));

      // Convert back to game config format with all required properties
      const gameConfig = {
        numPlayers: uniquePlayers.length,
        questionsPerPlayer: parseInt(gameSession.questions_per_player) || 6,
        players: uniquePlayers.map(p => ({
          name: p.player_name || 'Unknown Player',
          avatar: p.avatar || 'avatar1',
          avatarIcon: getAvatarIcon(p.avatar || 'avatar1'), // Restore from avatar type
          score: parseInt(p.score) || 0,
          level: parseInt(p.level) || 1,
          experience_points: parseInt(p.experience_points) || 0,
          coins: parseInt(p.coins) || 100,
          current_streak: parseInt(p.current_streak) || 0,
          best_streak: parseInt(p.best_streak) || 0,
          correct_answers: parseInt(p.correct_answers) || 0,
          incorrect_answers: parseInt(p.incorrect_answers) || 0,
          sys_id: p.sys_id // Keep the sys_id for updating
        })),
        playerLevel: parseInt(uniquePlayers[0].level) || 1,
        cumulativeXP: parseInt(uniquePlayers[0].experience_points) || 0,
        savedGameSessionId: gameSession.sys_id,
        roomCode: null,
        isMultiplayer: uniquePlayers.length > 1,
        // Add missing properties that GameBoard expects
        difficulty: gameSession.difficulty || 'easy'
      };

      console.log('🚀 Final game config ready:', gameConfig);
      
      // Make sure we have valid data before starting
      if (!gameConfig.players || gameConfig.players.length === 0) {
        throw new Error('No valid players found in saved game');
      }

      // Ensure players have names
      gameConfig.players.forEach((player, index) => {
        if (!player.name || player.name.trim() === '') {
          player.name = `Player ${index + 1}`;
        }
      });

      setLoadingProgress('Starting game...');
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log('✨ All validations passed, starting game!');
      onGameStart(gameConfig);
      
    } catch (error) {
      console.error('❌ Error loading saved game:', error);
      setLoadingProgress(`Error: ${error.message}`);
      
      // Show error for 3 seconds, then reset
      setTimeout(() => {
        setLoadingGame(false);
        setLoadingProgress('');
        alert('Error loading saved game: ' + error.message);
      }, 3000);
    }
  };

  const deleteSavedGame = async (gameId, gameName) => {
    if (!confirm(`Are you sure you want to delete "${gameName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/now/table/x_1599224_servicen_game_sessions/${gameId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-UserToken': window.g_ck || ''
        }
      });

      if (response.ok) {
        // Reload saved games
        await loadSavedGames();
        alert(`Game "${gameName}" deleted successfully`);
      } else {
        throw new Error('Failed to delete game');
      }
    } catch (error) {
      console.error('Error deleting saved game:', error);
      alert('Error deleting game: ' + error.message);
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
    
    // Store room data in localStorage for persistence
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
      alert('Please enter a room code');
      return;
    }
    
    const roomData = localStorage.getItem(`crossword_room_${joinRoomCode.toUpperCase()}`);
    if (roomData) {
      const room = JSON.parse(roomData);
      setRoomCode(joinRoomCode.toUpperCase());
      setIsMultiplayer(true);
      setQuestionsPerPlayer(room.questionsPerPlayer);
      // Add current player to room
      room.players.push(players[0]);
      localStorage.setItem(`crossword_room_${joinRoomCode.toUpperCase()}`, JSON.stringify(room));
    } else {
      alert('Room not found. Please check the room code.');
    }
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Room link copied to clipboard!');
    });
  };

  const handleStartGame = () => {
    const validPlayers = players.filter(p => p.name.trim());
    if (validPlayers.length !== numPlayers) {
      alert('Please enter names for all players');
      return;
    }

    const gameConfig = {
      numPlayers,
      questionsPerPlayer,
      players: validPlayers,
      roomCode: roomCode || null,
      isMultiplayer,
      // Remove difficulty - will be determined by player level
      playerLevel: 1 // Starting level
    };

    onGameStart(gameConfig);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Show futuristic loading screen if loading a game
  if (loadingGame) {
    return (
      <div className="game-setup fade-in">
        <div className="setup-container">
          <div className="setup-header">
            <h2>🌟 QUANTUM LOADING 🌟</h2>
            <p>Reconstructing saved game matrix...</p>
          </div>
          <div className="setup-content">
            <div className="card">
              <div className="loading-saved-games">
                <div className="loading-spinner"></div>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {loadingProgress || 'Initializing...'}
                </div>
                <div style={{
                  width: '100%',
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
                    animation: 'loadingBar 2s ease-in-out infinite',
                    width: '100%'
                  }}></div>
                </div>
                <style>{`
                  @keyframes loadingBar {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0%); }
                    100% { transform: translateX(100%); }
                  }
                `}</style>
                <p style={{marginTop: '2rem', color: 'rgba(255, 255, 255, 0.7)'}}>
                  🚀 Quantum entanglement in progress...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-setup fade-in">
      <div className="setup-container">
        <div className="setup-header">
          <h2>🌌 SERVICENOW NEXUS 🌌</h2>
          <p>Experience the future of ServiceNow learning through quantum crosswords!</p>
        </div>

        {/* Game Mode Selection */}
        <div className="setup-content">
          <div className="card mode-selection-card">
            <div className="card-header">
              <h3>🎮 Select Your Mission</h3>
            </div>
            <div className="card-body">
              <div className="mode-buttons">
                <button 
                  className={`btn ${!showSavedGames ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setShowSavedGames(false)}
                >
                  ⚡ New Quantum Game
                </button>
                <button 
                  className={`btn ${showSavedGames ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setShowSavedGames(true)}
                >
                  💾 Load Saved Matrix
                </button>
              </div>
            </div>
          </div>

          {showSavedGames ? (
            /* Saved Games Section */
            <div className="card saved-games-card">
              <div className="card-header">
                <h3>🗂️ Your Quantum Archives</h3>
                <button 
                  className="btn btn-sm btn-secondary"
                  onClick={loadSavedGames}
                  title="Refresh saved games list"
                  disabled={loading}
                >
                  {loading ? '⏳' : '🔄'} Refresh Matrix
                </button>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="loading-saved-games">
                    <div className="loading-spinner"></div>
                    <p>🔍 Scanning quantum archives...</p>
                  </div>
                ) : error ? (
                  <div className="error-saved-games">
                    <p>❌ Matrix error: {error}</p>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={loadSavedGames}
                    >
                      🔄 Retry Connection
                    </button>
                  </div>
                ) : savedGames.length === 0 ? (
                  <div className="no-saved-games">
                    <p>🌟 No archived games detected in the quantum matrix.</p>
                    <p>Begin your journey and save your progress to populate this space!</p>
                    <p><small>🆔 Neural ID: {getCurrentUserId()}</small></p>
                  </div>
                ) : (
                  <div className="saved-games-list">
                    {savedGames.map(game => (
                      <div key={game.sys_id} className="saved-game-item">
                        <div className="game-info">
                          <h4 className="game-name">🎯 {game.session_name}</h4>
                          <div className="game-details">
                            <span className="game-status">
                              Status: <span className={`status-badge status-${game.status}`}>
                                {game.status.toUpperCase()}
                              </span>
                            </span>
                            <span className="game-difficulty">
                              🔥 Level: {game.difficulty.toUpperCase()}
                            </span>
                            <span className="game-players">
                              👥 Players: {game.num_players}
                            </span>
                            <span className="game-date">
                              📅 Archived: {formatDate(game.sys_created_on)}
                            </span>
                          </div>
                        </div>
                        <div className="game-actions">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => loadSavedGame(game)}
                            disabled={loadingGame}
                          >
                            {loadingGame ? '⏳ Loading...' : '🚀 Continue Mission'}
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteSavedGame(game.sys_id, game.session_name)}
                            disabled={loadingGame}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* New Game Section */
            <>
              {/* Game Configuration */}
              <div className="card config-card">
                <div className="card-header">
                  <h3>⚙️ Mission Parameters</h3>
                </div>
                <div className="card-body">
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">👥 Neural Operatives</label>
                      <select 
                        className="form-control form-select"
                        value={numPlayers}
                        onChange={(e) => handleNumPlayersChange(parseInt(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <option key={num} value={num}>{num} Operative{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">🧩 Challenge Matrix Size</label>
                      <select 
                        className="form-control form-select"
                        value={questionsPerPlayer}
                        onChange={(e) => setQuestionsPerPlayer(parseInt(e.target.value))}
                      >
                        {[3, 6, 9, 12, 15].map(num => (
                          <option key={num} value={num}>{num} Quantum Challenges</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="level-info">
                    <div className="level-description">
                      <h4>🎯 Neural Evolution System</h4>
                      <p>• Initialize at <strong>Level 1</strong> with basic ServiceNow quantum packets</p>
                      <p>• Absorb XP energy for correct solutions to evolve your neural matrix</p>
                      <p>• Advanced levels = complex challenges + amplified rewards</p>
                      <p>• Surprise quantum anomalies appear randomly for bonus evolution!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multiplayer Options */}
              {numPlayers > 1 && (
                <div className="card multiplayer-card">
                  <div className="card-header">
                    <h3>🌐 Neural Network Options</h3>
                  </div>
                  <div className="card-body">
                    <div className="multiplayer-controls">
                      <button 
                        className="btn btn-primary"
                        onClick={createRoom}
                        disabled={showRoomOptions}
                      >
                        🚀 Create Quantum Room
                      </button>
                      
                      <div className="join-room-section">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter quantum access code"
                          value={joinRoomCode}
                          onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                          maxLength={6}
                        />
                        <button 
                          className="btn btn-secondary"
                          onClick={joinRoom}
                        >
                          🔗 Join Matrix
                        </button>
                      </div>
                    </div>

                    {showRoomOptions && roomCode && (
                      <div className="room-info">
                        <h4>🌟 Quantum Room: {roomCode}</h4>
                        <p>Share this access code with other operatives to join your quantum mission</p>
                        <button 
                          className="btn btn-accent btn-sm"
                          onClick={copyRoomLink}
                        >
                          📋 Copy Quantum Link
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Player Configuration */}
              <div className="card players-card">
                <div className="card-header">
                  <h3>👤 Neural Operative Configuration</h3>
                </div>
                <div className="card-body">
                  <div className="players-grid">
                    {players.map((player, index) => (
                      <div key={index} className="player-config">
                        <div className="player-header">
                          <h4>🚀 Operative {index + 1}</h4>
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">🏷️ Neural Identity</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={`Enter Operative ${index + 1} codename`}
                            value={player.name}
                            onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">🎭 Avatar & Specialization</label>
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
                                {avatar.icon} Quantum {avatar.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="avatar-preview">
                          <div className={`avatar ${player.avatar}`}>
                            <span className="avatar-icon">{player.avatarIcon}</span>
                          </div>
                          <span className="avatar-name">{player.name || `Operative ${index + 1}`}</span>
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
              🚀 Initialize Level 1 Matrix
            </button>
          </div>
        )}
      </div>
    </div>
  );
}