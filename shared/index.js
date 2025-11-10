const { createClient } = require("redis");

const publisher = createClient();
const subscriber = createClient();

publisher
  .connect()
  .then(() => console.log(" Redis Publisher Connected"))
  .catch((err) => console.error(" Publisher Connection Error:", err));

subscriber
  .connect()
  .then(() => console.log(" Redis Subscriber Connected"))
  .catch((err) => console.error(" Subscriber Connection Error:", err));

module.exports = { publisher, subscriber };
