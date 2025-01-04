const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
require("dotenv").config();


passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true
    },

    async (req, accessToken, refreshToken, profile, done) => {
        try {
            const { emails, displayName, photos } = profile;
            
            let user = await User.findOne({ email: emails[0]?.value })

            if (user) {
                if (!user.profilePicture) {
                    user.profilePicture = photos[0]?.value;
                    await user.save();
                }

                return done(null, user);
            }

            // IF USER NOT FOUND  CREATE NEW ONE...
            user = await User.create({
                username: displayName,
                email: emails[0]?.value,
                profilePicture: photos[0]?.value
            });

            done(null, user);

            
         } catch (error) {
            done(error)
         }

    }

))


module.exports = passport;