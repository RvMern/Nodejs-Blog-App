const globalErrorHandler = (err,req,res,next) => {
    const stack = err.stack;
    const message = err.message;
    const success = err.success ? err.success : 'false';
    const statusCode = err.statusCode ? err.statusCode : 500;

    res.status(statusCode).json({
        message,
        success,
        stack
    });
};




module.exports = globalErrorHandler;