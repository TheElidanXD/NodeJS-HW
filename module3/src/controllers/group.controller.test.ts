import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { app, server } from '../app';
import { StatusCodes } from '../utils/utils';
import { groupRouter, groupsRouter } from './group.controller';

jest.mock('../services/group.service', () => {
    return {
        GroupService: jest.fn().mockImplementation(() => {
            return {
                getAllGroups: jest.fn()
                    .mockResolvedValueOnce(['group1', 'group2'])
                    .mockRejectedValueOnce(new Error('error')),
                createGroup: jest.fn()
                    .mockResolvedValueOnce('group1')
                    .mockRejectedValueOnce(new Error('error')),
                getGroupById: jest.fn()
                    .mockResolvedValueOnce('group1')
                    .mockRejectedValueOnce(new Error('error')),
                updateGroup: jest.fn()
                    .mockResolvedValueOnce(null)
                    .mockRejectedValueOnce(new Error('error')),
                deleteGroup: jest.fn()
                    .mockResolvedValueOnce(null)
                    .mockRejectedValueOnce(new Error('error')),
            };
        })
    };
});

jest.mock('../utils/utils', () => ({
    validateSchema: () => jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
    }),
    StatusCodes: {
        INTERNAL_SERVER_ERROR: 500,
        NO_CONTENT: 204
    }
}));

jest.mock('./auth.controller', () => ({
    checkToken: jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
    }),
    authRouter: () => express.Router()
}));

describe('Group controller tests', () => {
    afterAll(async () => {
        await server.close();
    });

    test('groupsRouter should be defined', () => {
        expect(groupsRouter).toBeDefined();
    });

    test('groupRouter should be defined', () => {
        expect(groupRouter).toBeDefined();
    });

    test('should get all groups', async () => {
        const res = await request(app).get('/groups');
        expect(res).toBeDefined();
        expect(res.body).toEqual(['group1', 'group2']);
    });

    test('should not get all groups', async () => {
        const res = await request(app).get('/groups');
        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    test('should create new group', async () => {
        const res = await request(app).post('/groups');
        expect(res).toBeDefined();
        expect(res.body).toEqual('group1');
    });

    test('should not create new group', async () => {
        const res = await request(app).post('/groups');
        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    test('should get group by id', async () => {
        const res = await request(app).get('/group/123');
        expect(res).toBeDefined();
        expect(res.body).toEqual('group1');
    });

    test('should not get group by id', async () => {
        const res = await request(app).get('/group/123');
        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    test('should update group', async () => {
        const res = await request(app).put('/group/123');
        expect(res).toBeDefined();
        expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    test('should not update group', async () => {
        const res = await request(app).put('/group/123');
        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    test('should delete group', async () => {
        const res = await request(app).delete('/group/123');
        expect(res).toBeDefined();
        expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    test('should not delete group', async () => {
        const res = await request(app).delete('/group/123');
        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});
