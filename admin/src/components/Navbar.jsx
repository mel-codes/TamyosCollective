// src/components/Navbar.jsx

import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'

function Navbar() {
    const [isAdmin, setIsAdmin] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()

    // replaces your scroll event listener
    const [scrolled, setScrolled] = useState(false)
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // checks firebase auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAdmin(!!user)
        })
        return () => unsubscribe()
    }, [])

    // replaces your escape key listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && menuOpen) {
                setMenuOpen(false)
                document.body.style.overflow = ''
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [menuOpen])

    const handleHamburgerClick = () => {
        const isOpen = !menuOpen
        setMenuOpen(isOpen)
        document.body.style.overflow = isOpen ? 'hidden' : ''
    }

    const handleMenuClose = () => {
        setMenuOpen(false)
        document.body.style.overflow = ''
    }

    const handleSignOut = async () => {
        try {
            await signOut(auth)
            navigate('/')
        } catch (err) {
            console.error(err)
        }
    }
    return (
        <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <nav className="container" aria-label="Main navigation">

                <a href="http://localhost:5500/index.html" className="navbar-title">
                    Tamyos Collective
                </a>

                {/* hamburger */}
                <button
                    className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
                    id="hamburger"
                    onClick={handleHamburgerClick}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* nav links */}
                <ul
                    className={`navbar-links ${menuOpen ? 'open' : ''}`}
                    id="nav-links"
                >
                    <li><a href="/products.html" onClick={handleMenuClose}>Products</a></li>
                    <li><a href="/about.html" onClick={handleMenuClose}>About</a></li>
                    <li>
                        <a href="https://depop.com/tamyos" target="_blank" rel="noopener" onClick={handleMenuClose}>
                            Depop ↗
                        </a>
                    </li>

                    {/* dashboard — admin only */}
                    {isAdmin && (
                        <li>
                            <Link to="/dashboard" onClick={handleMenuClose}>
                                Dashboard
                            </Link>
                        </li>
                    )}

                    {/* user icon / sign out */}
                    <li>
                        {isAdmin ? (
                            <button className="navbar-signout" onClick={handleSignOut}>
                                Sign Out
                            </button>
                        ) : (
                            <Link to="/" className="navbar-user" aria-label="Admin login">
                                <FontAwesomeIcon icon={faUser} />
                            </Link>
                        )}
                    </li>

                </ul>

            </nav>
        </header>
    )
}

export default Navbar