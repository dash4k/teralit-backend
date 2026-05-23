import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../../../../swagger.config.json' with { type: 'json' };

const router = Router();

router.get('/', (_req, res) => {
  res.redirect('/docs');
});
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
  swaggerOptions: {
    requestInterceptor: (req) => {
      if (req.headers.Authorization && !req.headers.Authorization.startsWith('Bearer ')) {
        req.headers.Authorization = `Bearer ${req.headers.Authorization}`;
      }
      return req;
    }
  }
}));

export default router;
