// Auto-open the most recent chat when navigating to messages view
(function() {
    // Store the last opened chat in localStorage
    const LAST_CHAT_KEY = 'lastOpenedChat';
    
    // Save last chat when opening a chat
    const originalOpenChat = window.openChat;
    if (originalOpenChat) {
        window.openChat = async function(userId, userName, clickEvent) {
            await originalOpenChat(userId, userName, clickEvent);
            // Save to localStorage
            localStorage.setItem(LAST_CHAT_KEY, JSON.stringify({
                userId: userId,
                userName: userName,
                timestamp: Date.now()
            }));
        };
    }
    
    // Override switchView to auto-open last chat
    const originalSwitchView = window.switchView;
    if (originalSwitchView) {
        window.switchView = function(viewName) {
            originalSwitchView(viewName);
            
            // If switching to messages view, auto-open last chat
            if (viewName === 'messages') {
                setTimeout(() => {
                    autoOpenLastChat();
                }, 500); // Wait for chats to load
            }
        };
    }
    
    // Function to auto-open the last chat or the first available chat
    function autoOpenLastChat() {
        // Try to get last opened chat from localStorage
        const lastChatStr = localStorage.getItem(LAST_CHAT_KEY);
        
        if (lastChatStr) {
            try {
                const lastChat = JSON.parse(lastChatStr);
                // Check if the chat still exists in the list
                const chatItems = document.querySelectorAll('.chat-item');
                
                if (chatItems.length > 0) {
                    // Try to find the last opened chat
                    let foundChat = false;
                    chatItems.forEach(item => {
                        const userName = item.querySelector('div[style*="font-weight:600"]')?.textContent;
                        if (userName === lastChat.userName) {
                            item.click();
                            foundChat = true;
                        }
                    });
                    
                    // If last chat not found, open the first chat
                    if (!foundChat) {
                        chatItems[0].click();
                    }
                }
            } catch (e) {
                console.log('Could not restore last chat:', e);
                openFirstAvailableChat();
            }
        } else {
            // No last chat saved, open first available
            openFirstAvailableChat();
        }
    }
    
    // Function to open the first available chat
    function openFirstAvailableChat() {
        const chatItems = document.querySelectorAll('.chat-item');
        if (chatItems.length > 0) {
            chatItems[0].click();
        }
    }
    
    // Also auto-open when page loads if already on messages view
    window.addEventListener('load', () => {
        setTimeout(() => {
            const messagesView = document.getElementById('messages-view');
            if (messagesView && messagesView.classList.contains('active')) {
                autoOpenLastChat();
            }
        }, 1000);
    });
})();
