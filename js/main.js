//js/main.js

const navbar = document.querySelector('.navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// SCROLL - adds .scrolled class after 50px

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
})

// HAMBURGER TOGGLE

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);

    // tells screen readers if menu is open or closed
    hamburger.setAttribute('aria-expanded', isOpen);

    // prevents the page from scrolling behind the open menu
    document.body.style.overflow = isOpen ? 'hidden' : '';
})

// CLOSE MENU ON LINK CLICK

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
    })
})

// CLOSE MENU ON ESCAPE KEY

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open')
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
        
        // sends focus back to hamburger button
        hamburger.focus()
    }
})