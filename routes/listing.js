const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema, ReviewSchema } = require('../schema.js');
const Listing = require('../models/listing');
const {isLoggedIn,isOwner,validateListing, isReviewAuthor} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudConfig.js'); // assuming cloudConfig.js is in the same directory
const upload = multer({ storage: storage });
const express = require('express');
const { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, destroyListing } = require('../controllers/listings.js');
const router = express.Router();
const {search} = require('../controllers/listings.js');


router.get('/:id/edit', 
isLoggedIn,
isOwner,
wrapAsync(
    renderEditForm
));

router.post('/search',
wrapAsync(
        search
));


router.get('/new', 
isLoggedIn
,wrapAsync(
    renderNewForm
));




router.route("/")
.get(wrapAsync(index))
.post(
isLoggedIn,
// validateListing,
upload.single("listing[image][url]"),
wrapAsync(
    createListing                                                                                                                                                                       
));



router.route("/:id")
.delete(
isLoggedIn,
isOwner,
wrapAsync(
    destroyListing
))
.get(wrapAsync(
    showListing
))
.put(
isLoggedIn,
isOwner,
upload.single("listing[image][url]"),
validateListing,
wrapAsync(
    updateListing
));

module.exports = router;