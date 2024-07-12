
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); //next eka error ekak hadanna ona
}

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; //res.status 200 nisa 500 nisa
    res.status(statusCode);
    res.json({
        message: err.message,
        //stack: process.env.NODE_ENV === 'production' ? null : err.stack, //production eke nisa null
        stack: err?.stack, //optional chaining 
    })
}

module.exports = { notFound, errorHandler };