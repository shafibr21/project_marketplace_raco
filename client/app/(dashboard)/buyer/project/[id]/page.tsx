'use client';

import { useEffect, useState, useCallback } from 'react'; // Added useCallback
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/animations/FadeIn';
import toast from 'react-hot-toast';
import { Check, X, FileText, Download } from 'lucide-react';

// Interfaces (Should be in a separate types file in real app)
interface Project {
    _id: string;
    title: string;
    description: string;
    budget: number;
    status: string;
    assignedSolverId: { _id: string, username: string } | null;
}

interface Request {
    _id: string;
    solverId: { _id: string, username: string, email: string };
    message: string;
    status: string;
}

interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    timeline: string;
}

interface Submission {
    _id: string;
    filePath: string;
    status: string;
    taskId: string;
}

export default function BuyerProjectPage() {
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [requests, setRequests] = useState<Request[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({});

    const fetchProjectData = useCallback(async () => {
        try {
            const pRes = await api.get(`/projects/${id}`);
            setProject(pRes.data);

            if (pRes.data.status === 'open') {
                const rRes = await api.get(`/requests/project/${id}`);
                setRequests(rRes.data);
            } else {
                // Fetch tasks if assigned
                const tRes = await api.get(`/tasks/project/${id}`);
                setTasks(tRes.data);

                // Fetch submissions for tasks
                const subs: Record<string, Submission[]> = {};
                for (const t of tRes.data) {
                    const sRes = await api.get(`/submissions/task/${t._id}`);
                    subs[t._id] = sRes.data;
                }
                setSubmissions(subs);
            }
        } catch (err) {
            toast.error('Failed to load project details');
        }
    }, [id]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    const assignSolver = async (solverId: string) => {
        try {
            await api.put(`/projects/${id}/assign`, { solverId });
            toast.success('Solver assigned successfully!');
            fetchProjectData();
        } catch (err) {
            toast.error('Failed to assign solver');
        }
    };

    const reviewSubmission = async (submissionId: string, status: 'accepted' | 'rejected') => {
        try {
            await api.put(`/submissions/${submissionId}/review`, { status });
            toast.success(`Submission ${status}`);
            fetchProjectData(); // Refresh to see status updates
        } catch (err) {
            toast.error('Failed to review submission');
        }
    };

    const markProjectCompleted = async () => {
        try {
            await api.put(`/projects/${id}/complete`);
            toast.success('Project marked as completed!');
            fetchProjectData(); // Refresh to see updated status
        } catch (err) {
            toast.error('Failed to mark project as completed');
        }
    };

    const hasCompletedTask = tasks.some(task => task.status === 'completed');

    if (!project) return <div>Loading...</div>;

    return (
        <FadeIn>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-black">{project.title}</h1>
                <p className="text-slate-500">{project.description}</p>
                <div className="mt-4 flex gap-4 items-center">
                    <span className="font-bold text-black">${project.budget}</span>
                    <span className="uppercase tracking-wide text-sm font-semibold bg-slate-100 px-2 py-1 rounded text-black">{project.status}</span>
                    {hasCompletedTask && project.status !== 'completed' && (
                        <Button 
                            onClick={markProjectCompleted}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Mark as Completed
                        </Button>
                    )}
                </div>
            </div>

            {project.status === 'open' ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Solver Requests ({requests.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {requests.length === 0 ? <p className="text-slate-500">No requests yet.</p> : (
                            <div className="space-y-4">
                                {requests.map(req => (
                                    <div key={req._id} className="border p-4 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-black">{req.solverId.username}</p>
                                            <p className="text-smtext-black">{req.message}</p>
                                        </div>
                                        <Button onClick={() => assignSolver(req.solverId._id)}>Assign Project</Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    <Card className="bg-slate-50 border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-base text-slate-500">Assigned Solver</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-semibold text-black">{project.assignedSolverId?.username}</p>
                        </CardContent>
                    </Card>

                    <h2 className="text-2xl font-bold pt-4 text-black">Tasks & Progress</h2>
                    {tasks.length === 0 ? <p className="text-black  ">Solver has not created tasks yet.</p> : (
                        <div className="grid gap-4">
                            {tasks.map(task => (
                                <Card key={task._id} className={task.status === 'completed' ? 'border-green-200 bg-green-50 text-black' : 'text-black'}>
                                    <CardHeader>
                                        <div className="flex justify-between">
                                            <CardTitle>{task.title}</CardTitle>
                                            <span className="capitalize text-sm font-medium px-2 py-1 bg-white rounded border text-black">{task.status}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-600 mb-4">{task.description}</p>

                                        {/* Submissions Section */}
                                        <div>
                                            <h4 className="font-semibold mb-2 flex items-center"><FileText className="w-4 h-4 mr-2" /> Submissions</h4>
                                            {submissions[task._id]?.length > 0 ? (
                                                submissions[task._id].map(sub => (
                                                    <div key={sub._id} className="bg-white p-3 rounded border flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Download className="w-4 h-4 text-black" />
                                                            <a href={`http://localhost:5000/${sub.filePath}`} target="_blank" className="text-blue-600 hover:underline text-sm truncate max-w-[200px]" rel="noreferrer">
                                                                Download ZIP
                                                            </a>
                                                            <span className={`text-xs px-2 py-0.5 rounded ${sub.status === 'accepted' ? 'bg-green-100' : sub.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                                                                {sub.status}
                                                            </span>
                                                        </div>
                                                        {sub.status === 'pending' && (
                                                            <div className="flex gap-2 text-black">
                                                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => reviewSubmission(sub._id, 'accepted')}>Accept</Button>
                                                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => reviewSubmission(sub._id, 'rejected')}>Reject</Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-slate-400">No submissions yet.</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </FadeIn>
    );
}
