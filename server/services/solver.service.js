import Project from '../models/Project.js';
import Task from '../models/Task.js';
import mongoose from 'mongoose';

const getSolverStats = async (solverId) => {
    try {
        // Convert solverId string to ObjectId
        const solverObjectId = new mongoose.Types.ObjectId(solverId);

        const [
            earningsResult,
            totalTasks,
            completedTasks,
            availableProjects
        ] = await Promise.all([
            Project.aggregate([
                {
                    $match: {
                        assignedSolverId: solverObjectId,
                        status: 'completed'
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalEarnings: { $sum: '$budget' },
                        totalProjects: { $sum: 1 }
                    }
                }
            ]),
            Task.countDocuments({ solverId: solverObjectId }),
            Task.countDocuments({ solverId: solverObjectId, status: 'completed' }),
            Project.countDocuments({ status: 'open' })
        ]);

        const totalEarnings = earningsResult[0]?.totalEarnings || 0;
        const totalProjects = earningsResult[0]?.totalProjects || 0;

        const successRate = totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        return {
            success: true,
            data: {
                totalEarnings,
                successRate,
                totalProjects,
                availableProjects
            }
        };
    } catch (error) {
        console.error('Error in getSolverStats service:', error);
        return { success: false, error: error.message };
    }
};

export const SolverService = {
    getSolverStats
};
