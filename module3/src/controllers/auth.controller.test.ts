import { describe, expect, test } from '@jest/globals';
import { app, server } from '../app';
import request from 'supertest';
import { authRouter, checkToken } from './auth.controller';
import { StatusCodes } from '../utils/utils';
import { Request, Response } from 'express';

jest.mock('../services/user.service', () => {
    return {
        UserService: jest.fn().mockImplementation(() => {
            return {
                getUserByLoginAndPassword: jest.fn()
                    .mockResolvedValueOnce({ dataValues: { id: 123 } })
                    .mockResolvedValueOnce(null)
                    .mockRejectedValueOnce(new Error('error'))
            };
        })
    };
});

let jwtVerifyError: null|string = null;
jest.mock('jsonwebtoken', () => ({
    ...jest.requireActual('jsonwebtoken'),
    sign: jest.fn().mockReturnValue('testToken'),
    verify: jest.fn((token, secret, callback) => {
        return callback(jwtVerifyError, { sub: '123' });
    })
}));

describe('Auth controller tests', () => {
    afterAll(async () => {
        await server.close();
    });

    test('groupsRouter should be defined', () => {
        expect(authRouter).toBeDefined();
    });

    test('should find user and create jwt token', async () => {
        const res = await request(app).post('/login/username/password');
        expect(res).toBeDefined();
        expect(res.body).toEqual({ success: true, token: 'testToken' });
    });

    test('should not find user and return forbidden error', async () => {
        const res = await request(app).post('/login/username/password');
        expect(res.statusCode).toEqual(StatusCodes.FORBIDDEN);
    });

    test('should fail getting user and return internal server error', async () => {
        const res = await request(app).post('/login/username/password');
        expect(res.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    test('should verify token', async () => {
        const req = {} as Request;
        const res = {} as Response;
        const next = jest.fn();
        req.headers = {
            'x-access-token': 'testToken'
        };
        await checkToken(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test('should not verify token and return forbidden error', async () => {
        const req = {} as Request;
        req.headers = {
            'x-access-token': 'testToken'
        };
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue({ json: jest.fn() });
        const next = jest.fn();
        jwtVerifyError = 'error';
        await checkToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
    });

    test('should not find verify token and return unauthorized error', async () => {
        const req = {} as Request;
        req.headers = {};
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue({ json: jest.fn() });
        const next = jest.fn();
        await checkToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    });
});
