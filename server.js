//  OpenShift sample Node application
var express = require('express'),
        morgan = require('morgan'),
        path = require('path');
var app = express();

Object.assign = require('object-assign');

app.use(morgan('combined'));
//OPENSHIFT_NODEJS_PORT == 8080
//OPENSHIFT_NODEJS_IP == 0.0.0.0
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
// Note: you must place sass-middleware *before* `express.static` or else it will
// not work.
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'public'),
  debug: true
//  outputStyle: 'compressed',
//  prefix: '/stylesheets'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

var index = require('./routes/index');
app.use('/', index);
//app.use(require('./controllers'));
// error handling
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;
