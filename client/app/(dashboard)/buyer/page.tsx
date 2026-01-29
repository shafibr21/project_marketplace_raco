'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeIn } from '@/components/animations/FadeIn';
import toast from 'react-hot-toast';
import { Plus, DollarSign, Clock, Layout, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Project {
    _id: string;
    title: string;
    description: string;
    budget: number;
    status: string;
    assignedSolverId: { username: string } | null;
}

const MOCK_SPEND_DATA = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 900 },
    { month: 'Mar', amount: 3500 },
    { month: 'Apr', amount: 2100 },
    { month: 'May', amount: 4200 },
    { month: 'Jun', amount: 2800 },
];

export default function BuyerDashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showCreate, setShowCreate] = useState(false);

    // Create Form
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [budget, setBudget] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects?mine=true');
            setProjects(res.data);
        } catch (err) {
            toast.error('Failed to load projects');
        }
    };

    const createProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/projects', { title, description: desc, budget: Number(budget) });
            toast.success('Project created!');
            setShowCreate(false);
            setTitle('');
            setDesc('');
            setBudget('');
            fetchProjects();
        } catch (err) {
            toast.error('Failed to create project');
        }
    };

    const totalSpent = projects.reduce((acc, p) => acc + (p.status === 'completed' ? p.budget : 0), 0);
    const activeProjects = projects.filter(p => p.status === 'open' || p.status === 'assigned').length;

    return (
        <FadeIn>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Buyer Dashboard</h1>
                    <p className="text-slate-500">Manage your projects and payments.</p>
                </div>
                <Button onClick={() => setShowCreate(!showCreate)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </div>

            {/* Create Modal Area */}
            {showCreate && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
                    <Card className="border-blue-200 bg-blue-50/50">
                        <CardHeader>
                            <CardTitle>Post a New Project</CardTitle>
                            <CardDescription>Describe your needs to find the best solver.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={createProject} className="space-y-4 max-w-2xl">
                                <Input placeholder="Project Title (e.g., React Dashboard Fix)" value={title} onChange={e => setTitle(e.target.value)} required className="bg-white" />
                                <Input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} required className="bg-white" />
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                    <Input placeholder="Budget" type="number" value={budget} onChange={e => setBudget(e.target.value)} required className="pl-6 bg-white" />
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit">Post Project</Button>
                                    <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Spend</CardTitle>
                        <DollarSign className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Active Projects</CardTitle>
                        <Layout className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeProjects}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Pending Reviews</CardTitle>
                        <Clock className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 mb-8">
                {/* Spend Analysis Chart (Mock) */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Spend Analysis</CardTitle>
                        <CardDescription>Your spending over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-end justify-between gap-2 pt-4">
                            {MOCK_SPEND_DATA.map((d) => (
                                <div key={d.month} className="group relative flex-1 bg-slate-100 rounded-t-sm hover:bg-blue-100 transition-colors flex flex-col justify-end items-center pb-2">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(d.amount / 4500) * 100}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className="w-full max-w-[40px] bg-blue-500 rounded-t-md opacity-80 group-hover:opacity-100 relative"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            ${d.amount}
                                        </div>
                                    </motion.div>
                                    <span className="text-xs text-slate-500 mt-2 font-medium">{d.month}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity or Summary */}
                <Card className="bg-slate-900 text-white border-none">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="secondary" className="w-full justify-start" onClick={() => setShowCreate(true)}>Create New Project</Button>
                        <Button variant="ghost" className="w-full justify-start hover:bg-slate-800 hover:text-white">View Invoices</Button>
                        <Button variant="ghost" className="w-full justify-start hover:bg-slate-800 hover:text-white">Manage Payment Methods</Button>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-bold mb-4">Your Projects</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((p, i) => (
                    <motion.div key={p._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Link href={`/buyer/project/${p._id}`}>
                            <Card className="hover:shadow-lg transition-all cursor-pointer h-full border hover:border-blue-300 group">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg font-bold group-hover:text-blue-600 transition-colors">{p.title}</CardTitle>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${p.status === 'open' ? 'bg-green-100 text-green-700' :
                                            p.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </div>
                                    <CardDescription className="line-clamp-2 mt-2">{p.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center mt-2 pt-4 border-t border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400 uppercase">Budget</span>
                                            <span className="font-bold text-slate-900">${p.budget}</span>
                                        </div>
                                        <Button size="icon" variant="ghost" className="rounded-full">
                                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}

                {projects.length === 0 && !showCreate && (
                    <div className="col-span-full py-16 text-center border-2 border-dashed rounded-xl bg-slate-50/50">
                        <p className="text-slate-500 mb-4">No projects yet.</p>
                        <Button onClick={() => setShowCreate(true)}>Create Your First Project</Button>
                    </div>
                )}
            </div>
        </FadeIn>
    );
}
