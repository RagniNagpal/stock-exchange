// make server
const express = require("express");
const app = express();


const orderRoutes = require("./routes/order");

app.use(express.json()); 


// server.js
app.use("/api/v1/order", orderRoutes);



app.listen(3000, () => console.log("Server started"));

