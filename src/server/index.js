require('dotenv').config();

const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const cors = require('cors');
const campgrounds = require('./routes/campgroundRoutes');
const users = require('./routes/userRoutes');
const comments = require('./routes/commentRoutes');
const compression = require('compression');

const app = express();

app.use(compression());

app.use(favicon(path.join(__dirname, "..", "..", "public", "favicon.ico")))

app.use(cookieSession({
  secret: process.env.EXPRESS_SECRET,
  resave: false,
  saveUninitialized: false
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

app.get('*', (req, res) => {
  console.log('index catch-all');
  const index = path.join(__dirname, 'src', 'server', 'client', 'build', 'index.html');
  res.sendFile(index);
}); 

// error handler middleware
app.use((error, req, res) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    },
  });
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
