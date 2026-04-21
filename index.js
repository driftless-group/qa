const path         = require('path');
const assert       = require('assert');
const crypto       = require('crypto');
const mongoose     = require('mongoose');

const jwt          = require('jsonwebtoken');
const supertest    = require('supertest');
const express      = require('express');

const csrf         = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const { Builder }  = require('selenium-webdriver');
const chrome       = require('selenium-webdriver/chrome');

function freshGoose() {
  return new Promise((resolve) => {
    var names = Object.keys(mongoose.models);
    while(names.length > 0) {
      var name = names.pop();
      delete mongoose.models[name]
    }

    resolve();
  })
}
module.exports.refresh = freshGoose;



function doneMessage(done) {
  return function (error) {
    console.log(error);
    done();
  }
}
module.exports.doneMessage = doneMessage;
module.exports.exception = doneMessage;

module.exports.wait = function(milliseconds) {
  return new Promise(function(resolve) { 
    setTimeout(resolve, milliseconds)
  });
}

module.exports.drive = function(options={}) {
  if (options.headless == undefined) {
    options.headless = true;
  }

  let opts = new chrome.Options()
 
  if (options.headless == true) {
    opts.addArguments('--headless');
  }
  const driver = new Builder().forBrowser('chrome').setChromeOptions(opts).build();
 
  if (options.cookie) {
    driver.manage().addCookie(options.cookie);
  }

  return driver;

}

module.exports.supertest = supertest;

function appInstance(options={}) {
  const instance = express();

  if (options.render == undefined) {
    options.render = true
  }

  if (options.parse == undefined) {
    options.parse = true
  }

  if (options.render) {
    instance.response.render = require('@drifted/engine')({
      views: [
        path.join(process.cwd(), 'views'),
        path.join(process.cwd(), 'test', 'views')
      ],
      stream: true
    });
  }

  if (options.parse) {
    instance.use(bodyParser.urlencoded())
    instance.use(bodyParser.json());
    instance.use(cookieParser())
  }

  if (options.csrf) {
    instance.use(csrf({cookie: true}));
    instance.use(function(req, res, next) {
      res.locals.csrfToken = req.csrfToken();
      next();
    })
  }

  return instance;
}

module.exports.appInstance = appInstance;
module.exports.cookie      = function(obj={}, options={}) {
  if (options.webdriver == undefined) {
    options.webdriver = false;
  }

  const token = jwt.sign(obj, process.env.JWT_SECRET, { expiresIn: '1h' });	
  
  if (options.webdriver) {
    let cookie = {name: 'token', value: token, domain: '.localhost', path: '/'};
    return cookie;
  } else {
    return [['token',token].join('=')+";"]
  }
}



