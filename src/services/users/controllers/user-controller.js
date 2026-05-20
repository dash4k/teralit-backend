import UserRepositories from '../repositories/user-repositories.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import AuthenticationError from '../../../exceptions/authentication-error.js';

export const viewProfile = async (req, res, next) => {
  const { id } = req.user;

  const validId = await UserRepositories.verifyUserId(id);
  if (!validId) return next(new AuthenticationError('Invalid access token'));

  try {
    const user = await UserRepositories.getUser(id);
    return response(res, 200, 'Profile found', user);
  } catch (error) {
    console.error('error: ', error.message);
    return next(new InvariantError('Error while trying to get user\'s profile'));
  }
};

export const editProfile = async (req, res, next) => {
  const { id } = req.user;
  const { name } = req.validated;

  const validId = await UserRepositories.verifyUserId(id);
  if (!validId) return next(new AuthenticationError('Invalid access token'));

  try {
    const newData = await UserRepositories.updateUser(id, name);
    return response(res, 200, 'Profile updated successfully', newData);
  } catch (error) {
    console.error('error: ', error.message);
    return next(new InvariantError('Error while trying to update user\'s profile'));
  }
};

export const removeAccount = async (req, res, next) => {
  const { id } = req.user;

  const validId = await UserRepositories.verifyUserId(id);
  if (!validId) return next(new AuthenticationError('Invalid access token'));

  try {
    await UserRepositories.deleteUser(id);
    return response(res, 200, 'User deleted successfully');
  } catch (error) {
    console.log('error: ', error.message);
    return next(new InvariantError('Error while trying to delete user'));
  }
};
