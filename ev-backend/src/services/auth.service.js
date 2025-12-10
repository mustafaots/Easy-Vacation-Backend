import supabase, { isServiceRole } from '../config/supabaseClient.js';

const parseAuthHeader = (authHeader = '') => {
	const [scheme, token] = authHeader.split(' ');
	if (scheme?.toLowerCase() === 'bearer' && token) return token;
	return null;
};

export const signUp = async ({ email, password, ...profile }) => {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: profile,
			emailRedirectTo: process.env.SUPABASE_EMAIL_REDIRECT,
		},
	});
	if (error) throw error;
	return data;
};

// Upsert a profile row in public.users to mirror auth.users
export const ensureUserProfile = async ({ id, email, username, user_type = 'tourist', first_name, last_name }) => {
	if (!id || !email) {
		throw new Error('Missing id or email for profile creation');
	}

	const { data, error } = await supabase
		.from('users')
		.upsert({
			id,
			email,
			username,
			user_type,
			first_name,
			last_name,
			is_verified: true,
		}, { onConflict: 'id' })
		.select()
		.single();

	if (error) throw error;
	return data;
};

export const signIn = async ({ email, password }) => {
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) throw error;
	return data;
};

export const signOut = async (token) => {
	if (!token) return { success: true };
	try {
		const { data: userData } = await supabase.auth.getUser(token);
		const userId = userData?.user?.id;

		if (userId && isServiceRole && supabase.auth?.admin?.signOut) {
			await supabase.auth.admin.signOut(userId);
		} else {
			// Fall back to client signOut (will no-op server-side but keeps behavior predictable)
			await supabase.auth.signOut();
		}
	} catch (err) {
		// non-fatal
	}
	return { success: true };
};

export const getUserFromRequest = async (req) => {
	const token = parseAuthHeader(req.headers.authorization);
	if (!token) return null;
	const { data, error } = await supabase.auth.getUser(token);
	if (error) throw error;
	return data.user;
};

export const extractToken = parseAuthHeader;
