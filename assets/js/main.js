/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

  sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
            sectionsClass.classList.add('active-link')
        }else{
            sectionsClass.classList.remove('active-link')
        }                                                    
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
//     reset: true
});

sr.reveal('.home__data, .about__lead, .education__title, .hero__tag',{}); 
sr.reveal('.hero__portrait, .about-cards, .projects__subtitle, .projects__text',{delay: 400}); 
sr.reveal('.home__social-icon',{ interval: 200}); 

// Experience: stagger entries, reveal header and badges
sr.reveal('#experience .section-title', { delay: 100, distance: '20px' });
sr.reveal('#experience .experience__content', { interval: 150, origin: 'bottom', distance: '24px' });
sr.reveal('#experience .exp__header', { delay: 150, distance: '12px' });
sr.reveal('#experience .experience__achievements li', { interval: 80, distance: '10px' });
sr.reveal('#experience .exp__badge, #experience .experience__location', { delay: 200, distance: '10px' });

// Education & others
sr.reveal('#education .education__content, .about-card, .projects__item, .contact__input, .skills__group',{interval: 200}); 
sr.reveal('#education .edu__header', { delay: 150, distance: '12px' });
sr.reveal('#education .edu__badge, #education .education__studies', { delay: 200, distance: '10px' });
sr.reveal('#education .education__achievements li', { interval: 80, distance: '10px' });
// Contact info
sr.reveal('.contact__info-item', { interval: 120, distance: '12px' });

/*==================== BACK TO TOP (FOOTER BUTTON) ====================*/
const toTopBtn = document.getElementById('to-top');
if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// (Copy email feature removed per design update)

/*==================== CONTACT FORM (AJAX, NO REDIRECT) ====================*/
(() => {
    const form = document.querySelector('#contact .contact__form');
    if (!form) return;
    const statusEl = document.getElementById('contact-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    const setStatus = (msg, type) => {
        if (!statusEl) return;
        statusEl.textContent = msg;
        statusEl.classList.remove('is-success', 'is-error');
        if (type) statusEl.classList.add(type);
        statusEl.style.display = 'block';
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setStatus('', '');
        const originalText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' },
            });

            if (res.ok) {
                setStatus('Thanks! Your message has been sent.', 'is-success');
                form.reset();
            } else {
                const data = await res.json().catch(() => ({}));
                const errMsg = (data && data.errors && data.errors.map(e => e.message).join(', ')) || 'Oops! Something went wrong.';
                setStatus(errMsg, 'is-error');
            }
        } catch (err) {
            setStatus('Network error. Please try again later.', 'is-error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    });
})();

/* ==================== PROJECT MODAL (LIGHTBOX) ==================== */
(function(){
    // Open modal when project card is clicked or activated with Enter/Space
    function openProjectModal(triggerEl) {
        if (!triggerEl) return;
        // Create modal container if missing
        let modal = document.querySelector('.project-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'project-modal';
            modal.innerHTML = `
                <div class="project-modal__backdrop" tabindex="-1">
                    <div class="project-modal__dialog" role="dialog" aria-modal="true" aria-label="Project details" tabindex="0">
                        <button class="project-modal__close" aria-label="Close project details">×</button>
                        <div class="project-modal__content"></div>
                    </div>
                </div>`;
            document.body.appendChild(modal);

            // Close handlers
            modal.querySelector('.project-modal__close').addEventListener('click', closeProjectModal);
            modal.querySelector('.project-modal__backdrop').addEventListener('click', function(e){
                if (e.target === e.currentTarget) closeProjectModal();
            });
        }

        const content = triggerEl.querySelector('.projects__overlay')?.innerHTML || '';
        modal.querySelector('.project-modal__content').innerHTML = content;
        modal.classList.add('open');
        // prevent background scroll
        document.documentElement.style.overflow = 'hidden';
        // focus dialog for accessibility
        const dialog = modal.querySelector('.project-modal__dialog');
        if (dialog) dialog.focus();
    }

    function closeProjectModal(){
        const modal = document.querySelector('.project-modal');
        if (!modal) return;
        modal.classList.remove('open');
        document.documentElement.style.overflow = '';
    }

    // Delegate click events
    document.addEventListener('click', function(e){
        const btn = e.target.closest('.projects__img[role="button"]');
        if (!btn) return;
        openProjectModal(btn);
    });

    // Keyboard support: Enter/Space to open, Escape to close
    document.addEventListener('keydown', function(e){
        if (e.key === 'Escape') {
            closeProjectModal();
            return;
        }
        if (e.key === 'Enter' || e.key === ' ') {
            const active = document.activeElement;
            if (active && active.classList && active.classList.contains('projects__img')) {
                e.preventDefault();
                openProjectModal(active);
            }
        }
    });
})();

/*==================== SIMPLE I18N (EN / ZH-TW) ====================*/
(() => {
    const DICT = {
        'en': {
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.experience': 'Experience',
            'nav.skills': 'Skills',
            'nav.education': 'Education',
            'nav.projects': 'Projects',
            'nav.contact': 'Contact',
        },
        'zh-tw': {
            'nav.home': '首頁',
            'nav.about': '關於',
            'nav.experience': '經歷',
            'nav.skills': '技能',
            'nav.education': '學歷',
            'nav.projects': '專案',
            'nav.contact': '聯絡',
        }
    };

    const storageKey = 'site-lang';
    const pathIsZh = /^\/zh-tw(\/|$)/i.test(window.location.pathname);
    // Path takes precedence so that /zh-tw always shows zh-tw even if localStorage says otherwise
    let current = pathIsZh ? 'zh-tw' : 'en';
    localStorage.setItem(storageKey, current);

    const applyI18n = (lang) => {
        const map = DICT[lang] || DICT.en;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (map[key]) el.textContent = map[key];
        });
        const btn = document.getElementById('lang-toggle');
        if (btn) {
            btn.textContent = lang === 'en' ? 'EN' : '繁中';
            const target = lang === 'en' ? '繁體中文' : 'English';
            btn.setAttribute('aria-label', `Switch language to ${target}`);
            btn.setAttribute('title', target);
        }
        // Update html lang attribute for a11y/SEO
        document.documentElement.setAttribute('lang', lang === 'zh-tw' ? 'zh-Hant-TW' : 'en');
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => applyI18n(current));
    } else {
        applyI18n(current);
    }

    // Bind toggle: also navigate to the corresponding path so URL reflects language
    const btn = document.getElementById('lang-toggle');
    if (btn) {
        btn.addEventListener('click', () => {
            const next = current === 'en' ? 'zh-tw' : 'en';
            localStorage.setItem(storageKey, next);
            // Always go to top (no hash)
            if (next === 'zh-tw') {
                window.location.href = '/zh-tw/';
            } else {
                window.location.href = '/';
            }
        });
    }
})();
