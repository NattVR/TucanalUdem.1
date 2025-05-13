import express from 'express';
import cors from 'cors';
import "dotenv/config";
import userRouter from './routers/user.router.js';
import { PORT } from './config.js';
import {google} from 'googleapis';
import { OAuth2Client } from './config.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/tu_canal_udem', userRouter);


app.listen(PORT, () => {
  console.log('SERVIDOR CORRIENDO ' + PORT);
});

