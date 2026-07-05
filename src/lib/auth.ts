interface AuthCredentials {
  username: string;
  password: string;
}

const STORAGE_KEY = 'portfolioos_auth';
const DEFAULT_CREDENTIALS: AuthCredentials = {
  username: 'admin',
  password: 'portfolioos2024',
};

export class AuthService {
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    try {
      const { expiry } = JSON.parse(stored);
      return Date.now() < expiry;
    } catch {
      return false;
    }
  }

  static login(username: string, password: string): boolean {
    const stored = this.getStoredCredentials();
    if (username !== stored.username || password !== stored.password) {
      return false;
    }
    const session = {
      authenticated: true,
      loginTime: Date.now(),
      expiry: Date.now() + 24 * 60 * 60 * 1000,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return true;
  }

  static logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  static getStoredCredentials(): AuthCredentials {
    const env = typeof process !== 'undefined' ? process as any : {};
    return {
      username: (typeof window !== 'undefined' && (window as any).__PORTFOLIOOS_USERNAME) || env.PUBLIC_ADMIN_USERNAME || DEFAULT_CREDENTIALS.username,
      password: (typeof window !== 'undefined' && (window as any).__PORTFOLIOOS_PASSWORD) || env.PUBLIC_ADMIN_PASSWORD || DEFAULT_CREDENTIALS.password,
    };
  }
}
