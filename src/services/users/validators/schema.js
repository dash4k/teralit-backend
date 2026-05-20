import Joi from 'joi';

export const putUserProfilePayloadSchema = Joi.object({
  name: Joi.string().required(),
});