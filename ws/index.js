// const { WebSocketServer } = require("ws");
// const { subscriber } = require("../shared/index");

// // WebSocket Server start
// const wss = new WebSocketServer({ port: 8080 });
// allsocket=[]
// console.log(" WebSocket server started on ws://localhost:8080");

// // Client connection event
// wss.on("connection", (socket
//   console.log(" Client connected");

//   ws.send("👋 Connected to orderbook updates");

//   // Redis se updates suno
//   subscriber.subscribe("book_update", (message) => {
//     console.log(" Message from Redis:", message);

//     // WebSocket ke saare connected clients ko broadcast karo
//     wss.clients.forEach((client) => {
//       if (client.readyState === ws.OPEN) {
//         client.send(message);
//       }
//     });
//   });

//   // jab client disconnect kare
//   ws.on("close", () => {
//     console.log(" Client disconnected");
//   });
// });


// function broadcast(message){
//   allsocket.forEach((s)=>{

//   })
// }

// use iife


(() => {
  const { WebSocketServer } = require("ws");
const { subscriber } = require("../shared/index");


  // WebSocket Server start
  const wss = new WebSocketServer({ port: 8081 });
  let allSockets = [];

  console.log("🚀 WebSocket server started on ws://localhost:8080");

  // Broadcast function — sab clients ko message bhejna
  function broadcast(message) {
    allSockets.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(message);
      }
    });
  }

  // Redis Subscriber
  subscriber
    .subscribe("book_update", (message) => {
      console.log("📨 Message received from Redis:", message);
      broadcast(message);
    })
    .then(() => console.log("✅ Subscribed to Redis channel: book_update"))
    .catch((err) => console.error("❌ Redis Subscribe Error:", err));

  // WebSocket connection
  wss.on("connection", (ws) => {
    console.log("✅ Client connected");
    allSockets.push(ws);

    ws.send("👋 Connected to orderbook updates via WebSocket");

    ws.on("close", () => {
      console.log("❌ Client disconnected");
      allSockets = allSockets.filter((s) => s !== ws);
    });
  });
})();
