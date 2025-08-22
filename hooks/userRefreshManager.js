let globalRefreshTrigger = 0;
const refreshCallbacks = new Set();

export const userRefreshManager = {
  // Trigger a global refresh for all useUser instances
  triggerGlobalRefresh: () => {
    globalRefreshTrigger++;
    refreshCallbacks.forEach((callback) => callback());
  },

  // Subscribe a useUser instance to global refreshes
  subscribe: (callback) => {
    refreshCallbacks.add(callback);
    return () => refreshCallbacks.delete(callback);
  },

  // Get current refresh trigger value
  getRefreshTrigger: () => globalRefreshTrigger
};
