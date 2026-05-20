import { Router } from 'express';
import {
  createSession,
  listSessions,
  viewSession,
  editStatus,
  editTimestamp,
  removeSession
} from '../controllers/session-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import {
  putSessionStatusPayloadSchema
} from '../validators/schema.js';

const router = Router();

router.post('/sessions', authenticateToken, createSession);
router.get('/sessions', authenticateToken, listSessions);
router.get('/sessions/:id', authenticateToken, viewSession);
router.put('/sessions/:id/status', authenticateToken, validate(putSessionStatusPayloadSchema), editStatus);
router.put('/sessions/:id/timestamp', authenticateToken, editTimestamp);
router.delete('/sessions/:id', authenticateToken, removeSession);

export default router;
