require('dotenv').config();

const express = require('express');
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(options);
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors');
const campgroundRoutes = require('./routes.js/campgroundRoutes');
const userRoutes = require('./routes.js/userRoutes');
const commentRoutes = require('./routes.js/commentRoutes');
const middleware = require('./middleware');

const app = express();

app.use(expressSession({
  secret: 'no tan lines!',
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


// CAMPGROUND ROUTES
app.get('/api/campgrounds',
  campgroundRoutes.getCampgrounds);
app.get('/api/campgrounds/ycuser/:id',
  campgroundRoutes.getCampgroundsByUser);
app.get('/api/campgrounds/:id',
  campgroundRoutes.getCampgroundById);
app.post('/api/campgrounds',
  middleware.allowAccess,
  middleware.validCampground,
  campgroundRoutes.createCampground);
app.put('/api/campgrounds/:id',
  middleware.allowAccess,
  middleware.validCampground,
  campgroundRoutes.updateCampground);
app.delete('/api/campgrounds/:id',
  middleware.allowAccess,
  campgroundRoutes.deleteCampground);

// COMMENT ROUTES
app.get('/api/campgrounds/:campground_id/comments',
  commentRoutes.getComments);
app.post('/api/campgrounds/:campgroundId/comments',
  middleware.allowAccess,
  middleware.validComment,
  commentRoutes.createComment);
app.put('/api/campgrounds/:campgroundId/comments',
  middleware.allowAccess,
  middleware.validComment,
  commentRoutes.editComment);
app.delete('/api/campgrounds/:campgroundId/comments',
  middleware.allowAccess,
  commentRoutes.deleteComment);

// USER ROUTES
app.get('/api/ycusers',
  userRoutes.getYCUsers);
app.post('/api/ycusers/login',
  middleware.validUser,
  middleware.getUserByEmail,
  userRoutes.ycLogin);
app.post('/api/ycusers',
  middleware.validUser,
  middleware.checkIfUsernameInUse,
  middleware.checkIfEmailInUse,
  userRoutes.ycRegister);
app.get('/api/ycusers/logout',
  userRoutes.ycLogout);
app.get('/api/ycusers/:id',
  userRoutes.getYCUserById);
app.put('/api/ycusers',
  middleware.onUpdateCheckIfEmailInUse,
  userRoutes.ycUpdate);
app.post('/api/forgot',
  middleware.getUserByEmail,
  userRoutes.resetPassword);
app.post('/api/reset',
  middleware.getUserByToken,
  middleware.checkTokenExpiration,
  userRoutes.updatePassword);
app.get('/api/ycusers/token/:reset_password_token',
  userRoutes.getUserByToken);

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
