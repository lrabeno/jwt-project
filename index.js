import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import usersRouter from './routes/users-routes.js';
import authRouter from './routes/auth-routes.js';
import bodyparser from 'body-parser';

//function call that looks for env file and pulls env variables into file
dotenv.config();

//serves up static files from a different directory
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 8080;
// take note on this
const corsOptions = { credentials: true, origin: process.env.URL || '*' };

app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());
//app.use(express.json());

app.use('/', express.static(join(__dirname, 'public')));

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => console.log(`port listening on ${PORT}`));
