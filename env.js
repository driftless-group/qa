const path = require('path');
const fs   = require('fs');
var dotenv = require('dotenv');

if (process.env.NODE_ENV == undefined) {
  process.env.NODE_ENV = 'development';
}

var files = [path.join(process.cwd(), '.env')]
var file  = path.join(process.cwd(), 'config', '.env.'+process.env.NODE_ENV);

if (fs.existsSync(path.join(file))) {
  files.push(file);
}

dotenv.config({ path: files, quiet: ['test', 'production'].indexOf(process.env.NODE_ENV) > -1 });


