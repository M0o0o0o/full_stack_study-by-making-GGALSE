const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { setMessage, mailer, idReg, pwdReg, emailReg, chkForm, blackListNameReg } = require('./middleware');
const logger = require('../logger');

router.get('/terms', (req, res) => {
  res.status(200).render('terms');
});

router.post('/terms', (req, res) => {
  const agree_1 = req.body.agree_1 || false;
  const agree_2 = req.body.agree_2 || false;

  if (!agree_1 || !agree_2) {
    return res.status(200).json({
      status: false,
    });
  }

  req.session.isAgreeTerms = true;
  return res.status(200).json({
    status: true,
    redirect: '/sign/form',
  });
});

router.get('/form', (req, res) => {
  const isAgreeTerms = req.session.isAgreeTerms || false;
  if (!isAgreeTerms) {
    setMessage(req, '비정상적인 접근입니다.');
    return res.status(400).redirect('/');
  }
  res.status(200).render('form');
});

router.post('/form', async (req, res, next) => {
  try {
    const { user_id, username, email, password, chk_password, certi_num } = req.body;


    if (!chkForm(req.body)) {
      return res.status(200).json({
        sign: false,
        message: '필수 항목을 채워주세요.',
      });
    }

    if (!idReg(user_id)) {
      return res.status(200).json({
        sign: false,
        message: '아이디 형식을 맞춰주세요.',
      });
    }

    if (await User.findOne({ where: { user_id } })) {
      return res.status(200).json({
        sign: false,
        message: '이미 사용 중인 아이디입니다.',
      });
    }

    if (!emailReg(email)) {
      return res.status(200).json({
        sign: false,
        message: '이메일 형식을 맞춰주세요.',
      });
    }

    if (await User.findOne({ where: { email } })) {
      return res.status(200).json({
        sign: false,
        message: '이미 사용 중인 이메일입니다.',
      });
    }

    if (!pwdReg(password)) {
      return res.status(200).json({
        sign: false,
        message: '비밀번호 형식을 맞춰주세요.',
      });
    }

    if (password !== chk_password) {
      return res.status(200).json({
        sign: false,
        message: '비밀번호가 일치하지 않습니다.',
      });
    }

    // 이름 중에 '관리자'가 포함된 경우
    if (blackListNameReg(username)) {
      return res.status(200).json({
        sign: false,
        message: '사용할 수 없는 이름입니다.',
      });
    }

    if (req.session.certiNum !== certi_num) {
      return res.status(200).json({
        sign: false,
        message: '인증번호가 일치하지 않습니다.',
      });
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      user_id,
      username,
      email,
      password: hash,
      provider: '4',
    });

    delete req.session.isAgreeTerms;
    res.status(200).json({
      sign: true,
    });

    if (user) {
      res.status(200).json({
        sign: true,
      });
    }
  } catch (error) {
    logger.error(error);
    return res.status(400).json({
      sign: false,
      message: '다시 시도해주세요.',
    });
  }
});

router.post('/form/check/name', async (req, res) => {
  const user = await User.findOne({
    where: { user_id: req.body.user_id },
  });
  if (user) {
    return res.status(200).json({
      sign: false,
      message: '이미 존재하는 아이디입니다.',
    });
  }

  return res.status(200).json({
    sign: true,
    message: '사용 가능한 아이디입니다.',
  });
});

router.post('/form/check/email', async (req, res) => {
  const user = await User.findOne({
    where: { email: req.body.email },
  });

  if (user) {
    return res.status(200).json({
      sign: false,
      message: '이미 사용 중인 이메일입니다.',
    });
  }

  return res.status(200).json({
    sign: true,
    message: '사용 가능한 이메일입니다.',
  });
});

module.exports = router;
