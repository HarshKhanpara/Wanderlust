const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URI || 'mongodb://localhost:27017/wanderlust';

async function main(){
  console.log(MONGO_URL);
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log('connected to db');
}
).catch((err) => {
    console.log('error connecting to db', err);
}
);

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    //666acc9a1ef07d3d59021c23 convert to ObjectId
    owner: new mongoose.Types.ObjectId(obj._id),
    }));
    console.log(initData.data);
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();