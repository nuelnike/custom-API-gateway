// Importing the module
const express = require("express");
const router = express.Router();
import fs from "fs";
const controller_path = `${__dirname}/controllers`; // CONTTROLLER PATH TO AUTH FILES 

fs.readdirSync(controller_path).forEach((name:string) => {
	require(controller_path + '/' + name)(router);
});

module.exports=router;