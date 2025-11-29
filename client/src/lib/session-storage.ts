/**
 * Session storage for saving and loading coaching sessions
 */

export interface SavedSession {
  id: string;
  timestamp: number;
  ageGroup: string;
  challenge: string;
  sessionFocus: string;
  coachingMethod: string;
  numPlayers: number;
  numCoaches: number;
  sessionDuration: number;
  sessionPlan: string;
  whatsappSummary: string;
}

const STORAGE_KEY = 'trojans-coaching-sessions';
const MAX_SESSIONS = 10;

/**
 * Get all saved sessions
 */
export function getSavedSessions(): SavedSession[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading saved sessions:', error);
    return [];
  }
}

/**
 * Save a new session
 */
export function saveSession(session: Omit<SavedSession, 'id' | 'timestamp'>): SavedSession {
  try {
    const sessions = getSavedSessions();
    const newSession: SavedSession = {
      ...session,
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    // Add new session at the beginning
    sessions.unshift(newSession);

    // Keep only the most recent MAX_SESSIONS
    const trimmedSessions = sessions.slice(0, MAX_SESSIONS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedSessions));
    return newSession;
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
}

/**
 * Delete a session by ID
 */
export function deleteSession(id: string): void {
  try {
    const sessions = getSavedSessions();
    const filtered = sessions.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
}

/**
 * Clear all saved sessions
 */
export function clearAllSessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing sessions:', error);
    throw error;
  }
}

/**
 * Get a specific session by ID
 */
export function getSessionById(id: string): SavedSession | null {
  const sessions = getSavedSessions();
  return sessions.find(s => s.id === id) || null;
}

/**
 * Format timestamp for display
 */
export function formatSessionDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}
