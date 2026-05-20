import { Router } from 'express';
import {
  viewProfile,
  editProfile,
  removeAccount
} from '../controllers/user-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import {
  putUserProfilePayloadSchema
} from '../validators/schema.js';

const router = Router();

router.get('/profile', authenticateToken, viewProfile);
router.put('/profile', authenticateToken, validate(putUserProfilePayloadSchema), editProfile);
router.delete('/users', authenticateToken, removeAccount);

export default router;
