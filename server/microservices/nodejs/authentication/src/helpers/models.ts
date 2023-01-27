//import model builder
const SELECT_MODEL = require(`${__dirname}/../../../../../engine/src/database/config/model-builder`);

//MODELS LISTING
export const User = SELECT_MODEL('users');
export const Status = SELECT_MODEL('status');
export const Session = SELECT_MODEL('session');