import { Router } from 'express';

import authentications from '../services/authentications/routes/index.js';

const router = Router();

router.use('/', authentications);

export default router;
