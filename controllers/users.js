const User = require('../models/user');
const passport = require('passport');

module.exports.Signup = async (req, res) => {
    try{
    let {email, username, password} = req.body;
    let user = new User({email, username});
    let newUser = await User.register(user, password);
    console.log(newUser);
    req.login(newUser, err => {
        if(err) return next(err);
        else {
            req.flash('success', 'Welcome to Wanderlust!');
            res.redirect('/listings');
        }
    }
    );
   
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}


module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
}


module.exports.login = async(req, res) => {
    req.flash('success', 'Welcome back to Wanderlust!');
    redirectto = res.locals.returnTo || '/listings';
    res.redirect(redirectto);
}

module.exports.logout = (req, res,next) => {
    req.logout((err) => {
        if(err) return next(err);   
    req.flash('success', 'Goodbye!');
    res.redirect('/listings');
});}