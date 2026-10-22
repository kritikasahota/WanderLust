require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

main()
  .then((res) => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
};

app.get("/", (req, res) => {
  res.send("Hi! I am root");
});

app.listen(8080, (req, res) => {
  console.log("server is listening to port 8080");
});
