const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const {ReviewSchema} = require('../schema.js');
const Review = require('../models/review');
const Listing = require('../models/listing');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');

const express = require('express');
const { createReview, destroyReview } = require('../controllers/reviews.js');
const router = express.Router({ mergeParams: true });


router.post('/',
isLoggedIn,
validateReview,
wrapAsync(
    createReview
));



router.delete('/:reviewId',
isReviewAuthor, 
isLoggedIn,
wrapAsync(
    destroyReview
));


module.exports = router;