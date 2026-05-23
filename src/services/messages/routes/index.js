import { Router } from 'express';
import {
  agentAnswer,
  listMessages
} from '../controllers/message-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import {
  postMessageToAgentPayloadSchema
} from '../validators/schema.js';

const router = Router({ mergeParams: true });

router.post('/messages', authenticateToken, validate(postMessageToAgentPayloadSchema), agentAnswer);
router.get('/messages', authenticateToken, listMessages);

export default router;
