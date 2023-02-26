import { GroupService } from '../services/group.service';
import express from 'express';
import { Error } from 'sequelize';
import { StatusCodes, validateSchema } from '../utils/utils';
import { groupSchema } from '../validators/group';
import { GroupInstance } from '../models/group';

const groupService = new GroupService();

export const groupsRouter = express.Router();
groupsRouter.use(express.json());

groupsRouter.get('/', (req, res, next) => {
    groupService.getAllGroups()
        .then((value: GroupInstance[]) => {
            res.json(value);
        })
        .catch((err: Error) => next(err));
});

groupsRouter.post('/', validateSchema(groupSchema), (req, res, next) => {
    groupService.createGroup(req.body)
        .then((result: GroupInstance) => {
            res.json(result);
        })
        .catch((err: Error) => next(err));
});

export const groupRouter = express.Router();
groupRouter.use(express.json());

groupRouter.get('/:id', (req, res, next) => {
    groupService.getGroupById(req.params.id)
        .then((result: GroupInstance) => {
            res.json(result);
        })
        .catch((err: Error) => next(err));
});

groupRouter.put('/:id', validateSchema(groupSchema), (req, res, next) => {
    groupService.updateGroup(req.params.id, req.body)
        .then(() => {
            res.status(StatusCodes.NO_CONTENT).send();
        })
        .catch((err: Error) => next(err));
});

groupRouter.delete('/:id', (req, res, next) => {
    groupService.deleteGroup(req.params.id)
        .then(() => {
            res.status(StatusCodes.NO_CONTENT).send();
        })
        .catch((err: Error) => next(err));
});
