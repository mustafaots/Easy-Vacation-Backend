export const errorHandler = (err, req, res, next) => {
	// Fallback status code
	const status = err.status || 500;
	console.error('Error handler:', err); // keep lean log
	res.status(status).json({
		success: false,
		error: err.message || 'Something went wrong',
	});
};
