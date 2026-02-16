/**
 * NLWeb Chat - Custom UI for portfolio site
 * Direct integration with Cloudflare Worker /ask endpoint
 * Implements streaming SSE responses and conversation persistence
 */

class NLWebChat {
    constructor(config) {
        this.endpoint = config.endpoint;
        this.site = config.site;
        this.placeholder = config.placeholder || 'Ask a question...';
        this.containerId = config.containerId || 'nlweb-chat-container';
        this.storageKey = config.storageKey || 'nlweb_conversations';
        
        this.currentConversation = null;
        this.conversations = this.loadConversations();
        this.isStreaming = false;
        
        this.init();
    }

    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error('NLWeb Chat: Container not found:', this.containerId);
            return;
        }

        this.setupEventListeners();
        this.startNewConversation();
    }

    setupEventListeners() {
        const form = this.container.querySelector('.nlweb-chat-form');
        const input = this.container.querySelector('.nlweb-chat-input');
        const sendBtn = this.container.querySelector('.nlweb-chat-send');
        const newChatBtn = this.container.querySelector('.nlweb-new-chat-btn');
        const historyBtn = this.container.querySelector('.nlweb-history-btn');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        if (input) {
            input.addEventListener('input', () => {
                this.adjustInputHeight(input);
                if (sendBtn) {
                    sendBtn.disabled = !input.value.trim();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSubmit();
                }
            });
        }

        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => this.startNewConversation());
        }

        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.toggleHistory());
        }
    }

    adjustInputHeight(input) {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    }

    async handleSubmit() {
        const input = this.container.querySelector('.nlweb-chat-input');
        const query = input.value.trim();

        if (!query || this.isStreaming) return;

        input.value = '';
        input.style.height = 'auto';
        this.container.querySelector('.nlweb-chat-send').disabled = true;

        // Add user message to UI
        this.addMessage('user', query);
        
        // Scroll to show the user's message at the top (use requestAnimationFrame to ensure DOM is updated)
        requestAnimationFrame(() => {
            this.scrollToMessage('user');
        });

        // Add to conversation history
        this.currentConversation.messages.push({
            role: 'user',
            content: query,
            timestamp: Date.now()
        });

        // Start streaming response
        await this.streamQuery(query);
    }

    async streamQuery(query) {
        this.isStreaming = true;
        const messagesContainer = this.container.querySelector('.nlweb-chat-messages');
        
        // Ensure messages container is visible
        if (messagesContainer.classList.contains('nlweb-chat-hidden')) {
            messagesContainer.classList.remove('nlweb-chat-hidden');
        }
        
        // Create assistant message container
        const messageEl = this.createMessageElement('assistant');
        const contentEl = messageEl.querySelector('.nlweb-message-content');
        messagesContainer.appendChild(messageEl);
        
        // Scroll to make sure the user's question is at the top
        requestAnimationFrame(() => {
            this.scrollToMessage('user');
        });

        // Show loading state
        const loadingEl = document.createElement('div');
        loadingEl.className = 'nlweb-loading';
        loadingEl.innerHTML = '<span></span><span></span><span></span>';
        contentEl.appendChild(loadingEl);

        let assistantMessage = {
            role: 'assistant',
            content: '',
            results: [],
            timestamp: Date.now()
        };

        try {
            const response = await fetch(`${this.endpoint}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    site: this.site,
                    mode: 'answer'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            // Remove loading indicator
            loadingEl.remove();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep incomplete line in buffer

                for (const line of lines) {
                    if (!line.trim() || !line.startsWith('data: ')) continue;

                    try {
                        const data = JSON.parse(line.slice(6)); // Remove "data: " prefix
                        this.handleStreamEvent(data, contentEl, assistantMessage);
                    } catch (e) {
                        console.error('Error parsing SSE data:', e, line);
                    }
                }
            }

            // Save conversation
            this.currentConversation.messages.push(assistantMessage);
            this.saveConversations();

        } catch (error) {
            console.error('Error streaming query:', error);
            contentEl.innerHTML = `<p class="nlweb-error">Error: ${error.message}</p>`;
        } finally {
            this.isStreaming = false;
            this.container.querySelector('.nlweb-chat-send').disabled = false;
        }
    }

    handleStreamEvent(data, contentEl, assistantMessage) {
        const messageType = data.message_type;

        // Handle multiple message type variations for API compatibility
        switch (messageType) {
            case 'api_version':
            case 'data_retention':
                // API metadata - no UI action needed
                break;

            case 'sites':
                // Sites being searched - optionally show this
                if (data.sites && data.sites.length > 0) {
                    const sitesInfo = document.createElement('small');
                    sitesInfo.className = 'nlweb-sites-info';
                    sitesInfo.textContent = `Searching: ${data.sites.join(', ')}`;
                    contentEl.appendChild(sitesInfo);
                }
                break;

            case 'result_batch':
            case 'results':
                // Search results found
                if (data.results && data.results.length > 0) {
                    assistantMessage.results = data.results;
                    
                    // Generate a summary from the results
                    const summary = this.generateSummaryFromResults(data.results);
                    if (summary) {
                        assistantMessage.content = summary; // Store in message
                        const summaryEl = document.createElement('div');
                        summaryEl.className = 'nlweb-answer-text';
                        summaryEl.textContent = summary;
                        contentEl.appendChild(summaryEl);
                    }
                    
                    // Add a separator
                    const separator = document.createElement('hr');
                    separator.style.margin = 'var(--pico-spacing) 0';
                    separator.style.border = 'none';
                    separator.style.borderTop = '1px solid var(--pico-muted-border-color)';
                    contentEl.appendChild(separator);
                    
                    // Add label for results
                    const resultsLabel = document.createElement('small');
                    resultsLabel.className = 'nlweb-results-label';
                    resultsLabel.textContent = `Found ${data.results.length} relevant page${data.results.length !== 1 ? 's' : ''}:`;
                    resultsLabel.style.display = 'block';
                    resultsLabel.style.marginBottom = 'calc(var(--pico-spacing) / 2)';
                    resultsLabel.style.color = 'var(--pico-muted-color)';
                    contentEl.appendChild(resultsLabel);
                    
                    const resultsContainer = document.createElement('div');
                    resultsContainer.className = 'nlweb-results-container';
                    
                    data.results.forEach(result => {
                        const resultEl = this.createResultElement(result);
                        resultsContainer.appendChild(resultEl);
                    });
                    
                    contentEl.appendChild(resultsContainer);
                }
                break;

            case 'answer':
            case 'content':
                // Streaming answer text
                if (data.content) {
                    let answerEl = contentEl.querySelector('.nlweb-answer-text');
                    if (!answerEl) {
                        answerEl = document.createElement('div');
                        answerEl.className = 'nlweb-answer-text';
                        contentEl.appendChild(answerEl);
                    }
                    
                    assistantMessage.content += data.content;
                    answerEl.textContent = assistantMessage.content;
                }
                break;

            case 'complete':
            case 'done':
                // Stream complete - show fallback message if no content
                if (!assistantMessage.content && assistantMessage.results.length === 0) {
                    const noResultsEl = document.createElement('p');
                    noResultsEl.className = 'nlweb-no-results';
                    noResultsEl.textContent = 'No results found for your query.';
                    contentEl.appendChild(noResultsEl);
                }
                break;

            default:
                // Unknown message type - log for debugging
                console.warn('Unknown message type:', messageType);
        }
    }

    createResultElement(result) {
        const article = document.createElement('article');
        article.className = 'nlweb-result-item';

        // Extract clean title from URL or name
        const title = this.extractTitle(result);
        const titleEl = document.createElement('h4');
        const link = document.createElement('a');
        link.href = result.url || '#';
        link.textContent = title;
        link.target = '_blank';
        link.rel = 'noopener';
        titleEl.appendChild(link);
        article.appendChild(titleEl);

        // Extract and clean description
        const cleanDescription = this.extractCleanDescription(result.description);
        if (cleanDescription) {
            const desc = document.createElement('p');
            desc.textContent = cleanDescription;
            article.appendChild(desc);
        }

        if (result.url) {
            const urlLink = document.createElement('small');
            const urlA = document.createElement('a');
            urlA.href = result.url;
            urlA.textContent = new URL(result.url).pathname;
            urlA.target = '_blank';
            urlA.rel = 'noopener';
            urlLink.appendChild(urlA);
            article.appendChild(urlLink);
        }

        return article;
    }

    extractTitle(result) {
        // Try to get a clean title
        if (result.title && result.title !== result.url) {
            return result.title;
        }
        
        // Extract from URL
        try {
            const url = new URL(result.url);
            const path = url.pathname;
            
            if (path === '/' || path === '/index.html' || path === '/index2.html') {
                return 'Home';
            }
            
            // Remove .html and format
            const title = path
                .replace(/\.html$/, '')
                .replace(/^\//, '')
                .split('/')
                .pop()
                .replace(/-/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            return title || result.name || 'Untitled';
        } catch (e) {
            return result.name || 'Untitled';
        }
    }

    extractCleanDescription(rawDescription) {
        if (!rawDescription) return '';

        let cleaned = rawDescription;

        // Remove complete YAML frontmatter blocks (everything between --- markers)
        cleaned = cleaned.replace(/^---[\s\S]*?---\s*/m, '');
        
        // Remove any remaining YAML-style field markers (more aggressive)
        cleaned = cleaned.replace(/^\s*---\s*/gm, '');
        cleaned = cleaned.replace(/\s*description:\s*/gi, '');
        cleaned = cleaned.replace(/\s*title:\s*/gi, ' ');
        cleaned = cleaned.replace(/\s*image:\s*https?:\/\/[^\s]+/gi, '');
        cleaned = cleaned.replace(/\s*keywords:\s*/gi, '');
        cleaned = cleaned.replace(/\s*author:\s*/gi, '');
        cleaned = cleaned.replace(/\s*tags:\s*/gi, '');
        cleaned = cleaned.replace(/\s*date:\s*/gi, '');
        
        // Remove any URLs (including AWS S3 signed URLs with access keys)
        cleaned = cleaned.replace(/https?:\/\/[^\s]+/gi, '');
        
        // Remove common path patterns that aren't meaningful
        cleaned = cleaned.replace(/\/[a-zA-Z0-9_\-\/]+\.html/g, '');
        cleaned = cleaned.replace(/\/[a-zA-Z0-9_\-\/]+\.pdf/g, '');
        
        // Clean up multiple spaces and newlines
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        // If cleaned text is too short or meaningless, return empty
        if (cleaned.length < 20) return '';

        // Truncate to reasonable length
        if (cleaned.length > 200) {
            cleaned = cleaned.substring(0, 200).trim();
            // Try to break at a sentence or word boundary
            const lastPeriod = cleaned.lastIndexOf('.');
            const lastSpace = cleaned.lastIndexOf(' ');
            if (lastPeriod > 150) {
                cleaned = cleaned.substring(0, lastPeriod + 1);
            } else if (lastSpace > 150) {
                cleaned = cleaned.substring(0, lastSpace) + '...';
            } else {
                cleaned += '...';
            }
        }

        return cleaned;
    }

    generateSummaryFromResults(results) {
        if (!results || results.length === 0) return '';

        // Build a simple summary
        let summary = `I found ${results.length} relevant page${results.length !== 1 ? 's' : ''} that may help answer your question.`;

        return summary;
    }

    createMessageElement(role) {
        const messageEl = document.createElement('div');
        messageEl.className = `nlweb-message nlweb-message-${role}`;

        const contentEl = document.createElement('div');
        contentEl.className = 'nlweb-message-content';

        messageEl.appendChild(contentEl);
        return messageEl;
    }

    addMessage(role, content) {
        const messagesContainer = this.container.querySelector('.nlweb-chat-messages');
        
        // Show the messages container when the first message is added
        if (messagesContainer.classList.contains('nlweb-chat-hidden')) {
            messagesContainer.classList.remove('nlweb-chat-hidden');
        }
        
        const messageEl = this.createMessageElement(role);
        const contentEl = messageEl.querySelector('.nlweb-message-content');
        
        const textEl = document.createElement('div');
        textEl.className = 'nlweb-message-text';
        textEl.textContent = content;
        contentEl.appendChild(textEl);

        messagesContainer.appendChild(messageEl);
    }

    scrollToMessage(role) {
        const messagesContainer = this.container.querySelector('.nlweb-chat-messages');
        if (!messagesContainer) return;

        // Find the last message of the specified role
        const messages = messagesContainer.querySelectorAll(`.nlweb-message-${role}`);
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        
        // Calculate position to scroll the message to the top
        const containerRect = messagesContainer.getBoundingClientRect();
        const messageRect = lastMessage.getBoundingClientRect();
        
        // Calculate the scroll position needed
        const currentScrollTop = messagesContainer.scrollTop;
        const messageOffsetFromTop = messageRect.top - containerRect.top;
        const targetScrollTop = currentScrollTop + messageOffsetFromTop - 20; // 20px padding
        
        // Smooth scroll to position
        messagesContainer.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });
    }

    startNewConversation() {
        this.currentConversation = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            title: 'New Conversation',
            messages: []
        };

        // Clear messages and hide container
        const messagesContainer = this.container.querySelector('.nlweb-chat-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
            messagesContainer.classList.add('nlweb-chat-hidden');
        }

        // Focus input
        const input = this.container.querySelector('.nlweb-chat-input');
        if (input) {
            input.focus();
        }
    }

    toggleHistory() {
        const historyPanel = this.container.querySelector('.nlweb-history-panel');
        if (historyPanel) {
            historyPanel.classList.toggle('show');
        }
    }

    loadConversations() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error loading conversations:', e);
            return [];
        }
    }

    saveConversations() {
        try {
            // Update or add current conversation
            const index = this.conversations.findIndex(c => c.id === this.currentConversation.id);
            if (index >= 0) {
                this.conversations[index] = this.currentConversation;
            } else {
                this.conversations.unshift(this.currentConversation);
            }

            // Generate title from first message if still "New Conversation"
            if (this.currentConversation.title === 'New Conversation' && this.currentConversation.messages.length > 0) {
                const firstUserMessage = this.currentConversation.messages.find(m => m.role === 'user');
                if (firstUserMessage) {
                    this.currentConversation.title = firstUserMessage.content.slice(0, 50);
                    if (firstUserMessage.content.length > 50) {
                        this.currentConversation.title += '...';
                    }
                }
            }

            // Keep only last 50 conversations
            this.conversations = this.conversations.slice(0, 50);

            localStorage.setItem(this.storageKey, JSON.stringify(this.conversations));
        } catch (e) {
            console.error('Error saving conversations:', e);
        }
    }
}

// Auto-initialize if config is present
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('nlweb-chat-container');
    if (container && container.dataset.endpoint) {
        new NLWebChat({
            containerId: 'nlweb-chat-container',
            endpoint: container.dataset.endpoint,
            site: container.dataset.site,
            placeholder: container.dataset.placeholder,
            storageKey: container.dataset.storageKey || 'nlweb_conversations'
        });
    }
});
