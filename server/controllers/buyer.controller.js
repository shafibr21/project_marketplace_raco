import { buyerService } from "../services/buyer.service.js";

const getBuyerStats = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const result = await buyerService.getBuyerStats(req.user.id);

        if (!result.success) {
            return res.status(500).json({ message: result.error });
        }

        res.status(200).json(result.data);
    } catch (error) {
        console.error('Error in getBuyerStats controller:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const buyerController = {
    getBuyerStats
};
