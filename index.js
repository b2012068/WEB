const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const cookieParser= require("cookie-parser");
//const stripeRoute = require("./routes/stripe");
const cors = require("cors");

dotenv.config();

mongoose.connect(process.env.MONGO_URL,() => 
  {console.log("DB Connection Successfull!");
  })

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

app.listen(8000, () => {
  console.log("Backend server is running!");
});


