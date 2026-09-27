import { mongoService } from './mongoService';

// Authentication & User State Service with MongoDB Sync

const AUTH_USER_KEY = "aero_detective_user";
const REGISTERED_USERS_KEY = "aero_registered_users";

// Default admin and initial users storage
const INITIAL_USERS = [
  {
    id: "u_admin",
    name: "Admin Officer",
    email: "admin@aerodetective.org",
    password: "admin",
    role: "Administrator",
    organization: "Central Pollution Control Center",
    joinedDate: "January 2024",
    status: "Active",
    preferences: {
      alertThreshold: 120,
      enableRealtimeAlerts: true,
      detailedMLMode: true,
      units: "standard"
    }
  },
  {
    id: "u_analyst",
    name: "Dr. Alex Mitchell",
    email: "alex.mitchell@aerodetective.org",
    password: "password123",
    role: "Environmental Analyst",
    organization: "Atmospheric Pattern Lab",
    joinedDate: "September 2024",
    status: "Active",
    preferences: {
      alertThreshold: 150,
      enableRealtimeAlerts: true,
      detailedMLMode: true,
      units: "standard"
    }
  }
];

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(INITIAL_USERS));
  return INITIAL_USERS;
}

export const AuthService = {
  // Get current logged-in user or guest
  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading auth state", e);
    }
    return null;
  },

  getAllUsers: () => {
    return getStoredUsers();
  },

  login: async (email, password) => {
    const users = getStoredUsers();
    const cleanEmail = (email || '').trim().toLowerCase();
    const match = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);

    if (match) {
      const { password: _, ...safeUser } = match;
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
      return { success: true, user: safeUser };
    }

    // Allow user login with clean account creation if not yet registered
    const newUser = {
      id: `u_${Date.now()}`,
      name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase()),
      email: cleanEmail,
      role: cleanEmail.includes("admin") ? "Administrator" : "Environmental Analyst",
      organization: "Atmospheric Monitoring Cell",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      status: "Active",
      preferences: {
        alertThreshold: 150,
        enableRealtimeAlerts: true,
        detailedMLMode: true,
        units: "standard"
      }
    };
    
    users.push({ ...newUser, password });
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    mongoService.insertDocument('users', newUser);
    return { success: true, user: newUser };
  },

  register: async (name, email, password, role = "Environmental Analyst") => {
    const users = getStoredUsers();
    const cleanEmail = (email || '').trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    const newUser = {
      id: `u_${Date.now()}`,
      name,
      email: cleanEmail,
      role: role || (cleanEmail.includes("admin") ? "Administrator" : "Environmental Analyst"),
      organization: "Air Quality Sentinel",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      status: "Active",
      preferences: {
        alertThreshold: 100,
        enableRealtimeAlerts: true,
        detailedMLMode: true,
        units: "standard"
      }
    };

    users.push({ ...newUser, password });
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    mongoService.insertDocument('users', newUser);
    return { success: true, user: newUser };
  },

  updateProfile: (updatedData) => {
    const current = AuthService.getCurrentUser();
    if (!current) return null;
    
    const updated = { ...current, ...updatedData };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));

    // Update in users registry
    const users = getStoredUsers().map(u => u.email === current.email ? { ...u, ...updatedData } : u);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    mongoService.updateDocument('users', { email: current.email }, updatedData);
    return updated;
  },

  changePassword: async (currentPassword, newPassword) => {
    const current = AuthService.getCurrentUser();
    if (!current) throw new Error("No active session.");

    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.email === current.email);
    if (userIndex === -1) throw new Error("User record not found.");

    if (users[userIndex].password && users[userIndex].password !== currentPassword) {
      throw new Error("Incorrect current password.");
    }

    users[userIndex].password = newPassword;
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    mongoService.updateDocument('users', { email: current.email }, { password: newPassword });
    return { success: true };
  },

  logout: () => {
    localStorage.removeItem(AUTH_USER_KEY);
  }
};
