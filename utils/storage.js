/**
 * Storage Module for handling Chrome storage
 */
const Storage = (() => {
  /**
   * Get a value from storage
   * @param {string} key - The key to retrieve
   * @returns {Promise<any>} - The stored value
   */
  const get = async (key) => {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    });
  };

  /**
   * Set a value in storage
   * @param {string} key - The key to store
   * @param {any} value - The value to store
   * @returns {Promise<void>}
   */
  const set = async (key, value) => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  };

  /**
   * Remove a value from storage
   * @param {string} key - The key to remove
   * @returns {Promise<void>}
   */
  const remove = async (key) => {
    return new Promise((resolve) => {
      chrome.storage.local.remove(key, () => {
        resolve();
      });
    });
  };

  /**
   * Clear all storage
   * @returns {Promise<void>}
   */
  const clear = async () => {
    return new Promise((resolve) => {
      chrome.storage.local.clear(() => {
        resolve();
      });
    });
  };

  // Public API
  return {
    get,
    set,
    remove,
    clear
  };
})();