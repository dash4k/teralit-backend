import { Router } from 'express';
import {
  makePrediction,
  viewPrediction
} from '../controllers/classification-result-controller.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = Router({ mergeParams: true });

router.post('/classifications', authenticateToken, makePrediction);
router.get('/classifications', authenticateToken, viewPrediction);

export default router;
