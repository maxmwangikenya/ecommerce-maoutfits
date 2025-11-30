const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./Routes/users")
const authRoute = require("./Routes/auth")
const productRoute = require("./Routes/product")

require("dotenv").config(); 

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/product", productRoute);

mongoose
.connect(process.env.MONGO_URL)
.then(() => console.log("DB connected successfull!"))
.catch((err) => {
    console.log("DB not connected")
})



app.listen(process.env.PORT || 5000, () => {
  console.log(`backend server successfully running`);
});