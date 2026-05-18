import { Router } from 'express';

import authentications from '../services/authentications/routes/index';

const router = Router();

router.use('/', authentications);

export default router;
