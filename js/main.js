// js/main.js

const navbar = document.querySelector('.navbar')
const hamburger = document.getElementById('hamburger')
const navLinks = document.getElementById('nav-links')
const backToTop = document.getElementById('back-to-top')
const isProductsPage = document.body.classList.contains('products-page')

// =====================
// SCROLL
// =====================

window.addEventListener('scroll', () => {
    // navbar — always visible on products page
    if (isProductsPage) {
        navbar.classList.add('scrolled')
    } else {
        navbar.classList.toggle('scrolled', window.scrollY > 50)
    }

    // back to top button
    if (backToTop) {
        backToTop.classList.toggle('visible', window.scrollY > 400)
    }
})

// =====================
// HAMBURGER TOGGLE
// =====================

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open')
    hamburger.classList.toggle('open', isOpen)
    hamburger.setAttribute('aria-expanded', isOpen)
    document.body.style.overflow = isOpen ? 'hidden' : ''
})

// =====================
// CLOSE MENU ON LINK CLICK
// =====================

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open')
        hamburger.classList.remove('open')
        hamburger.setAttribute('aria-expanded', false)
        document.body.style.overflow = ''
    })
})

// =====================
// CLOSE MENU ON ESCAPE KEY
// =====================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open')
        hamburger.classList.remove('open')
        hamburger.setAttribute('aria-expanded', false)
        document.body.style.overflow = ''
        hamburger.focus()
    }
})

// =====================
// BACK TO TOP
// =====================

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    })
}