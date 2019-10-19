var express = require('express');

var giteaController = require('../controllers/gitea-hooks-receiver');

var healthzController = require('../controllers/healthz');

var router = express.Router();

router.get('/_healthz', healthzController.healthz);

router.post('/gitea/api/v1/org/events', giteaController.gitea_hook_handler);

module.exports = router;
