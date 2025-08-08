// Modern Documentation Hub JavaScript
class ModernDocsHub {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupProgressBar();
        this.setupThemeToggle();
        this.setupCopyButtons();
        this.setupBackToTop();
        this.setupSmoothScrolling();
        this.initializeTheme();
    }

    setupEventListeners() {
        // Top navigation clicks
        const navLinks = document.querySelectorAll('.nav-main a, .dropdown-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    this.scrollToSection(href);
                }
            });
        });
    }

    setupIntersectionObserver() {
        const sections = document.querySelectorAll('.content-section');
        const navLinks = document.querySelectorAll('.dropdown-menu a');
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    // Update dropdown navigation
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });

                    // Update main navigation
                    const mainNavLinks = document.querySelectorAll('.nav-main .nav-item');
                    mainNavLinks.forEach(link => {
                        link.classList.remove('active');
                        const section = this.getSectionFromId(id);
                        if (link.getAttribute('href') === `#${section}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    getSectionFromId(id) {
        // Map section IDs to main navigation sections
        const sectionMap = {
            'workflow': 'workflow',
            'heading-structure': 'workflow',
            'style-tags': 'workflow',
            'activity-styles': 'workflow',
            'specialized-styles': 'workflow',
            'code-style': 'workflow',
            'image-styles': 'workflow',
            'conversion-process': 'conversion-process',
            'pandoc-installation': 'conversion-process',
            'powershell-context-menu': 'conversion-process',
            'pandoc-conversion': 'conversion-process',
            'limits': 'limits',
            'troubleshooting': 'troubleshooting'
        };
        return sectionMap[id] || id;
    }

    setupProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (!progressBar) return;

        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial call
    }

    setupThemeToggle() {
        // Theme toggle disabled - light theme only
        return;
    }

    initializeTheme() {
        // Force light theme only
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }

    setupCopyButtons() {
        const codeBlocks = document.querySelectorAll('.code-block');
        
        codeBlocks.forEach(block => {
            // Skip if already has a copy button
            if (block.querySelector('.copy-btn')) return;
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerHTML = '📋 Copy';
            copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
            
            copyBtn.addEventListener('click', async () => {
                const text = block.textContent || block.innerText;
                
                try {
                    await navigator.clipboard.writeText(text);
                    copyBtn.innerHTML = '✅ Copied!';
                    copyBtn.style.background = 'var(--success-color)';
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = '📋 Copy';
                        copyBtn.style.background = 'var(--primary-color)';
                    }, 2000);
                } catch (err) {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-9999px';
                    document.body.appendChild(textArea);
                    textArea.select();
                    
                    try {
                        document.execCommand('copy');
                        copyBtn.innerHTML = '✅ Copied!';
                        setTimeout(() => {
                            copyBtn.innerHTML = '📋 Copy';
                        }, 2000);
                    } catch (fallbackErr) {
                        copyBtn.innerHTML = '❌ Failed';
                        setTimeout(() => {
                            copyBtn.innerHTML = '📋 Copy';
                        }, 2000);
                    }
                    
                    document.body.removeChild(textArea);
                }
            });
            
            block.style.position = 'relative';
            block.appendChild(copyBtn);
        });
    }

    setupBackToTop() {
        const backToTopBtn = document.querySelector('.back-to-top');
        if (!backToTopBtn) return;

        const toggleBackToTop = () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        };

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop(); // Initial call
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling for better UX
        const scrollToSection = (target) => {
            const element = document.querySelector(target);
            if (element) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const offset = element.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        };

        // Store method for external use
        this.scrollToSection = scrollToSection;
    }

    // Removed addQuickActions - buttons were unnecessary clutter

    showCompletionMessage() {
        const message = document.createElement('div');
        message.className = 'alert alert-success';
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.right = '20px';
        message.style.zIndex = '10000';
        message.style.maxWidth = '300px';
        message.innerHTML = `
            <strong>🎉 Great job!</strong><br>
            You've completed the CMP Document Converter setup guide!
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 3000);
    }

    // Analytics and tracking (if needed)
    trackSectionView(sectionId) {
        // Could integrate with analytics here
        console.log(`Section viewed: ${sectionId}`);
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to focus search (if implemented)
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                // Focus search input if available
            }
            
            // Escape to close mobile menu
            if (e.key === 'Escape') {
                // No sidebar to close anymore
            }
            
            // Arrow keys for navigation
            if (e.altKey) {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const hub = new ModernDocsHub();
    
    // Add quick actions after initialization
    setTimeout(() => {
        // hub.addQuickActions(); // Removed - buttons were unnecessary clutter
        hub.setupKeyboardShortcuts();
    }, 100);
    
    // Expose for external use if needed
    window.ModernDocsHub = hub;
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}