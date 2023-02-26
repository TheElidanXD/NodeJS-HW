import express, { NextFunction, Request, Response } from 'express';
import { userRouter, usersRouter } from './controllers/user.controller';
import { groupRouter, groupsRouter } from './controllers/group.controller';
import { userGroupsRouter } from './controllers/user-group.controller';
import { Error } from 'sequelize';

import * as dotenv from 'dotenv';
import { StatusCodes } from './utils/utils';
dotenv.config();

const app = express();
app.listen(process.env.DEV_PORT);

const appRouter = express.Router();
appRouter.use('/user', userRouter);
appRouter.use('/users', usersRouter);
appRouter.use('/groups', groupsRouter);
appRouter.use('/group', groupRouter);
appRouter.use('/user-group', userGroupsRouter);
app.use('', appRouter);

// eslint-disable-next-line no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.NOT_FOUND).json(err);
});
