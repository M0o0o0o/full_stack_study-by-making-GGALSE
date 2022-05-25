const { sequelize } = require('../models');
const Sequelize = require('sequelize');
const Board = require('../models/Board');

module.exports = async (bType, curPage, pageSize, searchText, searchType) => {
  const start = pageSize * curPage - pageSize + 1;
  const end = pageSize * curPage;

  //작성자 검색
  // 제목, 내용, 작성자, 제목 + 내용, 내가 쓴 글
  let title = '%%',
    content = '%%',
    username = '%%',
    user_id = '%%';

  if (searchType === '1') {
    title = `%${searchText}%`;
  } else if (searchType === '2') {
    content = `%${searchText}%`;
  } else if (searchType === '3') {
    username = `%${searchText}%`;
  } else if (searchType === '4') {
    title = `%${searchText}%`;
    content = `%${searchText}%`;
  } else {
    user_id = `%${searchText}%`;
  }

  try {
    return await sequelize.query(
      `
      SELECT * FROM (
      SELECT
      (SELECT COUNT(*) FROM boards
      WHERE  btype LIKE :bType
      AND title like :title
      AND content like :content
      AND username like :username
      AND ((content like :content)
      OR (title like :title))
      AND user_id like :user_id
      AND destroyedAt IS NULL) AS total,
      ROW_NUMBER() OVER(ORDER BY id DESC, createdAt DESC) AS number,
      ROW_NUMBER() OVER(ORDER BY id ASC, createdAt ASC) AS num,
      id, btype, user_id, username, title, content, view,  
      date_format(createdAt, '%y.%m.%d %H:%i') as createdAt, destroyedAt 
      from boards
      WHERE  btype LIKE :bType
      AND destroyedAt IS NULL
      AND title like :title
      AND content like :content
      AND username like :username
      AND ((content like :content)
      OR (title like :title))
      AND user_id like :user_id
      ) BRD
      WHERE BRD.number BETWEEN :start AND :end
      ORDER BY id DESC, createdAt DESC;
      `,
      {
        type: Sequelize.QueryTypes.SELECT,
        raw: true,
        replacements: { bType: `%${bType}%`, start, end, title, content, username, user_id },
      }
    );
  } catch (error) {
    return error;
  }
};
