import Joi from 'joi';

export const putSessionStatusPayloadSchema = Joi.object({
  status: Joi.string().valid('pending', 'completed', 'failed').required(),
});
