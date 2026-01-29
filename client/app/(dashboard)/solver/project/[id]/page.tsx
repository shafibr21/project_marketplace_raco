'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FadeIn } from '@/components/animations/FadeIn';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { Upload, CheckCircle, Clock, FileArchive, Send, ArrowLeft, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
    _id: string;
    title: string;
    description: string;
    budget: number;
    status: string;
    assignedSolverId: { _id: string } | null;
}

interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    timeline: string;
}

export default function SolverProjectPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();

    const [project, setProject] = useState<Project | null>(null);
    const [requestMsg, setRequestMsg] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);

    // Task Form
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [newTaskDate, setNewTaskDate] = useState('');
    const [showTaskForm, setShowTaskForm] = useState(false);

    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const fetchProjectData = useCallback(async () => {
        try {
            const pRes = await api.get(`/projects/${id}`);
            setProject(pRes.data);

            if (pRes.data.status === 'assigned' && pRes.data.assignedSolverId?._id === user?.id) {
                const tRes = await api.get(`/tasks/project/${id}`);
                setTasks(tRes.data);
            }
        } catch (err) {
            toast.error('Failed to load project details');
        }
    }, [id, user]);

    useEffect(() => {
        if (user) fetchProjectData();
    }, [fetchProjectData, user]);

    const sendRequest = async () => {
        try {
            await api.post('/requests', { projectId: id, message: requestMsg });
            toast.success('Request sent successfully!');
            router.push('/solver');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to send request');
        }
    };

    const createTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/tasks', {
                projectId: id,
                title: newTaskTitle,
                description: newTaskDesc,
                timeline: newTaskDate
            });
            toast.success('Task plan created');
            setNewTaskTitle('');
            setNewTaskDesc('');
            setNewTaskDate('');
            setShowTaskForm(false);
            fetchProjectData();
        } catch (err) {
            toast.error('Failed to create task');
        }
    };

    const handleFileUpload = async (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const loadToast = toast.loading('Uploading submission...');
            await api.post(`/submissions/${taskId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.dismiss(loadToast);
            toast.success('Submission uploaded!');
            fetchProjectData();
        } catch (err) {
            toast.error('Upload failed. Please ensure it is a ZIP file.');
        }
    };

    if (!project) return (
        <div className="flex items-center justify-center p-12">
            <div className="text-slate-500 animate-pulse">Loading project data...</div>
        </div>
    );

    const isAssignedToMe = project.assignedSolverId?._id === user?.id;

    return (
        <FadeIn>
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-slate-800 text-slate-400 hover:text-white group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </Button>

            <div className="grid gap-6 lg:grid-cols-3 mb-8">
                {/* Project Brief */}
                <div className="lg:col-span-2">
                    <Card className="bg-slate-900 border-slate-800 text-white shadow-xl">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1 block">Project Brief</span>
                                    <CardTitle className="text-3xl font-bold">{project.title}</CardTitle>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${project.status === 'open' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-300 leading-relaxed text-lg mb-6">{project.description}</p>
                            <div className="flex gap-6 pt-6 border-t border-slate-800">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Budget</p>
                                    <p className="text-2xl font-bold text-green-400">${project.budget}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Deadline</p>
                                    <p className="text-2xl font-bold text-slate-300">Flexible</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pitch or Status Card */}
                <div>
                    {project.status === 'open' && (
                        <Card className="bg-slate-800 border-slate-700 h-full">
                            <CardHeader>
                                <CardTitle className="text-white">Submit Proposal</CardTitle>
                                <CardDescription className="text-slate-400">Explain why you're the best fit.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <textarea
                                    className="w-full h-32 bg-slate-900 border-slate-700 rounded-md p-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    placeholder="I have experience with..."
                                    value={requestMsg}
                                    onChange={(e) => setRequestMsg(e.target.value)}
                                />
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={sendRequest}>
                                    <Send className="w-4 h-4 mr-2" /> Send Request
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                    {isAssignedToMe && (
                        <Card className="bg-emerald-900/20 border-emerald-500/30 h-full flex flex-col justify-center items-center p-6 text-center">
                            <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
                            <h3 className="text-xl font-bold text-emerald-100 mb-2">Active Assignment</h3>
                            <p className="text-emerald-200/60 text-sm">You are the lead solver on this project. Manage your tasks below.</p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Task Management */}
            {isAssignedToMe && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                        <h2 className="text-2xl font-bold text-white">Project Roadmap</h2>
                        <Button onClick={() => setShowTaskForm(!showTaskForm)} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                            {showTaskForm ? 'Cancel' : '+ Add Milestone'}
                        </Button>
                    </div>

                    <AnimatePresence>
                        {showTaskForm && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                <Card className="bg-slate-800 border-slate-700 mb-6">
                                    <CardContent className="pt-6">
                                        <form onSubmit={createTask} className="grid gap-4 md:grid-cols-2">
                                            <Input placeholder="Milestone Title" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} required className="bg-slate-900 border-slate-700 text-white" />
                                            <Input type="date" value={newTaskDate} onChange={e => setNewTaskDate(e.target.value)} required className="bg-slate-900 border-slate-700 text-white" />
                                            <div className="md:col-span-2">
                                                <Input placeholder="Description" value={newTaskDesc} onChange={e => setNewTaskDesc(e.target.value)} required className="bg-slate-900 border-slate-700 text-white" />
                                            </div>
                                            <div className="md:col-span-2 flex justify-end">
                                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save Milestone</Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        {tasks.map((task, index) => (
                            <motion.div key={task._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                                <Card className="bg-slate-900/50 border-slate-800 hover:bg-slate-900 transition-colors overflow-hidden group">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Status Strip */}
                                        <div className={`w-full md:w-2 h-2 md:h-auto ${task.status === 'completed' ? 'bg-emerald-500' :
                                            task.status === 'submitted' ? 'bg-amber-500' :
                                                'bg-slate-600'
                                            }`} />

                                        <div className="flex-1 p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                                    {task.title}
                                                    {task.status === 'completed' && <CheckCircle className="text-emerald-500 w-5 h-5" />}
                                                </h3>
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    task.status === 'submitted' ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-slate-700 text-slate-400'
                                                    }`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            <p className="text-slate-400 mb-4">{task.description}</p>
                                            <div className="flex items-center text-xs text-slate-500 gap-4">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Created: Today</span>
                                                {task.timeline && <span className="flex items-center gap-1 text-indigo-400"><Clock className="w-3 h-3" /> Due: {new Date(task.timeline).toLocaleDateString()}</span>}
                                            </div>
                                        </div>

                                        {/* Action Area */}
                                        <div className="p-6 bg-slate-950/30 flex flex-col justify-center items-center min-w-[240px] border-l border-slate-800/50">
                                            {task.status !== 'completed' ? (
                                                <div className="text-center w-full">
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept=".zip,.rar,.7z"
                                                        ref={(el) => { fileInputRefs.current[task._id] = el; }}
                                                        onChange={(e) => handleFileUpload(task._id, e)}
                                                    />
                                                    <button
                                                        onClick={() => fileInputRefs.current[task._id]?.click()}
                                                        className="w-full border-2 border-dashed border-slate-700 rounded-lg p-4 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group/upload flex flex-col items-center gap-2"
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover/upload:bg-indigo-500/20 transition-colors">
                                                            <Upload className="w-5 h-5 text-slate-400 group-hover/upload:text-indigo-400" />
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-300 group-hover/upload:text-white">
                                                            {task.status === 'submitted' ? 'Re-upload Work' : 'Upload Deliverable'}
                                                        </span>
                                                        <span className="text-xs text-slate-500">ZIP files only</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                                                        <FileArchive className="w-6 h-6 text-emerald-400" />
                                                    </div>
                                                    <p className="text-sm font-medium text-emerald-400">Work Approved</p>
                                                    <p className="text-xs text-emerald-500/60">Payment Released</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </FadeIn>
    );
}
