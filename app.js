var express = require('express'),
        morgan = require('morgan'),
        mongoose = require('mongoose'),
        bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser'),
        session = require('express-session'),
        path = require('path'),
        passport = require("passport"),
        LocalStrategy = require('passport-local').Strategy,
        flash = require("connect-flash"),
        passportLocalMongoose = require('passport-local-mongoose');
var app = express();
var User = require("./models/User");

Object.assign = require('object-assign');

app.use(morgan('combined'));
//OPENSHIFT_NODEJS_PORT == 8080
//OPENSHIFT_NODEJS_IP == 0.0.0.0
//MONGO_URL='mongodb://admin:secret@172.30.91.84:27017/blog'
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var mongoURL = process.env.MONGO_URL || 'mongodb://127.0.0.1/blog';
// Note: you must place sass-middleware *before* `express.static` or else it will
// not work.
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'public'),
  debug: true
//  outputStyle: 'compressed',
//  prefix: '/stylesheets'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
// Use native Node promises
mongoose.Promise = global.Promise;
// connect to MongoDB
mongoose.connect(mongoURL)
        .then(() => console.log('DB connection succesful: ' + mongoURL))
        .catch((err) => console.error(err + ' : ' + mongoURL));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
var index = require('./routes/index');
app.use('/', index);
var admin = require('./backend/routes/index');
app.use('/admin', admin);
// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;
