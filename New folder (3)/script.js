/* script.js */
document.addEventListener('DOMContentLoaded', () => {

    // 0. Cinematic Loader Logic
    const loader = document.getElementById('loader-wrapper');
    if (loader) {
        // Failsafe timeout: hide after 4 seconds regardless of network speed
        const fallbackTimeout = setTimeout(() => {
            loader.classList.add('fade-out');
        }, 4000);

        // Standard wait for page structural assets to load
        window.addEventListener('load', () => {
            clearTimeout(fallbackTimeout);
            // Small delay so the spinner feels deliberate
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 800);
        });
    }

    // 0.5 Intro Popup Logic
    const introPopup = document.getElementById('intro-popup');
    const closePopupBtn = document.getElementById('close-popup');
    const confusedBtn = document.getElementById('confused-btn');
    const mobileConfusedBtn = document.getElementById('mobile-confused-link');

    if (introPopup && closePopupBtn) {
        // Prevent scrolling while popup is open initially
        document.body.style.overflow = 'hidden';

        closePopupBtn.addEventListener('click', () => {
            introPopup.classList.remove('active');
            document.body.style.overflow = '';
        });

        const openPopup = (e) => {
            e.preventDefault();
            introPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Close mobile menu if it's open
            const hamburger = document.getElementById('hamburger-icon');
            const mobileMenu = document.getElementById('mobile-menu');
            if(hamburger && mobileMenu) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        };

        if (confusedBtn) confusedBtn.addEventListener('click', openPopup);
        if (mobileConfusedBtn) mobileConfusedBtn.addEventListener('click', openPopup);
    }

    // 1. Initialize Title Lettering
    const animateTexts = document.querySelectorAll('.animate-text');
    
    animateTexts.forEach(el => {
        const text = el.getAttribute('data-text');
        const offset = parseInt(el.getAttribute('data-delay-offset') || '0', 10);
        const words = text.split(' ');
        
        let charCount = 0;
        el.innerHTML = words.map(word => {
            const wordHtml = word.split('').map(char => {
                const delay = offset + (charCount * 30);
                charCount++;
                return `<span class="letter" style="transition-delay: ${delay}ms">${char}</span>`;
            }).join('');
            charCount++; // Account for the space
            return `<span class="word">${wordHtml}</span>`;
        }).join(' ');
    });

    // 2. Intersection Observer for Letter Pop Animation
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const letters = entry.target.querySelectorAll('.letter');
                letters.forEach(letter => letter.classList.add('active'));
            }
        });
    }, { threshold: 0.5 });

    animateTexts.forEach(text => titleObserver.observe(text));

    // 2.5 Typing Animation Observer
    const typeTexts = document.querySelectorAll('.type-text');
    const typeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                if (!target.classList.contains('animated')) {
                    target.classList.add('animated');
                    const text = target.getAttribute('data-text');
                    const offset = parseInt(target.getAttribute('data-delay-offset') || '0', 10);
                    
                    target.innerHTML = '<span class="cursor"></span>';
                    
                    setTimeout(() => {
                        let i = 0;
                        const speed = parseInt(target.getAttribute('data-speed') || '60', 10);
                        const interval = setInterval(() => {
                            if (i < text.length) {
                                const charNode = document.createTextNode(text.charAt(i));
                                target.insertBefore(charNode, target.querySelector('.cursor'));
                                i++;
                            } else {
                                clearInterval(interval);
                                const cursor = target.querySelector('.cursor');
                                if (cursor) cursor.remove();
                            }
                        }, speed); // Dynamic speed of typing
                    }, offset);
                }
            }
        });
    }, { threshold: 0.5 });
    typeTexts.forEach(text => typeObserver.observe(text));

    // 3. Tile Reveal Logic (Fade In)
    const tileObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-tile').forEach(tile => {
        tile.style.opacity = '0';
        tile.style.transform = 'translateY(50px)';
        tile.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        tileObserver.observe(tile);
    });
    // ... your existing Intersection Observer code ...

    // 4. Scroll Down Button Logic
    const scrollButton = document.querySelector('.scroll-down');
    const firstChapter = document.getElementById('chapter-1');

    if (scrollButton && firstChapter) {
        scrollButton.addEventListener('click', () => {
            firstChapter.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // 5. Mobile Menu Toggle Logic
    const hamburger = document.getElementById('hamburger-icon');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            // Toggle body scroll to prevent background scrolling when menu is open
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

});
