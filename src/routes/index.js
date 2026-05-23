import { Router } from 'express';

import authentications from '../services/authentications/routes/index.js';
import users from '../services/users/routes/index.js';
import sessions from '../services/sessions/routes/index.js';
import sessionImages from '../services/session-images/routes/index.js';
import classificationResults from '../services/classification-results/routes/index.js';
import messages from '../services/messages/routes/index.js';
import documentations from '../services/documentations/routes/index.js';

const router = Router();

router.use('/', documentations);
router.use('/', authentications);
router.use('/', users);
router.use('/', sessions);
router.use('/sessions/:sessionId/', sessionImages);
router.use('/sessions/:sessionId/', classificationResults);
router.use('/sessions/:sessionId/', messages);

export default router;
