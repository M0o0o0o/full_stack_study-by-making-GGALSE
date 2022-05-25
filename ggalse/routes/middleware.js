const nodemailer = require('nodemailer');
const Visit = require('../models/Visit');
const logger = require('../logger');
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    this.setMessage(req, '로그인 후에 이용해주세요.');
    res.status(304).redirect('/');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
  }
};

exports.setLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.login = true;
    res.locals.name = req.user.username;
    res.locals.id = req.user.id;
  } else {
    res.locals.login = false;
    res.locals.id = null;
    res.locals.name = null;
  }
  next();
};

exports.setMessage = (req, message) => {
  req.app.locals._message = message;
};

exports.mailer = async (sendEmail, title, content) => {
  const mailConfigure = {
    service: 'Naver',
    host: 'smtp.naver.com',
    port: 587,
    auth: {
      user: `${process.env.EMAIL_ID}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  };
  const message = {
    from: mailConfigure.auth.user,
    to: `${sendEmail}`,
    subject: `${title}`,
    text: `${content}`,
  };

  const transporter = nodemailer.createTransport(mailConfigure);

  await transporter.sendMail(message, (error, info) => {
    if (error) {
      logger.error(error);
      return false;
    }
    transporter.close();
  });

  return true;
};

exports.randomInt = () => {
  return Math.floor(Math.random() * (9999 - 1000)) + 1000;
};

exports.randomString = () => {
  return Math.random().toString(36).slice(2);
};

// post 데이터 확인
exports.chkForm = (datas) => {
  for (data in datas) {
    data = data || '';
    if (datas[data].length <= 0) {
      return false;
    }
  }
  return true;
};

// 아이디 유효성 검사 정규식
exports.idReg = (value) => {
  const alphaReg = /[A-za-z]/;
  const expReg = /[~!@#$%^&*()_+|<>?:{}]/;
  const korReg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  const spaceReg = /\s/;

  if (value.length < 5 || value.length > 15) {
    return false;
  }

  if (!alphaReg.test(value) || expReg.test(value) || spaceReg.test(value) || korReg.test(value)) {
    return false;
  }
  return true;
};

// 비밀번호 유효성 검사 정규식
exports.pwdReg = (value) => {
  const alphaReg = /[A-za-z]/;
  const expReg = /[~!@#$%^&*()_+|<>?:{}]/;
  const spaceReg = /\s/;
  const numReg = /[0-9]/;
  if (value.length < 8 || value.length > 16) {
    return false;
  }
  if (!alphaReg.test(value) || !expReg.test(value) || spaceReg.test(value) || !numReg.test(value)) {
    return false;
  }
  return true;
};

// 이메일 유효성 검사 정규식
exports.emailReg = (value) => {
  return /^[a-z0-9_+.-]+@([a-z0-9-]+\.)+[a-z0-9]{2,4}$/.test(value);
};

exports.blackListNameReg = (value) => {
  return /관리자/.test(value);
};

exports.countView = (req, res, article) => {
  // 이미 조회한 글이면 false 리턴
  let viewCookie = req.signedCookies.view || false;

  if (viewCookie) {
    let buffer = new Set(JSON.parse(req.signedCookies.view));
    if (!buffer.has(article.id)) {
      buffer.add(article.id);
      res.cookie('view', JSON.stringify([...buffer]), { maxAge: 86400000 * 30, httpOnly: true, signed: true });
      return true;
    }
  } else {
    let buffer = new Set();
    buffer.add(article.id);
    res.cookie('view', JSON.stringify([...buffer]), { maxAge: 86400000 * 30, httpOnly: true, signed: true });
    return true;
  }
  return false;
};

exports.countVisit = async (req, res, next) => {
  let today = new Date();
  today = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  try {
    let visit = await Visit.findOne({
      where: { date: today },
    });

    if (!visit) {
      visit = await Visit.create({
        date: today,
        count: 0,
      });
    }

    if (!req.signedCookies.visit) {
      let expire = new Date();
      expire.setHours(23);
      expire.setMinutes(59);
      expire.setSeconds(59);

      res.cookie('visit', true, { expires: expire, HttpOnly: true, signed: true });
      visit.count += 1;
      visit.save();
      visit.reload();
    }

    req.app.locals.visit = visit.count;
    next();
  } catch (error) {
    req.app.locals.visit = 0;
    logger.error(error);
    next();
  }
};
