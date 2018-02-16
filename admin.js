const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:@localhost/postgres';

const express = require('express');
const csv = require('express-csv'); // eslint-disable-line

const router = express.Router();

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

async function fetchData() {
  const client = new Client({ connectionString });
  await client.connect();
  const result = await client.query('SELECT * FROM users');
  await client.end();

  return result.rows;
}

router.get('/admin', ensureLoggedIn, async (req, res) => {
  const data = await fetchData();

  res.render('admin', { data });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

async function PutData() {
  const client = new Client({ connectionString });
  await client.connect();
  const data = await client.query('SELECT date, username, email, amount, ssn FROM users');
  await client.end();
  const gogn = data.rows;
  gogn.unshift(['date', 'name', 'email', 'amount', 'ssn']);
  return gogn;
}

router.get('/download', ensureLoggedIn, (req, res) => {
  const filename = 'test.csv';
  PutData().then((d) => {
    res.set(
      'Content-Disposition',
      `attachment; filename="${filename}"`,
    );
    res.send(res.csv(d));
  }).catch(() => {
    res.render('error');
  });
});

module.exports = router;
