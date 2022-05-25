const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn, setMessage, chkForm } = require('./middleware');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const logger = require('../logger');

//21-07-20 작성

router.post('/local', isNotLoggedIn, (req, res, next) => {
  if (!chkForm(req.body)) {
    setMessage(req, '아이디 또는 비밀번호를 입력해 주세요.');
    return res.status(400).redirect('/');
  }

  passport.authenticate('local', (error, user, info) => {
    if (error) {
      logger.error(error);

      next(error);
    }
    if (!user) {
      setMessage(req, info.message);
      return res.status(400).redirect('/');
    }

    return req.login(user, (loginError) => {
      if (loginError) {
        logger.error(error);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/oauth/kakao', isNotLoggedIn, passport.authenticate('kakao'));
router.get('/oauth/naver', isNotLoggedIn, passport.authenticate('naver'));
router.get('/oauth/google', isNotLoggedIn, passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));

router.get(
  '/oauth/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get(
  '/oauth/naver/callback',
  passport.authenticate('naver', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get(
  '/oauth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;
