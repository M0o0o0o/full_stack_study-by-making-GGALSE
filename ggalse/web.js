const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const favicon = require('serve-favicon');
const nunjucks = require('nunjucks');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportConfig = require('./passport');
const helmet = require('helmet');
const csp = require('helmet-csp');
const hpp = require('hpp');
const { countVisit } = require('./routes/middleware');
const logger = require('./logger');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);


const rLogin = require('./routes/login');
const rPage = require('./routes/page');
const rSign = require('./routes/sign');
const rUser = require('./routes/user');
const rIssueCode = require('./routes/issueCode');
const rWrite = require('./routes/write');
const rBoard = require('./routes/board');
const { setMessage } = require('./routes/middleware');

dotenv.config();

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

const app = express();
passportConfig();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

require('./models/initialize')(); 

if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy');
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(
    csp({
      directives: {
        defaultSrc: ["'self'", 'localhost:3000'],
        connectSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'http://fonts.googleapis.com', 'http://cdn.jsdelivr.net'],
        fontSrc: ["'self'", 'http://fonts.googleapis.com', 'http://cdn.jsdelivr.net', 'https://fonts.gstatic.com/'],
        imgSrc: ["'self'"],
        objectSrc: ["'none'"],
        childSrc: ["'none'"],
      },
    })
  );
  app.use(hpp());
} else {
  app.use(morgan('dev'));
  // app.use(morgan('combined'));
}

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'js')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIESECRET));

const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIESECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 2,
  },
  store: new RedisStore({ client: redisClient }),
};
if (process.env.NODE_ENV === 'production') {
  sessionOption.proxy = true;
}

app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

app.use(countVisit);

app.use('/', rPage);
app.use('/login', rLogin);
app.use('/sign', rSign);
app.use('/user', rUser);
app.use('/issue', rIssueCode);
app.use('/write', rWrite);
app.use('/board', rBoard);

app.use((req, res, next) => {
  const error = new Error();
  next(error);
});

app.use((err, req, res, next) => {
  logger.error(err);
  // console.error(err);
  setMessage(req, '비정상적인 접근입니다.');
  res.status(400).redirect('/');
});

app.listen(app.get('port'), () => {
  console.log('server on');
});
