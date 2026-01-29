'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/FadeIn';
import { ArrowUpRight, Wallet, CheckCircle, Briefcase, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
    _id: string;
    title: string;
    description: string;
    budget: number;
    status: string;
}

export default function SolverDashboard() {
    const [activeTab, setActiveTab] = useState<'browse' | 'my'>('browse');
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetchProjects();
    }, [activeTab]);

    const fetchProjects = async () => {
        try {
            const url = activeTab === 'browse' ? '/projects?open=true' : '/projects?assigned=true';
            const res = await api.get(url);
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <FadeIn>
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Solver Workspace</h1>
                    <p className="text-muted-foreground">Find work, manage tasks, and get paid.</p>
                </div>
                <div className="flex gap-2 p-1 bg-muted/20 rounded-lg">
                    <button
                        onClick={() => setActiveTab('browse')}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'browse' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Browse Market
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'my' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        My Assignments
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
                        <Wallet className="w-4 h-4 text-indigo-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">$12,450</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" /> +$1,200 this month
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">98%</div>
                        <p className="text-xs text-muted-foreground mt-1">Based on 45 projects</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Available Gigs</CardTitle>
                        <Search className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground mt-1">New opportunities today</p>
                    </CardContent>
                </Card>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {projects.map((p, i) => (
                        <motion.div key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                            <Link href={`/solver/project/${p._id}`}>
                                <Card className="h-full hover:border-primary/50 transition-colors group cursor-pointer bg-card/50 backdrop-blur-sm">
                                    <div className={`h-2 w-full rounded-t-lg ${activeTab === 'browse' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <CardTitle className="text-lg group-hover:text-primary transition-colors">{p.title}</CardTitle>
                                            {activeTab === 'my' && (
                                                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                    {p.status}
                                                </span>
                                            )}
                                        </div>
                                        <CardDescription className="line-clamp-2">{p.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Budget</p>
                                                <span className="text-lg font-bold text-foreground">${p.budget}</span>
                                            </div>
                                            <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                {activeTab === 'browse' ? 'Apply Now' : 'Manage Work'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                    {projects.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-muted rounded-xl">
                            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-medium mb-2">No projects found</h3>
                            <p className="text-muted-foreground">{activeTab === 'browse' ? 'Check back later for new opportunities.' : 'You have no active assignments.'}</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </FadeIn>
    );
}
