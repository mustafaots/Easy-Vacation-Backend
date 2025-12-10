import { getUserFromRequest } from '../services/auth.service.js';

export const requireAuth = async (req, res, next) => {
	try {
		const user = await getUserFromRequest(req);
		if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });
		req.user = user;
		next();
	} catch (err) {
		res.status(401).json({ success: false, error: 'Unauthorized' });
	}
};
