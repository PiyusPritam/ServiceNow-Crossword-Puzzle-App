import React from 'react';

export default function PlayerProfile({ player }) {
  if (!player) return null;

  return (
    <div className="player-profile">
      <div className="profile-avatar-container">
        <div className={`avatar ${player.avatar || 'avatar1'}`}>
          {player.name?.charAt(0)?.toUpperCase() || 'P'}
        </div>
        <div className="avatar-name">
          {player.name || 'Player'}
        </div>
      </div>
      <div className="profile-info">
        <div className="profile-stats">
          <div className="stat">
            <span className="stat-icon">🏆</span>
            <span className="stat-label">Level</span>
            <span className="stat-value">{player.level || 1}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">🪙</span>
            <span className="stat-label">Coins</span>
            <span className="stat-value">{player.coins || 0}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">⭐</span>
            <span className="stat-label">Score</span>
            <span className="stat-value">{player.score || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}