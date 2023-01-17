import express, { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { User } from './types/user';
import Joi from 'joi';

const userService = express();
const router = express.Router();

const userSchema = Joi.object().keys({
    login: Joi.string().required(),
    password: Joi.string().required().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/),
    age: Joi.number().integer().min(4).max(130)
});

const validateUserSchema = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        });
        if (error?.isJoi) {
            const errors = error.details.map(e => e.message);
            res.status(400).json({ status: false, errors });
        } else {
            next();
        }
    };
};

const userList: User[] = [
    { id: 'b3f78b6a-c11d-452b-9b4b-5ae318a75d14', login: 'User5', password: 'password123', age: 23, isDeleted: false },
    { id: '395d5202-e904-4933-a2fa-ac34b93eff00', login: 'User2', password: 'password321', age: 55, isDeleted: false },
    { id: '1cf21bcf-71ce-4ea9-910c-f438dc172123', login: 'User9', password: '1234qwe', age: 111, isDeleted: false },
    { id: 'e3699f09-ead5-4e91-b58d-375c156a5aaa', login: 'User4', password: '1234qwe', age: 111, isDeleted: false },
    { id: '42732bb8-0c36-469e-a5d1-dc14cf074f3b', login: 'User3', password: '1234qwe', age: 111, isDeleted: false },
    { id: '47a3f8a3-be65-4aad-a5e7-cf7faf424a28', login: 'User1', password: '1234qwe', age: 111, isDeleted: false },
    { id: '685a81ec-1406-4930-92e1-ee77a6c09020', login: 'User7', password: '1234qwe', age: 111, isDeleted: false }
];

const getUndeletedUsers = () => userList.filter(user => !user.isDeleted);
const getUserById = (id: string) => getUndeletedUsers().find(user => user.id === id);

const findUsersBySubstring = (substring: string) => getUndeletedUsers()
    .filter(user => substring && user.login.toLowerCase().includes(substring.toLowerCase()))
    .sort((a, b) => {
        if (a.login > b.login) {
            return 1;
        } else if (b.login > a.login) {
            return -1;
        }
        return 0;
    });

userService.listen(3000);
router.use(express.json());

router.param('id', (req, res, next, id) => {
    const currentUser = getUserById(id);
    if (currentUser) {
        res.locals.user = currentUser;
        next();
    } else {
        res.status(404).json({ message: `User with id ${id} not found` });
    }
});

router.get('/', (req, res) => {
    res.json(userList);
});

router.get('/user/:id', (req, res) => {
    res.json(res.locals.user);
});

router.post('/', validateUserSchema(userSchema), (req, res) => {
    const newUser: User = {
        id: uuid(),
        isDeleted: false,
        ...req.body
    };
    userList.push(newUser);
    res.status(204).send();
});

router.put('/user/:id', validateUserSchema(userSchema), (req, res) => {
    const currentUserIndex = getUndeletedUsers().indexOf(res.locals.user);
    userList[currentUserIndex] = {
        ...userList[currentUserIndex],
        ...req.body
    };
    res.status(204).send();
});

router.delete('/user/:id', (req, res) => {
    const currentUser = res.locals.user;
    currentUser.isDeleted = true;
    res.status(204).send();
});

router.get('/autoSuggestUsers/:substring/:limit', (req, res) => {
    if (Number(req.params.limit) < 1) {
        res.status(400).json({ message: 'Invalid limit' });
    } else {
        const autoSuggestUsers = findUsersBySubstring(req.params.substring);
        autoSuggestUsers.length ?
            res.json(autoSuggestUsers.slice(0, Number(req.params.limit))) :
            res.status(404).json({ message: 'Users not found' });
    }
});

userService.use('/users', router);
