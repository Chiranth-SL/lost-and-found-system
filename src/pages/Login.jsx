
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider'

const Login = () => {
    const { login } = useAuth()
const { user } = useAuth()
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const navigate = useNavigate()

useEffect(() => {
    if (user) {
        navigate('/')
    }
}, [user, navigate])

const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
        await login(email, password)
        navigate('/')
    } catch (error) {
        // Handle axios error response
        setError(error.response?.data?.error || error.message)
    } finally {
        setLoading(false)
    }
}

return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Login</h2>

            {error && (
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(217, 4, 41, 0.2)', border: '1px solid var(--accent-red)', borderRadius: '4px', color: '#ffadad', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Email</label>
                    <input
                        type="email"
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Password</label>
                    <input
                        type="password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#888' }}>
                Don't have an account? <Link to="/register" style={{ color: 'var(--accent-red)' }}>Register</Link>
            </p>
        </div>
    </div>
)
}

export default Login
