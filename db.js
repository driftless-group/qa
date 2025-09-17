const mongoose = require('mongoose');
const path = require('path');
require('qa/env')


mongoose.connect(process.env.MONGO_URL).
  catch(console.eror);
