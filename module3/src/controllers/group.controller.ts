import { GroupService } from '../services/group.service';
import express from 'express';
import { Error } from 'sequelize';
import { StatusCodes, validateSchema } from '../utils/utils';
import { groupSchema } from '../validators/group';
import { GroupInstance } from '../models/group';
import { checkToken } from './auth.controller';

const groupService = new GroupService();

export const groupsRouter = express.Router();
groupsRouter.use(express.json());

groupsRouter.get('/', checkToken, (req, res, next) => {
    groupService.getAllGroups()
        .then((value: GroupInstance[]) => {
            res.json(value);
        })
        .catch((err: Error) => next(err));
});

groupsRouter.post('/', checkToken, validateSchema(groupSchema), (req, res, next) => {
    groupService.createGroup(req.body)
        .then((result: GroupInstance) => {
            res.json(result);
        })
        .catch((err: Error) => next(err));
});

export const groupRouter = express.Router();
groupRouter.use(express.json());

groupRouter.get('/:id', checkToken, (req, res, next) => {
    groupService.getGroupById(req.params.id)
        .then((result: GroupInstance) => {
            res.json(result);
        })
        .catch((err: Error) => next(err));
});

groupRouter.put('/:id', checkToken, validateSchema(groupSchema), (req, res, next) => {
    groupService.updateGroup(req.params.id, req.body)
        .then(() => {
            res.status(StatusCodes.NO_CONTENT).send();
        })
        .catch((err: Error) => next(err));
});

groupRouter.delete('/:id', checkToken, (req, res, next) => {
    groupService.deleteGroup(req.params.id)
        .then(() => {
            res.status(StatusCodes.NO_CONTENT).send();
        })
        .catch((err: Error) => next(err));
});
