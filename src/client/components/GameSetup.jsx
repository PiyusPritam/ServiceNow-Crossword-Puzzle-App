import React, { useState } from 'react';
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

  return (
    <div className="game-setup fade-in">
      <div className="setup-container">
        <div className="setup-header">
          <h2>ServiceNow Crossword Challenge</h2>
          <p>Level up your ServiceNow knowledge through challenging crosswords!</p>
        </div>

        <div className="setup-content">
          {/* Game Configuration */}
          <div className="card config-card">
            <div className="card-header">
              <h3>Game Configuration</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Number of Players</label>
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
                  <label className="form-label">Questions Per Game</label>
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
                  <h4>🎯 Level Progression System</h4>
                  <p>• Start at <strong>Level 1</strong> with easy ServiceNow questions</p>
                  <p>• Earn XP for correct answers to advance levels</p>
                  <p>• Higher levels = harder questions + more points</p>
                  <p>• Surprise difficult questions appear randomly!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Multiplayer Options */}
          {numPlayers > 1 && (
            <div className="card multiplayer-card">
              <div className="card-header">
                <h3>Multiplayer Options</h3>
              </div>
              <div className="card-body">
                <div className="multiplayer-controls">
                  <button 
                    className="btn btn-primary"
                    onClick={createRoom}
                    disabled={showRoomOptions}
                  >
                    Create Room
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
                      Join Room
                    </button>
                  </div>
                </div>

                {showRoomOptions && roomCode && (
                  <div className="room-info">
                    <h4>Room Created: {roomCode}</h4>
                    <p>Share this code with other players to join your game</p>
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

          {/* Player Configuration */}
          <div className="card players-card">
            <div className="card-header">
              <h3>Player Setup</h3>
            </div>
            <div className="card-body">
              <div className="players-grid">
                {players.map((player, index) => (
                  <div key={index} className="player-config">
                    <div className="player-header">
                      <h4>Player {index + 1}</h4>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Player Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Enter Player ${index + 1} name`}
                        value={player.name}
                        onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Avatar & Role</label>
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
        </div>

        <div className="setup-footer">
          <button 
            className="btn btn-primary btn-lg"
            onClick={handleStartGame}
          >
            🚀 Start Level 1
          </button>
        </div>
      </div>
    </div>
  );
}