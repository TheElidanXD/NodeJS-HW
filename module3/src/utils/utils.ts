import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

export const validateSchema = (schema: Joi.ObjectSchema) => {
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
