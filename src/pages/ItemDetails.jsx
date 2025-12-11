
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../contexts/AuthProvider'
import { MapPin, Calendar, Tag, User } from 'lucide-react'

const ItemDetails = () => {
    const { id } = useParams()
    const { user, role } = useAuth()
    const navigate = useNavigate()

    const [item, setItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [claims, setClaims] = useState([])
    const [claiming, setClaiming] = useState(false)
    const [proof, setProof] = useState('')
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(() => {
        fetchItemDetails()
    }, [id])

    useEffect(() => {
        if (user && item && item.user_id && (user.id || user._id) === (item.user_id._id || item.user_id)) {
            fetchClaims()
        }
    }, [user, item])

    const fetchItemDetails = async () => {
        try {
            const { data } = await api.get(`/items/${id}`)
            setItem(data)
        } catch (error) {
            console.error('Error fetching item:', error)
            navigate('/browse')
        }
        setLoading(false)
    }

    const fetchClaims = async () => {
        try {
            const { data } = await api.get(`/claims?item_id=${id}`)
            setClaims(data)
        } catch (error) {
            console.error('Error fetching claims:', error)
        }
    }

    const handleClaim = async (e) => {
        e.preventDefault()
        setSubmitLoading(true)

        try {
            await api.post('/claims', {
                item_id: id,
                proof_description: proof
            })

            alert('Claim submitted! The finder will review it.')
            setClaiming(false)
        } catch (error) {
            alert(error.response?.data?.error || error.message)
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleClaimAction = async (claimId, newStatus) => {
        try {
            await api.put(`/claims/${claimId}`, { status: newStatus })

            // If approved, update item status too
            if (newStatus === 'approved') {
                setItem(prev => ({ ...prev, status: 'claimed' }))
            }

            fetchClaims()
        } catch (error) {
            alert(error.response?.data?.error || error.message)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to withdraw/delete this report? This action cannot be undone.')) return

        try {
            await api.delete(`/items/${id}`)
            alert('Item withdrawn/deleted successfully.')
            navigate(user ? '/dashboard' : '/')
        } catch (error) {
            alert(error.response?.data?.error || error.message)
        }
    }

    const handleStatusUpdate = async (newStatus) => {
        try {
            await api.put(`/items/${id}`, { status: newStatus })
            setItem(prev => ({ ...prev, status: newStatus }))
        } catch (error) {
            alert(error.response?.data?.error || error.message)
        }
    }

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>
    if (!item) return <div className="container" style={{ padding: '2rem' }}>Item not found</div>

    const userId = user?.id || user?._id
    const itemUserId = item.user_id?._id || item.user_id
    const isOwner = user && userId === itemUserId
    const canClaim = user && !isOwner && item.status === 'found'

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {item.image_url && (
                        <div style={{ height: '400px', backgroundColor: '#333', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{item.title}</h1>
                            <span style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                backgroundColor: item.status === 'lost' ? 'rgba(217, 4, 41, 0.2)' : 'rgba(255, 215, 0, 0.2)',
                                color: item.status === 'lost' ? 'var(--accent-red)' : 'var(--accent-gold)'
                            }}>
                                {item.status.toUpperCase()}
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', color: '#888' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={18} /> {item.location}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Tag size={18} /> {item.category}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar size={18} /> {new Date(item.created_at).toLocaleDateString()}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={18} /> {item.user_id?.full_name || 'Anonymous'}
                            </div>
                        </div>

                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>{item.description}</p>

                        {/* Actions */}
                        {canClaim && (
                            <div style={{ borderTop: '1px solid #333', paddingTop: '2rem' }}>
                                {!claiming ? (
                                    <button className="btn btn-primary" onClick={() => setClaiming(true)}>
                                        This is mine! (Claim Item)
                                    </button>
                                ) : (
                                    <form onSubmit={handleClaim} style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px' }}>
                                        <h3 style={{ marginBottom: '1rem' }}>Submit Claim</h3>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Proof of Ownership</label>
                                        <textarea
                                            className="input-field"
                                            rows="3"
                                            placeholder="Describe unique markings, contents, or attach a link to a photo..."
                                            value={proof}
                                            onChange={(e) => setProof(e.target.value)}
                                            required
                                        ></textarea>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                                                {submitLoading ? 'Sending...' : 'Send Claim'}
                                            </button>
                                            <button type="button" className="btn btn-secondary" onClick={() => setClaiming(false)}>Cancel</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {isOwner && item.status !== 'lost' && (
                            <div style={{ borderTop: '1px solid #333', paddingTop: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', color: 'var(--accent-gold)' }}>Claims on this item</h3>
                                {claims.length === 0 ? (
                                    <p style={{ color: '#666' }}>No claims yet.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {claims.map(claim => (
                                            <div key={claim._id || claim.id} style={{ padding: '1rem', border: '1px solid #444', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <strong>{claim.claimant_id?.full_name}</strong>
                                                    <span style={{
                                                        color: claim.status === 'approved' ? 'green' : claim.status === 'rejected' ? 'red' : 'orange'
                                                    }}>{claim.status.toUpperCase()}</span>
                                                </div>
                                                <p style={{ marginBottom: '1rem', color: '#999' }}>"{claim.proof_description}"</p>
                                                {claim.status === 'pending' && (
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', backgroundColor: 'green' }} onClick={() => handleClaimAction(claim._id || claim.id, 'approved')}>Approve</button>
                                                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', backgroundColor: 'red', color: 'white' }} onClick={() => handleClaimAction(claim._id || claim.id, 'rejected')}>Reject</button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Owner Withdraw Action */}
                    {isOwner && (
                        <div style={{ borderTop: '1px solid #333', paddingTop: '1.5rem', marginTop: 'auto' }}>
                            <button
                                className="btn btn-secondary"
                                style={{ width: '100%', borderColor: '#d90429', color: '#ff4444' }}
                                onClick={handleDelete}
                            >
                                Withdraw Report (Delete)
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Admin Controls */}
            {role === 'admin' && (
                <div className="container" style={{ marginTop: '2rem' }}>
                    <div className="card" style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid var(--accent-gold)' }}>
                        <h3 style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>Admin Controls</h3>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ color: '#aaa', fontSize: '0.9rem', marginRight: '0.5rem' }}>Update Status:</label>
                                <select
                                    className="input-field"
                                    style={{ width: 'auto', marginBottom: 0, display: 'inline-block' }}
                                    value={item.status}
                                    onChange={(e) => handleStatusUpdate(e.target.value)}
                                >
                                    <option value="lost">Lost</option>
                                    <option value="found">Found</option>
                                    <option value="claimed">Claimed</option>
                                    <option value="returned">Returned</option>
                                </select>
                            </div>
                            <button className="btn btn-primary" style={{ backgroundColor: 'darkred' }} onClick={handleDelete}>
                                Delete Item (Admin)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ItemDetails
