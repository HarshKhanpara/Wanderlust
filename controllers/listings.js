const Listing = require('../models/listing');

module.exports.index = async (req, res) => {
    let listings = await Listing.find();
    res.render('listings/index.ejs', {listings: listings});
}

module.exports.search = async (req, res) => {
    let {search} = req.body;
    let listings = await Listing.find({$text: {$search: search}});
    console.log(listings);
    res.render('listings/index.ejs', {listings: listings});
}


module.exports.renderNewForm =  async(req, res) => {
    res.render('listings/new.ejs');
}

module.exports.showListing = async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    .populate('owner')
    .populate({path:'reviews',
    populate: {path: 'author'}
})
    console.log("Listing: ", listing);
    if(!listing){
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    console.log(listing);
    console.log(listing.owner);
    res.render('listings/show.ejs', {listing: listing});
}

module.exports.createListing = async (req, res,next) => {
    if(!req.body.listing) throw new ExpressError('Invalid Listing Data', 400);
    console.log("Recieved listing data: ", req.body.listing)
    let listing = req.body.listing;
    listing.owner = req.user._id;
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image.url = url;
    listing.image.filename = filename;
    const newListing = new Listing(listing).save().then((listing) => {
        req.flash('success', 'Successfully made a new listing!');
        res.redirect('/listings');
    }
    );
}

module.exports.renderEditForm = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    
    if(!listing){
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings',{listing});
    }
    let orignalImageUrl = listing.image.url;
    orignalImageUrl = orignalImageUrl.replace('upload', 'upload/w_250,h_300');
    res.render('listings/edit.ejs', {listing: listing,orignalImageUrl});
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    console.log("id: ", id);
    console.log("req.file: ", req.file);
    let updatedListing = await Listing.findByIdAndUpdate(id)
    //Update image if a new image is uploaded
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image.url = url;
        updatedListing.image.filename = filename;
    }
    console.log("updatedListing: ", updatedListing);                                                                                        
      updatedListing.save().then((listing) => {
          console.log('listing updated');                 
          console.log("id: ", id);
          req.flash('success', 'Successfully updated a listing!');
          res.redirect(`/listings/${id}`);
      }
      );
  }

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a listing!');
    res.redirect('/listings');
}