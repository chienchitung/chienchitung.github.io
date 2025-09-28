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
