const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 5500;
const dotenv = require("dotenv").config();


mongoose.
connect(process.env.MONGO_URI)
.then(()=> {console.log("DBsuccessfully connected")})
.catch((err) => {
    console.log("err")
})

app.get("/api/test", () => {
    console.log("test is successful")
})

app.listen(PORT, () =>{
    console.log(`server successfully running on port ${PORT}`)
})