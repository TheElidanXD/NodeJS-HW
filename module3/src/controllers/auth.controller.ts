import express, { NextFunction, Request, Response } from 'express';
import { Error } from 'sequelize';
import jwt from 'jsonwebtoken';
import { StatusCodes } from '../utils/utils';
import { UserService } from '../services/user.service';
import { UserInstance } from '../models/user';
import * as process from 'process';

const userService = new UserService();

export const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post('/:login/:password', (req, res, next) => {
    userService.getUserByLoginAndPassword(req.params.login, req.params.password)
        .then((result: UserInstance) => {
            if (result) {
                const payload = { user: result.dataValues.id };
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 180 });
                res.json({ success: true, token });
            } else {
                res.status(StatusCodes.FORBIDDEN)
                    .json({ success: false, message: 'Bad login/password combination' });
            }
        })
        .catch((err: Error) => next(err));
});

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['x-access-token'] as string;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (error) => {
            if (error) {
                res.status(StatusCodes.FORBIDDEN)
                    .json({ success: false, message: 'Failed to authenticate access token' });
            } else {
                next();
            }
        });
    } else {
        res.status(StatusCodes.UNAUTHORIZED)
            .json({ success: false, message: 'No access token provided' });
    }
};
