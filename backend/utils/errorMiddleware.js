import AppError from "./AppError.js";

const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: "Something went wrong, please try again" });
};

export default errorMiddleware;
