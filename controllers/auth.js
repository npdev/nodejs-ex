"use strict";
let router = new (require('express').Router)();

const models = require('./../models');
const passport = require('passport');
const bCrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const twitterConfig = require('../config/twitter.js');
const fbConfig = require('../config/fb.js');
let flash = require('express-flash');

router.use(passport.initialize());
router.use(passport.session());

router.use(flash());
// Инициализация паспорта

let isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

// Генерация хэша с помощью bCrypt
let createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

passport.use('login', new LocalStrategy({
  passReqToCallback: true
},
        function (req, username, password, done) {
          // проверка в mongo, существует ли пользователь с таким логином
          models.User.findOne({'username': username},
                  function (err, user) {
                    // В случае возникновения любой ошибки, возврат с помощью метода done
                    if (err) {
                      return done(err);
                    }
                    // Пользователь не существует, ошибка входа и перенаправление обратно
                    if (!user) {
                      console.log('User Not Found with username ' + username);
                      return done(null, false,
                              req.flash('message', 'User Not found.'));
                    }
                    // Пользователь существует, но пароль введен неверно, ошибка входа
                    if (!isValidPassword(user, password)) {
                      console.log('Invalid Password');
                      return done(null, false,
                              req.flash('message', 'Invalid Password'));
                    }
                    // Пользователь существует и пароль верен, возврат пользователя из
                    // метода done, что будет означать успешную аутентификацию
                    return done(null, user);
                  }
          );
        }));

passport.use('signup', new LocalStrategy({
  passReqToCallback: true
},
        function (req, username, password, done, next) {
          let findOrCreateUser = function () {
            // поиск пользователя в Mongo с помощью предоставленного имени пользователя
            models.User.findOne({'username': username}, function (err, user) {
              // В случае любых ошибок - возврат
              if (err) {
                console.log('Error in SignUp: ' + err);
                return done(err);
              }
              // уже существует
              if (user) {
                console.log('User already exists');
                return done(null, false,
                        req.flash('message', 'User Already Exists'));
              } else {
                // если пользователя с таки адресом электронной почты
                // в базе не существует, создать пользователя
                let newUser = new models.User();
                // установка локальных прав доступа пользователя
                newUser.username = username;
                newUser.password = createHash(password);
                //newUser.email = req.param('email');
                //newUser.firstName = req.param('firstName');
                //newUser.lastName = req.param('lastName');

                // сохранения пользователя
                newUser.save(function (err) {
                  if (err) {
                    console.log('Error in Saving user: ' + err);
                    throw err;
                    //return next(err);
                  }
                  console.log('User Registration succesful');
                  return done(null, newUser);
                });
              }
            });
          };

          // Отложить исполнение findOrCreateUser и выполнить
          // метод на следующем этапе цикла события
          process.nextTick(findOrCreateUser);
        })
        );


passport.use('twitter', new TwitterStrategy({
  consumerKey: twitterConfig.apikey,
  consumerSecret: twitterConfig.apisecret,
  callbackURL: twitterConfig.callbackURL

},
        function (token, tokenSecret, profile, done) {

          // make the code asynchronous
// User.findOne won't fire until we have all our data back from Twitter
          process.nextTick(function () {

            models.User.findOne({'twitter.id': profile.id}, function (err, user) {

              // if there is an error, stop everything and return that
              // ie an error connecting to the database
              if (err)
                return done(err);

              // if the user is found then log them in
              if (user) {
                return done(null, user); // user found, return that user
              } else {
                // if there is no user, create them
                var newUser = new models.User();

                // set all of the user data that we need
                newUser.twitter.id = profile.id;
                newUser.twitter.token = token;
                newUser.twitter.username = profile.username;
                newUser.twitter.displayName = profile.displayName;
                newUser.twitter.lastStatus = profile._json.status.text;

                // save our user into the database
                newUser.save(function (err) {
                  if (err)
                    throw err;
                  return done(null, newUser);
                });
              }
            });

          });

        }));



passport.use('facebook', new FacebookStrategy({
  clientID: fbConfig.appID,
  clientSecret: fbConfig.appSecret,
  callbackURL: fbConfig.callbackUrl
},
// facebook will send back the tokens and profile
        function (access_token, refresh_token, profile, done) {

          console.log('profile', profile);

          // asynchronous
          process.nextTick(function () {

            // find the user in the database based on their facebook id
            models.User.findOne({'id': profile.id}, function (err, user) {

              // if there is an error, stop everything and return that
              // ie an error connecting to the database
              if (err)
                return done(err);

              // if the user is found, then log them in
              if (user) {
                return done(null, user); // user found, return that user
              } else {
                // if there is no user found with that facebook id, create them
                var newUser = new models.User();

                // set all of the facebook information in our user model
                newUser.fb.id = profile.id; // set the users facebook id
                newUser.fb.access_token = access_token; // we will save the token that facebook provides to the user
                newUser.fb.firstName = profile.name.givenName;
                newUser.fb.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
                newUser.fb.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                // save our user to the database
                newUser.save(function (err) {
                  if (err)
                    throw err;

                  // if successful, return the new user
                  return done(null, newUser);
                });
              }

            });
          });

        }));



// Сериализация паспорта
passport.serializeUser(function (user, done) {
  done(null, user._id);
});
// ДеСериализация паспорта
passport.deserializeUser(function (id, done) {
  models.User.findById(id, function (err, user) {
    done(err, user);
  });
});
// Конттроллер

router.get('/home', function (req, res, next)
{
  if (req.user)
    return res.redirect('/profile');
  res.render('home', {
    user: req.user
  });
});

router.get('/profile', function (req, res, next)
{
  if (!req.user)
    return res.redirect('/home');
  res.render('profile', {
    user: req.user
  });
});


// Так как любое связующее программное обеспечение базируется
// на вызовах next(), если пользователь аутентифицирован:
let isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
};


/* Получение домашней страницы */
// router.get('/profile', isAuthenticated, (req, res) => {
//   res.render('profile', { user: req.user });
// });


/* Handle Logout */

router.get('/logout', (req, res, next) => {
  req.logout();
  req.session.save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});


/* Обработка POST-данных авторизации */
router.post('/login', passport.authenticate('login', {
  successRedirect: '/home',
  failureRedirect: '/',
  failureFlash: true
}));


router.get('/login', function (req, res, next)
{
  if (req.user)
    return res.redirect('/');
  res.render('login', {
    user: req.user
  });
});

/* Получение страницы регистрации */

router.get('/register', (req, res, next) => {
  if (req.user)
    return res.redirect('/');
  res.render('register', {
    user: req.user,
    message: req.flash('message')
  });
});

/* Обработка регистрационных POST-данных */

router.post('/register', passport.authenticate('signup', {
  successRedirect: '/home',
  failureRedirect: '/signup',
  failureFlash: true
}));


// route for facebook authentication and login
// different scopes while logging in
router.get('/login/facebook',
        passport.authenticate('facebook', {scope: 'email'}
        ));

// handle the callback after facebook has authenticated the user
router.get('/login/facebook/callback',
        passport.authenticate('facebook', {
          successRedirect: '/fb',
          failureRedirect: '/'
        })
        );

// route for twitter authentication and login
// different scopes while logging in
router.get('/login/twitter',
        passport.authenticate('twitter'));

// handle the callback after facebook has authenticated the user
router.get('/login/twitter/callback',
        passport.authenticate('twitter', {
          successRedirect: '/twitter',
          failureRedirect: '/'
        })
        );

/* GET Twitter View Page */
router.get('/twitter', isAuthenticated, function (req, res) {
  res.render('twitter', {user: req.user});
});

module.exports = router;
