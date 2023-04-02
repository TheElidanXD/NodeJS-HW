import express from 'express';
import { Error } from 'sequelize';
import { UserGroupService } from '../services/user-group.service';
import { UserGroupInstance } from '../models/user-group';
import { checkToken } from './auth.controller';

const userGroupService = new UserGroupService();

export const userGroupsRouter = express.Router();
userGroupsRouter.use(express.json());

userGroupsRouter.get('/', checkToken, (req, res, next) => {
    userGroupService.getAllUserGroups()
        .then((value: UserGroupInstance[]) => {
            res.json(value);
        })
        .catch((err: Error) => next(err));
});

userGroupsRouter.post('/', checkToken, (req, res, next) => {
    userGroupService.createUserGroup(req.body)
        .then((value: UserGroupInstance) => {
            res.json(value);
        })
        .catch((err: Error) => next(err));
});
