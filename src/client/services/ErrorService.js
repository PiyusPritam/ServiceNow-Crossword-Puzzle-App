// Enhanced error handling service for better user experience
export class ErrorService {
  static handleApiError(error, context = '') {
    console.error(`API Error ${context}:`, error);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return 'Network connection error. Please check your internet connection and try again.';
    }
    
    // Handle timeout errors
    if (error.name === 'TimeoutError') {
      return 'Request timed out. Please try again.';
    }
    
    // Handle ServiceNow specific errors
    if (error.message) {
      const message = error.message.toLowerCase();
      
      if (message.includes('unauthorized') || message.includes('401')) {
        return 'Authentication error. Please refresh the page and try again.';
      }
      
      if (message.includes('forbidden') || message.includes('403')) {
        return 'Access denied. You may not have permission to perform this action.';
      }
      
      if (message.includes('not found') || message.includes('404')) {
        return context ? `${context} not found. It may have been deleted or moved.` : 'Resource not found.';
      }
      
      if (message.includes('bad request') || message.includes('400')) {
        return 'Invalid request. Please check your input and try again.';
      }
      
      if (message.includes('internal server error') || message.includes('500')) {
        return 'Server error. Please try again in a few moments.';
      }
      
      if (message.includes('service unavailable') || message.includes('503')) {
        return 'Service temporarily unavailable. Please try again later.';
      }
      
      // Return the original message if it's user-friendly
      if (error.message.length < 200 && !message.includes('error:') && !message.includes('exception')) {
        return error.message;
      }
    }
    
    // Handle string errors
    if (typeof error === 'string') {
      return error;
    }
    
    // Default fallback
    return `An error occurred${context ? ' while ' + context : ''}. Please try again.`;
  }

  static handleNetworkError(error) {
    console.error('Network Error:', error);
    
    if (!navigator.onLine) {
      return 'No internet connection. Please check your network and try again.';
    }
    
    if (error.name === 'NetworkError' || error.message.includes('Failed to fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    return this.handleApiError(error, 'connecting to server');
  }

  static handleSaveError(error) {
    const message = this.handleApiError(error, 'saving game');
    
    // Specific save-related guidance
    if (message.includes('unauthorized') || message.includes('authentication')) {
      return 'Session expired. Please refresh the page and save again.';
    }
    
    if (message.includes('quota') || message.includes('limit')) {
      return 'Storage limit reached. Please delete some old saved games and try again.';
    }
    
    return message;
  }

  static handleLoadError(error) {
    const message = this.handleApiError(error, 'loading saved game');
    
    // Specific load-related guidance
    if (message.includes('not found')) {
      return 'Saved game not found. It may have been deleted or corrupted.';
    }
    
    if (message.includes('corrupted') || message.includes('invalid')) {
      return 'Saved game data is corrupted and cannot be loaded.';
    }
    
    return message;
  }

  static showUserMessage(message, type = 'info', duration = 5000) {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Create a temporary notification element if none exists
    let notification = document.querySelector('.error-notification');
    if (notification) {
      clearTimeout(notification.timeoutId);
      notification.remove();
    }
    
    notification = document.createElement('div');
    notification.className = `error-notification error-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getNotificationColor(type)};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 10001;
      max-width: 400px;
      font-weight: 500;
      font-size: 0.9rem;
      line-height: 1.4;
      animation: slideIn 0.3s ease-out;
      backdrop-filter: blur(10px);
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#error-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'error-notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    notification.timeoutId = setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
    
    // Allow manual dismissal
    notification.addEventListener('click', () => {
      clearTimeout(notification.timeoutId);
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    });
    
    return message;
  }

  static getNotificationColor(type) {
    switch (type) {
      case 'error': return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)';
      case 'warning': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'success': return 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)';
      case 'info': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }

  static validateGameData(gameData) {
    const errors = [];
    
    if (!gameData) {
      errors.push('Game data is missing');
      return errors;
    }
    
    if (!gameData.players || !Array.isArray(gameData.players) || gameData.players.length === 0) {
      errors.push('At least one player is required');
    }
    
    if (gameData.players) {
      gameData.players.forEach((player, index) => {
        if (!player.name || player.name.trim() === '') {
          errors.push(`Player ${index + 1} needs a name`);
        }
        if (!player.avatar) {
          errors.push(`Player ${index + 1} needs an avatar`);
        }
      });
    }
    
    if (!gameData.numPlayers || gameData.numPlayers < 1 || gameData.numPlayers > 8) {
      errors.push('Number of players must be between 1 and 8');
    }
    
    if (!gameData.questionsPerPlayer || gameData.questionsPerPlayer < 3 || gameData.questionsPerPlayer > 20) {
      errors.push('Questions per player must be between 3 and 20');
    }
    
    return errors;
  }

  static async retryWithExponentialBackoff(operation, maxRetries = 3, baseDelay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        console.warn(`Operation failed (attempt ${attempt}/${maxRetries}):`, error.message);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff: 1s, 2s, 4s...
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  static logError(error, context, additionalData = {}) {
    const errorLog = {
      timestamp: new Date().toISOString(),
      context,
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: window.g_user?.userID || 'unknown',
      ...additionalData
    };
    
    console.error('Detailed error log:', errorLog);
    
    // Could send to error tracking service here
    // await this.sendErrorToServer(errorLog);
    
    return errorLog;
  }
}