const path         = require('path');
const assert       = require('assert');
const crypto       = require('crypto');

const jwt          = require('jsonwebtoken');
const supertest    = require('supertest');
const express      = require('express');

const csrf         = require('csurf');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');

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
module.exports.supertest   = supertest;
module.exports.cookie      = function(obj={}) {
  const token = jwt.sign(obj, process.env.JWT_SECRET, { expiresIn: '1h' });	
  return [['token',token].join('=')+";"]
}



