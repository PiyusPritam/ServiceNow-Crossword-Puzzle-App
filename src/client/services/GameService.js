// GameService - Handles all game-related API operations
export class GameService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-UserToken': window.g_ck
    };
  }

  // Game Sessions
  async createGameSession(sessionData) {
    try {
      const response = await fetch(`${this.baseUrl}/x_1599224_servicen_game_sessions`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to create game session');
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error('Error creating game session:', error);
      throw error;
    }
  }

  async getGameSession(sessionId) {
    try {
      const response = await fetch(`${this.baseUrl}/x_1599224_servicen_game_sessions/${sessionId}?sysparm_display_value=all`, {
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch game session');
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error('Error fetching game session:', error);
      throw error;
    }
  }

  async updateGameSession(sessionId, updateData) {
    try {
      const response = await fetch(`${this.baseUrl}/x_1599224_servicen_game_sessions/${sessionId}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to update game session');
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error('Error updating game session:', error);
      throw error;
    }
  }

  // Game Players
  async addPlayerToGame(sessionId, playerData) {
    try {
      const response = await fetch(`${this.baseUrl}/x_1599224_servicen_game_players`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          ...playerData,
          game_session: sessionId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to add player');
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error('Error adding player:', error);
      throw error;
    }
  }

  async getGamePlayers(sessionId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/x_1599224_servicen_game_players?sysparm_query=game_session=${sessionId}&sysparm_display_value=all&sysparm_order_by=player_order`, 
        { headers: this.headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch game players');
      }

      const result = await response.json();
      return result.result || [];
    } catch (error) {
      console.error('Error fetching game players:', error);
      throw error;
    }
  }

  async updatePlayer(playerId, updateData) {
    try {
      const response = await fetch(`${this.baseUrl}/x_1599224_servicen_game_players/${playerId}`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to update player');
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error('Error updating player:', error);
      throw error;
    }
  }

  // Game Moves
  async submitAnswer(moveData) {
    try {
      const response = await fetch(`${this.baseUrl}/x_1599224_servicen_game_moves`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(moveData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to submit answer');
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }

  async getGameMoves(sessionId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/x_1599224_servicen_game_moves?sysparm_query=game_session=${sessionId}&sysparm_display_value=all&sysparm_order_by=move_number`, 
        { headers: this.headers }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch game moves');
      }

      const result = await response.json();
      return result.result || [];
    } catch (error) {
      console.error('Error fetching game moves:', error);
      throw error;
    }
  }
}