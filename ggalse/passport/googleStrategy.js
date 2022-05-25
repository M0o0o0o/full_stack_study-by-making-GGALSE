const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: `${process.env.GOOGLE_CALLBACK}`,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({
            where: { sns_id: profile.id, provider: '3' },
          });

          if (user) {
            done(null, user);
          } else {
            const newUser = await User.create({
              username: profile._json.name,
              sns_id: profile.id,
              provider: '3',
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
