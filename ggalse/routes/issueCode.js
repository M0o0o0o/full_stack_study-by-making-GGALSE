const express = require('express');
const router = express.Router();
const { isNotLoggedIn, mailer, randomInt, emailReg } = require('./middleware');
const logger = require('../logger');
router.get('/code', isNotLoggedIn, (req, res) => {
  try {
    const certiNum = randomInt();
    const title = '깔세온 이메일 인증 요청 코드';
    const content = `요청하신 인증번호 입니다.\n인증번호 : ${certiNum}`;

    if (!emailReg(req.query.email)) {
      res.status(200).json({
        issued: false,
        message: '이메일 형식을 맞춰주세요.',
      });
    }

    if (mailer(req.query.email, title, content)) {
      req.session.certiNum = `${certiNum}`;

      return res.status(200).json({
        issued: true,
      });
    }

    return res.status(200).json({
      issued: false,
    });
  } catch (error) {
    logger.error(error);
    return res.status(200).json({
      issued: false,
    });
  }
});

router.post('/code', isNotLoggedIn, (req, res) => {
  const sessionCetrti = req.session.certiNum || null;

  const certi_num = req.body.certi_num || null;

  if (!sessionCetrti || !certi_num) {
    return res.status(400).json({ message: '비정상적인 접근입니다.' });
  }

  if (sessionCetrti === certi_num) {
    return res.status(200).json({ status: true, message: '인증번호가 일치합니다.' });
  }

  return res.status(200).json({
    status: false,
    message: '인증번호가 일치하지 않습니다.',
  });
});

module.exports = router;
