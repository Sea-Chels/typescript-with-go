// Secure token storage utilities
// Using memory storage with sessionStorage fallback for security

class TokenStorage {
  private memoryToken: string | null = null;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly EXPIRY_KEY = 'token_expiry';

  // Store token in memory first, sessionStorage as fallback
  setToken(token: string, expiresAt?: string): void {
    this.memoryToken = token;
    
    // Use sessionStorage as fallback for page refreshes
    // sessionStorage is cleared when browser tab is closed
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem(this.TOKEN_KEY, token);
        if (expiresAt) {
          sessionStorage.setItem(this.EXPIRY_KEY, expiresAt);
        }
      } catch (e) {
        console.error('Failed to store token in sessionStorage:', e);
      }
    }
  }

  // Get token from memory first, then sessionStorage
  getToken(): string | null {
    // Check if token is expired first
    if (this.isTokenExpired()) {
      this.clearToken();
      return null;
    }

    // Return from memory if available
    if (this.memoryToken) {
      return this.memoryToken;
    }

    // Try to restore from sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const token = sessionStorage.getItem(this.TOKEN_KEY);
        if (token) {
          this.memoryToken = token;
          return token;
        }
      } catch (e) {
        console.error('Failed to retrieve token from sessionStorage:', e);
      }
    }

    return null;
  }

  // Clear token from both memory and sessionStorage
  clearToken(): void {
    this.memoryToken = null;
    
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.removeItem(this.TOKEN_KEY);
        sessionStorage.removeItem(this.EXPIRY_KEY);
      } catch (e) {
        console.error('Failed to clear token from sessionStorage:', e);
      }
    }
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const expiryStr = sessionStorage.getItem(this.EXPIRY_KEY);
        if (expiryStr) {
          const expiry = new Date(expiryStr);
          return new Date() >= expiry;
        }
      } catch (e) {
        console.error('Failed to check token expiry:', e);
      }
    }
    return false;
  }

  // Get token expiry time
  getTokenExpiry(): Date | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const expiryStr = sessionStorage.getItem(this.EXPIRY_KEY);
        if (expiryStr) {
          return new Date(expiryStr);
        }
      } catch (e) {
        console.error('Failed to get token expiry:', e);
      }
    }
    return null;
  }
}

// Export singleton instance
export const tokenStorage = new TokenStorage();

// Utility function to parse JWT and extract claims
export function parseJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT:', e);
    return null;
  }
}

// Auto logout on token expiry
export function setupAutoLogout(onLogout: () => void): void {
  const checkExpiry = () => {
    if (tokenStorage.isTokenExpired()) {
      onLogout();
    }
  };

  // Check every minute
  const interval = setInterval(checkExpiry, 60 * 1000);

  // Return cleanup function
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => clearInterval(interval));
  }
}