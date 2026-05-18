import 'dotenv/config';

import express from 'express';
import ErrorHandler from '../middlewares/error.js';
import routes from '../routes/index.js';

const app = express();
app.use(express.json());
app.use(ErrorHandler);
app.use(routes);

export default app;
