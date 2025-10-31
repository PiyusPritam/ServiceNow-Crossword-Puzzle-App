// Error handling service for better user experience
export class ErrorService {
  static handleApiError(error, context = '') {
    console.error(`API Error ${context}:`, error);
    
    if (error.message) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return `An error occurred${context ? ' while ' + context : ''}. Please try again.`;
  }

  static handleNetworkError(error) {
    if (!navigator.onLine) {
      return 'No internet connection. Please check your network and try again.';
    }
    
    if (error.name === 'NetworkError' || error.message.includes('Failed to fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    return this.handleApiError(error, 'connecting to server');
  }

  static showUserMessage(message, type = 'info') {
    // This could be enhanced to show toast notifications
    console.log(`${type.toUpperCase()}: ${message}`);
    return message;
  }
}