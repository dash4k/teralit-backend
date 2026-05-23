import 'dotenv/config';

import express from 'express';
import ErrorHandler from '../middlewares/error.js';
import routes from '../routes/index.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(ErrorHandler);

export default app;
