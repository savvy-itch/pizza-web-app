const { StatusCodes } = require('http-status-codes');
const path = require('path');

const errorHandlerMiddleware = async (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later'
  }
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose different value`;
    customError.statusCode = 400;
  }
  if (customError.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
    return res.status(customError.statusCode).sendFile(path.join(__dirname, '..', 'public', '500.html'));
  }
  return res.status(customError.statusCode).json({ msg: customError.msg, code: customError.code });
}

module.exports = errorHandlerMiddleware;