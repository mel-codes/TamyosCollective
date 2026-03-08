import './Login.css'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError]       = useState('')
    const [loading, setLoading]   = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const email = `${username}@tamyoscollective.com`

        try {
            await signInWithEmailAndPassword(auth, email, password)
            localStorage.setItem('isAdmin', 'true')
            console.log('logged in!')
            navigate('/dashboard')
        } catch (err) {
            setError('Invalid username or password.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">

            {/* background video */}
            <video className="login-bg-video" autoPlay muted loop playsInline>
                <source src="/videos/vid1.mp4" type="video/mp4" />
            </video>

            <div className="login-card">

                <h1 className="login-title">Tamyos Admin</h1>
                <p className="login-subtitle">Sign in to your dashboard</p>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default Login