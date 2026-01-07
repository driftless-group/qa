# qa


```bash
  npm install @drifted/qa --save-dev
```

## Create a Quick App For Testing
```javascript
  var app = appInstance({csrf: true}), 
  driver = drive({headless: false});
  
  app.response.render = require('@drifted/views/engine')({
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

  app.use(require(path.join(__dirname, '..', "routes")));
```
