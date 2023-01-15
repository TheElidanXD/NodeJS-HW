import express from 'express';
import { userRouter, usersRouter } from './controllers/user.controller';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
app.listen(process.env.DEV_PORT);

const appRouter = express.Router();
appRouter.use('/user', userRouter);
appRouter.use('/users', usersRouter);
app.use('', appRouter);
