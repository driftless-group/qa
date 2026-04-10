const mongoose = require('mongoose');
const path = require('path');

function initialize(url) {
  if (url == undefined && process.env.MONGO_URL != undefined) {
    url = process.env.MONGO_URL;
  }
  return mongoose.connect(url)
}

module.exports = initialize;
