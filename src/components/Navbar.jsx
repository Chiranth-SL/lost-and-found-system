
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider'
import { Menu, X, Search, PlusCircle, LogOut, User } from 'lucide-react'

const Navbar = () => {
    const { user, role, signOut } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <nav style={{
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            borderBottom: '1px solid #333',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            backdropFilter: 'blur(10px)'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
                {/* Logo */}
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--text-primary)' }}>L&F</span>
                    <span style={{ color: 'var(--accent-red)' }}>System</span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/browse" className="nav-link">Browse Items</Link>

                    {user ? (
                        <>
                            <Link to="/report" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                <PlusCircle size={18} /> Report Item
                            </Link>

                            <Link to="/dashboard" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                                Dashboard
                            </Link>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderLeft: '1px solid #333', paddingLeft: '1rem' }}>
                                {role === 'admin' && (
                                    <Link to="/admin" style={{ color: 'var(--accent-gold)' }}>Admin</Link>
                                )}
                                <button onClick={handleSignOut} style={{ background: 'none', color: '#666', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login" style={{ color: 'var(--text-secondary)' }}>Login</Link>
                            <Link to="/register" style={{ color: 'var(--accent-red)' }}>Register</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isOpen ? 'open' : ''}`}>
                <Link to="/" className="nav-link" onClick={() => setIsOpen(false)} style={{ fontSize: '1.2rem', padding: '1rem', borderBottom: '1px solid #333' }}>
                    Home
                </Link>
                <Link to="/browse" className="nav-link" onClick={() => setIsOpen(false)} style={{ fontSize: '1.2rem', padding: '1rem', borderBottom: '1px solid #333' }}>
                    Browse Items
                </Link>

                {user ? (
                    <>
                        <Link to="/report" className="btn btn-primary" onClick={() => setIsOpen(false)} style={{ justifyContent: 'center', margin: '1rem 0' }}>
                            <PlusCircle size={18} /> Report Item
                        </Link>

                        <Link to="/dashboard" className="nav-link" onClick={() => setIsOpen(false)} style={{ fontSize: '1.2rem', padding: '1rem', borderBottom: '1px solid #333' }}>
                            My Dashboard
                        </Link>

                        {role === 'admin' && (
                            <Link to="/admin" onClick={() => setIsOpen(false)} style={{ fontSize: '1.2rem', padding: '1rem', borderBottom: '1px solid #333', color: 'var(--accent-gold)' }}>
                                Admin Panel
                            </Link>
                        )}

                        <button onClick={() => { setIsOpen(false); handleSignOut(); }} style={{
                            background: 'none',
                            color: '#ff4444',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1.2rem',
                            padding: '1rem',
                            width: '100%',
                            textAlign: 'left'
                        }}>
                            <LogOut size={20} /> Logout
                        </button>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <Link to="/login" className="btn btn-secondary" onClick={() => setIsOpen(false)} style={{ justifyContent: 'center' }}>
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-primary" onClick={() => setIsOpen(false)} style={{ justifyContent: 'center' }}>
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
