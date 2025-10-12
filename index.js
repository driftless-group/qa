const path         = require('path');
const assert       = require('assert');
const crypto       = require('crypto');

const jwt          = require('jsonwebtoken');
const supertest    = require('supertest');
const express      = require('express');

const csrf         = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

module.exports.drive = function(options={}) {
  const opts = new chrome.Options().addArguments('--headless');
  const driver = new Builder().forBrowser('chrome').setChromeOptions(opts).build();
  
  if (options.cookies != undefined) {
    driver.manage().addCookie(options.cookies);
  }

  return driver;
}

module.exports.supertest   = supertest;

function appInstance(options={}) {
  const instance = express();

  if (options.render == undefined) {
    options.render = true
  }

  if (options.parse == undefined) {
    options.parse = true
  }

  if (options.render) {
    instance.response.render = require('views/engine')({
      views: [
        path.join(process.cwd(), 'views'),
        path.join(process.cwd(), 'node_modules', 'views')
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
module.exports.cookie      = function(obj={}) {
  const token = jwt.sign(obj, process.env.JWT_SECRET, { expiresIn: '1h' });	
  return [['token',token].join('=')+";"]
}



