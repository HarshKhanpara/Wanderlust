const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URI || 'mongodb://localhost:27017/wanderlust';

async function main(){
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
    owner:"66704bcb8980945dcb3a8a63"
    })); 
      await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();