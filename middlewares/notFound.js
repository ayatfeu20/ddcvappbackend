const NotFound = (_req, _res, next) => {
    const error = new Error('API Not Found');
	error.status = 404;
	next(error);
}

export default NotFound;