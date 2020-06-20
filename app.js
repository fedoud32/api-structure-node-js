const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Importing Routes
const authRoute = require("./routes/auth");
const PostsRoute = require("./routes/posts");
const FormRoute = require("./routes/form");
const ContactRoute = require('./routes/contact')

//***** middleware */
// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// enable CORS - Cross Origin Resource Sharing
app.use(
  cors({
    credentials: true,
  })
);
// routes middelware
app.use("/user", authRoute);
app.use("/posts", PostsRoute);
app.use("/form", FormRoute);
app.use("/contact", ContactRoute);

// connect to database
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(`DB Connection Error: ${err.message}`));

app.get("/", (req, res) => {
  res.send("no route defined");
});

// listening to port
app.listen(8000);
