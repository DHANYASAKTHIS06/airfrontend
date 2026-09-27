// AERO-DETECTIVE Authentication Service (Mock / Client-side persistence)

const AUTH_USER_KEY = "aero_detective_user";

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
    // Default demo user
    return {
      name: "Dr. Alex Mitchell",
      email: "alex.mitchell@aerodetective.org",
      role: "Environmental Analyst",
      organization: "Atmospheric Pattern Lab",
      joinedDate: "October 2024",
      savedLocations: ["Coimbatore", "Bengaluru", "Shimla"],
      preferences: {
        alertThreshold: 150,
        enableRealtimeAlerts: true,
        detailedMLMode: true,
        units: "standard"
      }
    };
  },

  login: async (email, password) => {
    await new Promise((res) => setTimeout(res, 400));
    const user = {
      name: email.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role: "Environmental Analyst",
      organization: "Atmospheric Pattern Lab",
      joinedDate: "September 2026",
      savedLocations: ["Coimbatore", "Delhi", "Bengaluru"],
      preferences: {
        alertThreshold: 150,
        enableRealtimeAlerts: true,
        detailedMLMode: true,
        units: "standard"
      }
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  register: async (name, email, password) => {
    await new Promise((res) => setTimeout(res, 400));
    const user = {
      name,
      email,
      role: "Environmental Analyst",
      organization: "Global Air Sentinel",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      savedLocations: ["Coimbatore"],
      preferences: {
        alertThreshold: 100,
        enableRealtimeAlerts: true,
        detailedMLMode: true,
        units: "standard"
      }
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  updateProfile: (updatedData) => {
    const current = AuthService.getCurrentUser();
    const updated = { ...current, ...updatedData };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
    return updated;
  },

  logout: () => {
    localStorage.removeItem(AUTH_USER_KEY);
  }
};
