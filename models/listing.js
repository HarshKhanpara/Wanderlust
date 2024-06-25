const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      set:(v) =>{
        return v==="" ? "default.jpg" : v
      }
    },
    url: {
      type: String,
      set:(v) =>{
        return v==="" ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v
      }
    }
  
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.index({ title: 'text', description: 'text',location: 'text',country: 'text' });


listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    const res = await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log(res);
  }
}
);


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;