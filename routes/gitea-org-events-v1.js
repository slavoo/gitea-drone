var express = require('express');
const droneClient = require('../clients/drone-client');

var router = express.Router();

router.post('/org/events', function (req, res, next) {

  let event = req.header('x-gitea-event');

  if (event !== 'repository') {
    console.debug(`unsupported event type: ${event}`);
    res.send({ message: `unsupported event type: ${event}` });
    return;
  }

  let action = req.body.action;

  let fullName = req.body && req.body.repository && req.body.repository.full_name;

  switch (action) {
    case 'created':

      console.info(`activating gitea repository in drone: ${fullName}`);

      droneClient.activateRepo(
        fullName,
        () => {
          console.info('repository activated.');
          res.sendStatus(204);
          return;
        },
        (msg) => {
          console.error(`activation failed: ${msg}`);
          res.sendStatus(204);
          return;
        }
      );

      break;
    case 'deleted':
      console.info(`removing gitea repository from drone: ${req.body.repository.full_name}`);

      droneClient.deleteRepo(
        fullName,
        () => {
          console.info('repository removed');
          res.sendStatus(204);
          return;
        },
        (msg) => {
          console.error(`removing failed: ${msg}`);
          res.sendStatus(204);
          return;
        }
      );

      break;
    default:
      console.debug(`unsupported repository action: ${action}`);
      res.send({ message: `unsupported repository action: ${action}` });
      return;
  }
});

module.exports = router;
