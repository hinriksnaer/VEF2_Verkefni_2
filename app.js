const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const passport = require('passport');
const { Strategy } = require('passport-local');
const form = require('./form');
const admin = require('./admin');
const users = require('./users');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


const sessionSecret = 'leyndarmál';

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

function strat(username, password, done) {
  users
    .findByUsername(username)
    .then((user) => {
      if (!user) {
        return done(null, false);
      }

      return users.comparePasswords(password, user);
    })
    .then(res => done(null, res))
    .catch((err) => {
      done(err);
    });
}

passport.use(new Strategy(strat));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  users
    .findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

app.use(passport.initialize());
app.use(passport.session());

app.use(admin);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', form);
app.use('/admin', admin);

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).render('error', { title: '404', errorbreyta: 'Vesen þú ert í 404 villu' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);
  res.status(500).render('error', { title: '500', errorbreyta: 'Vesen þú ert í 500 villu' });
}
app.use(notFoundHandler);
app.use(errorHandler);
const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});
