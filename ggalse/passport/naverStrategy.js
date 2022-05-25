const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;
const User = require('../models/User');

// 21-07-20 작성

module.exports = () => {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_ID,
        clientSecret: process.env.NAVER_SECRET,
        callbackURL: `${process.env.NAVER_CALLBACK}`,
        authType: 'reauthenticate',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('response =');
          console.log(profile);
          const user = await User.findOne({
            where: { sns_id: profile.id, provider: '2' },
          });

          if (user) {
            done(null, user);
          } else {
            let nickname = profile.nickname;
            let _email = profile.email;
            nickname = nickname === undefined ? null : nickname;
            _email = _email === undefined ? null : _email;

            const newUser = await User.create({
              username: nickname,
              email: _email,
              sns_id: profile.id,
              provider: '2',
            });

            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
