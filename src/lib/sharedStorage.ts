// Shared storage for expert applications that survives hot reloads
declare global {
  var __expertApplications: any[];
}

// Initialize global storage if it doesn't exist
if (!global.__expertApplications) {
  global.__expertApplications = [];
}

export const expertApplications = global.__expertApplications;

// Helper functions for managing expert applications
export const addExpertApplication = (application: any) => {
  expertApplications.push(application);
  console.log('Expert application added:', application);
  console.log('Total applications in memory:', expertApplications.length);
};

export const getExpertApplications = () => {
  console.log('Getting expert applications, count:', expertApplications.length);
  return expertApplications;
};

export const updateExpertApplication = (id: string, updates: any) => {
  const index = expertApplications.findIndex(app => app._id === id);
  if (index !== -1) {
    expertApplications[index] = { ...expertApplications[index], ...updates };
    return expertApplications[index];
  }
  return null;
};

// Debug function to check storage state
export const debugStorage = () => {
  console.log('=== EXPERT APPLICATIONS STORAGE DEBUG ===');
  console.log('Global storage exists:', !!global.__expertApplications);
  console.log('Applications count:', expertApplications.length);
  console.log('Applications:', expertApplications);
  console.log('=========================================');
}; 