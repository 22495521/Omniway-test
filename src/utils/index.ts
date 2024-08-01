import jsonWebToken, { type JwtPayload } from 'jsonwebtoken';
import createHttpError from 'http-errors';

export const generateToken = (username: string, isRefresh: boolean) => {
    const expiresIn = isRefresh ? '5m' : '2m';
    const secret = isRefresh ? process.env.JWT_Refresh_SECRET : process.env.JWT_SECRET;
    return jsonWebToken.sign({ username }, secret, {
        expiresIn
    });
};

export const verifyToken = (token: string, isRefresh: boolean): JwtPayload => {
    const secret = isRefresh ? process.env.JWT_Refresh_SECRET : process.env.JWT_SECRET;
    try {
        return jsonWebToken.verify(token, secret) as JwtPayload;
    } catch (error) {
        if (error instanceof jsonWebToken.TokenExpiredError) {
            throw createHttpError(202, '令牌已過期，請重新登錄');
        } else if (error instanceof jsonWebToken.JsonWebTokenError) {
            throw createHttpError(401, '無效的令牌');
        } else if (error instanceof jsonWebToken.NotBeforeError) {
            throw createHttpError(401, '令牌未激活');
        } else {
            throw createHttpError(500, '伺服器內部錯誤');
        }
    }
};
