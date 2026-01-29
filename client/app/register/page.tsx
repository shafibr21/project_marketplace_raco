'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/animations/FadeIn';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');   
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/register', { username, email, password  }); // Default role is solver
            login(res.data.token, res.data.user);
            toast.success('Account created!');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <FadeIn>
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle className="text-center">Register</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <Input
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Input
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button type="submit" className="w-full">
                                Create Account
                            </Button>
                            <p className="text-center text-sm text-slate-500">
                                Already have an account?{' '}
                                <Link href="/login" className="text-slate-900 underline">
                                    Login
                                </Link>
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </FadeIn>
        </div>
    );
}
