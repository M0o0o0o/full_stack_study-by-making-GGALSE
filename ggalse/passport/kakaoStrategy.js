const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/User');

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: `${process.env.KAKAO_CALLBACK}`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({
            where: { sns_id: profile.id, provider: '1' },
          });
          if (user) {
            done(null, user);
          } else {
            let nickname = profile._json.properties.nickname;
            let _email = profile._json.kakao_account.email;
            nickname = nickname === undefined ? null : nickname;
            _email = nickname === undefined ? null : _email;

            const newUser = await User.create({
              username: nickname,
              email: _email,
              sns_id: profile.id,
              provider: '1',
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
