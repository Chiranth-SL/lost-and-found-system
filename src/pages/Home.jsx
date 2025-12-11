
import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'

const Home = () => {
    return (
        <div style={{ minHeight: 'calc(100vh - 80px)' }}>
            {/* Hero Section */}
            <section style={{
                height: '600px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1555421689-d68471e189f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1rem', background: 'linear-gradient(to right, white, #999)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        LOST & FOUND
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#ccc', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        The official campus portal to report lost belongings and return found items to their owners.
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <Link to="/report" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                            <Plus size={20} /> I Found Something
                        </Link>
                        <Link to="/report?type=lost" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                            <Search size={20} /> I Lost Something
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-primary)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div className="card">
                            <h3 style={{ color: 'var(--accent-red)', marginBottom: '1rem', fontSize: '1.5rem' }}>Report Items</h3>
                            <p style={{ color: '#999' }}>Quickly post details about items you've lost or found. Add photos and descriptions to help identify them.</p>
                        </div>
                        <div className="card">
                            <h3 style={{ color: 'var(--accent-red)', marginBottom: '1rem', fontSize: '1.5rem' }}>Search & Filter</h3>
                            <p style={{ color: '#999' }}>Browse through the database by category, location, or date to find what you're looking for.</p>
                        </div>
                        <div className="card">
                            <h3 style={{ color: 'var(--accent-red)', marginBottom: '1rem', fontSize: '1.5rem' }}>Easy Retrieval</h3>
                            <p style={{ color: '#999' }}>Connect with finders through a secure claim process and get your belongings back.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
