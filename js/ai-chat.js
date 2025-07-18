// AI Chat Functionality
class AIChat {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.apiKey = null; // Will be set when user provides it
    this.initializeElements();
    this.bindEvents();
    this.setupAutoResize();
  }

  initializeElements() {
    this.chatButton = document.getElementById('aiChatButton');
    this.chatModal = document.getElementById('aiChatModal');
    this.chatClose = document.getElementById('aiChatClose');
    this.chatMessages = document.getElementById('aiChatMessages');
    this.chatInput = document.getElementById('aiChatInput');
    this.chatSend = document.getElementById('aiChatSend');
  }

  bindEvents() {
    this.chatButton.addEventListener('click', () => this.toggleChat());
    this.chatClose.addEventListener('click', () => this.closeChat());
    this.chatSend.addEventListener('click', () => this.sendMessage());
    
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && 
          !this.chatModal.contains(e.target) && 
          !this.chatButton.contains(e.target)) {
        this.closeChat();
      }
    });
  }

  setupAutoResize() {
    this.chatInput.addEventListener('input', () => {
      this.chatInput.style.height = 'auto';
      this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 100) + 'px';
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    this.chatModal.classList.add('show');
    this.chatInput.focus();
    
    // If first time opening, ask for API key
    if (!this.apiKey) {
      this.showApiKeyPrompt();
    }
  }

  closeChat() {
    this.isOpen = false;
    this.chatModal.classList.remove('show');
  }

  showApiKeyPrompt() {
    const message = `
      <div style="background: #333; padding: 15px; border-radius: 10px; margin: 10px 0;">
        <p style="margin: 0 0 10px 0; color: #fff; font-size: 13px;">
          To use the AI assistant, please provide your OpenAI API key:
        </p>
        <input type="password" id="apiKeyInput" placeholder="Enter your OpenAI API key" 
               style="width: 100%; padding: 8px; border: none; border-radius: 5px; background: #222; color: #fff; margin-bottom: 10px;">
        <button onclick="aiChat.setApiKey()" 
                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-size: 12px;">
          Save API Key
        </button>
        <p style="margin: 10px 0 0 0; color: #888; font-size: 11px;">
          Your API key is stored locally and never shared. Get one from <a href="https://platform.openai.com/api-keys" target="_blank" style="color: #667eea;">OpenAI</a>
        </p>
      </div>
    `;
    
    this.addMessage(message, 'bot', true);
  }

  setApiKey() {
    const input = document.getElementById('apiKeyInput');
    const key = input.value.trim();
    
    if (key) {
      this.apiKey = key;
      localStorage.setItem('openai_api_key', key);
      this.addMessage('✅ API key saved! You can now ask me anything.', 'bot');
      
      // Remove the API key prompt
      const apiPrompt = input.closest('.ai-message');
      if (apiPrompt) {
        apiPrompt.remove();
      }
    } else {
      alert('Please enter a valid API key');
    }
  }

  async sendMessage() {
    const message = this.chatInput.value.trim();
    if (!message) return;

    // Check if API key is set
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('openai_api_key');
      if (!this.apiKey) {
        this.showApiKeyPrompt();
        return;
      }
    }

    // Add user message
    this.addMessage(message, 'user');
    this.chatInput.value = '';
    this.chatInput.style.height = 'auto';

    // Show typing indicator
    this.showTypingIndicator();

    try {
      const response = await this.callOpenAI(message);
      this.removeTypingIndicator();
      this.addMessage(response, 'bot');
    } catch (error) {
      this.removeTypingIndicator();
      this.addMessage('Sorry, I encountered an error. Please check your API key and try again.', 'bot');
      console.error('OpenAI API Error:', error);
    }
  }

  async callOpenAI(message) {
    const systemPrompt = `You are an AI assistant for Versico, a student productivity platform created by Rushal. 

    About Versico:
    - Offers student productivity systems and Notion dashboards
    - Services include Personal Dashboard, Career Support, Doubt Solving Help, and Tool Library
    - Pricing: Starter (₹199), Essential (₹399), Premium (₹799)
    - Also offers "Neural Blackbook" for ₹399
    - Created by Rushal, an IIM student
    
    Be helpful, friendly, and knowledgeable about student productivity, study techniques, and Versico's services. Keep responses concise and actionable.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  addMessage(content, sender, isHTML = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}`;
    
    if (isHTML) {
      messageDiv.innerHTML = content;
    } else {
      messageDiv.textContent = content;
    }
    
    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    
    this.chatMessages.appendChild(typingDiv);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
}

// Initialize AI Chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.aiChat = new AIChat();
});