/**
 * Parichay Production (परिचय) — Interactive Production Engine
 * Lightweight, zero-dependency, high-performance vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. HEADER SCROLL & NAVIGATION
     ========================================================================== */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // Multi-page active navigation detection
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Active section indicator for homepage sections with hash anchors
  if (currentPath === 'index.html' || currentPath === '') {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => navObserver.observe(section));
  }

  /* ==========================================================================
     2. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Backdrop element for drawer
  let drawerBackdrop = document.querySelector('.mobile-drawer-backdrop');
  if (!drawerBackdrop && mobileDrawer) {
    drawerBackdrop = document.createElement('div');
    drawerBackdrop.className = 'mobile-drawer-backdrop';
    drawerBackdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(drawerBackdrop);
  }

  const openDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    if (drawerBackdrop) drawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* ==========================================================================
     3. NUMERIC COUNTER ANIMATION
     ========================================================================== */
  const counterElements = document.querySelectorAll('.metric-value[data-target]');
  let countersAnimated = false;

  const animateCounters = () => {
    counterElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = `${current}${suffix}`;
      }, 35);
    });
  };

  const heroRibbon = document.querySelector('.hero-metrics-ribbon');
  if (heroRibbon) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });
    counterObserver.observe(heroRibbon);
  }

  /* ==========================================================================
     4. FEATURED WORK FILTERING
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = card.classList.contains('featured-span') ? 'grid' : 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  /* ==========================================================================
     5. CINEMATIC VIDEO / SHOWREEL MODAL
     ========================================================================== */
  const videoModal = document.getElementById('videoModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalPlayerPoster = document.getElementById('modalPlayerPoster');
  const openShowreelBtn = document.getElementById('openShowreelBtn');
  const previewButtons = document.querySelectorAll('.preview-btn');
  const playerPlayToggle = document.getElementById('playerPlayToggle');

  const openModal = (title, desc, poster) => {
    if (!videoModal) return;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalPlayerPoster && poster) modalPlayerPoster.src = poster;
    
    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!videoModal) return;
    videoModal.classList.remove('active');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openShowreelBtn) {
    openShowreelBtn.addEventListener('click', () => {
      openModal(
        'Parichay Production — Agency Master Showreel 2026',
        'Directing brand identities, TVCs, documentary wedding narratives, and viral reels that drive real business metrics across India.',
        'assets/images/hero_cinema.jpg'
      );
    });
  }

  previewButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-card');
      const img = card ? card.querySelector('.project-media img') : null;
      const title = btn.getAttribute('data-video-title') || 'Featured Campaign Reel';
      const desc = btn.getAttribute('data-desc') || 'Cinematic direction and marketing content by Parichay Production.';
      const poster = img ? img.src : 'assets/images/hero_cinema.jpg';
      openModal(title, desc, poster);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Simulated Play Toggle in Cinema Player
  if (playerPlayToggle) {
    let isPlaying = true;
    playerPlayToggle.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playerPlayToggle.innerHTML = isPlaying 
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    });
  }

  /* ==========================================================================
     6. INTERACTIVE INQUIRY FORM & WHATSAPP GENERATOR
     ========================================================================== */
  const inquiryForm = document.getElementById('projectInquiryForm');
  const formStatusMsg = document.getElementById('formStatusMsg');
  const whatsappDirectBtn = document.getElementById('whatsappDirectBtn');
  const quickInquiryBtn = document.getElementById('quickInquiryBtn');

  if (quickInquiryBtn) {
    quickInquiryBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const nameInput = document.getElementById('clientName');
          if (nameInput) nameInput.focus();
        }, 600);
      }
    });
  }

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = inquiryForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Project Brief';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Transmitting Brief...</span>`;
      }

      const name = document.getElementById('clientName').value.trim();
      const company = document.getElementById('clientCompany').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const service = document.getElementById('serviceInterest').value;
      const message = document.getElementById('projectDetails').value.trim();

      // Encode prefilled WhatsApp message
      const waText = encodeURIComponent(
        `Hi Rahul,\n\nI just submitted an inquiry on Parichay Production's website:\n\n*Name:* ${name}\n*Brand/Company:* ${company}\n*Phone:* ${phone}\n*Service:* ${service}\n*Brief:* ${message}\n\nLooking forward to speaking with you!`
      );

      // Web3Forms direct email delivery if key configured
      const formData = new FormData(inquiryForm);
      if (window.PARICHAY_WEB3FORMS_KEY) {
        formData.append("access_key", window.PARICHAY_WEB3FORMS_KEY);
        formData.append("subject", `New Parichay Brief: ${company} (${service})`);
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        }).catch(err => console.log('Brief transmission handled.'));
      }

      setTimeout(() => {
        // Show immediate success confirmation
        if (formStatusMsg) {
          formStatusMsg.className = 'form-status-msg success';
          formStatusMsg.innerHTML = `
            <div style="margin-bottom: 0.5rem;">
              <strong style="color: #25D366; font-size: 1.05rem;">✓ Brief Successfully Received!</strong>
            </div>
            <p style="margin-bottom: 0.85rem; color: var(--text-primary); font-size: 0.92rem;">
              Thank you, <strong>${name}</strong>. Your project brief for <em>${company}</em> (${service}) has been delivered to Founder & Director Rahul Raj Tiwari.
            </p>
            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 0.6rem;">
              <a href="https://wa.me/919993356206?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-sm">
                <span>Chat Now on WhatsApp</span>
              </a>
              <a href="tel:+919993356206" class="btn btn-outline btn-sm">
                <span>Call +91 99933 56206</span>
              </a>
            </div>
          `;
          formStatusMsg.style.display = 'block';
          formStatusMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }

        // Open WhatsApp window
        window.open(`https://wa.me/919993356206?text=${waText}`, '_blank');
        inquiryForm.reset();
      }, 600);
    });
  }

  if (whatsappDirectBtn) {
    whatsappDirectBtn.addEventListener('click', () => {
      const name = document.getElementById('clientName')?.value.trim() || 'Client';
      const company = document.getElementById('clientCompany')?.value.trim() || 'Brand';
      const service = document.getElementById('serviceInterest')?.value || 'Production Inquiry';
      const msg = document.getElementById('projectDetails')?.value.trim() || 'I would like to explore a creative campaign.';

      const waText = encodeURIComponent(
        `Hi Rahul,\n\nI'd like to discuss a project with Parichay Production:\n*Name:* ${name}\n*Company:* ${company}\n*Service:* ${service}\n*Details:* ${msg}`
      );
      window.open(`https://wa.me/919993356206?text=${waText}`, '_blank');
    });
  }

  // Global helper to set inquiry subject from wedding spotlight
  window.setInquirySubject = (serviceName) => {
    const serviceSelect = document.getElementById('serviceInterest');
    if (serviceSelect) {
      serviceSelect.value = "Cinematic Wedding Documentary";
    }
  };

  /* ==========================================================================
     7. FLOATING DOCK HIDE ON FOOTER REACH
     ========================================================================== */
  const floatingDock = document.getElementById('floatingDock');
  const footer = document.querySelector('.site-footer');

  if (floatingDock && footer) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          floatingDock.style.opacity = '0.3';
          floatingDock.style.pointerEvents = 'none';
        } else {
          floatingDock.style.opacity = '1';
          floatingDock.style.pointerEvents = 'auto';
        }
      });
    }, { threshold: 0.1 });
    footerObserver.observe(footer);
  }

  console.log('🎬 Parichay Production Website initialized. All systems ready.');
});
