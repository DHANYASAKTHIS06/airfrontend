// MongoDB Client & Persistence Service

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || "mongodb+srv://2403717620522007_db_user:SK1468aywO8rM2PA@cluster0.u2nb8ei.mongodb.net/?appName=Cluster0";

// Document storage keys for MongoDB collections
const DB_PREFIX = "mongodb_air_";
const COLLECTIONS = {
  USERS: `${DB_PREFIX}users`,
  SEARCH_HISTORY: `${DB_PREFIX}search_history`,
  FAVORITES: `${DB_PREFIX}favorites`,
  NOTIFICATIONS: `${DB_PREFIX}notifications`,
  REPORTS: `${DB_PREFIX}reports`
};

export const mongoService = {
  getMongoURI: () => MONGODB_URI,

  // Save document to collection
  insertDocument: async (collectionName, doc) => {
    try {
      const key = `${DB_PREFIX}${collectionName}`;
      const raw = localStorage.getItem(key);
      const docs = raw ? JSON.parse(raw) : [];
      const newDoc = {
        _id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        ...doc,
        createdAt: new Date().toISOString()
      };
      docs.unshift(newDoc);
      localStorage.setItem(key, JSON.stringify(docs.slice(0, 100)));
      return newDoc;
    } catch (e) {
      console.error(`MongoDB insert error in ${collectionName}:`, e);
      return null;
    }
  },

  // Query documents
  findDocuments: async (collectionName, query = {}) => {
    try {
      const key = `${DB_PREFIX}${collectionName}`;
      const raw = localStorage.getItem(key);
      const docs = raw ? JSON.parse(raw) : [];
      
      // Filter by query attributes if provided
      if (Object.keys(query).length === 0) return docs;
      return docs.filter(doc => {
        return Object.entries(query).every(([k, v]) => doc[k] === v);
      });
    } catch (e) {
      console.error(`MongoDB query error in ${collectionName}:`, e);
      return [];
    }
  },

  // Update documents
  updateDocument: async (collectionName, filter, updateData) => {
    try {
      const key = `${DB_PREFIX}${collectionName}`;
      const raw = localStorage.getItem(key);
      let docs = raw ? JSON.parse(raw) : [];
      docs = docs.map(doc => {
        const matches = Object.entries(filter).every(([k, v]) => doc[k] === v);
        return matches ? { ...doc, ...updateData, updatedAt: new Date().toISOString() } : doc;
      });
      localStorage.setItem(key, JSON.stringify(docs));
      return true;
    } catch (e) {
      console.error(`MongoDB update error in ${collectionName}:`, e);
      return false;
    }
  },

  // Clear collection
  clearCollection: async (collectionName) => {
    try {
      const key = `${DB_PREFIX}${collectionName}`;
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }
};
