
import { User } from '../types';

const REGISTERED_USERS_KEY = 'auraCareRegisteredUsers';
const USER_SESSION_KEY = 'auraCareUserSession';

// Helper to get registered users from localStorage
const getRegisteredUsers = (): Record<string, string> => {
    try {
        const usersJson = localStorage.getItem(REGISTERED_USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : {};
    } catch (error) {
        console.error("Could not parse registered users:", error);
        return {};
    }
};

// Helper to save registered users to localStorage
const saveRegisteredUsers = (users: Record<string, string>) => {
    try {
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Could not save registered users:", error);
    }
};

// Creates a user session.
const saveUserToSession = (user: User) => {
    try {
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Could not save user session:", error);
    }
};

// Helper to format user name from email
const formatUserName = (email: string): string => {
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
};

// Registers a new user.
export const register = (email: string, password: string):User | null => {
    const users = getRegisteredUsers();
    if (users[email]) {
        throw new Error("User with this email already exists.");
    }
    
    users[email] = password; // In a real app, you'd hash this password.
    saveRegisteredUsers(users);

    const newUser: User = {
        email,
        name: formatUserName(email)
    };
    saveUserToSession(newUser);
    return newUser;
};


// Logs in an existing user.
export const login = (email: string, password: string): User | null => {
    const users = getRegisteredUsers();
    if (!users[email] || users[email] !== password) {
        throw new Error("Invalid email or password.");
    }
    
    const loggedInUser: User = {
        email,
        name: formatUserName(email)
    };
    saveUserToSession(loggedInUser);
    return loggedInUser;
};

// Signs the user out and clears their session.
export const logout = (callback: () => void) => {
    localStorage.removeItem(USER_SESSION_KEY);
    callback();
};


// Retrieves the current user from the session.
export const getCurrentUser = (): User | null => {
    try {
        const userJson = localStorage.getItem(USER_SESSION_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error("Could not retrieve user session:", error);
        return null;
    }
};
