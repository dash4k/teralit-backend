import SessionRepositories from '../repositories/session-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import AuthorizationError from '../../../exceptions/authorization-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';

export const createSession = async (req, res, next) => {
  const { id: userId } = req.user;

  try {
    const sessionId = await SessionRepositories.createSession(userId);
    return response(res, 201, 'Session created successfully', sessionId);
  } catch (error) {
    console.error('error: ', error.message);
    return next(new InvariantError('Error while trying to create new session'));
  }
};

export const listSessions = async (req, res, next) => {
  const { id: userId } = req.user;

  try {
    const sessions = await SessionRepositories.getUserSessions(userId);
    return response(res, 200, 'Sessions listed', { sessions });
  } catch (error) {
    console.error('error: ', error.message);
    return next(new InvariantError('Error while trying to list sessions'));
  }
};

export const viewSession = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: sessionId } = req.params;

  const validSessionId = await SessionRepositories.verifySessionId(sessionId);
  if (!validSessionId) return next(new NotFoundError('Session not found'));

  const validOwner = await SessionRepositories.verifySessionOwner(userId, sessionId);
  if (!validOwner) return next(new AuthorizationError('You don\'t have access to the following resource'));

  try {
    const session = await SessionRepositories.getUserSession(sessionId);
    return response(res, 200, 'Session found', session);
  } catch (error) {
    console.error('error: ', error.message);
    return next(new InvariantError('Error while trying to find session'));
  }
};

export const editStatus = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: sessionId } = req.params;
  const { status } = req.validated;

  const validSessionId = await SessionRepositories.verifySessionId(sessionId);
  if (!validSessionId) return next(new NotFoundError('Session not found'));

  const validOwner = await SessionRepositories.verifySessionOwner(userId, sessionId);
  if (!validOwner) return next(new AuthorizationError('You don\'t have access to the following resource'));

  try {
    const session = await SessionRepositories.updateSessionStatus(userId, sessionId, status);
    return response(res, 200, 'Session status updated successfully', session);
  } catch (error) {
    console.error('error: ', error.message);
    return next(new InvariantError('Error while trying to update session\'s status'));
  }
};

export const editTimestamp = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: sessionId } = req.params;

  const validSessionId = await SessionRepositories.verifySessionId(sessionId);
  if (!validSessionId) return next(new NotFoundError('Session not found'));

  const validOwner = await SessionRepositories.verifySessionOwner(userId, sessionId);
  if (!validOwner) return next(new AuthorizationError('You don\'t have access to the following resource'));

  try {
    const session = await SessionRepositories.updateSessionTimestamp(userId, sessionId);
    return response(res, 200, 'Session timestamp updated successfully', session);
  } catch (error) {
    console.error('error: ', error.message);
  }
};

export const removeSession = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: sessionId } = req.params;

  const validSessionId = await SessionRepositories.verifySessionId(sessionId);
  if (!validSessionId) return next(new NotFoundError('Session not found'));

  const validOwner = await SessionRepositories.verifySessionOwner(userId, sessionId);
  if (!validOwner) return next(new AuthorizationError('You don\'t have access to the following resource'));

  try {
    await SessionRepositories.deleteSession(userId, sessionId);
    return response(res, 200, 'Session deleted successfully');
  } catch (error) {
    console.error('error: ', error.message);
    return next(new InvariantError('Error while trying to delete session'));
  }
};
