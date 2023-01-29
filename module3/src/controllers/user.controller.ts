import express from 'express';
import { Error } from 'sequelize';
import { UserService } from '../services/user.service';
import { StatusCodes, validateSchema } from '../utils/utils';
import { userSchema } from '../validators/user';
import { UserInstance } from '../models/user';

const userService = new UserService();

export const usersRouter = express.Router();
usersRouter.use(express.json());

usersRouter.get('/', (req, res, next) => {
    userService.getAllUsers()
        .then((value: UserInstance[]) => {
            res.json(value);
        })
        .catch((err: Error) => next(err));
});

usersRouter.post('/', validateSchema(userSchema), (req, res, next) => {
    userService.createUser(req.body)
        .then((result: UserInstance) => {
            res.json(result);
        })
        .catch((err: Error) => next(err));
});

usersRouter.post('/:groupId', validateSchema(userSchema), async (req, res) => {
    const user = await userService.addNewUserToGroup(req.body, req.params.groupId);
    if (user) {
        res.json(user);
    } else {
        res.status(StatusCodes.BAD_REQUEST).send();
    }
});

usersRouter.get('/autoSuggestUsers/:substring/:limit', (req, res) => {
    const { substring, limit } = req.params;
    userService.findUsersBySubstring(substring, Number(limit))
        .then((result: UserInstance[]) => {
            res.json(result);
        })
        .catch((err: Error) => {
            res.status(StatusCodes.NOT_FOUND).json(err);
        });
});
export const userRouter = express.Router();
userRouter.use(express.json());

userRouter.get('/:id', (req, res, next) => {
    userService.getUserById(req.params.id)
        .then((result: UserInstance) => {
            res.json(result);
        })
        .catch((err: Error) => next(err));
});

userRouter.put('/:id', validateSchema(userSchema), (req, res, next) => {
    userService.updateUser(req.params.id, req.body)
        .then(() => {
            res.status(StatusCodes.NO_CONTENT).send();
        })
        .catch((err: Error) => next(err));
});

userRouter.delete('/:id', (req, res, next) => {
    userService.deleteUser(req.params.id)
        .then(() => {
            res.status(StatusCodes.NO_CONTENT).send();
        })
        .catch((err: Error) => next(err));
});
