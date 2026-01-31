import { SolverService } from '../services/solver.service.js';

const getSolverStats = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const result = await SolverService.getSolverStats(req.user.id);

        if (!result.success) {
            return res.status(500).json({ message: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        console.error('Error in getSolverStats controller:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const SolverController = {
    getSolverStats
};
