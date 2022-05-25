const express = require('express');
const router = express.Router();
const User = require('../models/User');
const deleteUser = require('../query/deleteUser');
const { isLoggedIn, isNotLoggedIn, randomString, mailer, chkForm, emailReg, pwdReg, setMessage, blackListNameReg } = require('./middleware');
const bcrypt = require('bcrypt');
const logger = require('../logger');

//user_id, username, 이메일,
router.get('/myinfo', isLoggedIn, (req, res, next) => {
  res.status(200).render('myinfo.html', {
    _id: req.user.id,
    id: req.user.user_id,
    username: req.user.username,
    email: req.user.email,
  });
});

router.post('/myinfo', isLoggedIn, async (req, res, next) => {
  let { username, password, chk_password } = req.body;
  if (!chkForm({ username })) {
    return res.status(200).json({
      status: false,
      message: '필수 항목을 입력해주세요.',
    });
  }

  if (blackListNameReg(username)) {
    return res.status(200).json({
      status: false,
      message: '사용할 수 없는 이름입니다.',
    });
  }

  password = password || false;
  chk_password = chk_password || false;

  if (password && !pwdReg(password)) {
    return res.status(200).json({
      status: false,
      message: '8~16자의 영문, 숫자, 특수문자를 사용하세요.',
    });
  }

  if (!(password === chk_password)) {
    return res.status(200).json({
      status: false,
      message: '비밀번호가 일치하지 않습니다.',
    });
  }

  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      user.username = req.body.username;

      if (password) {
        const hash = await bcrypt.hash(req.body.password, 12);
        user.password = hash;
      }

      await user.save();
      req.logout();
      setMessage(req, '다시 로그인해주세요.');
      return res.status(200).json({
        status: true,
        message: '회원정보 변경 완료',
      });
    }
  } catch (error) {
    logger.error(error);
  }
  return res.status(200).json({
    status: false,
    message: '다시 시도해주세요.',
  });
});

router.get('/help', isNotLoggedIn, (req, res, next) => {
  res.status(200).render('help');
});


router.post('/help/find/id', isNotLoggedIn, async (req, res, next) => {
  const { email, certi_num } = req.body;

  if (!chkForm(req.body)) {
    return res.status(200).json({ status: false, message: '필수 항목을 입력하세요.' });
  }

  if (!emailReg(email)) {
    return res.status(200).json({ status: false, message: '이메일 형식을 맞춰주세요.' });
  }

  if (req.session.certiNum !== certi_num) {
    return res.status(200).json({ status: false, message: '인증번호가 일치하지 않습니다.' });
  }

  const user = await User.findOne({
    where: { email: req.body.email },
  });

  if (user) {
    return res.status(200).json({ status: true, message: `가입하신 아이디는 ${user.user_id} 입니다.` });
  }

  return res.status(200).json({ status: false, message: '가입하신 아이디가 없습니다.' });
});

router.post('/help/find/pwd', isNotLoggedIn, async (req, res, next) => {
  try {
    const { user_id, email } = req.body;

    if (!chkForm(req.body)) {
      return res.status(200).json({
        status: false,
        message: '필수 항목을 입력하세요.',
      });
    }

    if (!emailReg(email)) {
      return res.status(200).json({
        status: false,
        message: '올바른 형식이 아닙니다.',
      });
    }
    //ERR_ASSERTION
    const user = await User.findOne({
      where: {
        user_id: req.body.user_id,
        email: req.body.email,
      },
    });
    if (user) {
      const tempPwd = randomString();
      const hash = await bcrypt.hash(tempPwd, 12);
      user.password = hash;
      user.save();
      const title = '깔세온 임시 비밀번호 발급';
      const content = `임시 비밀번호 : ${tempPwd}`;
      // 예외처리 추가
      if (mailer(req.body.email, title, content)) {
        return res.status(200).json({ status: true, message: '임시 비밀번호를 이메일로 발송되었습니다.' });
      }
    }
    return res.status(200).json({ status: false, message: '아이디 또는 이메일을 확인해주세요.' });
  } catch (error) {
    logger.error(error);
    return res.status(200).json({ status: false, message: '다시 시도해주세요.' });
  }
});

router.delete('/myinfo/withdraw', isLoggedIn, async (req, res, next) => {
  try {
    const isWithdraw = await deleteUser(req.user.id);
    setMessage(req, '정상적으로 탈퇴되었습니다.');
    req.logout();
    return res.status(200).json({ status: true });
  } catch (error) {
    setMessage(req, '다시 시도해주세요.');
    return res.status(200).json({ status: true });
  }
});

module.exports = router;
