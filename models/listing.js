const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    set: (v) => v === "https://unsplash.com/illustrations/palm-trees-silhouetted-against-a-bright-orange-sunburst-yk_VBgwUwtU"? "default link" : v,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
modules.export = Listing;
