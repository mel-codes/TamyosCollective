// src/components/Navbar.jsx

import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faInstagram } from '@fortawesome/free-brands-svg-icons' 

function Navbar() {
    const [isAdmin, setIsAdmin]   = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()

    // scroll listener
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // firebase auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAdmin(!!user)
        })
        return () => unsubscribe()
    }, [])

    // escape key listener
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
            sessionStorage.removeItem('isAdmin')
            handleMenuClose()
            navigate('/')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <nav className="container" aria-label="Main navigation">

                
                   <a href={`https://tamyoscollective.com/index.html${isAdmin ? '?admin=true' : ''}`}
                    className="navbar-title">
                    Tamyos Collective
                </a>

                {/* hamburger */}
                <button
                    className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
                    onClick={handleHamburgerClick}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* nav links */}
                <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <li><a href={`https://tamyoscollective.com/index.html${isAdmin ? '?admin=true' : ''}`} onClick={handleMenuClose}>Home</a></li>
                    <li><a href={`https://tamyoscollective.com/products.html${isAdmin ? '?admin=true' : ''}`} onClick={handleMenuClose}>Products</a></li>
                    <li><a href={`https://tamyoscollective.com/about.html${isAdmin ? '?admin=true' : ''}`} onClick={handleMenuClose}>About</a></li>
                    <li>
                        <a href="https://instagram.com/tamyoscollective" target="_blank" rel="noopener" aria-label="Instagram" onClick={handleMenuClose}>
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                    </li>
                    <li>
                        <a href="https://depop.com/tamyosvintage" target="_blank" rel="noopener" onClick={handleMenuClose}>
                            Depop ↗
                        </a>
                    </li>

                    {/* dashboard — admin only */}
                    {isAdmin && (
                        <li>
                            <Link to="/dashboard" onClick={handleMenuClose}>Dashboard</Link>
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