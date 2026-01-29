'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Fix import
import api from '@/lib/api';

interface User {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'buyer' | 'solver';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: () => { },
    logout: () => { },
    isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded: any = jwtDecode(storedToken);
                // Check expiry if needed
                setToken(storedToken);
                // Ideally fetch user details from /me to ensure validity and get latest role
                api.get('/auth/me').then(res => {
                    setUser(res.data);
                }).catch(() => {
                    logout();
                }).finally(() => {
                    setIsLoading(false);
                });
            } catch (e) {
                logout();
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
        // Redirect based on role logic can happen here or in the page
        if (newUser.role === 'admin') router.push('/admin');
        else if (newUser.role === 'buyer') router.push('/buyer');
        else if (newUser.role === 'solver') router.push('/solver');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
