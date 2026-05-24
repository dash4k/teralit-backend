import AuthenticationRepositories from '../repositories/authentication-repositories.js';
import TokenManager from '../../../security/token-manager.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import AuthenticationError from '../../../exceptions/authentication-error.js';
import AuthorizationError from '../../../exceptions/authorization-error.js';
import sendVerificationEmail from '../../../emails/verification-emails/controllers/verification-email-controller.js';

export const register = async (req, res, next) => {
  const { email } = req.validated;

  const { emailExist } = await AuthenticationRepositories.verifyEmailExist(email);
  if (emailExist) return next(new InvariantError('Email is already been used by another user'));

  const { id, verificationToken } = await AuthenticationRepositories.createUser(req.validated);
  if (!id) return next(new InvariantError('Error while trying to register new user'));

  await sendVerificationEmail(email, verificationToken);

  return response(res, 201, 'User created successfully, please check your email for verification link', { id });
};

export const verifyEmail = async (req, res, next) => {
  const { token } = req.query;

  const userId = await AuthenticationRepositories.verifyToken(token);
  if (!userId) return next(new InvariantError('Invalid or expired verification link'));

  await AuthenticationRepositories.verifyUser(userId);

  return response(res, 200, 'User verified successfully');
};

export const resendEmailVerification = async (req, res, next) => {
  const { email } = req.validated;

  const { emailExist, emailVerified } = await AuthenticationRepositories.verifyEmailExist(email);
  if (!emailExist) return next(new InvariantError('Invalid email'));
  if (emailVerified) return next(new InvariantError('Email is already verified'));

  const token = AuthenticationRepositories.createToken(email);

  await sendVerificationEmail(email, token);

  return response(res, 200, 'Verification email sent');
};

export const login = async (req, res, next) => {
  const { email, password } = req.validated;

  const { id: userId, verified } = await AuthenticationRepositories.verifyUserCredentials(email, password);
  if (!userId) return next(new AuthenticationError('Invalid user credentials'));
  if (!verified) return next(new AuthorizationError('Please verify your email address first'));

  const accessToken = TokenManager.generateAccessToken({ id: userId });
  const refreshToken = TokenManager.generateRefreshToken({ id: userId });

  await AuthenticationRepositories.createAuthentication(refreshToken);

  return response(res, 201, 'Login success', {
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
