const express = require('express');
const routes = express.Router();

const views = __dirname + '/views/';

const profile = {
  name: 'Marcus',
  avatar: 'https://github.com/marcusungarette.png',
  'monthly-budget': 3000,
  'hours-per-day': 8,
  'days-per-week': 5,
  'vacation-per-year': 4,
};

const jobs = [
  {
    id: 1,
    name: 'Floricultura Lua',
    'daily-hours': 2,
    'total-hours': 30,
    createdAt: Date.now(),
  },
  {
    id: 2,
    name: 'Supermercado da Vila',
    'daily-hours': 4,
    'total-hours': 20,
    createdAt: Date.now(),
  },
];

routes.get('/', (req, res) => res.render(views + 'index', { jobs: jobs }));
routes.get('/job', (req, res) => res.render(views + 'job'));
routes.post('/job', (req, res) => {
  // const lastId = jobs[jobs.length - 1]?.id || 1;

  jobs.push({
    id: lastId + 1,
    name: req.body.name,
    'daily-hours': req.body['daily-hours'],
    'total-hours': req.body['total-hours'],
    createdAt: Date.now(),
  });
  return res.redirect('/');
});
routes.get('/job/edit', (req, res) => res.render(views + 'job-edit'));
routes.get('/profile', (req, res) =>
  res.render(views + 'profile', { profile: profile })
);

module.exports = routes;
