import Joi from 'joi';

export const userSchema = Joi.object().keys({
    login: Joi.string().required(),
    password: Joi.string().required().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/),
    age: Joi.number().integer().min(4).max(130)
});
