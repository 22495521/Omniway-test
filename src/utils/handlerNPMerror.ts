import { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

export const handlerNPMError: ErrorRequestHandler = (err, _req, res, next): void => {
    if (err.message === 'Passport authentication error') {
        res.status(401).json({
            message: 'code 參數錯誤',
            status: 'false'
        });
        return;
    } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).json({
            status: 'false',
            message: err.message
        });
        return;
    } else if (err instanceof mongoose.Error.CastError) {
        res.status(400).json({
            status: 'false',
            message: err.message
        });
        return;
    } else {
        next(err);
    }
};
