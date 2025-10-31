import React, { useState } from 'react';
import './GameSetup.css';

export default function GameSetup({ onGameStart }) {
  const [numPlayers, setNumPlayers] = useState(2);
  const [questionsPerPlayer, setQuestionsPerPlayer] = useState(10);
  const [difficulty, setDifficulty] = useState('normal');
  const [players, setPlayers] = useState([
    { name: '', avatar: 'avatar1' },
    { name: '', avatar: 'avatar2' }
  ]);

  const handleNumPlayersChange = (newNum) => {
    setNumPlayers(newNum);
    const newPlayers = [...players];
    
    if (newNum > players.length) {
      // Add new players
      for (let i = players.length; i < newNum; i++) {
        newPlayers.push({ name: '', avatar: `avatar${i + 1}` });
      }
    } else {
      // Remove excess players
      newPlayers.splice(newNum);
    }
    
    setPlayers(newPlayers);
  };

  const updatePlayer = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const handleStartGame = () => {
    // Validate that all players have names
    const validPlayers = players.filter(p => p.name.trim());
    if (validPlayers.length !== numPlayers) {
      alert('Please enter names for all players');
      return;
    }

    const gameConfig = {
      numPlayers,
      questionsPerPlayer,
      difficulty,
      players: validPlayers
    };

    onGameStart(gameConfig);
  };

  const avatarOptions = [
    'avatar1', 'avatar2', 'avatar3', 'avatar4',
    'avatar5', 'avatar6', 'avatar7', 'avatar8'
  ];

  const difficultyDescriptions = {
    easy: 'Basic ServiceNow terminology and concepts',
    normal: 'Platform features and common workflows',
    hard: 'Advanced configurations and integrations',
    legend: 'Complex scripting and architecture',
    mythical: 'Expert-level platform knowledge and edge cases'
  };

  return (
    <div className="game-setup fade-in">
      <div className="setup-container">
        <div className="setup-header">
          <h2>Game Setup</h2>
          <p>Configure your ServiceNow crossword challenge</p>
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
                  <label className="form-label">Questions Per Player</label>
                  <select 
                    className="form-control form-select"
                    value={questionsPerPlayer}
                    onChange={(e) => setQuestionsPerPlayer(parseInt(e.target.value))}
                  >
                    {[5, 10, 15, 20, 25, 30].map(num => (
                      <option key={num} value={num}>{num} Questions</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Difficulty Level</label>
                <select 
                  className="form-control form-select"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                  <option value="legend">Legend</option>
                  <option value="mythical">Mythical</option>
                </select>
                <div className="difficulty-description">
                  {difficultyDescriptions[difficulty]}
                </div>
              </div>
            </div>
          </div>

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
                      <label className="form-label">Avatar</label>
                      <select
                        className="form-control form-select"
                        value={player.avatar}
                        onChange={(e) => updatePlayer(index, 'avatar', e.target.value)}
                      >
                        {avatarOptions.map(avatar => (
                          <option key={avatar} value={avatar}>
                            {avatar.charAt(0).toUpperCase() + avatar.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="avatar-preview">
                      <div className={`avatar ${player.avatar}`}>
                        {player.name.charAt(0).toUpperCase() || (index + 1)}
                      </div>
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
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}