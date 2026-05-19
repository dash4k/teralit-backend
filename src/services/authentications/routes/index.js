import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout
} from '../controllers/authentication-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import {
  registerPayloadSchema,
  loginPayloadSchema,
  putAuthenticationPayloadSchema,
  deleteAuthenticationPayloadSchema
} from '../validators/schema.js';

const router = Router();

router.post('/register', validate(registerPayloadSchema), register);
router.post('/login', validate(loginPayloadSchema), login);
router.put('/authentications', validate(putAuthenticationPayloadSchema), refreshToken);
router.delete('/authentications', authenticateToken, validate(deleteAuthenticationPayloadSchema), logout);

export default router;
