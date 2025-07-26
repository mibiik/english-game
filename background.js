// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('AutoFlirt AI extension installed!');
});

// Listen for tab updates to inject content script as needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only proceed if the tab has completed loading
  if (changeInfo.status === 'complete') {
    // Check if we're on a supported social media site
    const url = tab.url || '';
    const isSupportedSite = [
      'instagram.com',
      'linkedin.com', 
      'twitter.com',
      'x.com',
      'tinder.com'
    ].some(domain => url.includes(domain));

    if (isSupportedSite) {
      // Execute content script
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      }).catch(error => {
        console.error('Error injecting content script:', error);
      });
    }
  }
});