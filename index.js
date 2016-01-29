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
  resave: true
}));


app.use(require('body-parser').json());
app.use('/static', express.static('static'));

app.use(function(req, res, next) {
  if (!req.session.owner_id) {
    req.session.owner_id = randomstring.generate(12);
  }
  next();
});


const SubmissionModel = require('./models/submissionModel');
const challengeData = {
  id: 12344,
  defaultCode: 'function transcribe(inputString) { \n' +
  '  var result = null; \n\n' +
  '  //Your code here \n\n' +
  '  return result;\n}'
};

app.get('/:id?', function(req, res) {
  const sub_id = req.params.id || req.session.submission_id;
  if (req.params.id || req.params.id !== req.session.submission_id) {
    req.session.read_only = true;
  } else {
    req.session.read_only = false;
  }

  const defaultPackage = {
    code: JSON.stringify(challengeData.defaultCode),
    id: challengeData.id,
    readOnly: req.session.read_only
  };

  if (!sub_id) {
    return res.render('index', defaultPackage);
  }

  SubmissionModel.findById(sub_id)
    .then(function(model) {
      res.render('index', {
        code: JSON.stringify(model ? model.code : challengeData.defaultCode),
        id: challengeData.id,
        readOnly: req.session.read_only
      });
    }, function(err) {
      console.log('error in error handler of submission find!', err);
      return res.render('index', defaultPackage);
    }).end(function(err) {
      console.log('error in end of /:id? !', err);
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
  if (req.session.read_only) {
    res.status(401).end('');
  }

  if (!sub_id) {
    var sub = new SubmissionModel({code: code});
    return sub.save().then(function() {
      req.session.submission_id = sub.id;
      req.session.save(function() {
        res.end('');
      });
    });
  }

  SubmissionModel
    .findOneAndUpdate(
      {_id: sub_id},
      {$set: {code: code}}
    )
    .then(function() {
      return res.end('');
    }, function(err) {
      console.log('submission retrieval failed', err);
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

  if (!sub_id) {
    return res.send(challengeData.defaultCode).end();
  }

  SubmissionModel
    .findById(sub_id)
    .then(function(sub) {
      res.send(sub ? sub.code : challengeData.defaultCode);
      res.end();
    }, function(err) {
        console.log('submission retrieval failed', err);
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
