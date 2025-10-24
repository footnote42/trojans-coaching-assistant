/**
 * API Key Storage Utilities
 * Handles storing and retrieving API keys from localStorage
 */

const API_KEY_STORAGE_KEY = 'anthropic_api_key';

export const apiKeyStorage = {
  /**
   * Save API key to localStorage
   */
  save(apiKey: string): void {
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    } catch (error) {
      console.error('Failed to save API key:', error);
      throw new Error('Failed to save API key to browser storage');
    }
  },

  /**
   * Get API key from localStorage or environment variable (dev mode)
   */
  get(): string | null {
    // First check localStorage (user-provided key)
    const userKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (userKey) {
      return userKey;
    }

    // Fall back to environment variable for development
    const devKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (devKey) {
      return devKey;
    }

    return null;
  },

  /**
   * Check if API key exists
   */
  exists(): boolean {
    return this.get() !== null;
  },

  /**
   * Remove API key from localStorage
   */
  remove(): void {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to remove API key:', error);
    }
  },

  /**
   * Validate API key format (basic check)
   */
  isValidFormat(apiKey: string): boolean {
    // Anthropic keys start with 'sk-ant-'
    return apiKey.startsWith('sk-ant-') && apiKey.length > 20;
  }
};