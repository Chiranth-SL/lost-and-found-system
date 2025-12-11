
import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../contexts/AuthProvider'

const ReportItem = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const initialType = searchParams.get('type') === 'lost' ? 'lost' : 'found'

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Electronics',
        location: '',
        status: initialType,
        image_url: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (!user) {
            setError('You must be logged in to report an item.')
            setLoading(false)
            return
        }

        try {
            await api.post('/items', formData)
            navigate('/browse')
        } catch (error) {
            setError(error.response?.data?.error || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
                    Report {formData.status === 'lost' ? 'Lost' : 'Found'} Item
                </h2>

                {error && (
                    <div style={{ padding: '1rem', backgroundColor: '#e6394622', border: '1px solid var(--accent-red)', borderRadius: '4px', color: '#ffadad', marginBottom: '1rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>What happened?</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                className={`btn ${formData.status === 'lost' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFormData({ ...formData, status: 'lost' })}
                                style={{ flex: 1, justifyContent: 'center' }}
                            >
                                I Lost Something
                            </button>
                            <button
                                type="button"
                                className={`btn ${formData.status === 'found' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setFormData({ ...formData, status: 'found' })}
                                style={{ flex: 1, justifyContent: 'center' }}
                            >
                                I Found Something
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Item Name</label>
                        <input
                            type="text"
                            name="title"
                            className="input-field"
                            placeholder="e.g. Blue iPhone 13"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Category</label>
                        <select
                            name="category"
                            className="input-field"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Accessories">Accessories</option>
                            <option value="ID Cards">ID Cards & Wallets</option>
                            <option value="Keys">Keys</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Location</label>
                        <input
                            type="text"
                            name="location"
                            className="input-field"
                            placeholder="e.g. Main Library, 2nd Floor"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Description</label>
                        <textarea
                            name="description"
                            className="input-field"
                            rows="4"
                            placeholder="Provide more details..."
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc' }}>Image URL (Optional)</label>
                        <input
                            type="url"
                            name="image_url"
                            className="input-field"
                            placeholder="https://example.com/image.jpg"
                            value={formData.image_url}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ReportItem
