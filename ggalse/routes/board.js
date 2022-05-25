const express = require('express');
const router = express.Router();
const searchBoardList = require('../query/searchBoardList');
const searchArticle = require('../query/searchArticle');
const delelteArticle = require('../query/deleteArticle');
const { boardName } = require('../code');
const { setLogin, setMessage, isLoggedIn, countView } = require('./middleware');
const Board = require('../models/Board');
const Sequelize = require('sequelize');

router.get('/', setLogin, async (req, res, next) => {
  let { curpage, pagesize, searchtext, btype, searchtype } = req.query;

  btype = btype || '';
  searchtext = searchtext || '';
  searchtype = searchtype || '';

  if (searchtype === '5' && res.locals.id !== parseInt(searchtext)) {
    setMessage(req, '비정상적인 접근입니다.');
    return res.status(400).redirect('/');
  }

  try {
    const boardList = await searchBoardList(btype, curpage, pagesize, searchtext, searchtype);
    btype = btype || 0;
    if (searchtype === '5') {
      btype = 9;
    }
    if (boardList.length > 0) {
      return res.status(200).render('board', {
        login: res.locals.login,
        name: res.locals.name,
        id: res.locals.id,
        visit: req.app.locals.visit,
        boardList: boardList,
        boardName: boardName[btype],
        btype,
        total: boardList[0].total,
        curPage: curpage,
      });
    }

    return res.status(200).render('board', {
      login: res.locals.login,
      id: res.locals.id,
      name: res.locals.name,
      visit: req.app.locals.visit,
      boardList: null,
      boardName: boardName[btype],
      total: 0,
    });
  } catch (error) {
    return res.status(200).render('board', {
      login: res.locals.login,
      id: res.locals.id,
      name: res.locals.name,
      visit: req.app.locals.visit,
      boardList: null,
      boardName: boardName[btype],
      total: 0,
    });
  }
});

router.get('/article', setLogin, async (req, res, next) => {
  try {
    const article = await searchArticle(req.query.id);

    if (!article) {
      setMessage(req, '존재하지 않는 게시글입니다.');
      return res.status(200).render('article', {
        login: res.locals.login,
        name: res.locals.name,
        id: res.locals.id,
        visit: req.app.locals.visit,
        article: null,
      });
    }

    //조회수 처리
    if (countView(req, res, article)) {
      article.view += 1;
      await Board.update(
        { view: article.view },
        {
          where: { id: article.id },
        }
      );
    }

    let mypage = false;

    // 글 작성자인 경우나 관리자의 경우 수정, 삭제 활성화를 위한 변수
    if ((res.locals.id && article.user_id === res.locals.id) || res.locals.id === 1) {
      mypage = true;
    }

    return res.status(200).render('article', {
      login: res.locals.login,
      name: res.locals.name,
      id: res.locals.id,
      visit: req.app.locals.visit,

      article,
      mypage,
      boardName: boardName[article.btype],
    });
  } catch (error) {
    setMessage(req, '존재하지 않는 게시글입니다.');
    return res.status(400).redirect('/');
  }
});

router.delete('/article/delete', setLogin, isLoggedIn, async (req, res, next) => {
  try {
    const id = req.query.id;

    const article = await Board.findOne({
      where: { id },
    });

    if (!article) {
      setMessage(req, '존재하지 않는 게시글입니다.');
      return res.status(200).json({
        status: false,
        redirect: '/',
      });
    }

    // 글 작성자도 아니고 관리자도 아닐 경우
    if (!(req.user.id === article.user_id) && req.user.id !== 1) {
      setMessage(req, '접근 권한이 없습니다.');
      return res.status(200).json({
        status: false,
        redirect: '/',
      });
    }

    await delelteArticle(id);

    return res.status(200).json({
      status: false,
      redirect: `/board?searchtype=5&searchtext=${req.user.id}&curpage=1&pagesize=15`,
    });
  } catch (error) {
    setMessage(req, '다시 시도해주세요.');
    return res.status(200).json({
      status: false,
      redirect: '/',
    });
  }
});
module.exports = router;
