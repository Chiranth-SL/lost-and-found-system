
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import api from '../api'
import { Search, Filter, MapPin, Calendar, Tag } from 'lucide-react'

const BrowseItems = () => {
    const location = useLocation()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterCategory, setFilterCategory] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchItems()
    }, [filterStatus, filterCategory, location.key])

    const fetchItems = async () => {
        setLoading(true)
        try {
            const params = {}
            if (filterStatus !== 'all') params.type = filterStatus
            if (filterCategory !== 'all') params.category = filterCategory

            const { data } = await api.get('/items', { params })
            setItems(data)
        } catch (error) {
            console.error('Error fetching items:', error)
        }
        setLoading(false)
    }

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Browse Items</h1>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/report?type=lost" className="btn btn-secondary">Report Lost</Link>
                    <Link to="/report?type=found" className="btn btn-primary">Report Found</Link>
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', padding: '1rem' }}>
                <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
                    <input
                        type="text"
                        className="input-field"
                        style={{ marginBottom: 0, paddingLeft: '2.5rem' }}
                        placeholder="Search items or locations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="input-field"
                    style={{ width: 'auto', marginBottom: 0 }}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="lost">Lost</option>
                    <option value="found">Found</option>
                    <option value="returned">Returned</option>
                </select>

                <select
                    className="input-field"
                    style={{ width: 'auto', marginBottom: 0 }}
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Accessories">Accessories</option>
                    <option value="ID Cards">ID Cards</option>
                    <option value="Keys">Keys</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {/* Grid */}
            {loading ? (
                <p style={{ textAlign: 'center', color: '#666' }}>Loading items...</p>
            ) : filteredItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                    <p>No items found matching your criteria.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {filteredItems.map(item => (
                        <Link key={item._id} to={`/items/${item._id}`} className="card" style={{ textDecoration: 'none', color: 'inherit', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '200px', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ color: '#555' }}>No Image</span>
                                )}
                            </div>
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{item.title}</h3>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        backgroundColor: item.status === 'lost' ? 'rgba(217, 4, 41, 0.2)' : 'rgba(255, 215, 0, 0.2)',
                                        color: item.status === 'lost' ? 'var(--accent-red)' : 'var(--accent-gold)'
                                    }}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </div>

                                <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>{item.description?.substring(0, 60)}...</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#777' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MapPin size={14} /> {item.location}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Tag size={14} /> {item.category}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={14} /> {new Date(item.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default BrowseItems
