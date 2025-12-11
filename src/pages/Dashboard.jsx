
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../contexts/AuthProvider'

const Dashboard = () => {
    const { user } = useAuth()
    const [myItems, setMyItems] = useState([])
    const [myClaims, setMyClaims] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            setLoading(true)
            try {
                // Fetch my items
                const itemsRes = await api.get(`/items?user_id=${user.id || user._id}`)
                setMyItems(itemsRes.data)

                // Fetch my claims
                const claimsRes = await api.get('/claims?type=my-claims')
                setMyClaims(claimsRes.data)
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            }
            setLoading(false)
        }

        if (user) {
            fetchData()
        }
    }, [user])

    const deleteItem = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return

        try {
            await api.delete(`/items/${id}`)
            setMyItems(myItems.filter(item => item.id !== id && item._id !== id))
        } catch (error) {
            alert('Error deleting item')
        }
    }

    if (!user) return <div className="container" style={{ padding: '2rem' }}>Please login to view dashboard.</div>

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Dashboard</h1>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {/* My Items */}
                <div className="card">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-red)' }}>My Reported Items</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : myItems.length === 0 ? (
                        <p style={{ color: '#666' }}>You haven't reported any items yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {myItems.map(item => (
                                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#111', borderRadius: '8px' }}>
                                    <div>
                                        <Link to={`/items/${item._id}`} style={{ fontWeight: 'bold', fontSize: '1.1rem', marginRight: '0.5rem' }}>{item.title}</Link>
                                        <span style={{ fontSize: '0.8rem', color: '#888' }}>({item.status})</span>
                                        <p style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(item.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <button className="btn btn-secondary" style={{ padding: '0.5rem' }} onClick={() => deleteItem(item._id)}>Delete</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* My Claims */}
                <div className="card">
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>My Claims</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : myClaims.length === 0 ? (
                        <p style={{ color: '#666' }}>You haven't claimed any items yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {myClaims.map(claim => (
                                <div key={claim._id} style={{ padding: '1rem', backgroundColor: '#111', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong>Item: {claim.item_id?.title}</strong>
                                        <span style={{
                                            color: claim.status === 'approved' ? 'green' : claim.status === 'rejected' ? 'red' : 'orange'
                                        }}>{claim.status.toUpperCase()}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: '#666' }}>Date: {new Date(claim.created_at).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
