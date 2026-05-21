import SessionImageRepositories from '../repositories/session-image-repositories.js';
import SessionRepositories from '../../sessions/repositories/session-repositories.js';
import response from '../../../utils/response.js';
import ClientError from '../../../exceptions/client-error.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import AuthorizationError from '../../../exceptions/authorization-error.js';

export const uploadImage = async (req, res, next) => {
  const { sessionId } = req.params;
  const { id: userId } = req.user;
  if (!req.file) return next(new ClientError('Image is required'));

  const validSession = SessionRepositories.verifySessionId(sessionId);
  if (!validSession) return next(new NotFoundError('Session not found'));

  const validSessionOwner = SessionRepositories.verifySessionOwner(userId, sessionId);
  if (!validSessionOwner) return next(new AuthorizationError('You don\'t have access to the following resource'));

  try {
    const image = await SessionImageRepositories.createSessionImage(sessionId, req.file);
    return response(res, 201, 'Session image created', image);
  } catch (error) {
    console.error('error: ', error.message);
    return next(new InvariantError('Error while trying to create session image'));
  }
};

export const viewImage = async (req, res, next) => {
  const { sessionId } = req.params;
  const { id: userId } = req.user;

  const validSession = SessionRepositories.verifySessionId(sessionId);
  if (!validSession) return next(new NotFoundError('Session not found'));

  const validSessionOwner = SessionRepositories.verifySessionOwner(userId, sessionId);
  if (!validSessionOwner) return next(new AuthorizationError('You don\'t have access to the following resource'));

  try {
    const image = SessionImageRepositories.getSessionImage(sessionId);
    res.setHeader('Content-Disposition', `inline; filename="${image.filename}"`);
    res.status(200);
    return res.sendFile(image);
  } catch (error) {
    console.error(error);
    return next(new InvariantError('Error while trying to display image'));
  }
};
