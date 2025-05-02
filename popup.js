document.addEventListener('DOMContentLoaded', async () => {
  // Cache DOM elements
  const loadingContainer = document.getElementById('loading-container');
  const errorContainer = document.getElementById('error-container');
  const contentContainer = document.getElementById('content-container');
  const messagesContainer = document.getElementById('messages-container');
  const suggestionsList = document.getElementById('suggestions-list');
  const platformBadge = document.getElementById('platform-badge');
  const profileName = document.getElementById('profile-name');
  const profileUsername = document.getElementById('profile-username');
  const profileBio = document.getElementById('profile-bio');
  const recentMessages = document.getElementById('recent-messages');
  const messagesList = document.getElementById('messages-list');
  const languageSelect = document.getElementById('language');
  const toneSelect = document.getElementById('tone');
  const generateButton = document.getElementById('generate-button');
  const refreshButton = document.getElementById('refresh-button');
  const retryButton = document.getElementById('retry-button');
  const errorMessage = document.getElementById('error-message');

  // Load saved preferences
  const savedLanguage = await Storage.get('language');
  const savedTone = await Storage.get('tone');
  
  if (savedLanguage) {
    languageSelect.value = savedLanguage;
  }
  if (savedTone) {
    toneSelect.value = savedTone;
  }

  // Initialize state
  let currentProfileData = null;
  let isGenerating = false;

  // Show loading state initially
  showLoading();

  // Get the active tab
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTab = tabs[0];

  // Check if we're on a supported platform
  const url = new URL(currentTab.url);
  const hostname = url.hostname;
  
  // Determine which platform we're on
  let platform = null;
  if (hostname.includes('instagram.com')) {
    platform = 'Instagram';
  } else if (hostname.includes('linkedin.com')) {
    platform = 'LinkedIn';
  } else if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    platform = 'X (Twitter)';
  } else if (hostname.includes('tinder.com')) {
    platform = 'Tinder';
  }

  if (!platform) {
    showError('Please navigate to a supported social media profile (Instagram, LinkedIn, X/Twitter, or Tinder)');
    return;
  }

  platformBadge.textContent = platform;

  try {
    // Execute content script to get profile data
    const results = await chrome.tabs.sendMessage(currentTab.id, { action: 'getProfileData' });
    
    if (!results || !results.success) {
      showError('Could not extract profile data. Make sure you are on a profile page.');
      return;
    }

    currentProfileData = results.data;
    
    // Update UI with profile data
    profileName.textContent = currentProfileData.name || 'Unknown';
    profileUsername.textContent = currentProfileData.username ? `@${currentProfileData.username}` : '';
    profileBio.textContent = currentProfileData.bio || 'No bio available';
    
    // Display recent messages if available
    if (currentProfileData.recentContent && currentProfileData.recentContent.length > 0) {
      recentMessages.classList.remove('hidden');
      messagesList.innerHTML = currentProfileData.recentContent
        .map(content => `<p>${content}</p>`)
        .join('');
    }
    
    // Show content
    showContent();
  } catch (error) {
    console.error('Error:', error);
    
    // Check if content script is not injected yet
    if (error.message.includes('Could not establish connection')) {
      // Inject the content script manually
      await chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        files: ['content.js']
      });
      
      // Try again after injection
      try {
        const results = await chrome.tabs.sendMessage(currentTab.id, { action: 'getProfileData' });
        
        if (!results || !results.success) {
          showError('Could not extract profile data. Make sure you are on a profile page.');
          return;
        }

        currentProfileData = results.data;
        
        // Update UI with profile data
        profileName.textContent = currentProfileData.name || 'Unknown';
        profileUsername.textContent = currentProfileData.username ? `@${currentProfileData.username}` : '';
        profileBio.textContent = currentProfileData.bio || 'No bio available';
        
        // Display recent messages if available
        if (currentProfileData.recentContent && currentProfileData.recentContent.length > 0) {
          recentMessages.classList.remove('hidden');
          messagesList.innerHTML = currentProfileData.recentContent
            .map(content => `<p>${content}</p>`)
            .join('');
        }
        
        // Show content
        showContent();
      } catch (retryError) {
        showError('Error extracting profile data. Please refresh the page and try again.');
      }
    } else {
      showError('Error extracting profile data. Please refresh the page and try again.');
    }
  }

  // Language selection change handler
  languageSelect.addEventListener('change', async () => {
    const selectedLanguage = languageSelect.value;
    await Storage.set('language', selectedLanguage);
  });

  // Generate message button click handler
  generateButton.addEventListener('click', async () => {
    if (isGenerating) return;
    
    const selectedTone = toneSelect.value;
    const selectedLanguage = languageSelect.value;
    
    // Save preferences
    await Storage.set('tone', selectedTone);
    await Storage.set('language', selectedLanguage);
    
    if (!currentProfileData) {
      showError('No profile data available. Please refresh and try again.');
      return;
    }
    
    // Show loading state
    isGenerating = true;
    generateButton.disabled = true;
    generateButton.textContent = API.translations[selectedLanguage].generating;
    
    try {
      const messages = await API.generateMessages(currentProfileData, selectedTone, selectedLanguage);
      
      // Display messages
      displayMessages(messages, selectedLanguage);
      
      // Show messages container
      messagesContainer.classList.remove('hidden');
    } catch (error) {
      console.error('Generation error:', error);
      showError(API.translations[selectedLanguage].error);
    } finally {
      // Reset button
      isGenerating = false;
      generateButton.disabled = false;
      generateButton.textContent = 'Generate Messages';
    }
  });

  // Refresh button click handler
  refreshButton.addEventListener('click', async () => {
    if (isGenerating) return;
    
    const selectedTone = toneSelect.value;
    const selectedLanguage = languageSelect.value;
    
    if (!currentProfileData) {
      showError('No profile data available. Please refresh and try again.');
      return;
    }
    
    // Show loading state
    isGenerating = true;
    refreshButton.disabled = true;
    
    try {
      const messages = await API.generateMessages(currentProfileData, selectedTone, selectedLanguage);
      
      // Display messages
      displayMessages(messages, selectedLanguage);
    } catch (error) {
      console.error('Generation error:', error);
      showError(API.translations[selectedLanguage].error);
    } finally {
      // Reset button
      isGenerating = false;
      refreshButton.disabled = false;
    }
  });

  // Retry button click handler
  retryButton.addEventListener('click', () => {
    window.location.reload();
  });

  // Helper function to display messages
  function displayMessages(messages, language) {
    // Clear previous messages
    suggestionsList.innerHTML = '';
    
    // Add each message to the list
    messages.forEach(message => {
      const messageCard = document.createElement('div');
      messageCard.className = 'message-card';
      
      const messageText = document.createElement('p');
      messageText.className = 'message-text';
      messageText.textContent = message;
      
      const messageActions = document.createElement('div');
      messageActions.className = 'message-actions';
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy
      `;
      
      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(message).then(() => {
          // Show success indicator
          const successIndicator = document.createElement('span');
          successIndicator.className = 'copy-success';
          successIndicator.textContent = API.translations[language].copied;
          messageCard.appendChild(successIndicator);
          
          // Remove after animation
          setTimeout(() => {
            if (messageCard.contains(successIndicator)) {
              messageCard.removeChild(successIndicator);
            }
          }, 1500);
        });
      });
      
      messageActions.appendChild(copyButton);
      messageCard.appendChild(messageText);
      messageCard.appendChild(messageActions);
      suggestionsList.appendChild(messageCard);
    });
  }

  // Helper functions to manage UI state
  function showLoading() {
    loadingContainer.classList.remove('hidden');
    errorContainer.classList.add('hidden');
    contentContainer.classList.add('hidden');
  }

  function showError(message) {
    loadingContainer.classList.add('hidden');
    errorContainer.classList.remove('hidden');
    contentContainer.classList.add('hidden');
    errorMessage.textContent = message;
  }

  function showContent() {
    loadingContainer.classList.add('hidden');
    errorContainer.classList.add('hidden');
    contentContainer.classList.remove('hidden');
  }
});