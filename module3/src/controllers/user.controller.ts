import express from 'express';
import { Error } from 'sequelize';
import { UserService } from '../services/user.service';
import { validateSchema } from '../utils/utils';
import { userSchema } from '../validators/user';

const userService = new UserService();

export const usersRouter = express.Router();
usersRouter.use(express.json());

usersRouter.get('/', (req, res) => {
    userService.getAllUsers()
        .then((value: unknown) => {
            res.json(value);
        })
        .catch((err: Error) => {
            res.status(404).json(err);
        });
});

usersRouter.post('/', validateSchema(userSchema), (req, res) => {
    userService.createUser(req.body)
        .then((result: unknown) => {
            res.json(result);
        })
        .catch((err: Error) => {
            res.status(404).json(err);
        });
});

usersRouter.get('/autoSuggestUsers/:substring/:limit', (req, res) => {
    const { substring, limit } = req.params;
    userService.findUsersBySubstring(substring, Number(limit))
        .then((result: unknown) => {
            res.json(result);
        })
        .catch((err: Error) => {
            res.status(404).json(err);
        });
});
export const userRouter = express.Router();
userRouter.use(express.json());

userRouter.get('/:id', (req, res) => {
    userService.getUserById(req.params.id)
        .then((result: unknown) => {
            res.json(result);
        })
        .catch((err: Error) => {
            res.status(404).json(err);
        });
});

userRouter.put('/:id', validateSchema(userSchema), (req, res) => {
    userService.updateUser(req.params.id, req.body)
        .then(() => {
            res.status(204).send();
        })
        .catch((err: Error) => {
            res.status(404).json(err);
        });
});

userRouter.delete('/:id', (req, res) => {
    userService.deleteUser(req.params.id)
        .then(() => {
            res.status(204).send();
        })
        .catch((err: Error) => {
            res.status(404).json(err);
        });
});
