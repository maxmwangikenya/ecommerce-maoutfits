const express = require("express");
const app = express();
const mongoose = require("mongoose")
const PORT = 5500;

app.listen(PORT, () =>{
    console.log(`server successfully running on port ${PORT}`)
})