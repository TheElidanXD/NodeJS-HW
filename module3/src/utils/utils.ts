import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line no-shadow
export enum StatusCodes {
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN  = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}

export const validateSchema = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false
        });
        if (error?.isJoi) {
            const errors = error.details.map(e => e.message);
            res.status(StatusCodes.BAD_REQUEST).json({ status: false, errors });
        } else {
            next();
        }
    };
};
