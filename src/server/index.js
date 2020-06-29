require('dotenv').config();

const express = require('express');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors');
const campgrounds = require('./routes/campgroundRoutes');
const users = require('./routes/userRoutes');
const comments = require('./routes/commentRoutes');
const expressSanitizer = require('express-sanitizer');

const app = express();

app.use(favicon(path.join(__dirname, "public", "favicon.ico")))

app.use(expressSession({
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
app.use(expressSanitizer());

app.use('/api/campgrounds', campgrounds);
app.use('/api/comments', comments);
app.use('/api/users', users);

app.get('*', (req, res) => {
  console.log('index catch-all');
  res.sendFile('/app/dist/index.html');
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
