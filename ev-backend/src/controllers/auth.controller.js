import { signUp, signIn, signOut, getUserFromRequest, ensureUserProfile } from '../services/auth.service.js';

export const register = async (req, res) => {
	try {
		const { email, password, username, first_name, last_name, user_type, ...profile } = req.body;
		const data = await signUp({ email, password, username, first_name, last_name, user_type, ...profile });
		const authUser = data.user;
		if (authUser) {
			await ensureUserProfile({
				id: authUser.id,
				email: authUser.email,
				username: username || authUser.user_metadata?.username,
				first_name,
				last_name,
				user_type,
			});
		}
		res.status(201).json({ success: true, data: { user: data.user, session: data.session } });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const data = await signIn({ email, password });
		const authUser = data.user;
		if (authUser) {
			await ensureUserProfile({
				id: authUser.id,
				email: authUser.email,
				username: authUser.user_metadata?.username,
				first_name: authUser.user_metadata?.first_name,
				last_name: authUser.user_metadata?.last_name,
				user_type: authUser.user_metadata?.user_type,
			});
		}
		res.json({ success: true, data: { user: data.user, session: data.session } });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		const authHeader = req.headers.authorization;
		await signOut(authHeader?.split(' ')[1]);
		res.json({ success: true });
	} catch (error) {
		res.status(400).json({ success: false, error: error.message });
	}
};

export const me = async (req, res) => {
	try {
		const user = await getUserFromRequest(req);
		if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });
		res.json({ success: true, data: user });
	} catch (error) {
		res.status(401).json({ success: false, error: error.message });
	}
};
