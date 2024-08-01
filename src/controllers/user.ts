import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import { handleErrorAsync, errorResponse } from '@/utils/errorHandler';
import { successResponse } from '@/utils/successHandler';
import UsersModel from '@/models/user';
import { generateToken } from '@/utils/index';
import { verifyToken } from '@/utils/index';

export const getData: RequestHandler = handleErrorAsync(async (_req, res, _next) => {
    res.status(200).json(
        successResponse({
            message: '成功'
        })
    );
});

export const signup: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        next(errorResponse(400, '格式錯誤'));
        return;
    }

    const checkEmail = await UsersModel.findOne({ username });

    if (checkEmail) {
        next(errorResponse(409, '此帳號已註冊'));
        return;
    }

    await UsersModel.create({
        username,
        password: await bcrypt.hash(password, 6)
    });

    res.status(200).json(
        successResponse({
            message: '註冊成功'
        })
    );
});

export const login: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const { username, password } = req.body;

    const user = await UsersModel.findOne({ username }).select('+password');
    if (!user) {
        next(errorResponse(404, '此使用者不存在'));
        return;
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        next(errorResponse(202, '密碼錯誤'));
        return;
    }

    const token = generateToken(user.username, false);
    const refreshToken = generateToken(user.username, true);

    res.status(200).json(
        successResponse({
            message: '登入成功',
            data: {
                username,
                token,
                refreshToken
            }
        })
    );
});

export const EditPassword: RequestHandler = handleErrorAsync(async (req, res, next) => {
    const { newPassword, username } = req.body;

    if (!username || !newPassword) {
        next(errorResponse(400, '格式錯誤'));
        return;
    }

    //抓取jwt上的username
    const token = req.headers.authorization?.split(' ')[1] as string;
    const userData = verifyToken(token, false);

    //jwt Data不等於 username
    if (username !== userData.username) {
        next(errorResponse(400, '資料錯誤'));
        return;
    }

    // 加密新密码
    const salt = await bcrypt.genSalt(10);
    //更新密碼
    await UsersModel.updateOne({ username }, { $set: { password: await bcrypt.hash(newPassword, salt) } });

    res.status(200).json(
        successResponse({
            message: '更新成功'
        })
    );
});

export const Validate_refresh_token: RequestHandler = handleErrorAsync(async (req, res, _next) => {
    //抓取jwt上的username
    const Refresh_token = req.headers.authorization?.split(' ')[1] as string;
    const userData = verifyToken(Refresh_token, true);

    //製作jwt訪問令牌
    const token = generateToken(userData.username, false);

    res.status(200).json(
        successResponse({
            message: 'token刷新成功',
            data: {
                token
            }
        })
    );
});
