const express = require('express');
const router = express.Router();
const { isLoggedIn, setMessage } = require('./middleware');
const Board = require('../models/Board');
const multer = require('multer');
const path = require('path');
const { boardName } = require('../code');
const sanitizeHTML = require('sanitize-html');

router.get('/', isLoggedIn, async (req, res, next) => {
  // 관리자 구분을 위한 isAdmin
  let isAdmin = req.user.id === 1 ? true : false;
  let boardId = req.query.id || null;
  let bName = null;
  let article = await Board.findOne({
    where: { id: boardId },
  });

  if (article) {
    if (!(req.user.id === article.user_id)) {
      article = null;
    }

    bName = boardName[article.btype];
  }
  return res.status(200).render('write', {
    name: req.user.username,
    visit: req.app.locals.visit,
    id: res.locals.id,
    isAdmin,
    login: true,
    article,
    bName,
  });
});

// redirect는 본인이 쓴 글로 가도록 하자
router.post('/', isLoggedIn, async (req, res, next) => {
  const btype = req.body.board || false;
  let title = req.body.title || '';
  let content = req.body.p_content || '';

  // 관리자 아닌데 공지사항 쓰면/ redirect 되돌리기
  if (req.user.id !== 1 && (btype === '8' || btype === '10')) {
    return res.status(200).json({
      status: false,
      message: '비정상적인 접근입니다.',
    });
  }

  if (!btype) {
    return res.status(200).json({
      status: false,
      message: '게시판을 선택하세요',
    });
  }

  title = sanitizeHTML(title, {
    allowedTags: ['img', 'p', 'strong', 'blockquote', 'em', 's', 'hr', 'table', 'tr', 'tbody', 'td'],
  });
  content = sanitizeHTML(content, {
    allowedTags: ['img', 'p', 'strong', 'blockquote', 'em', 's', 'hr', 'table', 'tr', 'tbody', 'td'],
  });

  if (title.length <= 0) {
    return res.status(200).json({
      status: false,
      message: '제목을 입력하세요.',
    });
  }

  if (title.length >= 255) {
    return res.status(200).json({
      status: false,
      message: '제목이 너무 깁니다.',
    });
  }
  if (content.length <= 0) {
    return res.status(200).json({
      status: false,
      message: '내용을 입력하세요.',
    });
  }

  const h_id = req.body.h_id || null;
  let board = null;
  try {
    if (h_id) {
      board = await Board.findOne({
        where: { id: h_id },
      });

      if (board) {
        board.title = title;
        board.content = content;
        await board.save();
        await board.reload();
      }
    } else {
      for (let i = 0; i <= 20; i++) {
        board = await Board.create({
          btype: btype,
          title: title,
          content: content,
          user_id: req.user.id,
          username: req.user.username,
          visit: req.app.locals.visit,
          view: 0,
        });
      }
    }
    if (board) {
      return res.status(201).json({
        status: true,
        redirect: `/board/article?id=${board.id}`,
      });
    }
  } catch (error) {
    next(error);
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'public/upload/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext === '.jpeg' || ext === '.jpg' || ext === '.png') {
      return cb(null, true);
    }
    return cb(null, false);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/imageupload', isLoggedIn, upload.single('upload'), (req, res, next) => {
  // upload successed
  // {uploaded : 1, filename : 파일명, url : 파일 업로드 경로}
  // uploaded failed
  // { uploaded : 0 , error : { message : 경고 메시지 }}
  if (req.file) {
    return res.status(201).json({
      uploaded: 1,
      fileName: req.file.filename,
      url: `http://localhost:3000/upload/${req.file.filename}`,
    });
  }

  return res.status(400).json({
    uploaded: 0,
    error: { message: '이미지만 업로드 가능합니다.' },
  });
});

module.exports = router;
