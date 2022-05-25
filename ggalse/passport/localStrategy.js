const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

//---------------
// 2021-07-20 작성
module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'user_id',
        passwordField: 'password',
      },
      async (user_id, password, done) => {
        try {
          const user = await User.findOne({ where: { user_id } });

          if (user) {
            const pwdCompare = await bcrypt.compare(password, user.password);
            if (pwdCompare) {
              done(null, user);
            } else {
              done(null, false, { message: '아이디 또는 비밀번호를 다시 확인해주세요.' });
            }
          } else {
            done(null, false, { message: '가입하지 않은 아이디이거나, 비밀번호를 확인해주세요.' });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
