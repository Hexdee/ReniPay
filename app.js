require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require('crypto');
const path = require("path");
const auth = require("./middleware/auth");

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// importing user context
const User = require("./model/user");
const Payment = require("./model/payment");


app.get("/", (req, res) => {
  res.send("Welcome to ReniPay");
});

app.get("/pay/:id", async(req, res) => {
  try {
    // console.log(req.query);
    const id = req.params.id;
    // const payment = Payment.findOne({id});
    const payment = await Payment.findOne({id});

    if (!payment) {
      return res.status(400).send("Payment not found");
    }

    console.log(payment)
    console.log("payment", payment.merchant, payment.amount)

    const merchant = payment.merchant
    const amount = payment.amount
    res.render('payment', {amount, merchant});
    console.log(payment)
  } catch(error) {
    console.log(error)
  }
});

app.post("/create", auth, async (req, res) => {
  res.send("Create payment link");
})

app.post("/create", auth, async (req, res) => {
    try {
        // Get payment details
        const { amount, description} = req.body;
    
        // Validate payment details
        if (!(amount && description)) {
          return res.status(400).send("All input is required");
        }
    
        console.log(req.user);
    
        // Create user in our database
        const payment = await Payment.create({
          id: randomUUID(),
          amount,
          merchant: req.user.email,
          description
        });
    
        // return new user
        res.status(201).json(payment);
      } catch (err) {
        console.log(err);
      }
});

// Register
app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { first_name, last_name, email, username, password } = req.body;
  
      // Validate user input
      if (!(email && password && first_name && last_name && username)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        username: username.toLowerCase(),
        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  

// Login
app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        res.status(200).json(user);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });


module.exports = app;