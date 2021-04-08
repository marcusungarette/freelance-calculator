const express = require('express');
const routes = express.Router();

const views = __dirname + '/views/';

const Profile = {
  data: {
    name: 'Marcus',
    avatar: 'https://github.com/marcusungarette.png',
    'monthly-budget': 3000,
    'hours-per-day': 8,
    'days-per-week': 5,
    'vacation-per-year': 4,
    'value-hour': 75,
  },
  controllers: {
    index(req, res) {
      return res.render(views + 'profile', { profile: Profile.data });
    },

    update(req, res) {
      const data = req.body;

      const totalWeeksInAYear = 52;

      const weeksWorkedInAMonth =
        (totalWeeksInAYear - data['vacation-per-year']) / 12;

      const hoursWorkedOnAWeek = data['hours-per-day'] * data['days-per-week'];

      const totalHoursWorkedOnAMonth = weeksWorkedInAMonth * hoursWorkedOnAWeek;

      const valueHour = data['monthly-budget'] / totalHoursWorkedOnAMonth;

      Profile.data = {
        ...Profile.data,
        ...req.body,
        'value-hour': valueHour,
      };

      return res.redirect('/profile');
    },
  },
};

const Job = {
  data: [
    {
      id: 1,
      name: 'Floricultura Lua',
      'daily-hours': 8,
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
  ],

  controllers: {
    index(req, res) {
      const updatedJobs = Job.data.map(job => {
        const remaining = Job.services.daysToDeliverTheJob(job);
        const status = remaining <= 0 ? 'done' : 'progress';

        return {
          ...job,
          remaining,
          status,
          budget: Job.services.calculateBudget(job, Profile.data['value-hour']),
        };
      });

      return res.render(views + 'index', { jobs: updatedJobs });
    },

    save(req, res) {
      const lastId = Job.data[Job.data.length - 1]?.id || 1;

      Job.data.push({
        id: lastId + 1,
        name: req.body.name,
        'daily-hours': req.body['daily-hours'],
        'total-hours': req.body['total-hours'],
        createdAt: Date.now(),
      });
      return res.redirect('/');
    },

    create(req, res) {
      return res.render(views + 'job');
    },

    show(req, res) {
      const jobId = req.params.id;

      const job = Job.data.find(job => Number(job.id) === Number(jobId));

      if (!job) {
        return res.send('Job not found!');
      }

      job.budget = Job.services.calculateBudget(
        job,
        Profile.data['value-hour']
      );

      return res.render(views + 'job-edit', { job });
    },

    update(req, res) {
      const jobId = req.params.id;

      const job = Job.data.find(job => Number(job.id) === Number(jobId));

      if (!job) {
        return res.send('Job not found!');
      }

      const updatedJob = {
        ...job,
        name: req.body.name,
        'total-hours': req.body['total-hours'],
        'daily-hours': req.body['daily-hours'],
      };

      Job.data = Job.data.map(job => {
        if (Number(job.id) === Number(jobId)) {
          job = updatedJob;
        }
        return job;
      });

      res.redirect('/job/' + jobId);
    },
  },

  services: {
    daysToDeliverTheJob(job) {
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
    },

    calculateBudget: (job, valueHour) => job['total-hours'] * valueHour,
  },
};

routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);
routes.get('/job/:id', Job.controllers.show);
routes.post('/job/:id', Job.controllers.update);
routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);

module.exports = routes;
