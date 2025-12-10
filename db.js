const mongoose = require('mongoose');
const path = require('path');
require(path.join(__dirname, '..', 'env'));


mongoose.connect(process.env.MONGO_URL).
  catch(console.eror);
