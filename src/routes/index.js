import { Router } from 'express';

import authentications from '../services/authentications/routes/index.js';
import users from '../services/users/routes/index.js';
import sessions from '../services/sessions/routes/index.js';
import sessionImages from '../services/session-images/routes/index.js';

const router = Router();

router.use('/', authentications);
router.use('/', users);
router.use('/', sessions);
router.use('/sessions/:sessionId/', sessionImages);

export default router;
