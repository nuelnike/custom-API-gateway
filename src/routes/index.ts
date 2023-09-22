const express = require('express');
const router = express.Router();

//include individual rotues
require('./authentication.ts')(router);
require('./sample_service.ts')(router);

module.exports = router;