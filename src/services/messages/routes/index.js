import { Router } from 'express';
import {
  saveMessage,
  agentAnswer,
  listMessages
} from '../controllers/message-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import {
  postMessagePayloadSchema,
  postMessageToAgentPayloadSchema
} from '../validators/schema.js';

const router = Router({ mergeParams: true });

router.post('/messages', authenticateToken, validate(postMessagePayloadSchema), saveMessage);
router.post('/agents', authenticateToken, validate(postMessageToAgentPayloadSchema), agentAnswer);
router.get('/messages', authenticateToken, listMessages);

export default router;
