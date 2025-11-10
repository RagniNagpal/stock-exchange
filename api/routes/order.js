// //create router

// const express = require("express");
// const router = express.Router();
// const { postPlaceOrder } = require("../controller/order");


// router.post("/order", postPlaceOrder);

// module.exports = router;


const express = require("express");
const router = express.Router();

// ✅ correct import — make sure spelling same ho
const { postPlaceOrder } = require("../controller/order");

router.post("/", postPlaceOrder);

module.exports = router;
