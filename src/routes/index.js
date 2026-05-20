import { Router } from 'express';

import authentications from '../services/authentications/routes/index.js';
import users from '../services/users/routes/index.js';

const router = Router();

router.use('/', authentications);
router.use('/', users);

export default router;
