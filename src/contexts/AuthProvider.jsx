
import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
            setRole(res.data.role);
        } catch (err) {
            console.error('Auth check failed:', err);
            localStorage.removeItem('token');
            setUser(null);
            setRole(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setRole(res.data.user.role);
        return res.data;
    };

    const register = async (email, password, fullName, role = 'student') => {
        const res = await api.post('/auth/register', { email, password, full_name: fullName, role });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setRole(res.data.user.role);
        return res.data;
    };

    const signOut = () => {
        localStorage.removeItem('token');
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, login, register, signOut, loading }}>
            {!loading ? children : <div style={{ color: 'white', padding: '2rem' }}>Loading application...</div>}
        </AuthContext.Provider>
    );
};
