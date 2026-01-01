/**
 * Smooth Scrolling Navigation
 * Handles smooth scrolling when clicking navigation links
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    // Add click event listener to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (targetId === '#') return;
            
            // Find the target element
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate offset for sticky navbar
                const navbarHeight = document.querySelector('.navbar-section')?.offsetHeight || 0;
                
                // Get current scroll position
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                
                // Get element position relative to viewport
                const elementRect = targetElement.getBoundingClientRect();
                
                // Calculate target scroll position
                const targetScroll = currentScroll + elementRect.top - navbarHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: Math.max(0, targetScroll),
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }
            }
        });
    });
    
    // Add active state to navigation links on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const offset = 200; // Offset for navbar and better detection
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionId = section.getAttribute('id');
            const sectionRect = section.getBoundingClientRect();
            const sectionTop = scrollPosition + sectionRect.top;
            const sectionBottom = sectionTop + sectionRect.height;
            
            // Check if current scroll position is within this section
            if (scrollPosition + offset >= sectionTop && scrollPosition + offset < sectionBottom) {
                currentSection = sectionId;
            }
        });
        
        // Update active state for all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Call on scroll
    window.addEventListener('scroll', highlightNavigation);
    
    // Call on page load
    highlightNavigation();
});

/**
 * Add scroll animation effects
 */
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Observe icon items
    const iconItems = document.querySelectorAll('.icon-item');
    iconItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
});

/**
 * Contact Form Submission Handler using Google Apps Script
 * 
 * FREE & UNLIMITED SOLUTION:
 * - Uses Google Apps Script (completely free, unlimited submissions)
 * - Sends email notifications to: nadimhassan99921@gmail.com
 * - Saves all form data to Google Sheets
 * 
 * Google Apps Script must be configured to:
 * 1. Receive POST requests with JSON data
 * 2. Send email via MailApp.sendEmail() to recipientEmail
 * 3. Save data to Google Sheets via SpreadsheetApp
 */
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzHmr6m5rJatAVYYPn_QenccbpmnF5j5yuuq734eW76eMCCwT2iSq0J7rg4ZBn7HcALHg/exec';
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Disable submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>جاري الإرسال...';
            
            // Hide previous messages
            if (formMessage) {
                formMessage.style.display = 'none';
                formMessage.className = 'form-message';
            }
            
            // Get field values
            const fullName = contactForm.querySelector('#fullName').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const phone = contactForm.querySelector('#phone').value.trim();
            const company = contactForm.querySelector('#company').value.trim() || '';
            const message = contactForm.querySelector('#message').value.trim();
            
            // Validate required fields
            if (!fullName || !email || !phone || !message) {
                if (formMessage) {
                    formMessage.style.display = 'block';
                    formMessage.className = 'form-message form-message-error';
                    formMessage.textContent = 'يرجى ملء جميع الحقول المطلوبة.';
                }
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                return;
            }
            
            // Prepare JSON data for Google Apps Script
            // Include recipient email to ensure notification is sent
            const formData = {
                fullName: fullName,
                email: email,
                phone: phone,
                company: company,
                message: message,
                recipientEmail: 'nadimhassan99921@gmail.com' // Email notification recipient
            };
            
            try {
                // Try with CORS first (works when served from a web server)
                let response;
                let data;
                
                try {
                    response = await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    });
                    
                    data = await response.json();
                    
                    if (response.ok && data.status === 'success') {
                        // Success - we can read the response!
                        if (formMessage) {
                            formMessage.style.display = 'block';
                            formMessage.className = 'form-message form-message-success';
                            formMessage.textContent = 'شكراً لك! تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.';
                        }
                        
                        // Reset form
                        contactForm.reset();
                        return; // Exit early on success
                    } else {
                        throw new Error(data.message || 'فشل إرسال الرسالة');
                    }
                } catch (corsError) {
                    // If CORS fails (e.g., when opening from file://), use no-cors mode
                    if (corsError.message.includes('CORS') || corsError.message.includes('Failed to fetch') || corsError.name === 'TypeError') {
                        // Fallback: Use no-cors mode (data still sends, but we can't read response)
                        await fetch(GOOGLE_SCRIPT_URL, {
                            method: 'POST',
                            mode: 'no-cors',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(formData)
                        });
                        
                        // Assume success since we can't read response in no-cors mode
                        // The data is still sent successfully to Google Apps Script
                        if (formMessage) {
                            formMessage.style.display = 'block';
                            formMessage.className = 'form-message form-message-success';
                            formMessage.textContent = 'شكراً لك! تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.';
                        }
                        
                        // Reset form
                        contactForm.reset();
                        return; // Exit early on success
                    } else {
                        // Re-throw if it's a different error
                        throw corsError;
                    }
                }
            } catch (error) {
                // Show error message only for actual errors (not CORS)
                if (formMessage) {
                    formMessage.style.display = 'block';
                    formMessage.className = 'form-message form-message-error';
                    formMessage.textContent = 'عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.';
                }
                console.error('Form submission error:', error);
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
});

