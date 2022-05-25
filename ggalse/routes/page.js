const express = require('express');
const router = express.Router();
const { setLogin, isLoggedIn } = require('./middleware');
const searchBoardMainList = require('../query/searchBoardMainList');
const logger = require('../logger');

router.get('/', setLogin, async (req, res) => {
  try {
    const boards = [];
    boards.push([]);

    for (let bType = 1; bType <= 6; bType++) {
      boards.push(await searchBoardMainList(bType));
    }

    const _message = req.app.locals._message || false;
    delete req.app.locals._message;

    return res.status(200).render('main', {
      login: res.locals.login,
      name: res.locals.name,
      id: res.locals.id,
      visit: req.app.locals.visit,
      _message,
      boards: boards,
    });
  } catch (error) {
    logger.error(error);
    return res.status(200).render('main', {
      login: res.locals.login,
      name: res.locals.name,
      id: res.locals.id,
      visit: req.app.locals.visit,
      _message,
      boards: null,
    });
  }
});

router.get('/logout', isLoggedIn, (req, res) => {
  // 21-07-20 작성
  // 로그아웃 후 redirect할 것인지 render할 것인지 고민 후 수정 필요
  req.logout();
  req.session.destroy();
  res.status(200).redirect('/');
});

module.exports = router;
