import fs from 'fs';
import ClassificationResultRepositories from '../repositories/classification-result-repositories.js';
import SessionRepositories from '../../sessions/repositories/session-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import AuthorizationError from '../../../exceptions/authorization-error.js';

export const makePrediction = async (req, res, next) => {
  const { sessionId } = req.params;
  const { id: userId } = req.user;

  const validSession = await SessionRepositories.verifySessionId(sessionId);
  if (!validSession) return next(new NotFoundError('Session not found'));

  const validSessionOwner = await SessionRepositories.verifySessionOwner(userId, sessionId);
  if (!validSessionOwner) return next(new AuthorizationError('You don\'t have access to the following resource'));

  const image = await SessionRepositories.getSessionImage(sessionId);

  const fileBuffer = await fs.promises.readFile(image.path);
  const blob = new Blob([fileBuffer], { type: image.mimetype });

  const formData = new FormData();
  formData.append('image', blob, image.filename);

  const modelResponse = await fetch(`${process.env.MODEL_PROTOCOL}://${process.env.MODEL_HOST}:${process.env.MODEL_PORT}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!modelResponse.ok) {
    const err = await modelResponse.json();
    console.error(err);
    return next(new InvariantError('Error while trying to create prediction'));
  }

  const modelResponseJson = await modelResponse.json();

  try {
    const id = await ClassificationResultRepositories.createClassificationResult(sessionId, modelResponseJson);
    return response(res, 201, 'Classification result created successfully', id);
  } catch (error) {
    console.error('error: ', error.message);
    return next(new InvariantError('Error while trying to create prediction'));
  }
};

export const viewPrediction = async (req, res, next) => {
  const { sessionId } = req.params;
  const { id: userId } = req.user;

  const validSession = await SessionRepositories.verifySessionId(sessionId);
  if (!validSession) return next(new NotFoundError('Session not found'));

  const validSessionOwner = await SessionRepositories.verifySessionOwner(userId, sessionId);
  if (!validSessionOwner) return next(new AuthorizationError('You don\'t have access to the following resource'));

  try {
    const classification = await ClassificationResultRepositories.getClassificationResult(sessionId);
    return response(res, 200, 'Classification result found', classification);
  } catch (error) {
    console.error('error: ', error.message);
    return next(new InvariantError('Error while trying to find prediction'));
  }
};
