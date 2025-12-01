// Auto-scroll messages to bottom when loaded
function scrollMessagesToBottom() {
    const messagesList = document.getElementById('messages-list');
    if (messagesList) {
        messagesList.scrollTop = messagesList.scrollHeight;
    }
}

// Override the original loadMessages function to add scroll behavior
if (typeof window.loadMessages !== 'undefined') {
    const originalLoadMessages = window.loadMessages;
    window.loadMessages = async function(otherUserId) {
        await originalLoadMessages(otherUserId);
        setTimeout(scrollMessagesToBottom, 100);
    };
}

// Override sendMessage to scroll after sending
if (typeof window.sendMessage !== 'undefined') {
    const originalSendMessage = window.sendMessage;
    window.sendMessage = async function() {
        await originalSendMessage();
        setTimeout(scrollMessagesToBottom, 100);
    };
}

// Observe for new messages and auto-scroll
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            const messagesList = document.getElementById('messages-list');
            if (messagesList && mutation.target === messagesList) {
                scrollMessagesToBottom();
            }
        }
    });
});

// Start observing when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const messagesList = document.getElementById('messages-list');
    if (messagesList) {
        observer.observe(messagesList, {
            childList: true,
            subtree: false
        });
    }
});
