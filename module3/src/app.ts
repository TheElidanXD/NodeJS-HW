import express, { NextFunction, Request, Response } from 'express';
import { userRouter, usersRouter } from './controllers/user.controller';
import { groupRouter, groupsRouter } from './controllers/group.controller';
import { userGroupsRouter } from './controllers/user-group.controller';
import morgan from 'morgan';
import { Error } from 'sequelize';

import * as dotenv from 'dotenv';
import { StatusCodes } from './utils/utils';
dotenv.config();

const app = express();
app.listen(process.env.DEV_PORT);

morgan.token('body', (req: Request) => JSON.stringify(req.body));
morgan.token('params', (req: Request) => Object.entries(req.params).map(([param, value]) => `${param}:${value}`).join(' '));
app.use(morgan(':method :url :body :params - :response-time ms'));

const appRouter = express.Router();
appRouter.use('/user', userRouter);
appRouter.use('/users', usersRouter);
appRouter.use('/groups', groupsRouter);
appRouter.use('/group', groupRouter);
appRouter.use('/user-group', userGroupsRouter);
app.use('', appRouter);

// eslint-disable-next-line no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    req.params.error = err.message;
    res.status(StatusCodes.NOT_FOUND).json(err);
});
