// Enhanced message attachments display fix - works with image-fix.js
(function() {
    // Add CSS for proper message attachments display
    const style = document.createElement('style');
    style.textContent = `
        /* Fix message attachment display */
        .message-attachment {
            margin-top: 0.5rem;
            max-width: 100%;
        }
        
        .message-attachment img {
            max-width: 300px !important;
            max-height: 400px !important;
            width: auto !important;
            height: auto !important;
            border-radius: 8px;
            display: block;
            object-fit: contain;
            cursor: pointer;
            transition: var(--transition);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .message-attachment img:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        /* Fix message file display */
        .message-file {
            display: flex !important;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 300px;
            cursor: pointer;
            transition: var(--transition);
            margin-top: 0.5rem;
        }
        
        .message-file:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
        }
        
        .message-file > span:first-child {
            font-size: 2rem;
            flex-shrink: 0;
        }
        
        .message-file > div {
            flex: 1;
            min-width: 0;
        }
        
        .message-file strong {
            display: block;
            font-weight: 600;
            font-size: 0.9rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 0.25rem;
        }
        
        .message-file div > div {
            font-size: 0.75rem;
            opacity: 0.8;
        }
        
        /* Sent message files */
        .message.sent .message-file {
            background: rgba(255, 255, 255, 0.2) !important;
            border-color: rgba(255, 255, 255, 0.3);
        }
        
        .message.sent .message-file:hover {
            background: rgba(255, 255, 255, 0.25) !important;
        }
        
        /* Received message files */
        .message.received .message-file {
            background: rgba(0, 0, 0, 0.05) !important;
            border-color: var(--border);
            color: var(--dark);
        }
        
        .message.received .message-file:hover {
            background: rgba(0, 0, 0, 0.08) !important;
        }
        
        /* Dark mode */
        body.dark-mode .message.received .message-file {
            background: rgba(255, 255, 255, 0.05) !important;
            border-color: #374151 !important;
            color: #f9fafb !important;
        }
        
        body.dark-mode .message.received .message-file:hover {
            background: rgba(255, 255, 255, 0.08) !important;
        }
        
        body.dark-mode .message-attachment img {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        body.dark-mode .message-attachment img:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        
        /* Image modal */
        .image-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s;
        }
        
        .image-modal.active {
            display: flex;
        }
        
        .image-modal img {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 8px;
        }
        
        .image-modal-close {
            position: absolute;
            top: 2rem;
            right: 2rem;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            font-size: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .image-modal-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
        }
    `;
    document.head.appendChild(style);
    
    // Create image modal if it doesn't exist
    if (!document.querySelector('.image-modal')) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <button class="image-modal-close" onclick="closeImageModal()">×</button>
            <img id="modal-image" src="" alt="Full size image">
        `;
        document.body.appendChild(modal);
        
        // Close modal on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImageModal();
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeImageModal();
            }
        });
    }
    
    // Global functions for image modal
    window.openImageModal = function(imageSrc) {
        const modal = document.querySelector('.image-modal');
        const modalImg = document.getElementById('modal-image');
        if (modal && modalImg) {
            modalImg.src = imageSrc;
            modal.classList.add('active');
        }
    };
    
    window.closeImageModal = function() {
        const modal = document.querySelector('.image-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    };
    
    console.log('Message attachments fix loaded');
})();
