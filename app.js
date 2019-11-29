const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Importing Routes
const authRoute= require('./routes/auth');
const PostsRoute = require('./routes/posts')

//***** middleware */ 
// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// enable CORS - Cross Origin Resource Sharing
app.use(cors({
    credentials: true,
  }));
// routes middelware
app.use('/api/user', authRoute);
app.use('/posts', PostsRoute);


// connect to database
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(`DB Connection Error: ${err.message}`));




app.get('/' , (req, res) => {
    res.send('first try')
})


// listening to port
app.listen(3000);