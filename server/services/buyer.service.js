import Project from "../models/Project.js";
import ProjectRequest from "../models/ProjectRequest.js";
import Submission from "../models/Submission.js";
import Task from "../models/Task.js";

const getBuyerStats = async (buyerId) => {
    try {
        // Get buyer's projects
        const buyerProjects = await Project.find({ buyerId });
        const projectIds = buyerProjects.map(p => p._id);

        // Get only OPEN project IDs (for pending applications)
        const openProjectIds = buyerProjects
            .filter(p => p.status === 'open')
            .map(p => p._id);

        // Get tasks for these projects
        const tasks = await Task.find({ projectId: { $in: projectIds } });
        const taskIds = tasks.map(t => t._id);

        // Count pending submissions (work submitted for review)
        const pendingSubmissions = await Submission.countDocuments({
            taskId: { $in: taskIds },
            status: 'pending'
        });

        // Count pending project requests (solver applications) - ONLY for open projects
        const pendingApplications = await ProjectRequest.countDocuments({
            projectId: { $in: openProjectIds },
            status: 'pending'
        });

        // Total pending reviews = submissions + applications
        const pendingReviews = pendingSubmissions + pendingApplications;

        // Calculate total spend (completed projects)
        const totalSpent = buyerProjects
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + (p.budget || 0), 0);

        // Count active projects
        const activeProjects = buyerProjects.filter(
            p => p.status === 'open' || p.status === 'assigned'
        ).length;

        return {
            success: true,
            data: {
                totalSpent,
                activeProjects,
                pendingReviews
            }
        };
    } catch (error) {
        console.error('Error in getBuyerStats service:', error.message);
        return { success: false, error: error.message };
    }
};

export const buyerService = {
    getBuyerStats
};
