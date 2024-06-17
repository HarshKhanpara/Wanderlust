const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    console.log('post review');
    console.log('req.body: ', req.body);
    console.log('req.params: ', req.params);
    let listing = await Listing.findById(req.params.id);
    console.log('listing: ', listing);
    let review = new Review(req.body.review);
    listing.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await listing.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/listings/${listing._id}`);
} 

module.exports.destroyReview = async (req, res) => {
    console.log('delete review');
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/listings/${id}`);
}