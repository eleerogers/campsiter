require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors');
const campgrounds = require('./routes/campgroundRoutes');
const users = require('./routes/userRoutes');
const comments = require('./routes/commentRoutes');

const app = express();

app.use(expressSession({
  secret: process.env.EXPRESS_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('keyboard_cat'));
app.use(cors({
  credentials: true
}));
app.use(flash());

app.use('/api/campgrounds', campgrounds);
app.use('/api/comments', comments);
app.use('/api/users', users);

app.get('*', (req, res) => {
  res.sendFile('/app/dist/index.html');
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
