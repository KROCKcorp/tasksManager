export default function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'something went wrong on the server';

  res.status(status).json({ msg: message });
}
