const mongoose = require("mongoose");

// Schema is a class provided by Mongoose. We use it to define the structure and rules of our documents.
const Schema = mongoose.Schema;

// ============================================================
// 1. CREATING LISTING SCHEMA
// ============================================================
// A Schema defines what fields a Listing document will contain,
// their data types, default values and validation rules.
// Think of Schema as a blueprint for documents stored in MongoDB.
// Every listing created in our WanderLust application will follow this structure.

const listingSchema = new Schema({
  // TITLE FIELD
  title: {
    // The title must be a String (text).
    type: String,

    // required: true means title cannot be empty or missing.
    // If title is not provided, Mongoose validation will fail.
    required: true,
  },

  // DESCRIPTION FIELD
  // Stores the description of the property.
  // Its data type is String.
  // It is optional because required is not set to true.
  description: String,

  // IMAGE FIELD
  image: {
    // Stores the image URL as a String.
    type: String,

    // DEFAULT VALUE:
    // If the user does not provide an image,
    // Mongoose uses this URL as the default value.
    default:
      "https://unsplash.com/illustrations/palm-trees-silhouetted-against-a-bright-orange-sunburst-yk_VBgwUwtU",

    // SETTER FUNCTION:
    // A setter allows us to modify a value before Mongoose stores it in the document.
    //'v' represents the value being assigned to image.
    // If the assigned value matches the specified URL, the setter returns "default link".
    // Otherwise, it returns the original value.
    // IMPORTANT:
    // This is custom logic specific to your project.
    // It is not a built-in requirement of Mongoose.
    set: (v) =>
      v ===
      "https://unsplash.com/illustrations/palm-trees-silhouetted-against-a-bright-orange-sunburst-yk_VBgwUwtU"
        ? "default link"
        : v,
  },

  // PRICE FIELD
  // Stores the price of the property.
  // Number allows us to store numeric values.
  price: Number,

  // LOCATION FIELD
  // Stores the property location.
  // Example: Goa, Manali, Mumbai.
  location: String,

  // COUNTRY FIELD
  // Stores the country in which the property is located.
  // Example: India, USA, France.
  country: String,
});

// ============================================================
// 2. CREATING MONGOOSE MODEL
// ============================================================

// mongoose.model() creates a Model using our Schema.
//
// First argument: "Listing"
// This is the name of our model.
//
// Second argument: listingSchema
// Defines the structure and validation rules.
//
// Mongoose normally converts the model name "Listing"
// into the MongoDB collection name "listings".
//
// We use this model in app.js to perform CRUD operations.

const Listing = mongoose.model("Listing", listingSchema);

// ============================================================
// 3. EXPORTING THE MODEL
// ============================================================

// module.exports makes the Listing model available to other files in our project.
// In app.js and init/index.js, we import it using:
// const Listing = require("./models/listing.js")
// This allows those files to access MongoDB through the Listing model.

module.exports = Listing;
