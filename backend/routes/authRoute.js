const { Router } = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");
const passport = require("passport");
const generateToken = require("../utils/genrateToken");

const router = Router();


router.post("/register", registerUser);

router.post("/login", loginUser)

router.get("/logout", logoutUser);


router.get("/google", passport.authenticate("google", { 
    scope: ["profile", "email"]
}))


router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/userLogin`,
    session: false
}), (req, res) => {

    const accessToken = generateToken(req?.user);

    res.cookie("accessToken", accessToken, { httpsOnly: true });

    res.redirect(`${process.env.FRONTEND_URL}`)

});


module.exports = router;