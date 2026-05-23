import Joi from 'joi';

export const postMessagePayloadSchema = Joi.object({
  role: Joi.string().valid('user', 'agent').required(),
  content: Joi.string().required(),
});

export const postMessageToAgentPayloadSchema = Joi.object({
  content: Joi.string().required(),
});
