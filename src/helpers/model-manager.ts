//import model builder
const SelectModel = require(`${__dirname}/../bootstrap/database/config/model-builder`);

//MODELS LISTING
export const User = SelectModel('users');
export const Status = SelectModel('status');
export const Session = SelectModel('session');