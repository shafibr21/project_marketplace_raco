'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/FadeIn';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Users, TrendingUp, AlertTriangle, Activity, ArrowUpRight, ArrowDownRight, ShieldCheck, UserCog } from 'lucide-react';

interface User {
    _id: string;
    username: string;
    email: string;
    role: string;
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState({ users: 0, projects: 0, volume: 0 });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [userRes, statRes] = await Promise.all([
                api.get('/users'),
                api.get('/admin/stats')
            ]);
            setUsers(userRes.data);
            setStats(statRes.data);
        } catch (err) {
            console.error('Failed to load data, using fallbacks if necessary');
        }
    };

    const updateUserRole = async (userId: string, newRole: string) => {
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            toast.success(`User promoted to ${newRole}`);
            fetchData();
        } catch (err) {
            toast.error('Failed to update role');
        }
    };

    return (
        <FadeIn>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900">Admin Control Center</h1>
                    <p className="text-slate-500 mt-2">Platform overview, user management, and dispute resolution.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.users}</div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Active Projects</CardTitle>
                            <BriefcaseIcon className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.projects}</div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Total Volume</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">${stats.volume.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 mb-8">
                {/* User Table */}
                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Role Approval Queue</CardTitle>
                        <CardDescription>Review and upgrade user permissions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {users.slice(0, 5).map((u) => (
                                <div key={u._id} className="flex items-center justify-between p-4 border rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                            {u.username.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{u.username}</p>
                                            <p className="text-xs text-slate-500">{u.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${u.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' :
                                                u.role === 'buyer' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-green-50 text-green-600 border-green-100'
                                            }`}>
                                            {u.role}
                                        </span>
                                        {u.role !== 'admin' && (
                                            <div className="flex gap-1">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" title="Promote to Buyer" onClick={() => updateUserRole(u._id, 'buyer')}>
                                                    <BriefcaseIcon className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" title="Set as Solver" onClick={() => updateUserRole(u._id, 'solver')}>
                                                    <ShieldCheck className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </FadeIn>
    );
}

function BriefcaseIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    )
}
