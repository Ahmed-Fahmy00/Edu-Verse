// Add password toggle functionality with dark mode support
(function() {
    // Add CSS for password toggle
    const style = document.createElement('style');
    style.textContent = `
        .password-wrapper {
            position: relative;
        }
        
        .password-toggle {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            padding: 4px 8px;
            color: var(--gray);
            transition: var(--transition);
            z-index: 10;
        }
        
        .password-toggle:hover {
            color: var(--primary);
        }
        
        /* Dark mode support */
        body.dark-mode .password-toggle {
            color: #f9fafb !important;
        }
        
        body.dark-mode .password-toggle:hover {
            color: var(--primary) !important;
        }
        
        .password-wrapper input {
            padding-right: 45px !important;
        }
    `;
    document.head.appendChild(style);
    
    // Function to wrap password inputs and add toggle button
    function addPasswordToggles() {
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        
        passwordInputs.forEach(input => {
            // Skip if already wrapped
            if (input.parentElement.classList.contains('password-wrapper')) {
                return;
            }
            
            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'password-wrapper';
            
            // Wrap the input
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            
            // Create toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.type = 'button';
            toggleBtn.className = 'password-toggle';
            toggleBtn.innerHTML = '👁️';
            toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
            
            // Add click handler
            toggleBtn.addEventListener('click', function() {
                if (input.type === 'password') {
                    input.type = 'text';
                    toggleBtn.innerHTML = '🙈';
                } else {
                    input.type = 'password';
                    toggleBtn.innerHTML = '👁️';
                }
            });
            
            wrapper.appendChild(toggleBtn);
        });
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addPasswordToggles);
    } else {
        addPasswordToggles();
    }
    
    // Also run after a short delay to catch dynamically added inputs
    setTimeout(addPasswordToggles, 500);
})();
