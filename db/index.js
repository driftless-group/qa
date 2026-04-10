const path = require('path');
require(path.join(__dirname, '..', 'env'));
var initialize = require(path.join(__dirname, 'initialize'));

initialize(process.env.MONGO_URL).
  catch(console.eror);
