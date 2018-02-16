const { Client } = require('pg');
const xss = require('xss');
const { check, validationResult } = require('express-validator/check');
const passport = require('passport');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:@localhost/postgres';

const express = require('express');

const router = express.Router();

function form(req, res) {
  const data = {};
  if (req.isAuthenticated()) {
    const loggingInfo = {
      isLogged: true,
      userName: req.user.name,
    };
    res.render('form', {
      data,
      loggingInfo,
    });
  } else {
    const loggingInfo = {
      isLogged: false,
    };
    res.render('form', {
      data,
      loggingInfo,
    });
  }
}

function thanks(req, res) {
  res.render('thanks');
}

router.get('/', form);
router.get('/thanks', thanks);

async function addUser(data) {
  const client = new Client({ connectionString });
  await client.connect();
  await client.query('INSERT INTO users(Date, Username, Email, SSN, Amount) VALUES (CURRENT_TIMESTAMP, $1, $3, $2, $4);', data);
}

router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    // getum núna notað user í viewum
    res.locals.user = req.user;
  }

  next();
});

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/admin');
  }
  const data = {};
  res.render('login', { data });
  return null;
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/admin');
  },
);

router.post(
  '/adduser',

  check('name').isLength({ min: 1 }).withMessage('Nafn má ekki vera tómt'),
  check('email').isLength({ min: 1 }).withMessage('Netfang má ekki vera tómt'),
  check('email').isEmail().withMessage('Netfang verður að vera netfang'),
  check('ssn').isLength({ min: 1 }).withMessage('Kennitala má ekki vera tóm'),
  check('ssn').matches(/^[0-9]{6}-?[0-9]{4}$/).withMessage('Kennitala verður að vera á formi 000000-0000'),
  check('amount').matches(/^\d*[1-9]\d*$/).withMessage('Fjöldi þarf að vera jákvæður'),

  async (req, res) => {
    const data = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      data.err = errors.array().map(i => i.msg);
      if (req.isAuthenticated()) {
        const loggingInfo = {
          isLogged: true,
          userName: req.user.name,
        };
        res.render('form', {
          data,
          loggingInfo,
        });
      } else {
        const loggingInfo = {
          isLogged: false,
        };
        res.render('form', {
          data,
          loggingInfo,
        });
      }
    } else {
      await addUser([xss(data.name), xss(data.ssn), xss(data.email), xss(data.amount)]);
      res.redirect('/thanks');
    }
  },
);

module.exports = router;
