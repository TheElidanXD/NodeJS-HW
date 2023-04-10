import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { app, server } from '../app';
import { StatusCodes } from '../utils/utils';
import { usersRouter, userRouter } from './user.controller';

jest.mock('../services/user.service', () => {
    return {
        UserService: jest.fn().mockImplementation(() => {
            return {
                getAllUsers: jest.fn()
                    .mockResolvedValueOnce({ login: 'testUser' })
                    .mockRejectedValueOnce(new Error('error')),
                createUser: jest.fn()
                    .mockResolvedValueOnce({ login: 'testUser' })
                    .mockRejectedValueOnce(new Error('error')),
                findUsersBySubstring: jest.fn()
                    .mockResolvedValueOnce({ login: 'testUser' })
                    .mockRejectedValueOnce(new Error('error')),
                getUserById: jest.fn()
                    .mockResolvedValueOnce({ login: 'testUser' })
                    .mockRejectedValueOnce(new Error('error')),
                updateUser: jest.fn()
                    .mockResolvedValueOnce(null)
                    .mockRejectedValueOnce(new Error('error')),
                deleteUser: jest.fn()
                    .mockResolvedValueOnce(null)
                    .mockRejectedValueOnce(new Error('error')),
            };
        })
    };
});

jest.mock('./auth.controller', () => ({
    checkToken: jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
    }),
    authRouter: () => express.Router()
}));

jest.mock('../utils/utils', () => ({
    validateSchema: () => jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
    }),
    StatusCodes: {
        INTERNAL_SERVER_ERROR: 500,
        NO_CONTENT: 204
    }
}));

describe('User controller tests', () => {
    afterAll(async () => {
        await server.close();
    });

    test('usersRouter should be defined', () => {
        expect(usersRouter).toBeDefined();
    });

    test('userRouter should be defined', () => {
        expect(userRouter).toBeDefined();
    });

    test('should send user', async () => {
        const res = await request(app).get('/users');
        expect(res).toBeDefined();
        expect(res.body).toEqual({ login: 'testUser' });
    });

    test('should not send user', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    test('should create user', async () => {
        const res = await request(app).post('/users');
        expect(res).toBeDefined();
        expect(res.body).toEqual({ login: 'testUser' });
    });

    test('should not create user', async () => {
        const res = await request(app).post('/users');
        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    test('should find users by substring', async () => {
        const res = await request(app).get('/users/autoSuggestUsers/substr/5');
        expect(res).toBeDefined();
        expect(res.body).toEqual({ login: 'testUser' });
    });

    test('should not find users by substring', async () => {
        const res = await request(app).get('/users/autoSuggestUsers/substr/5');
        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    test('should get user', async () => {
        const res = await request(app).get('/user/123');
        expect(res).toBeDefined();
        expect(res.body).toEqual({ login: 'testUser' });
    });

    test('should not get user', async () => {
        const res = await request(app).get('/user/123');
        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    test('should update user', async () => {
        const res = await request(app).put('/user/123');
        expect(res).toBeDefined();
        expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    test('should not update user', async () => {
        const res = await request(app).put('/user/123');
        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    test('should delete user', async () => {
        const res = await request(app).delete('/user/123');
        expect(res).toBeDefined();
        expect(res.statusCode).toEqual(StatusCodes.NO_CONTENT);
    });

    test('should not delete user', async () => {
        const res = await request(app).delete('/user/123');
        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });
});
