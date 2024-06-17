const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const { Signup, renderSignupForm, login, logout } = require('../controllers/users');


router.get('/logout', logout);


router.route("/signup")
.get(
renderSignupForm
)
.post( wrapAsync(
    Signup
));

router.route("/login")
.post(
saveRedirectUrl
,passport.authenticate("local",{
    failureFlash: true,
    failureRedirect: '/login'
}), 
wrapAsync(
    login
))
.get((req, res) => {
    res.render('users/login.ejs');
}
);

 

module.exports = router;