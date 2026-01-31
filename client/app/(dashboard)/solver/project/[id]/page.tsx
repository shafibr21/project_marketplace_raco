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
            <Button 
                variant="ghost" 
                onClick={() => router.back()} 
                className="mb-6 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <div className="grid gap-6 lg:grid-cols-3 mb-8">
                {/* Project Brief */}
                <div className="lg:col-span-2">
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2 block">
                                        Project Brief
                                    </span>
                                    <CardTitle className="text-2xl font-bold text-gray-900">
                                        {project.title}
                                    </CardTitle>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    project.status === 'open' 
                                        ? 'bg-green-50 text-green-700 border border-green-200' 
                                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}>
                                    {project.status}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed mb-6">
                                {project.description}
                            </p>
                            <div className="flex gap-8 pt-4 border-t border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                        Budget
                                    </p>
                                    <p className="text-xl font-bold text-green-600">
                                        ${project.budget}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                        Deadline
                                    </p>
                                    <p className="text-xl font-bold text-gray-900">
                                        Flexible
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pitch or Status Card */}
                <div>
                    {project.status === 'open' && (
                        <Card className="border-gray-200 shadow-sm h-full">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Submit Proposal</CardTitle>
                                <CardDescription className="text-gray-600">
                                    Explain why you're the best fit
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <textarea
                                    className="w-full h-32 border border-gray-200 rounded-lg p-3 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                    placeholder="I have experience with..."
                                    value={requestMsg}
                                    onChange={(e) => setRequestMsg(e.target.value)}
                                />
                                <Button 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                                    onClick={sendRequest}
                                >
                                    <Send className="w-4 h-4 mr-2" /> Send Request
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                    {isAssignedToMe && (
                        <Card className="bg-green-50 border-green-200 shadow-sm h-full flex flex-col justify-center items-center p-8 text-center">
                            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Active Assignment
                            </h3>
                            <p className="text-gray-600 text-sm">
                                You are assigned to this project
                            </p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Task Management */}
            {isAssignedToMe && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Tasks</h2>
                        <Button 
                            onClick={() => setShowTaskForm(!showTaskForm)} 
                            variant="outline" 
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            {showTaskForm ? 'Cancel' : '+ Add Milestone'}
                        </Button>
                    </div>

                    <AnimatePresence>
                        {showTaskForm && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }} 
                                exit={{ opacity: 0, height: 0 }} 
                                className="overflow-hidden"
                            >
                                <Card className="border-gray-200 shadow-sm mb-6">
                                    <CardContent className="pt-6">
                                        <form onSubmit={createTask} className="grid gap-4 md:grid-cols-2">
                                            <Input 
                                                placeholder="Milestone Title" 
                                                value={newTaskTitle} 
                                                onChange={e => setNewTaskTitle(e.target.value)} 
                                                required 
                                                className="border-gray-200"
                                            />
                                            <Input 
                                                type="date" 
                                                value={newTaskDate} 
                                                onChange={e => setNewTaskDate(e.target.value)} 
                                                required 
                                                className="border-gray-200"
                                            />
                                            <div className="md:col-span-2">
                                                <Input 
                                                    placeholder="Description" 
                                                    value={newTaskDesc} 
                                                    onChange={e => setNewTaskDesc(e.target.value)} 
                                                    required 
                                                    className="border-gray-200"
                                                />
                                            </div>
                                            <div className="md:col-span-2 flex justify-end">
                                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                                    Save Milestone
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        {tasks.map((task, index) => (
                            <motion.div 
                                key={task._id} 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Status Strip */}
                                        <div className={`w-full md:w-1 h-1 md:h-auto ${
                                            task.status === 'completed' ? 'bg-green-500' :
                                            task.status === 'submitted' ? 'bg-amber-500' :
                                            'bg-gray-300'
                                        }`} />

                                        <div className="flex-1 p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                                    {task.title}
                                                    {task.status === 'completed' && (
                                                        <CheckCircle className="text-green-600 w-5 h-5" />
                                                    )}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    task.status === 'completed' ? 'bg-green-50 text-green-700' :
                                                    task.status === 'submitted' ? 'bg-amber-50 text-amber-700' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-4">{task.description}</p>
                                            <div className="flex items-center text-xs text-gray-500 gap-4">
                                                {task.timeline && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> 
                                                        Due: {new Date(task.timeline).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Area */}
                                        <div className="p-6 bg-gray-50 flex flex-col justify-center items-center min-w-[200px] border-l border-gray-100">
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
                                                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-2"
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                                                            <Upload className="w-5 h-5 text-gray-600" />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {task.status === 'submitted' ? 'Re-upload' : 'Upload Work'}
                                                        </span>
                                                        <span className="text-xs text-gray-500">ZIP only</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                                                        <FileArchive className="w-6 h-6 text-green-600" />
                                                    </div>
                                                    <p className="text-sm font-medium text-green-700">Approved</p>
                                                    <p className="text-xs text-gray-500">Payment Released</p>
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
