// js/auth.js

// Auth state is passed via URL param from React admin (?admin=true)
// then stored in sessionStorage for the session duration

const urlParams = new URLSearchParams(window.location.search)
const adminParam = urlParams.get('admin')

if (adminParam === 'true') {
    sessionStorage.setItem('isAdmin', 'true')
    window.history.replaceState({}, '', window.location.pathname)
}

const init = () => {
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true'
    const navLinks = document.getElementById('nav-links')
    const userIcon = document.querySelector('.navbar-user-li')

    if (!userIcon) return

    if (isAdmin) {
        const dashboardLi = document.createElement('li')
        dashboardLi.innerHTML = `<a href="https://admin.tamyoscollective.com/dashboard">Dashboard</a>`
        navLinks.insertBefore(dashboardLi, userIcon)

        userIcon.innerHTML = `
            <button class="navbar-signout" id="navbar-signout">Sign Out</button>
        `

        document.getElementById('navbar-signout').addEventListener('click', () => {
            sessionStorage.removeItem('isAdmin')
            window.location.reload()
        })

    } else {
        userIcon.innerHTML = `
            <a href="https://admin.tamyoscollective.com" aria-label="Admin login">
                <i class="fa-regular fa-user"></i>
            </a>
        `
    }
}

document.addEventListener('DOMContentLoaded', init)