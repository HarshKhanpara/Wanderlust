const Listing = require('./models/listing');
const ExpressError = require('./utils/ExpressError');
const { listingSchema, ReviewSchema } = require('./schema.js');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //redirect url
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
        delete req.session.returnTo;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id)
    if(!res.locals.currentUser || !listing.owner.equals(res.locals.currentUser._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing = (req, res, next) => {
    console.log('validating listing');
    console.log('req.body: ', req.body);
    const {error} = listingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}




module.exports.validateReview = (req, res, next) => {
    const {error} = ReviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    console.log(review.author.equals(res.locals.currentUser._id));
    console.log(review.author);
    console.log(res.locals.currentUser._id);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}