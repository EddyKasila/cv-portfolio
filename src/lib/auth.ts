interface AuthCredentials {
  username: string;
  password: string;
}

export const STORAGE_KEY = 'portfolioos_auth';

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
    const creds = this.getStoredCredentials();
    if (username !== creds.username || password !== creds.password) {
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
    if (typeof window !== 'undefined') {
      const win = window as any;
      if (win.__PORTFOLIOOS_USERNAME && win.__PORTFOLIOOS_PASSWORD) {
        return { username: win.__PORTFOLIOOS_USERNAME, password: win.__PORTFOLIOOS_PASSWORD };
      }
    }
    try {
      const env = import.meta.env;
      if (env.PUBLIC_ADMIN_USERNAME && env.PUBLIC_ADMIN_PASSWORD) {
        return { username: env.PUBLIC_ADMIN_USERNAME, password: env.PUBLIC_ADMIN_PASSWORD };
      }
    } catch {}
    return { ...DEFAULT_CREDENTIALS };
  }
}
