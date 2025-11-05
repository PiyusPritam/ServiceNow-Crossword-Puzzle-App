// GameService - Handles all game-related API operations with improved error handling
import { ErrorService } from './ErrorService.js';

export class GameService {
  constructor() {
    this.baseUrl = '/api/now/table';
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-UserToken': window.g_ck || ''
    };
  }

  // Enhanced error handling wrapper for fetch requests
  async apiRequest(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers
        }
      });

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorData.message || errorMessage;
        } catch (parseError) {
          console.warn('Could not parse error response:', parseError);
          errorMessage = `${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.result || result;
    } catch (error) {
      console.error(`API Error for ${url}:`, error);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network connection error. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  // Game Sessions
  async createGameSession(sessionData) {
    try {
      console.log('Creating game session with data:', sessionData);
      
      const result = await this.apiRequest(`${this.baseUrl}/x_1599224_servicen_game_sessions`, {
        method: 'POST',
        body: JSON.stringify(sessionData)
      });

      console.log('Game session created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating game session:', error);
      const message = ErrorService.handleApiError(error, 'creating game session');
      throw new Error(message);
    }
  }

  async getGameSession(sessionId) {
    try {
      console.log('Fetching game session:', sessionId);
      
      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      const result = await this.apiRequest(
        `${this.baseUrl}/x_1599224_servicen_game_sessions/${sessionId}?sysparm_display_value=all`
      );

      console.log('Game session fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('Error fetching game session:', error);
      const message = ErrorService.handleApiError(error, 'loading game session');
      throw new Error(message);
    }
  }

  async updateGameSession(sessionId, updateData) {
    try {
      console.log('Updating game session:', sessionId, updateData);
      
      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      const result = await this.apiRequest(`${this.baseUrl}/x_1599224_servicen_game_sessions/${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });

      console.log('Game session updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Error updating game session:', error);
      const message = ErrorService.handleApiError(error, 'updating game session');
      throw new Error(message);
    }
  }

  async deleteGameSession(sessionId) {
    try {
      console.log('Deleting game session:', sessionId);
      
      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      await this.apiRequest(`${this.baseUrl}/x_1599224_servicen_game_sessions/${sessionId}`, {
        method: 'DELETE'
      });

      console.log('Game session deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting game session:', error);
      const message = ErrorService.handleApiError(error, 'deleting game session');
      throw new Error(message);
    }
  }

  // Game Players with improved error handling
  async addPlayerToGame(sessionId, playerData) {
    try {
      console.log('Adding player to game:', sessionId, playerData);
      
      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      const result = await this.apiRequest(`${this.baseUrl}/x_1599224_servicen_game_players`, {
        method: 'POST',
        body: JSON.stringify({
          ...playerData,
          game_session: sessionId
        })
      });

      console.log('Player added successfully:', result);
      return result;
    } catch (error) {
      console.error('Error adding player:', error);
      const message = ErrorService.handleApiError(error, 'adding player to game');
      throw new Error(message);
    }
  }

  async getGamePlayers(sessionId) {
    try {
      console.log('Fetching game players for session:', sessionId);
      
      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      const result = await this.apiRequest(
        `${this.baseUrl}/x_1599224_servicen_game_players?sysparm_query=game_session=${sessionId}&sysparm_display_value=all&sysparm_order_by=player_order`
      );

      console.log('Game players fetched successfully:', result);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error fetching game players:', error);
      const message = ErrorService.handleApiError(error, 'loading game players');
      throw new Error(message);
    }
  }

  async updatePlayer(playerId, updateData) {
    try {
      console.log('Updating player:', playerId, updateData);
      
      if (!playerId) {
        throw new Error('Player ID is required');
      }

      const result = await this.apiRequest(`${this.baseUrl}/x_1599224_servicen_game_players/${playerId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      });

      console.log('Player updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Error updating player:', error);
      const message = ErrorService.handleApiError(error, 'updating player data');
      throw new Error(message);
    }
  }

  // Game Moves with enhanced validation
  async submitAnswer(moveData) {
    try {
      console.log('Submitting answer:', moveData);
      
      // Validate required fields
      if (!moveData.game_session || !moveData.player) {
        throw new Error('Game session and player are required');
      }

      const result = await this.apiRequest(`${this.baseUrl}/x_1599224_servicen_game_moves`, {
        method: 'POST',
        body: JSON.stringify(moveData)
      });

      console.log('Answer submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error submitting answer:', error);
      const message = ErrorService.handleApiError(error, 'submitting answer');
      throw new Error(message);
    }
  }

  async getGameMoves(sessionId) {
    try {
      console.log('Fetching game moves for session:', sessionId);
      
      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      const result = await this.apiRequest(
        `${this.baseUrl}/x_1599224_servicen_game_moves?sysparm_query=game_session=${sessionId}&sysparm_display_value=all&sysparm_order_by=move_number`
      );

      console.log('Game moves fetched successfully:', result);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error fetching game moves:', error);
      const message = ErrorService.handleApiError(error, 'loading game moves');
      throw new Error(message);
    }
  }

  // Enhanced saved games functionality
  async getSavedGames(userId) {
    try {
      console.log('Fetching saved games for user:', userId);
      
      if (!userId) {
        throw new Error('User ID is required');
      }

      const encodedQuery = `created_by=${userId}^ORstatus!=cancelled`;
      const result = await this.apiRequest(
        `${this.baseUrl}/x_1599224_servicen_game_sessions?sysparm_query=${encodedQuery}&sysparm_display_value=all&sysparm_limit=50&sysparm_order_by=sys_created_onDESC`
      );

      console.log('Saved games fetched successfully:', result);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error fetching saved games:', error);
      const message = ErrorService.handleApiError(error, 'loading saved games');
      throw new Error(message);
    }
  }

  // Validation helper methods
  validateSessionData(sessionData) {
    const required = ['session_name', 'difficulty', 'num_players'];
    const missing = required.filter(field => !sessionData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    return true;
  }

  validatePlayerData(playerData) {
    const required = ['player_name', 'avatar'];
    const missing = required.filter(field => !playerData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required player fields: ${missing.join(', ')}`);
    }
    
    return true;
  }

  // Connection test method
  async testConnection() {
    try {
      const result = await this.apiRequest(`${this.baseUrl}/sys_user?sysparm_limit=1`);
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Retry mechanism for failed operations
  async retryOperation(operation, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        console.warn(`Operation failed (attempt ${i + 1}/${maxRetries}):`, error.message);
        
        if (i === maxRetries - 1) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
}