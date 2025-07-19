// Immediately inject message handler
(function() {
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getProfileData') {
      try {
        const profileData = extractProfileData();
        sendResponse({ success: true, data: profileData });
      } catch (error) {
        console.error('Error extracting profile data:', error);
        sendResponse({ success: false, error: error.message });
      }
    }
    return true; // Required to use sendResponse asynchronously
  });

  // Function to extract profile data based on the current platform
  function extractProfileData() {
    const url = window.location.href;
    let platform;
    let data = {
      name: '',
      username: '',
      bio: '',
      recentContent: [],
      platform: ''
    };

    // Determine which platform we're on
    if (url.includes('instagram.com')) {
      platform = 'instagram';
      data = extractInstagramData();
    } else if (url.includes('linkedin.com')) {
      platform = 'linkedin';
      data = extractLinkedInData();
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      platform = 'twitter';
      data = extractTwitterData();
    } else if (url.includes('tinder.com')) {
      platform = 'tinder';
      data = extractTinderData();
    } else {
      throw new Error('Unsupported platform');
    }

    data.platform = platform;
    return data;
  }

  // Extract data from Instagram profile
  function extractInstagramData() {
    // Check if we're on a profile page
    if (!window.location.pathname.match(/^\/[^/]+\/?$/)) {
      throw new Error('Not on an Instagram profile page');
    }

    try {
      // Extract name and username
      const headerSection = document.querySelector('header section');
      if (!headerSection) throw new Error('Could not find header section');

      const headings = headerSection.querySelectorAll('h2');
      let name = '';
      let username = '';

      if (headings.length > 0) {
        username = headings[0].textContent.trim();
        name = username; // Instagram often doesn't show full name separately
      }

      // Extract bio
      const bioSpan = document.querySelector('header section span:-webkit-any(h1, span)');
      const bio = bioSpan ? bioSpan.textContent.trim() : '';

      // Extract recent posts (captions)
      const recentContent = [];
      const articles = document.querySelectorAll('article');
      articles.forEach(article => {
        const captionElement = article.querySelector('ul li span');
        if (captionElement) {
          const caption = captionElement.textContent.trim();
          if (caption && !recentContent.includes(caption)) {
            recentContent.push(caption);
          }
        }
      });

      return {
        name,
        username,
        bio,
        recentContent: recentContent.slice(0, 3) // Only take the first 3 posts
      };
    } catch (error) {
      console.error('Error parsing Instagram profile:', error);
      // Return partial data if available
      return {
        name: document.title.split('@')[1] || document.title,
        username: document.title.split('@')[1] || '',
        bio: '',
        recentContent: []
      };
    }
  }

  // Extract data from LinkedIn profile
  function extractLinkedInData() {
    try {
      // Extract name
      const nameElement = document.querySelector('h1');
      const name = nameElement ? nameElement.textContent.trim() : '';

      // Extract headline (similar to bio)
      const headlineElement = document.querySelector('div.text-body-medium');
      const bio = headlineElement ? headlineElement.textContent.trim() : '';

      // Extract username from URL
      const urlParts = window.location.pathname.split('/');
      const username = urlParts.length > 2 ? urlParts[2] : '';

      // Extract recent activity
      const recentContent = [];
      const posts = document.querySelectorAll('.feed-shared-update-v2');
      posts.forEach(post => {
        const contentElement = post.querySelector('.feed-shared-text');
        if (contentElement) {
          const content = contentElement.textContent.trim();
          if (content && !recentContent.includes(content)) {
            recentContent.push(content);
          }
        }
      });

      // Extract skills
      const skills = [];
      const skillElements = document.querySelectorAll('.pv-skill-entity');
      skillElements.forEach(skill => {
        const skillName = skill.querySelector('.pv-skill-entity__skill-name');
        if (skillName) {
          skills.push(skillName.textContent.trim());
        }
      });

      // Add skills to recent content if no posts found
      if (recentContent.length === 0 && skills.length > 0) {
        recentContent.push(`Skills: ${skills.slice(0, 5).join(', ')}`);
      }

      return {
        name,
        username,
        bio,
        recentContent: recentContent.slice(0, 3)
      };
    } catch (error) {
      console.error('Error parsing LinkedIn profile:', error);
      return {
        name: document.title.split('|')[0] || document.title,
        username: '',
        bio: '',
        recentContent: []
      };
    }
  }

  // Extract data from Twitter profile
  function extractTwitterData() {
    try {
      // Extract name and username
      const nameElement = document.querySelector('[data-testid="primaryColumn"] h2 span');
      const name = nameElement ? nameElement.textContent.trim() : '';

      // Extract username from URL or element
      let username = '';
      const urlParts = window.location.pathname.split('/');
      if (urlParts.length > 1) {
        username = urlParts[1];
      }

      // Extract bio
      const bioElement = document.querySelector('[data-testid="userBio"]');
      const bio = bioElement ? bioElement.textContent.trim() : '';

      // Extract recent tweets
      const recentContent = [];
      const tweets = document.querySelectorAll('[data-testid="tweet"]');
      tweets.forEach(tweet => {
        const tweetTextElement = tweet.querySelector('[data-testid="tweetText"]');
        if (tweetTextElement) {
          const tweetText = tweetTextElement.textContent.trim();
          if (tweetText && !recentContent.includes(tweetText)) {
            recentContent.push(tweetText);
          }
        }
      });

      return {
        name,
        username,
        bio,
        recentContent: recentContent.slice(0, 3)
      };
    } catch (error) {
      console.error('Error parsing Twitter profile:', error);
      return {
        name: document.title.split('(')[0] || document.title,
        username: window.location.pathname.split('/')[1] || '',
        bio: '',
        recentContent: []
      };
    }
  }

  // Extract data from Tinder profile
  function extractTinderData() {
    try {
      // Extract name
      const nameElement = document.querySelector('.Typs\\(display-1-strong\\)');
      const name = nameElement ? nameElement.textContent.trim() : '';

      // Tinder doesn't have usernames, so use name
      const username = name;

      // Extract bio
      const bioElement = document.querySelector('.Px\\(16px\\).Py\\(12px\\)');
      const bio = bioElement ? bioElement.textContent.trim() : '';

      // Extract interests/passions
      const interests = [];
      const interestElements = document.querySelectorAll('.Bd');
      interestElements.forEach(interest => {
        interests.push(interest.textContent.trim());
      });

      // Use interests as recent content
      const recentContent = interests.length > 0 
        ? [`Interests: ${interests.join(', ')}`] 
        : [];

      return {
        name,
        username,
        bio,
        recentContent
      };
    } catch (error) {
      console.error('Error parsing Tinder profile:', error);
      return {
        name: document.title || 'Tinder Profile',
        username: '',
        bio: '',
        recentContent: []
      };
    }
  }
})();