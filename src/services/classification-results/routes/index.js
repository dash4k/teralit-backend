import { Router } from 'express';
import {
  makePrediction,
  viewPrediction
} from '../controllers/classification-result-controller.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = Router({ mergeParams: true });

router.post('/classification', authenticateToken, makePrediction);
router.get('/classification', authenticateToken, viewPrediction);

export default router;
