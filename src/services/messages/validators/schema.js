import Joi from 'joi';

export const postMessageToAgentPayloadSchema = Joi.object({
  content: Joi.string().required(),
});
