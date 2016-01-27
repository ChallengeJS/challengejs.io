const express = require('express');
const hbs = require('express-hbs');
const http = require('http');
const randomstring = require('randomstring');

const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const mongoose = require('mongoose');


const app = express();

app.engine('hbs', hbs.express4({
  beautify: true
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(require('cookie-parser')());
app.use(expressSession({
  secret: 'shakeitshakeit1234',
  store: new MongoStore({url: 'mongodb://localhost/challengejs-session'}),
  saveUninitialized: true,
  resave: false
}));


app.use(require('body-parser').json());
app.use('/static', express.static('static'));

app.use(function(req, res, next) {
  if (!req.session.owner_id) {
    req.session.owner_id = randomstring.generate(12);
  }
  next();
});


const ChallengeModel = require('./models/challengeModel');
const SubmissionModel = require('./models/submissionModel');
const challengeId = '56a534aaa18270611621448f';

app.get('/:id?', function(req, res) {
  var addSubmission = function(arg) {return arg};

  if (!req.session.submission_id) {
    addSubmission = function(challenge) {
      var sub = new SubmissionModel({owner_id: req.session.owner_id})
      challenge.submissions.push(sub);
      return challenge.save().then(function() {
        req.session.submission_id = sub.id;
        return challenge;
      });
    }
  }

  ChallengeModel
    .findById(challengeId, {live: 0})
    .exec()
    .then(addSubmission)
    .then(function(model) {
      var sub = model.submissions.id(req.session.submission_id);
      model.code = JSON.stringify(sub ? sub.code : model.defaultCode);
      res.render('index', model);
    }, function(err) {
      console.log('error!', err);
      res.end('Error!');
    }).end(function(err) {
      console.log('error!', err);
      res.end('Error!');
    });
});


app.get('/embed/:id', function(req, res) {
  res.render('embed/embed',  {
    id: req.params.id,
    rand: Math.random()
  });
});


app.post('/submissions/:id', function(req, res) {
  var code = req.body.code;
  var sub_id = req.session.submission_id;

  ChallengeModel
    .findOneAndUpdate(
      {_id: req.params.id, 'submissions._id': sub_id},
      {$set: {"submissions.$.code": code}}
    )
    .then(function() {
      return res.end('');
    }, function(err) {
      console.log('submission retieval failed', err);
      res.status(404);
      res.end('');
    }).end(function(err) {
      console.log('err in post', err);
      res.end('')
    });
});


app.get('/submissions/:id', function(req, res) {
  var sub_id = req.session.submission_id;

  res.set('Content-Type', 'application/javascript');
  ChallengeModel
    .findById(req.params.id)
    .then(function(challenge) {
      var sub = challenge.submissions.id(sub_id);
      res.send(sub.code);
      res.end();
    }, function(err) {
        console.log('submission retieval failed', err);
        res.status(404);
        res.end();
    })
    .end(function(err) {
      console.log('err in get', err);
      res.end('');
    });
});

mongoose.connect('mongodb://localhost/challengejs');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connected');
});

http.createServer(app).listen(8001, function() {
  console.log('app is running at port 8001');
});
