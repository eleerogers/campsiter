require('dotenv').config();

import path from 'path';
import express, { Request, Response } from 'express'
import type { ErrorRequestHandler } from "express";
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import campgrounds from './routes/campgroundRoutes';
import users from './routes/userRoutes';
import comments from './routes/commentRoutes';
import compression from 'compression';

const app = express();

app.use(compression());

app.use(favicon(path.join(__dirname, "..", "..", "public", "favicon.ico")))

app.use(cookieSession({
  secret: process.env.EXPRESS_SECRET
}));

app.use(express.static('dist'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('keyboard_cat'));
app.use(cors({
  credentials: true
}));

app.use('/api/users', users);
app.use('/api/campgrounds', campgrounds);
app.use('/api/comments', comments);


app.get('*', (req: Request, res: Response) => {
  console.log('index catch-all');
  res.sendFile('/app/dist/index.html');
});

// error handler middleware
const errorHandler: ErrorRequestHandler = (error, req, res) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    },
  });
}

app.use(errorHandler);

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
