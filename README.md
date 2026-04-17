# qa


### Install
```bash
  npm install @drifted/qa --save-dev
```

## Usage

### Create a Quick App For Testing
```javascript
  const { appInstance } = require('@drifted/qa');
  var app = appInstance({csrf: true})
 
  app.response.render = require('@drifted/engine')({
    views: [
      path.join(__dirname, 'views'),
      path.join(process.cwd(), 'node_modules', '@drifted', 'views')
    ],
    stream: true
  });

  app.use(require('@drifted/assets/static')({
    path: [
      path.join(__dirname, '..', 'node_modules', '@drifted', 'assets', 'public')
    ]
  }));
```
