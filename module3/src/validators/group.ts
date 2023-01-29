import Joi from 'joi';
import { availableGroupPermission } from '../models/group';

export const groupSchema = Joi.object().keys({
    name: Joi.string().required(),
    permissions: Joi.array()
        .items(
            Joi.string().custom((value: string, helpers) => {
                return availableGroupPermission.includes(value) ||
                    helpers.error(`There is no such permission as ${value}`);
            })
        )
        .required()
});
