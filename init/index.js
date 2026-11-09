// ============================================================
// 1. IMPORTING REQUIRED PACKAGES AND FILES
// ============================================================

// dotenv loads environment variables from the .env file.
// We need it to access our MongoDB connection URL.
require("dotenv").config();

// Importing Mongoose to connect Node.js with MongoDB and perform database operations.
const mongoose = require("mongoose");

// Importing sample data from data.js.
// This file contains predefined listing objects that we want to insert into our MongoDB database.
const initData = require("./data.js");

// Importing the Listing model from models/listing.js.
// This model defines the structure of listing documents and provides methods to interact with MongoDB.
const Listing = require("../models/listing.js");

// ============================================================
// 2. CONNECTING TO MONGODB AND INITIALIZING DATABASE
// ============================================================

// Calling main() to establish a MongoDB connection.
//
// .then() executes after the database connection succeeds.
// .catch() handles errors during connection or initialization.
//
// FLOW:
// 1. main() connects to MongoDB.
// 2. Once connected, the .then() block executes.
// 3. initDB() is called to initialize the database.
// 4. If an error occurs, the .catch() block handles it.

main()
  .then((res) => {
    // This message is printed when MongoDB connection succeeds.
    console.log("connected to DB");

    // Calling initDB() to insert sample listing data.
    // return ensures the Promise from initDB() is passed to the .then() chain, so its errors can reach .catch().
    return initDB();
  })
  .catch((err) => {
    // Prints database connection or initialization errors.
    console.log(err);
  });

// ============================================================
// 3. DATABASE CONNECTION FUNCTION
// ============================================================

// async function allows us to use await inside it.
// This function is responsible for connecting to MongoDB.

async function main() {
  // mongoose.connect() establishes a connection with MongoDB.
  //
  // process.env.MONGODB_URL gets the connection string from our .env file.
  //
  // await waits until the database connection succeeds or an error occurs.
  await mongoose.connect(process.env.MONGODB_URL);
};

// ============================================================
// 4. DATABASE INITIALIZATION FUNCTION
// ============================================================

// This asynchronous function prepares our database with predefined sample listing data.
// It performs two main operations:
// 1. Deletes existing listing documents.
// 2. Inserts fresh sample listing documents.
// This process is called DATABASE SEEDING.

const initDB = async () => {
  // STEP 1: DELETE EXISTING LISTINGS
  // deleteMany({}) deletes ALL documents from the listings collection because an empty filter matches every document.
  // This prevents duplicate sample records when we run the initialization script again.
  // IMPORTANT: This also deletes listings created by users!
  await Listing.deleteMany({});

  // STEP 2: INSERT SAMPLE LISTINGS
  // initData.data contains the array of sample listing objects imported from init/data.js.
  // insertMany() inserts all those objects into MongoDB as multiple documents.
  await Listing.insertMany(initData.data);

  // STEP 3: CONFIRM INITIALIZATION
  // This message is printed after all sample data has been successfully inserted.
  console.log("data was initialized");
};
