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
  'value-hour': 75,
};

const jobs = [
  {
    id: 1,
    name: 'Floricultura Lua',
    'daily-hours': 1,
    'total-hours': 8,
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

function daysToDeliverTheJob(job) {
  const remainingDaysToDeliverJob = (
    job['total-hours'] / job['daily-hours']
  ).toFixed();

  //Data de criacao do projeto
  const createdJobDate = new Date(job.createdAt);

  //Dia do vencimento do projeto
  const dueJobDay =
    createdJobDate.getDate() + Number(remainingDaysToDeliverJob);

  //Atribui Dia do vencimento
  const dueJobDateInMsec = createdJobDate.setDate(dueJobDay);

  //Diferenca do dia de hoje com o dia atual
  const timeDiffInMsec = dueJobDateInMsec - Date.now();

  //Transformar mSec em dias
  const dayInMsec = 1000 * 60 * 60 * 24;
  const dayDiff = Math.floor(timeDiffInMsec / dayInMsec);

  //Restam X dias
  return dayDiff;
}

routes.get('/', (req, res) => {
  const updatedJobs = jobs.map(job => {
    const remaining = daysToDeliverTheJob(job);
    const status = remaining <= 0 ? 'done' : 'progress';

    return {
      ...job,
      remaining,
      status,
      budget: profile['value-hour'] * job['total-hours'],
    };
  });

  return res.render(views + 'index', { jobs: updatedJobs });
});

routes.get('/job', (req, res) => res.render(views + 'job'));
routes.post('/job', (req, res) => {
  const lastId = jobs[jobs.length - 1]?.id || 1;

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
