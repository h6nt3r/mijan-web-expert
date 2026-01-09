document.addEventListener('DOMContentLoaded', () => {
    // Scroll to Top Logic
    const scrollToTopBtn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', () => {
        // Show button after 10% of page height is scrolled
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 10) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Social Share Functionality
    const shareBtns = document.querySelectorAll('.share-btn');
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    shareBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            if (btn.classList.contains('facebook')) {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`, '_blank');
            } else if (btn.classList.contains('x-twitter')) {
                window.open(`https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`, '_blank');
            } else if (btn.classList.contains('linkedin')) {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`, '_blank');
            } else if (btn.classList.contains('whatsapp')) {
                window.open(`https://api.whatsapp.com/send?text=${pageUrl}`, '_blank');
            } else if (btn.classList.contains('instagram')) {
                window.open('https://www.instagram.com/', '_blank');
            } else if (btn.classList.contains('tiktok')) {
                window.open('https://www.tiktok.com/', '_blank');
            } else if (btn.classList.contains('copy-link')) {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    const icon = btn.querySelector('i');
                    const originalClass = icon.className;
                    icon.className = 'fas fa-check';
                    setTimeout(() => {
                        icon.className = originalClass;
                    }, 2000);
                });
            }
        });
    });

    // Simple Mobile Menu Toggle (logic only)
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            // In a real implementation, this would show/hide the menu
            alert('Mobile menu clicked! (Implementing full mobile menu soon)');
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });

        // Initialize active item
        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });

    // Dynamic Tooltip Positioning
    const serviceCards = document.querySelectorAll('.service-card');
    const servicesGrid = document.querySelector('.services-grid');

    const positionTooltip = (card) => {
        const tooltip = card.querySelector('.service-details');
        if (!tooltip) return;
        tooltip.classList.remove('tooltip-left');
        const rect = tooltip.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            tooltip.classList.add('tooltip-left');
        }
    };

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Remove default active state if it exists
            if (servicesGrid && servicesGrid.classList.contains('has-default-active')) {
                servicesGrid.classList.remove('has-default-active');
            }
            positionTooltip(card);
        });
    });

    // Initial position for default active card if it exists
    const defaultActive = document.querySelector('.service-card.active-default');
    if (defaultActive) {
        positionTooltip(defaultActive);
    }

    // Hero Typing Animation
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: [
                'AI Automation',
                'AI Agent Making',
                'Web Design',
                'Web Development',
                'Website Security',
                'Penetration Testing'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            cursorChar: '|'
        });
    }

    // Counter Animation for Why Us Section
    const animateCounter = (element, target, duration) => {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = Math.ceil(target);
                clearInterval(timer);
            } else {
                element.textContent = Math.ceil(current);
            }
        }, 16);
    };

    // Intersection Observer for Why Us counters
    const whyUsSection = document.querySelector('#why-us');
    if (whyUsSection) {
        const counters = whyUsSection.querySelectorAll('.why-number');
        let hasAnimated = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target'));
                        animateCounter(counter, target, 2500); // 2.5 seconds
                    });
                }
            });
        }, {
            threshold: 0.3 // Trigger when 30% of section is visible
        });

        observer.observe(whyUsSection);
    }

    // Portfolio Filter System
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let visibleCount = 8; // Show 8 cards initially (2 rows of 4)

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            visibleCount = 8; // Reset visible count

            // Count how many items we've shown for this filter
            let shownCount = 0;

            portfolioCards.forEach((card) => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    if (shownCount < visibleCount) {
                        card.classList.remove('hidden');
                        shownCount++;
                    } else {
                        card.classList.add('hidden');
                    }
                } else {
                    card.classList.add('hidden');
                }
            });

            // Update Load More button visibility
            updateLoadMoreBtn(filter);
        });
    });

    // Load More functionality
    function updateLoadMoreBtn(filter) {
        const visibleCards = Array.from(portfolioCards).filter(card => {
            const category = card.getAttribute('data-category');
            return filter === 'all' || category === filter;
        });

        if (visibleCards.length > visibleCount) {
            loadMoreBtn.classList.remove('hidden');
        } else {
            loadMoreBtn.classList.add('hidden');
        }
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');

            visibleCount += 4;
            let shownCount = 0;

            portfolioCards.forEach((card) => {
                const category = card.getAttribute('data-category');

                if (activeFilter === 'all' || category === activeFilter) {
                    if (shownCount < visibleCount) {
                        card.classList.remove('hidden');
                        shownCount++;
                    }
                }
            });

            updateLoadMoreBtn(activeFilter);
        });
    }

    // Initialize: Hide cards beyond first 8
    portfolioCards.forEach((card, index) => {
        if (index >= 8) {
            card.classList.add('hidden');
        }
    });

    // Check if Load More button should be shown initially
    if (portfolioCards.length > 8) {
        loadMoreBtn.classList.remove('hidden');
    } else {
        loadMoreBtn.classList.add('hidden');
    }

    // Lightbox functionality
    const lightbox = document.getElementById('portfolioLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.querySelector('.lightbox-close');
    const viewFullBtns = document.querySelectorAll('.view-full-btn');

    viewFullBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const imageUrl = btn.getAttribute('data-image');
            lightboxImage.src = imageUrl;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on overlay click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    // Testimonial Carousel
    const track = document.querySelector('.testimonial-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.slider-dots');

        if (slides.length > 0) {
            // Function to get current slide width
            const getSlideWidth = () => slides[0].getBoundingClientRect().width;

            // Create dots
            // Note: Since we have 2 items per view on desktop, we might want fewer dots,
            // but sticking to 1 dot per item allows direct access to any item start position.
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    moveToSlide(index);
                    if (!isHovering) resetAutoPlay();
                });
                dotsNav.appendChild(dot);
            });

            const dots = Array.from(dotsNav.children);
            let currentSlideIndex = 0;
            let isHovering = false;

            const updateDots = (targetIndex) => {
                dots.forEach(dot => dot.classList.remove('active'));
                if (dots[targetIndex]) {
                    dots[targetIndex].classList.add('active');
                }
            };

            const moveToSlide = (targetIndex) => {
                const slideWidth = getSlideWidth();

                if (targetIndex < 0) {
                    targetIndex = slides.length - 1;
                } else if (targetIndex >= slides.length) {
                    targetIndex = 0;
                }

                // Translate using pixels to handle potentially changing widths
                track.style.transform = `translateX(-${targetIndex * slideWidth}px)`;
                currentSlideIndex = targetIndex;
                updateDots(currentSlideIndex);
            };

            // Auto Play Logic
            let autoPlayInterval;

            const startAutoPlay = () => {
                clearInterval(autoPlayInterval); // Clear any existing
                autoPlayInterval = setInterval(() => {
                    moveToSlide(currentSlideIndex + 1);
                }, 3000);
            };

            const resetAutoPlay = () => {
                // If hovering, we do NOTHING. The interval is already cleared by mouseenter.
                // If we restart it here, it defeats the hover pause.
                if (isHovering) return;
                startAutoPlay();
            };

            // Start initially
            startAutoPlay();

            // Event Listeners
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    moveToSlide(currentSlideIndex + 1);
                    if (!isHovering) resetAutoPlay();
                });
            }

            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    moveToSlide(currentSlideIndex - 1);
                    if (!isHovering) resetAutoPlay();
                });
            }

            // Hover Pause
            const container = document.querySelector('.testimonial-slider-container');
            if (container) {
                container.addEventListener('mouseenter', () => {
                    isHovering = true;
                    clearInterval(autoPlayInterval);
                });

                container.addEventListener('mouseleave', () => {
                    isHovering = false;
                    startAutoPlay();
                });
            }

            // Handle Resize
            window.addEventListener('resize', () => {
                const slideWidth = getSlideWidth();
                // Re-arrange just in case (though flex handles layout)
                // Re-center current slide
                track.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
            });

            // Initial positioning helper if needed (not strictly necessary with flex + transform)
            const initSlideWidth = getSlideWidth();
            slides.forEach((slide, index) => {
                slide.style.left = initSlideWidth * index + 'px';
            });
        }
    }

    // Why Us Number Animation
    const whySection = document.querySelector('.why-us-section');
    const whyNumbers = document.querySelectorAll('.why-number');
    let started = false; // Function started ? No

    if (whySection && whyNumbers.length > 0) {
        const startCount = (el) => {
            const target = parseInt(el.dataset.target);
            const duration = 2000; // 2 seconds
            const step = Math.ceil(target / (duration / 16)); // 60fps approx
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                } else {
                    el.textContent = current;
                }
            }, 16);
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started) {
                whyNumbers.forEach((num) => startCount(num));
                started = true;
            }
        }, { threshold: 0.5 });

        observer.observe(whySection);
    }
});
