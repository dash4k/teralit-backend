import { Router } from 'express';
import {
  register,
  verifyEmail,
  resendEmailVerification,
  login,
  refreshToken,
  logout
} from '../controllers/authentication-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import {
  registerPayloadSchema,
  resendVerificationPayloadSchema,
  loginPayloadSchema,
  putAuthenticationPayloadSchema,
  deleteAuthenticationPayloadSchema
} from '../validators/schema.js';

const router = Router();

router.post('/register', validate(registerPayloadSchema), register);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', validate(resendVerificationPayloadSchema), resendEmailVerification);
router.post('/login', validate(loginPayloadSchema), login);
router.put('/authentications', validate(putAuthenticationPayloadSchema), refreshToken);
router.delete('/authentications', authenticateToken, validate(deleteAuthenticationPayloadSchema), logout);

export default router;
