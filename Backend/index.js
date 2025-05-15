import express from 'express';
import cors from 'cors';
import "dotenv/config";
import userRouter from './routers/user.router.js';
import { PORT } from './config.js';
import session from 'express-session';


const app = express();
app.use(cors());
app.use(express.json());


app.use(session({
  secret: 'mi_clave',
  resave: false,
  saveUninitialized: false,
}));

app.use('/tu_canal_udem', userRouter);

app.listen(PORT, () => {
  console.log('SERVIDOR CORRIENDO ' + PORT);
});

