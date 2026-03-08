// src/Dashboard.jsx
import { signOut } from 'firebase/auth'
import { auth } from './firebase'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const navigate = useNavigate()

    const handleSignOut = async () => {
        try {
            await signOut(auth)
            navigate('/')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="dashboard">
            <main className="dashboard-main">
                <h2>Welcome back!</h2>
                <p>You are logged in.</p>
            </main>
        </div>
    )
}

export default Dashboard