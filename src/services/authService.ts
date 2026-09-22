import { jwtDecode } from 'jwt-decode';
import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile } from './storage';

export const AUTH_TOKEN_KEY = 'qivora_auth_token';

export interface GoogleJwtPayload {
  iss?: string;
  nbf?: number;
  aud?: string;
  sub: string;
  email: string;
  email_verified?: boolean;
  azp?: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  iat?: number;
  exp?: number;
  jti?: string;
}

/**
 * Parses and verifies a Google OAuth 2.0 Credential (JWT)
 * Maps user information into Qivora's UserProfile schema and persists session.
 */
export function processGoogleCredential(credential: string): UserProfile {
  try {
    const payload = jwtDecode<GoogleJwtPayload>(credential);

    if (!payload.email || !payload.sub) {
      throw new Error('Invalid Google credential payload: Missing email or user ID');
    }

    // Save token in storage
    localStorage.setItem(AUTH_TOKEN_KEY, credential);

    // Retrieve existing profile or merge with previous game history
    const existing = getUserProfile();

    const updatedProfile: UserProfile = {
      ...existing,
      id: `usr_google_${payload.sub.slice(0, 10)}`,
      googleId: payload.sub,
      name: payload.name || payload.given_name || 'Candidate',
      email: payload.email,
      avatar: payload.picture,
      emailVerified: payload.email_verified ?? true,
      authProvider: 'google',
      joinedDate: existing.joinedDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    saveUserProfile(updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('[AuthService] Error decoding Google credential:', error);
    throw new Error('Failed to process Google login response. Please check your credentials.');
  }
}

/**
 * Returns true if a valid authentication session exists
 */
export function isUserAuthenticated(): boolean {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return false;

  try {
    const payload = jwtDecode<GoogleJwtPayload>(token);
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      // Token expired
      logoutUser();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Clears current authentication session and resets profile to guest baseline
 */
export function logoutUser(): UserProfile {
  localStorage.removeItem(AUTH_TOKEN_KEY);

  const guestProfile: UserProfile = {
    id: 'usr_candidate_01',
    name: 'Candidate',
    email: 'candidate@qivora.io',
    cqScore: 0,
    streakDays: 0,
    testsCompleted: 0,
    puzzlesSolved: 0,
    joinedDate: 'September 2026',
    authProvider: 'guest',
    bestScores: {
      inductive: 0,
      deductive: 0,
      grid: 0,
      switch: 0,
      memory: 0,
      attention: 0,
      reaction: 0,
      math: 0
    }
  };

  saveUserProfile(guestProfile);
  return guestProfile;
}
