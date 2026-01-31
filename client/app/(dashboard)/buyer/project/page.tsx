'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FadeIn } from '@/components/animations/FadeIn';
import toast from 'react-hot-toast';
import { Plus, Eye } from 'lucide-react';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  buyerId: User;
  assignedSolverId?: User;
  createdAt: string;
  updatedAt: string;
}

const BuyerProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects/buyer/my-projects');
        setProjects(response.data);
        setLoading(false);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to fetch projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open - Awaiting Solver';
      case 'assigned':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading your projects...</div>
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">My Projects</h1>
            <p className="text-gray-600 mt-2">
              Total Projects: {projects.length}
            </p>
          </div>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 text-lg mb-4">You haven't created any projects yet</p>
              <Button 
                onClick={() => router.push('/buyer')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card 
                key={project._id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/buyer/project/${project._id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl text-black">{project.title}</CardTitle>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {getStatusText(project.status)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-700 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="border-t pt-3 space-y-3">
                      <div>
                        <span className="font-semibold text-sm text-gray-600">
                          Budget:
                        </span>
                        <span className="ml-2 text-lg font-bold text-green-600">
                          ${project.budget.toLocaleString()}
                        </span>
                      </div>

                      {project.assignedSolverId ? (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <span className="font-semibold text-sm text-gray-600 block mb-1">
                            Assigned Solver:
                          </span>
                          <p className="font-medium text-black">
                            {project.assignedSolverId.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            {project.assignedSolverId.email}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-amber-50 p-3 rounded-lg text-center">
                          <p className="text-sm text-amber-800 font-medium">
                            Waiting for solver applications
                          </p>
                        </div>
                      )}

                      <div className="text-xs text-gray-500 pt-2 border-t">
                        <p>
                          Created:{' '}
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                        <p>
                          Updated:{' '}
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/buyer/project/${project._id}`);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </FadeIn>
  );
};

export default BuyerProjects;