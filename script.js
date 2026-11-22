document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================
  // NAVIGATION & MENU TOGGLE
  // ==========================================
  const header = document.getElementById('header');
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change Header background on scroll
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Check on init

  // Mobile Menu Toggle
  if (navToggle && navMenu) {
    const setMenuOpen = (isOpen) => {
      navToggle.classList.toggle('open', isOpen);
      navMenu.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    };

    navToggle.addEventListener('click', () => {
      const isOpen = !navMenu.classList.contains('open');
      setMenuOpen(isOpen);
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        setMenuOpen(false);
      }
    });
  }

  // Active Link Highlighting on scroll
  const sections = document.querySelectorAll('section');
  const handleActiveLink = () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 200; // Offset for header trigger

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', handleActiveLink);
  handleActiveLink(); // Check on init


  // ==========================================
  // HERO TYPING EFFECT
  // ==========================================
  const typedTextSpan = document.getElementById('typed-text');
  const roles = [
    'AI & Data Science Student',
    'Aspiring Software Engineer',
    'Machine Learning Enthusiast',
    'Problem Solver'
  ];
  const typingDelay = 100;
  const erasingDelay = 50;
  const newRoleDelay = 2000; // Delay before starting next word
  let roleIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < roles[roleIndex].length) {
      typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      setTimeout(erase, newRoleDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      roleIndex++;
      if (roleIndex >= roles.length) roleIndex = 0;
      setTimeout(type, typingDelay + 100);
    }
  }

  if (typedTextSpan) {
    setTimeout(type, 1000); // Initial delay
  }


  // ==========================================
  // PROJECT GRID FILTER
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  let filterTimer = null;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button style
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      if (filterTimer) {
        clearTimeout(filterTimer);
      }

      projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95) translateY(14px)';
      });

      filterTimer = setTimeout(() => {
        projectCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          const matches = filterValue === 'all' || category.split(' ').includes(filterValue);

          if (matches) {
            card.classList.remove('hide');
            card.classList.add('active');
            void card.offsetWidth; // Force reflow before fading back in
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          } else {
            card.classList.add('hide');
          }
        });
      }, 250);
    });
  });


  // ==========================================
  // SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, stop observing this item
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before full view
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if observer is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }


  // ==========================================
  // CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const formError = document.getElementById('form-error');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      // Visual submitting state
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <span class="typed-cursor">|</span>';

      formSuccess.style.display = 'none';
      formError.style.display = 'none';

      // Gather input data (validation check)
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        formError.style.display = 'block';
        formError.innerHTML = '<i data-lucide="alert-triangle" style="display: inline-block; vertical-align: middle; margin-right: 0.5rem; width: 18px; height: 18px;"></i> Please fill out all required fields.';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
      }

      // Prepare form data for Web3Forms API
      const formData = new FormData(contactForm);
      // Replace with your Web3Forms Access Key from https://web3forms.com
      const ACCESS_KEY = "877a4c50-56d0-4bbe-96dc-e39cfe8cf1d8";
      formData.append("access_key", ACCESS_KEY);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      })
        .then(async (response) => {
          const result = await response.json();
          if (response.status === 200 || result.success) {
            formSuccess.style.display = 'block';
            contactForm.reset();
          } else {
            formError.style.display = 'block';
            formError.innerHTML = `<i data-lucide="alert-triangle" style="display: inline-block; vertical-align: middle; margin-right: 0.5rem; width: 18px; height: 18px;"></i> ${result.message || 'Failed to send. Please check your network and try again.'}`;
            if (typeof lucide !== 'undefined') lucide.createIcons();
          }
        })
        .catch((error) => {
          formError.style.display = 'block';
          formError.innerHTML = '<i data-lucide="alert-triangle" style="display: inline-block; vertical-align: middle; margin-right: 0.5rem; width: 18px; height: 18px;"></i> Failed to send. Please check your network connection.';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        });
    });
  }

});
