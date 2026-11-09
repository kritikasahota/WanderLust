// ============================================================
// 1. IMPORTING REQUIRED PACKAGES AND MODULES
// ============================================================

// dotenv: Loads environment variables from the .env file.
// We use it to access sensitive information like MongoDB URL.
require("dotenv").config();

// Express: Node.js framework used to create our web server and handle HTTP requests (GET, POST, PUT, DELETE).
const express = require("express");

// Creating an Express application.
// 'app' will be used to configure middleware and define routes.
const app = express();

// Mongoose: Connects Node.js with MongoDB and provides methods to perform database operations.
const mongoose = require("mongoose");

// Importing our Listing model.
// This model is defined in models/listing.js.
// We use it to create, read, update and delete listings.
const Listing = require("./models/listing.js");

// Path: Core Node.js module used to work with file and folder paths.
const path = require("path");

// Method-Override: Allows HTML forms to send PUT and DELETE requests because HTML forms natively support only GET and POST.
const methodOverride = require("method-override");


// ============================================================
// 2. CONFIGURING EXPRESS APPLICATION
// ============================================================

// Tells Express that we are using EJS as our template engine.
// EJS allows us to write dynamic HTML using JavaScript.
app.set("view engine", "ejs");

// Tells Express where our EJS files are stored.
// __dirname represents the current project directory.
// path.join() creates a correct path to the views folder.
app.set("views", path.join(__dirname, "views"));

// Middleware: Reads data submitted through HTML forms.
// extended: true allows nested objects such as: listing[title], listing[description], etc.
// The submitted data becomes available inside req.body.
app.use(express.urlencoded({ extended: true }));

// Middleware: Converts requests containing ?_method=PUT or ?_method=DELETE into actual PUT or DELETE requests.
app.use(methodOverride("_method"));


// ============================================================
// 3. CONNECTING NODE.JS WITH MONGODB
// ============================================================

// Calling main() to establish a connection with MongoDB Atlas.
// main() is an asynchronous function, so it returns a Promise.

// .then(): Executes when the database connection succeeds.
// .catch(): Handles errors if the connection fails.
main()
  .then((res) => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

// Function responsible for connecting our application with the MongoDB database using Mongoose.
async function main() {

  // process.env.MONGODB_URL reads the database connection URL from the .env file.
  // await waits until the MongoDB connection is established.
  await mongoose.connect(process.env.MONGODB_URL);
};


// ============================================================
// 4. ROOT ROUTE
// ============================================================

// GET ROUTE: Handles requests made to the root URL '/'.
// Example: http://localhost:8080/
// req = Request received from the browser.
// res = Response sent back to the browser.
// res.send() sends a simple text response.
app.get("/", (req, res) => {
  res.send("Hi! I am root");
});


// ============================================================
// 5. INDEX ROUTE - READ ALL LISTINGS
// ============================================================

// GET ROUTE: Displays all available listings.
// URL: http://localhost:8080/listings
//
// FLOW:
// 1. Browser sends GET request to /listings.
// 2. Express executes this route.
// 3. Listing.find({}) fetches ALL documents from MongoDB.
// 4. The fetched data is stored in allListings.
// 5. res.render() sends allListings to index.ejs.
// 6. EJS displays all listings on the webpage.

app.get("/listings", async (req, res) => {

  // find({}) returns all listing documents from the database.
  const allListings = await Listing.find({});

  // Rendering index.ejs and passing the fetched data.
  // allListings becomes accessible inside index.ejs.
  res.render("listings/index.ejs", { allListings });
});


// ============================================================
// 6. NEW ROUTE - DISPLAY FORM TO CREATE A LISTING
// ============================================================

// GET ROUTE: Displays the form for creating a new listing.
// URL: http://localhost:8080/listings/new
//
// FLOW:
// 1. User clicks the New Listing button.
// 2. Browser sends GET request to /listings/new.
// 3. Express renders new.ejs.
// 4. User gets an empty form to enter listing details.
//
// IMPORTANT:
// This route must be declared BEFORE /listings/:id.
// Otherwise, Express may treat "new" as a listing ID.

app.get("/listings/new", (req, res) => {
  // Displays the form present in new.ejs.
  res.render("listings/new.ejs");
});


// ============================================================
// 7. SHOW ROUTE - READ ONE PARTICULAR LISTING
// ============================================================

// GET ROUTE: Displays details of one specific listing.
// URL example: http://localhost:8080/listings/12345
//
// :id is a dynamic route parameter.
// Every listing has a unique MongoDB _id.
//
// FLOW:
// 1. User clicks a particular listing.
// 2. Browser sends GET request with its ID.
// 3. req.params extracts the ID from the URL.
// 4. Listing.findById(id) searches MongoDB.
// 5. The matching listing is stored in 'listing'.
// 6. The listing is passed to show.ejs.
// 7. show.ejs displays its details.

app.get("/listings/:id", async (req, res) => {

  // Extracting the dynamic ID from the URL.
  // Example: /listings/12345 -> id = "12345"
  let { id } = req.params;

  // Finding one listing using its MongoDB ID.
  const listing = await Listing.findById(id);

  // Sending the fetched listing to show.ejs.
  // The listing variable becomes accessible inside EJS.
  res.render("listings/show.ejs", { listing });

});


// ============================================================
// 8. CREATE ROUTE - SAVE A NEW LISTING
// ============================================================

// POST ROUTE: Creates and saves a new listing in MongoDB.
// URL: /listings
//
// FLOW:
// 1. User fills out the form in new.ejs.
// 2. User clicks Submit.
// 3. Form sends a POST request to /listings.
// 4. Form data is available inside req.body.
// 5. req.body.listing contains all listing information.
// 6. A new Listing document is created.
// 7. save() stores it in MongoDB.
// 8. User is redirected to the listings page.
//
// Example form field:
// name="listing[title]"
//
// This creates a nested object:
// req.body = {
//   listing: {
//     title: "Beautiful Villa"
//   }
// }

app.post("/listings", async (req, res) => {

  // Creating a new document using submitted form data.
  const newListing = new Listing(req.body.listing);

  // Saving the new document permanently in MongoDB.
  await newListing.save();

  // Redirecting the user to the page displaying all listings.
  res.redirect("/listings");
});


// ============================================================
// 9. EDIT ROUTE - DISPLAY EXISTING DATA IN EDIT FORM
// ============================================================

// GET ROUTE: Displays the edit form for a particular listing.
// URL example: /listings/12345/edit
//
// FLOW:
// 1. User clicks the Edit button on show.ejs.
// 2. Browser sends GET request to /listings/:id/edit.
// 3. req.params extracts the listing ID.
// 4. Listing.findById(id) fetches existing data.
// 5. The listing object is passed to edit.ejs.
// 6. EJS displays existing values inside the form.
// 7. User can modify the information.
//
// IMPORTANT:
// We must pass { listing } to res.render().
// Otherwise, EJS will give "listing is not defined".

app.get("/listings/:id/edit", async (req, res) => {

  // Extracting the listing ID from the URL.
  let { id } = req.params;

  // Fetching the existing listing from MongoDB.
  const listing = await Listing.findById(id);

  // Passing the fetched listing to edit.ejs.
  // Now we can use listing.title, listing.price, etc.
  res.render("listings/edit.ejs", { listing });
});


// ============================================================
// 10. UPDATE ROUTE - UPDATE EXISTING LISTING
// ============================================================

// PUT ROUTE: Updates an existing listing in MongoDB.
// URL example: /listings/12345
//
// FLOW:
// 1. User edits information in edit.ejs.
// 2. User clicks Update.
// 3. Form sends a POST request with ?_method=PUT.
// 4. methodOverride converts it into a PUT request.
// 5. req.params extracts the listing ID.
// 6. req.body.listing contains updated form information.
// 7. findByIdAndUpdate() updates the document.
// 8. User is redirected to the updated listing page.

app.put("/listings/:id", async (req, res) => {

  // Extracting the ID of the listing to be updated.
  let { id } = req.params;

  // Finding the document using its ID and updating its fields.
  //
  // Spread operator (...) copies all properties of
  // req.body.listing into a new object.
  //
  // Example:
  // { ...req.body.listing }
  //
  // This sends the updated title, description, price, etc.
  // to MongoDB.
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // Redirecting to the updated listing's show page.
  res.redirect(`/listings/${id}`);
});


// ============================================================
// 11. DELETE ROUTE - DELETE A LISTING
// ============================================================

// DELETE ROUTE: Permanently deletes a listing from MongoDB.
// URL example: /listings/12345
//
// FLOW:
// 1. User clicks Delete on show.ejs.
// 2. Browser submits a DELETE request.
// 3. methodOverride converts the form request into DELETE.
// 4. req.params extracts the listing ID.
// 5. findByIdAndDelete() removes the document.
// 6. User is redirected to the index page.

app.delete("/listings/:id", async (req, res) => {

  // Extracting the ID of the listing to be deleted.
  let { id } = req.params;

  // Finding the listing using its ID and deleting it.
  // The deleted document is returned and stored in deletedListing.
  let deletedListing = await Listing.findByIdAndDelete(id);

  // Printing the deleted document in the terminal.
  console.log(deletedListing);

  // Redirecting to the page displaying all listings.
  res.redirect("/listings");
});


// ============================================================
// 12. TEST ROUTE (CURRENTLY COMMENTED)
// ============================================================

// This route was previously used to test MongoDB connection and check whether a listing could be saved.
// Since it is commented, Express will NOT execute this route.
// app.get("/testListing", async (req, res) => {
//  //Creating a sample listing document.
//   let sampleListing = new Listing({
//     title: "My new villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });
//
//   // Saving the sample listing in MongoDB.
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successfull testing");
// });


// ============================================================
// 13. STARTING THE EXPRESS SERVER
// ============================================================

// app.listen() starts our server on port 8080.
// After starting the server, open:
// http://localhost:8080
// The callback executes when the server starts listening.

app.listen(8080, (req, res) => {
  console.log("server is listening to port 8080")
});
