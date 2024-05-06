const appError = (statusCode,message) => {
    let error = new Error(message);
    error.stack = error.stack;
    error.statusCode = statusCode ? statusCode : 500;
    return error;
};


module.exports = appError;