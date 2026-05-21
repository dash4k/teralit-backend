import { Router } from 'express';
import {
  uploadImage,
  viewImage
} from '../controllers/session-image-controller.js';
import authenticateToken from '../../../middlewares/auth.js';
import { upload } from '../storage/storage-config.js';

const router = Router({ mergeParams: true });

router.post('/images', authenticateToken, upload.single('image'), uploadImage);
router.get('/images', authenticateToken, viewImage);

export default router;
