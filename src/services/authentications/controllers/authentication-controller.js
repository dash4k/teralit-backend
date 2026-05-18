import AuthenticationRepositories from '../repositories/authentication-repositories.js';
import TokenManager from '../../../security/token-manager.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import AuthenticationError from '../../../exceptions/authentication-error.js';

export const register = async (req, res, next) => {
  const { email } = req.validated;

  const emailExist = await AuthenticationRepositories.verifyEmailExist(email);
  if (emailExist) return next(new InvariantError('Email is already been used by another user'));

  const id = await AuthenticationRepositories.createUser(req.validated);
  if (!id) return next(new InvariantError('Error while trying to register new user'));

  return response(res, 201, 'User created successfully', id);
};

export const login = async (req, res, next) => {
  const { email, password } = req.validated;

  const userId = await AuthenticationRepositories.verifyUserCredentials(email, password);
  if (!userId) return next(new AuthenticationError('Invalid user credentials'));

  const accessToken = TokenManager.generateAccessToken({ id: userId });
  const refreshToken = TokenManager.generateRefreshToken({ id: userId });

  return response(res, 200, 'Login success', {
    accessToken,
    refreshToken
  });
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.validated;

  const validRefreshToken = await AuthenticationRepositories.verifyRefreshToken(refreshToken);
  if (!validRefreshToken) return next(new InvariantError('Invalid refresh token'));

  const { id } = TokenManager.verifyRefreshToken(refreshToken);
  const accessToken = TokenManager.generateAccessToken({ id });

  return response(res, 200, 'Access token updated successfully', { accessToken });
};

export const logout = async (req, res, next) => {
  const { refreshToken } = req.validated;

  const validRefreshToken = await AuthenticationRepositories.verifyRefreshToken(refreshToken);
  if (!validRefreshToken) return next(new InvariantError('Invalid refresh token'));

  await AuthenticationRepositories.deleteRefreshToken(refreshToken);

  return response(res, 200, 'Logout success');
};
