// server.js
// where your node app starts

// init project
var nunjucks = require('nunjucks');
var express = require('express');
var jsonfile = require('jsonfile');
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
var moment = require('moment');

var app = express();

app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    force: true,
    debug: true,
    outputStyle: 'compressed'
}));

var env = nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
});

env.addFilter('moment', function(str, format) {
  return moment(str).format(format);
});

var globals = {};
globals.job = jsonfile.readFileSync('data/job.json');
globals.applicant = jsonfile.readFileSync('data/applicant.json');
env.addGlobal('job', globals.job);
env.addGlobal('applicant', globals.applicant);

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.render('index.html');
});

app.get("/job/:version", function (request, response) {
  response.render('job/' + request.params.version + '.html');
});

app.get("/applicant/:version", function (request, response) {
  response.render('applicant/' + request.params.version + '.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
