'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
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

const AdminProject = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/admin/projects');
        setProjects(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">All Projects</h1>
        <p className="text-gray-600 mt-2">
          Total Projects: {projects.length}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-700 line-clamp-3">
                  {project.description}
                </p>

                <div className="border-t pt-3 space-y-2">
                  <div>
                    <span className="font-semibold text-sm text-gray-600">
                      Budget:
                    </span>
                    <span className="ml-2 text-lg font-bold text-green-600">
                      ${project.budget.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-sm text-gray-600">
                      Buyer:
                    </span>
                    <div className="ml-2 text-sm">
                      <p className="font-medium">{project.buyerId.username}</p>
                      <p className="text-gray-500">{project.buyerId.email}</p>
                    </div>
                  </div>

                  {project.assignedSolverId && (
                    <div>
                      <span className="font-semibold text-sm text-gray-600">
                        Assigned Solver:
                      </span>
                      <div className="ml-2 text-sm">
                        <p className="font-medium">
                          {project.assignedSolverId.username}
                        </p>
                        <p className="text-gray-500">
                          {project.assignedSolverId.email}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 pt-2">
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No projects found</p>
        </div>
      )}
    </div>
  );
};

export default AdminProject;