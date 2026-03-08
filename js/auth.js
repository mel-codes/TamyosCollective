// js/auth.js

// check if admin param is in URL
const urlParams = new URLSearchParams(window.location.search)
const adminParam = urlParams.get('admin')

// if admin param exists, store it in sessionStorage
if (adminParam === 'true') {
    sessionStorage.setItem('isAdmin', 'true')
    // clean up URL
    window.history.replaceState({}, '', window.location.pathname)
}

const isAdmin = sessionStorage.getItem('isAdmin') === 'true'
const navLinks = document.getElementById('nav-links')
const userIcon = document.querySelector('.navbar-user-li')

if (isAdmin) {
    const dashboardLi = document.createElement('li')
    dashboardLi.innerHTML = `<a href="http://localhost:5173/dashboard">Dashboard</a>`
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
        <a href="http://localhost:5173" aria-label="Admin login">
            <i class="fa-regular fa-user"></i>
        </a>
    `
}