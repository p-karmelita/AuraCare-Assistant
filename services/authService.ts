
import { jwtDecode } from 'jwt-decode';
import { User } from '../types';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const USER_SESSION_KEY = 'auraCareUserSession';

// This function initializes the Google Identity Services client.
export const initGoogleAuth = (callback: (user: User) => void): void => {
    if (!GOOGLE_CLIENT_ID) {
        console.error("Google Client ID is not configured.");
        return;
    }
    
    if (typeof window.google === 'undefined') {
        console.error("Google Identity Services script not loaded.");
        return;
    }

    window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: any) => {
            handleCredentialResponse(response, callback);
        },
    });
};

// This function handles the response from Google Sign-In.
const handleCredentialResponse = (response: any, callback: (user: User) => void) => {
    try {
        const userObject: any = jwtDecode(response.credential);
        const user: User = {
            name: userObject.name,
            email: userObject.email,
            picture: userObject.picture,
        };
        saveUserToSession(user);
        callback(user);
    } catch (error) {
        console.error("Error decoding credential response: ", error);
    }
};

// Prompts the user to sign in with Google.
export const signIn = () => {
    if (!GOOGLE_CLIENT_ID) {
        console.error("Cannot sign in: Google Client ID is not configured.");
        return;
    }
     if (typeof window.google === 'undefined') {
        console.error("Cannot sign in: Google Identity Services script not loaded.");
        return;
    }
    window.google.accounts.id.prompt();
};

// Signs the user out and clears their session.
export const signOut = (callback: () => void) => {
    localStorage.removeItem(USER_SESSION_KEY);
    if (window.google?.accounts) {
        window.google.accounts.id.disableAutoSelect();
    }
    callback();
};

// Saves the user object to localStorage.
const saveUserToSession = (user: User) => {
    try {
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Could not save user session:", error);
    }
};

// Retrieves the user object from localStorage.
export const getUserFromSession = (): User | null => {
    try {
        const userJson = localStorage.getItem(USER_SESSION_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error("Could not retrieve user session:", error);
        return null;
    }
};
