// Message reply and delete functionality
(function() {
    // Add CSS for message actions
    const style = document.createElement('style');
    style.textContent = `
        .message-wrapper {
            position: relative;
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            animation: fadeIn 0.3s;
        }
        
        .message-wrapper.sent {
            flex-direction: row-reverse;
        }
        
        .message-actions {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            opacity: 0;
            transition: opacity 0.2s;
        }
        
        .message-wrapper:hover .message-actions {
            opacity: 1;
        }
        
        .message-action-btn {
            width: 28px;
            height: 28px;
            border: none;
            background: var(--light-gray);
            border-radius: 50%;
            cursor: pointer;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
            padding: 0;
        }
        
        .message-action-btn:hover {
            background: var(--primary);
            color: white;
            transform: scale(1.1);
        }
        
        .message-action-btn.delete:hover {
            background: var(--danger);
        }
        
        .reply-indicator {
            background: var(--light-gray);
            padding: 0.5rem;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            border-left: 3px solid var(--primary);
            font-size: 0.85rem;
            color: var(--gray);
        }
        
        .reply-indicator strong {
            color: var(--primary);
            display: block;
            margin-bottom: 0.25rem;
        }
        
        .reply-preview {
            background: rgba(99, 102, 241, 0.1);
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            margin-bottom: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-left: 3px solid var(--primary);
        }
        
        .reply-preview-content {
            flex: 1;
        }
        
        .reply-preview-label {
            font-size: 0.75rem;
            color: var(--primary);
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        
        .reply-preview-text {
            font-size: 0.85rem;
            color: var(--gray);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .reply-cancel-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            color: var(--gray);
            padding: 0.25rem;
            transition: var(--transition);
        }
        
        .reply-cancel-btn:hover {
            color: var(--danger);
            transform: rotate(90deg);
        }
        
        /* Dark mode support */
        body.dark-mode .message-action-btn {
            background: #374151 !important;
            color: #f9fafb !important;
        }
        
        body.dark-mode .message-action-btn:hover {
            background: var(--primary) !important;
            color: white !important;
        }
        
        body.dark-mode .message-action-btn.delete:hover {
            background: var(--danger) !important;
        }
        
        body.dark-mode .reply-indicator {
            background: #374151 !important;
            color: #9ca3af !important;
        }
        
        body.dark-mode .reply-indicator strong {
            color: var(--primary) !important;
        }
        
        body.dark-mode .reply-preview {
            background: rgba(99, 102, 241, 0.2) !important;
        }
        
        body.dark-mode .reply-preview-text {
            color: #9ca3af !important;
        }
    `;
    document.head.appendChild(style);
    
    // Store reply context
    let replyingTo = null;
    
    // Function to add action buttons to messages
    function addMessageActions() {
        const messagesList = document.getElementById('messages-list');
        if (!messagesList) return;
        
        const messages = messagesList.querySelectorAll('.message');
        
        messages.forEach(message => {
            // Skip if already has actions
            if (message.parentElement.classList.contains('message-wrapper')) {
                return;
            }
            
            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'message-wrapper';
            if (message.classList.contains('sent')) {
                wrapper.classList.add('sent');
            }
            
            // Wrap the message
            message.parentNode.insertBefore(wrapper, message);
            wrapper.appendChild(message);
            
            // Create actions container
            const actions = document.createElement('div');
            actions.className = 'message-actions';
            
            // Reply button
            const replyBtn = document.createElement('button');
            replyBtn.className = 'message-action-btn reply';
            replyBtn.innerHTML = '↩️';
            replyBtn.title = 'Reply';
            replyBtn.onclick = () => replyToMessage(message);
            
            // Delete button (only for sent messages)
            if (message.classList.contains('sent')) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'message-action-btn delete';
                deleteBtn.innerHTML = '🗑️';
                deleteBtn.title = 'Delete';
                deleteBtn.onclick = () => deleteMessage(message);
                actions.appendChild(deleteBtn);
            }
            
            actions.appendChild(replyBtn);
            wrapper.appendChild(actions);
        });
    }
    
    // Function to handle reply
    function replyToMessage(messageElement) {
        const messageBubble = messageElement.querySelector('.message-bubble');
        const isSent = messageElement.classList.contains('sent');
        
        // Get the full text content from the bubble
        const timeElement = messageBubble.querySelector('.message-time');
        const replyIndicator = messageBubble.querySelector('.message-reply-indicator');
        
        // Clone the bubble to extract text
        const bubbleClone = messageBubble.cloneNode(true);
        
        // Remove time and reply indicator from clone
        const cloneTime = bubbleClone.querySelector('.message-time');
        const cloneReply = bubbleClone.querySelector('.message-reply-indicator');
        if (cloneTime) cloneTime.remove();
        if (cloneReply) cloneReply.remove();
        
        // Get text content
        let messageText = bubbleClone.textContent.trim();
        
        // Check for attachments
        const hasImage = messageBubble.querySelector('.message-attachment img');
        const hasFile = messageBubble.querySelector('.message-file');
        
        // If it's an image, use "📷 Image" as text
        if (hasImage && !messageText) {
            messageText = '📷 Image';
        }
        // If it's a file, use filename
        else if (hasFile) {
            const fileName = hasFile.querySelector('strong')?.textContent || 'File';
            messageText = `📄 ${fileName}`;
        }
        
        // Store reply context
        replyingTo = {
            text: messageText || 'Message',
            sender: isSent ? 'You' : (typeof currentChat !== 'undefined' && currentChat ? currentChat.userName : 'User'),
            hasImage: !!hasImage,
            hasFile: !!hasFile,
            fileName: hasFile ? hasFile.querySelector('strong')?.textContent : null
        };
        
        console.log('Reply context set:', replyingTo);
        
        // Show reply preview
        showReplyPreview();
        
        // Focus on input
        const input = document.getElementById('message-text');
        if (input) input.focus();
    }
    
    // Function to show reply preview (WhatsApp style)
    function showReplyPreview() {
        if (!replyingTo) return;
        
        console.log('Showing reply preview for:', replyingTo);
        
        // Remove existing preview
        const existingPreview = document.querySelector('.reply-preview');
        if (existingPreview) existingPreview.remove();
        
        // Truncate long text
        const maxLength = 50;
        const text = replyingTo.text || 'Message';
        const previewText = text.length > maxLength 
            ? text.substring(0, maxLength) + '...' 
            : text;
        
        // Create preview
        const preview = document.createElement('div');
        preview.className = 'reply-preview';
        preview.innerHTML = `
            <div class="reply-preview-content">
                <div class="reply-preview-label">Replying to ${replyingTo.sender}</div>
                <div class="reply-preview-text">${previewText}</div>
            </div>
            <button class="reply-cancel-btn" onclick="cancelReply()">✕</button>
        `;
        
        // Insert before message input
        const messageInput = document.querySelector('.message-input');
        if (messageInput) {
            messageInput.insertBefore(preview, messageInput.firstChild);
            console.log('Reply preview added to DOM');
        } else {
            console.error('Message input not found');
        }
    }
    
    // Function to cancel reply
    window.cancelReply = function() {
        replyingTo = null;
        const preview = document.querySelector('.reply-preview');
        if (preview) preview.remove();
    };
    
    // Function to delete message (calls backend)
    async function deleteMessage(messageElement) {
        // Get message ID from data attribute
        const messageId = messageElement.dataset.messageId;
        
        if (!messageId) {
            showToast('Cannot delete: Message ID not found');
            return;
        }
        
        // Remove from DOM with animation first (optimistic UI)
        const wrapper = messageElement.closest('.message-wrapper');
        if (wrapper) {
            wrapper.style.opacity = '0';
            wrapper.style.transform = 'translateX(20px)';
            wrapper.style.transition = 'all 0.3s ease';
            
            setTimeout(async () => {
                try {
                    // Get currentUser and API_URL from global scope (not window.)
                    if (typeof currentUser === 'undefined' || !currentUser || !currentUser._id) {
                        showToast('Error: User not logged in');
                        wrapper.style.opacity = '1';
                        wrapper.style.transform = 'translateX(0)';
                        return;
                    }
                    
                    // Call backend to delete
                    const response = await fetch(`${API_URL}/messages/${messageId}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: currentUser._id })
                    });
                    
                    if (response.ok) {
                        wrapper.remove();
                        showToast('Message deleted');
                    } else {
                        // Restore if delete failed
                        wrapper.style.opacity = '1';
                        wrapper.style.transform = 'translateX(0)';
                        const error = await response.json();
                        showToast('Delete failed: ' + (error.error || 'Unknown error'));
                    }
                } catch (err) {
                    // Restore if delete failed
                    wrapper.style.opacity = '1';
                    wrapper.style.transform = 'translateX(0)';
                    showToast('Delete failed: ' + err.message);
                }
            }, 300);
        }
    }
    
    // Function to show toast notification
    function showToast(message) {
        // Remove existing toast
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();
        
        // Create toast
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--success);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: fadeIn 0.3s;
        `;
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Store the reply data globally so sendMessage can access it
    window.getReplyData = function() {
        return replyingTo;
    };
    
    // Hook into send to clear reply (don't override sendMessage)
    setTimeout(() => {
        const sendBtn = document.querySelector('.message-input .btn-primary');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                setTimeout(() => {
                    window.cancelReply();
                }, 500);
            });
        }
        
        // Also hook into Enter key
        const messageInput = document.getElementById('message-text');
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    setTimeout(() => {
                        window.cancelReply();
                    }, 500);
                }
            });
        }
    }, 2000);
    
    // Run when messages view is opened
    document.addEventListener('DOMContentLoaded', () => {
        // Observe for messages being loaded
        const observer = new MutationObserver(() => {
            addMessageActions();
        });
        
        const messagesList = document.getElementById('messages-list');
        if (messagesList) {
            observer.observe(messagesList, {
                childList: true,
                subtree: false
            });
        }
    });
    
    // Also run after delays to catch initial messages
    setTimeout(addMessageActions, 1500);
    setTimeout(addMessageActions, 3000);
})();
