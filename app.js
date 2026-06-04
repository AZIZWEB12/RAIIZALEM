document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     PARTICLE BACKGROUND CANVAS (HERO)
     ========================================================================== */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 45;

    const resizeCanvas = () => {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.3 + 0.05;
        // Use brand blues and oranges
        const colors = [
          `rgba(0, 117, 194, ${this.opacity})`,
          `rgba(243, 112, 33, ${this.opacity * 0.6})`,
          `rgba(0, 117, 194, ${this.opacity * 0.4})`
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 117, 194, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawLines();
      requestAnimationFrame(animateParticles);
    };

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
  }

  /* ==========================================================================
     MOBILE MENU Hamburger
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavPanel = document.getElementById('mobile-nav-panel');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMobileMenu = () => {
    mobileMenuBtn.classList.toggle('active');
    mobileNavPanel.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  };

  if (mobileMenuBtn && mobileNavPanel) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Close menu on link click
        mobileMenuBtn.classList.remove('active');
        mobileNavPanel.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  /* ==========================================================================
     SCROLL ACTIVE LINK TRACKING & SMOOTH SCROLL
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav a');

  const updateActiveNavLink = () => {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // navbar height offset
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // Run once initially

  // Smooth scroll click handler for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Account for top-bar + header height
        const offset = 120;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==========================================================================
     SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  // Also add reveal class to all sections that don't have it
  document.querySelectorAll('.section').forEach(section => {
    if (!section.classList.contains('reveal')) {
      section.classList.add('reveal');
    }
  });

  const revealOnScroll = () => {
    const allRevealEls = document.querySelectorAll('.reveal');
    allRevealEls.forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 120;

      if (elementTop < windowHeight - revealPoint) {
        el.classList.add('visible');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Run once on load

  /* ==========================================================================
     INTERACTIVE BUDGET CALCULATOR
     ========================================================================== */
  const calcClasse = document.getElementById('calc-classe');
  const calcFormule = document.getElementById('calc-formule');
  const calcHeures = document.getElementById('calc-heures');
  const hoursDisplay = document.getElementById('hours-display');
  const calcRate = document.getElementById('calc-rate');
  const calcTotal = document.getElementById('calc-total');
  const calcCtaBtn = document.getElementById('calc-cta-btn');

  // Pricing matrix
  const prices = {
    Standard: { intermediaire: 2500, examen: 3000 },
    Premium:  { intermediaire: 3500, examen: 4000 },
    Gold:     { intermediaire: 4500, examen: 5000 }
  };

  const calculateBudget = () => {
    if (!calcClasse || !calcFormule || !calcHeures) return;

    const classeVal = calcClasse.value;
    const formuleVal = calcFormule.value;
    const hours = parseInt(calcHeures.value);

    // Update hours display text
    hoursDisplay.textContent = `${hours} h`;

    // Fetch rate from matrix
    const rate = prices[formuleVal][classeVal];
    
    // Calculate total (weekly hours * 4 weeks)
    const monthlyTotal = rate * hours * 4;

    // Display formatted results
    calcRate.textContent = `${rate.toLocaleString('fr-FR')} FCFA`;
    calcTotal.textContent = `${monthlyTotal.toLocaleString('fr-FR')} FCFA`;
  };

  // Add event listeners for calculator inputs
  if (calcClasse && calcFormule && calcHeures) {
    calcClasse.addEventListener('change', calculateBudget);
    calcFormule.addEventListener('change', calculateBudget);
    calcHeures.addEventListener('input', calculateBudget);
    
    // Initial run
    calculateBudget();
  }

  // CTA button from calculator shifts to form and prefills options
  if (calcCtaBtn) {
    calcCtaBtn.addEventListener('click', () => {
      const selectedFormule = calcFormule.value;
      const selectedClasse = calcClasse.value;
      const hours = calcHeures.value;

      // Prefill contact form
      const formFormule = document.getElementById('form-formule');
      const formClasse = document.getElementById('form-classe');
      const formMessage = document.getElementById('form-message');

      if (formFormule) formFormule.value = selectedFormule;
      if (formClasse) {
        if (selectedClasse === 'examen') {
          formClasse.value = '3e'; // default exam class
        } else {
          formClasse.value = '6e'; // default intermediate class
        }
      }
      if (formMessage) {
        formMessage.value = `Demande de simulation de tarif : Formule ${selectedFormule}, Niveau ${selectedClasse === 'examen' ? 'Examens' : 'Intermédiaire'}, pour ${hours} heures par semaine.`;
      }

      // Smooth scroll to form section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const offset = 120;
        const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  }

  // Select formula button directly from tariff cards
  document.querySelectorAll('.select-formula').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const formulaName = this.getAttribute('data-formula');
      const formFormule = document.getElementById('form-formule');
      if (formFormule) {
        formFormule.value = formulaName;
      }
    });
  });

  /* ==========================================================================
     STATS COUNTER ANIMATION
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateStats = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      const text = stat.textContent;
      
      // Determine if there is a percentage sign or if we just want numbers
      const isPercent = text.includes('%');
      let count = 0;
      const duration = 2000; // 2 seconds
      const speed = Math.max(10, Math.floor(duration / target));

      const counter = setInterval(() => {
        count += Math.ceil(target / (duration / speed));
        if (count >= target) {
          clearInterval(counter);
          stat.textContent = target + (isPercent ? '%' : '');
        } else {
          stat.textContent = count + (isPercent ? '%' : '');
        }
      }, speed);
    });
  };

  // Run counting animation using IntersectionObserver when hero section enters viewport
  const heroSection = document.getElementById('accueil');
  if (heroSection && statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(heroSection);
  }

  /* ==========================================================================
     TESTIMONIALS CAROUSEL
     ========================================================================== */
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dotsContainer = document.getElementById('carousel-dots');

  if (track && prevBtn && nextBtn && dotsContainer) {
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let cardsPerView = 3;
    let autoPlayInterval;

    const getCardsPerView = () => {
      if (window.innerWidth < 600) return 1;
      if (window.innerWidth < 960) return 2;
      return 3;
    };

    const getTotalSlides = () => {
      return Math.ceil(cards.length / cardsPerView);
    };

    const buildDots = () => {
      dotsContainer.innerHTML = '';
      const totalSlides = getTotalSlides();
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === currentIndex) dot.classList.add('active');
        dot.setAttribute('aria-label', `Aller au témoignage ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    };

    const updateCarousel = () => {
      const cardWidth = cards[0].offsetWidth;
      const gap = 32; // 2rem gap
      const translateX = currentIndex * (cardWidth + gap) * cardsPerView;
      track.style.transform = `translateX(-${translateX}px)`;

      // Update dots
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    const goToSlide = (index) => {
      const totalSlides = getTotalSlides();
      currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
      updateCarousel();
    };

    const nextSlide = () => {
      const totalSlides = getTotalSlides();
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    };

    const prevSlide = () => {
      const totalSlides = getTotalSlides();
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    };

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });

    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };

    const handleResize = () => {
      cardsPerView = getCardsPerView();
      currentIndex = 0;
      buildDots();
      updateCarousel();
    };

    // Init
    cardsPerView = getCardsPerView();
    buildDots();
    updateCarousel();
    startAutoPlay();

    window.addEventListener('resize', handleResize);
  }

  /* ==========================================================================
     FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all other FAQ items
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
            const otherBtn = other.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('open');
          answer.style.maxHeight = null;
          questionBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* ==========================================================================
     FORM SUBMISSION → WhatsApp Redirect
     ========================================================================== */
  const inscriptionForm = document.getElementById('inscription-form');
  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');
  const formFeedback = document.getElementById('form-feedback');
  const feedbackCloseBtn = document.getElementById('feedback-close-btn');

  if (inscriptionForm) {
    inscriptionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect form data
      const name = document.getElementById('form-name')?.value || '';
      const phone = document.getElementById('form-phone')?.value || '';
      const classe = document.getElementById('form-classe')?.value || '';
      const formule = document.getElementById('form-formule')?.value || '';
      const message = document.getElementById('form-message')?.value || '';
      
      // Collect selected subjects
      const checkedSubjects = [];
      document.querySelectorAll('input[name="subject"]:checked').forEach(cb => {
        checkedSubjects.push(cb.value);
      });
      const subjectsText = checkedSubjects.length > 0 ? checkedSubjects.join(', ') : 'Non précisé';

      // Build WhatsApp message
      const waMessage = `Bonjour RA YII ZALEM 👋

*Demande d'inscription - Cours à Domicile*

👤 Nom : ${name}
📞 Téléphone : ${phone}
🎓 Classe : ${classe}
📦 Formule : ${formule}
📚 Matières : ${subjectsText}
${message ? `\n📝 Détails : ${message}` : ''}

Merci de me recontacter pour organiser le premier cours !`;

      // Show loader
      if (btnText && btnSpinner) {
        btnText.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
      }

      // Simulate short delay then redirect to WhatsApp
      setTimeout(() => {
        // Hide loader
        if (btnText && btnSpinner) {
          btnText.classList.remove('hidden');
          btnSpinner.classList.add('hidden');
        }

        // Show success popup
        if (formFeedback) {
          formFeedback.classList.remove('hidden');
          document.body.classList.add('no-scroll');
        }

        // Open WhatsApp with pre-filled message
        const encodedMessage = encodeURIComponent(waMessage);
        window.open(`https://wa.me/22607742222?text=${encodedMessage}`, '_blank');
      }, 1200);
    });
  }

  // Close feedback popup
  if (feedbackCloseBtn && formFeedback) {
    feedbackCloseBtn.addEventListener('click', () => {
      formFeedback.classList.add('hidden');
      document.body.classList.remove('no-scroll');
      
      // Reset form
      if (inscriptionForm) {
        inscriptionForm.reset();
      }
    });
  }
});
