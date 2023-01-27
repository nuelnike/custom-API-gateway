const express = require('express');
const router = express.Router();

//include individual rotues
require('./authentication.ts')(router);
require('./product.ts')(router);
require('./order.ts')(router);
require('./tracker.ts')(router);

module.exports = router;