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
    const isProductsPage = document.body.classList.contains('products-page')
    const isAboutPage = document.body.classList.contains('about-page')

    if (isProductsPage || isAboutPage) {
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
// MOODBOARD SCROLL
// =====================

const track = document.getElementById('moodboard-track')

if (track) {
    // duplicate images for seamless loop
    const images = track.innerHTML
    track.innerHTML = images + images

    let isDown = false
    let startX
    let scrollLeft
    let autoScrollInterval

    const startAutoScroll = () => {
        stopAutoScroll()
        autoScrollInterval = setInterval(() => {
            track.scrollLeft += 1
            // when we reach halfway (the duplicate), jump back to start silently
            if (track.scrollLeft >= track.scrollWidth / 2) {
                track.scrollLeft = 0
            }
        }, 16)
    }

    const stopAutoScroll = () => clearInterval(autoScrollInterval)

    startAutoScroll()

    // mouse drag
    track.addEventListener('mousedown', (e) => {
        isDown = true
        track.classList.add('dragging')
        startX = e.pageX - track.offsetLeft
        scrollLeft = track.scrollLeft
        stopAutoScroll()
    })

    track.addEventListener('mouseleave', () => {
        isDown = false
        track.classList.remove('dragging')
        startAutoScroll()
    })

    track.addEventListener('mouseup', () => {
        isDown = false
        track.classList.remove('dragging')
        startAutoScroll()
    })

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return
        e.preventDefault()
        const x = e.pageX - track.offsetLeft
        const walk = (x - startX) * 1.5
        track.scrollLeft = scrollLeft - walk
    })

    // touch swipe
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - track.offsetLeft
        scrollLeft = track.scrollLeft
        stopAutoScroll()
    }, { passive: true })

    track.addEventListener('touchend', () => startAutoScroll())

    track.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - track.offsetLeft
        const walk = (x - startX) * 1.5
        track.scrollLeft = scrollLeft - walk
    }, { passive: true })
}