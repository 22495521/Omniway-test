import type { RequestHandler } from 'express';
import { verifyToken } from '@/utils/index';
import { errorResponse, handleErrorAsync } from '@/utils/errorHandler';

let token: string;
export const isAuth: RequestHandler = handleErrorAsync(async (req, _res, next) => {
    token = '';
    if (req.headers.authorization && req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization?.split(' ')[1];
    }

    if (!token) {
        next(errorResponse(404, '你尚未登入'));
        return;
    }

    if (token) {
        await new Promise((_resolve, _reject) => {
            _resolve(verifyToken(token, false));
        });
    }
    next();
});

let Fresh_token: string;
export const Fresh_isAuth: RequestHandler = handleErrorAsync(async (req, _res, next) => {
    Fresh_token = '';
    if (req.headers.authorization && req.headers.authorization?.startsWith('Bearer')) {
        Fresh_token = req.headers.authorization?.split(' ')[1];
    }

    if (!Fresh_token) {
        next(errorResponse(404, '你尚未登入'));
        return;
    }

    if (Fresh_token) {
        await new Promise((_resolve, _reject) => {
            _resolve(verifyToken(Fresh_token, true));
        });
    }
    next();
});
