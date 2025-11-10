// class OrderBook {
//   constructor (symbol = "BTCUSD") {
//     this.symbol = symbol
//     this.bids = [],   // sorted descending
//     this.ask = [],    // sorted ascending 
//     this._nextId = 1,
//     this.lastTradedPrice = null
//   }

//   //helper
// _generate() {
//   return this._nextId++;
// }

// _sort (sides) {    
//   if (sides === "BUY" ) {
//     this.bids.sort((a, b) => {
//       if (a.price !=b.price){
//         return b.price-a.price
//       }
//         return a.timestamp-b.timestamp;
//       })
//     }else{
//       this.ask.sort((a,b)=>{
//         if(a.price!=b.price){
//           return a.price-b.price;
//         }
//         return a.timestamp-b.timestamp;
//       })
//     }
//   }

//     //PUBLIC FUNCTION
//     // function to place a new order in orderbook (price optional ho sakta hai )
//     /* 
//     1. create new order {orderId, side, type, price?, originalQty, remainingQty, execQty, timestamp, user}
//     2. match type if type == market, call marketMatch, else call limitMatch
//     */
// placeOrder (side, type, price = null, quantity, user) {
//   /* Basic Validation (mtlb kuch cheejen important hai jaise symbol or side milni hi chahiye) */
//   let order = {
//     orderId : this._generate(),
//     symbol : this.symbol,
//     side : side,   // buyer or seller 
//     type : type,
//     price : price, 
//     originalQty : quantity,
//     remainingQty : quantity,
//     execQty : 0,
//     timestamp : Date.now(),
//     user : user
//   }
// // let trades = [];   // ye humne isliye kiya taki hum baad mai trades ki history show kar paye
//   if (type === "MARKET") {
//     let result = this._marketMatch(order);
//     if (result.remainingQty > 0) {
//       console.log("Order completed " + result.execQty + " Cancel order: " + result.remainingQty);
//     }
//     return result;
//   } else {
//     let result = this._limitMatch(order);
//     return result;
//   }
// }

// // execute order if it is a market order
// /* bids : sorted descending  (bids hamara kharidne wala hota hai )
// asks : sorted ascending   0th index se shuru karenge (or asks hamara bechne wala hota hai )
// 1. side check : buy | sell  
// 2. if buy start buying from asks array starting from index 0 
// loop while order.remainingQty > 0 && asks.length > 0   (idhar loop tab tak chalegi jab tak hamari required quantity buy nhi ho jati ya phir koi bech hi nhi rha hoga )
// buy min(order.remainingQty, asks[0].remainingQty)  - jaise hamare pass 1500 ke pass 5 quantity hai or 1501 ke pass 10 or hamara bids ko chahiye 7 quantity toh sabse pehle voh 1500 mai 5 khared lega or 2 remaining rhe jayegi or phir agar quantity 4 chahiye bids ko toh phir 4 kharid lega or phir asks ke pass 1 quantity rhe jayegi iska mtlb har baari hamari minimum quantity buy ho rhi hai 
// update remainingQty and execQty
// */

// // market order hamara create or execute hota hai ismai order book nhi banti 
//  _marketMatch(order) {
//     if (order.side === "BUY") {
//       let asksArr = this.ask;

//       while (order.remainingQty > 0 && asksArr.length > 0) {
//         let top = asksArr[0];
//         let orderFill = Math.min(order.remainingQty, top.remainingQty);

//         order.execQty += orderFill;
//         order.remainingQty -= orderFill;

//         top.execQty += orderFill;
//         top.remainingQty -= orderFill;

//         if (top.remainingQty === 0) {
//           asksArr.shift(); // remove fully filled ask
//         }
//       }
//       return order;
//     }

//     if (order.side === "SELL") {
//       let bidsArr = this.bids; // ✅ FIXED (was this.bid before)

//       while (order.remainingQty > 0 && bidsArr.length > 0) {
//         let top = bidsArr[0];
//         let orderFill = Math.min(order.remainingQty, top.remainingQty);

//         order.execQty += orderFill;
//         order.remainingQty -= orderFill;

//         top.execQty += orderFill;
//         top.remainingQty -= orderFill;

//         if (top.remainingQty === 0) {
//           bidsArr.shift(); // remove fully filled bid
//         }
//       }
//       return order;
//     }
//   }


// // execute order if it a limit order  (limit order hamara order book mai show hota hai )
// /* pehle ka toh market match wala hi same hai */
// _limitMatch(order) {
//   if (order.side === "BUY") {
//     let opposite = this.ask;  // jab first time order banega toh ye array empty hoga (hamen buy karna hai opposite array se mtlb buy karna hai ask wale se )
//     while (order.remainingQty > 0 && opposite.length > 0) {
//       let top = opposite[0];   // sabse pehle 0th index se start karenge kyuki vahan sasti value hoti hai 
//       if (order.price >= top.price) {
//         let filledOrder = Math.min(order.remainingQty, top.remainingQty);
//         order.remainingQty -= filledOrder;
//         order.execQty += filledOrder;

//         top.remainingQty -= filledOrder;
//         top.execQty += filledOrder;

//         if(top.remainingQty <= 0) {
//           opposite.shift();
//         }
//       }else {
//         break;
//       }
//     }
//     if (order.remainingQty > 0) {
//       this.bids.push(order);
//       this._sort("BUY");
//     }
//   }
//   else if (order.side === "SELL") {
//     let opposite = this.bids;
//     while (order.remainingQty > 0 && opposite.length > 0) {
//       let top = opposite[0];   // sabse pehle 0th index se start karenge kyuki vahan sasti value hoti hai 
//       if (order.price <= top.price) {
//         let filledOrder = Math.min(order.remainingQty, top.remainingQty);
//         order.remainingQty -= filledOrder;
//         order.execQty += filledOrder;

//         top.remainingQty -= filledOrder;
//         top.execQty += filledOrder;

//         if(top.remainingQty <= 0) {
//           opposite.shift();
//         }
//       }else {
//         break;
//       }
//     }
//     if (order.remainingQty > 0) {
//       this.ask.push(order);
//       this._sort("SELL");
//     }
//   }
// }

// getBookSnapshot () {
//   return {
//     bids : this.bids.map((o) => [o.price, o.remainingQty]),
//     ask : this.ask.map((o) => [o.price, o.remainingQty]),

//     // currentPrice : 
//   }
// }  
// }

// //if a function or variable starts with _  baki language mei keywords(private) par js mei _ lagaya mtlb bahar vala samjh jaega ki private rakhna hai .... sirf class mei hi access ho payega
// //let orderBook=new OrderBook("BTCUSD")
// //js mei comparator se sort karna padhte hai

// let BTCUSDOrderBook=new OrderBook()
// // fill bids as a market maker
// console.log(BTCUSDOrderBook.getBookSnapshot());
// BTCUSDOrderBook.placeOrder("BUY", "LIMIT", "1500.00", 10, "Vamika");
// BTCUSDOrderBook.placeOrder("BUY", "LIMIT", "1505.00", 20, "Ragni");
// BTCUSDOrderBook.placeOrder("BUY", "LIMIT", "1506.00", 10, "Vanshika");

// console.log(BTCUSDOrderBook.getBookSnapshot());

// // fill ask as a market maker
// BTCUSDOrderBook.placeOrder("SELL", "LIMIT", "1507.00", 10, "Vamika");
// BTCUSDOrderBook.placeOrder("SELL", "LIMIT", "1508.00", 10, "Ragni");
// BTCUSDOrderBook.placeOrder("SELL", "LIMIT", "1509.00", 10, "Vanshika");
// console.log(BTCUSDOrderBook.getBookSnapshot());


// module.exports=OrderBook;



class OrderBook{
    constructor(symbol = "BTCUSD"){     // what will user want that constructor will take symbol as input
        this.symbol = symbol,
        this.bids = [],
        this.ask = [],   // filled by market makers
        this._nextId = 1,
        this.lastTradedPrice = null;
    }

    // ----------------- helper function to generate unique ids -----------------
    _generateOrderId(){
        return this._nextId++;
    }

    // ----------------- helper function to sort -----------------
    _sort(sides){
        if(sides === "BUY"){
            this.bids.sort((a, b) =>{   // a and b are two objects being compared (from an array of objects of bids)
                if(a.price != b.price){   // if prices are not equal then sort but if equal then sort by timestamps
                    return b.price - a.price;  // descending order
                }
                else{
                    return a.timestamp - b.timestamp;  // ascending order of timestamp
                }
            }); // sort function in js is done by lexicographical order by default but if we dont want that we pass comparator function
        }
        else{
            if(sides === "SELL"){
                this.ask.sort((a,b)=>{
                    if(a.price != b.price){   // if prices are not equal then sort but if equal then sort by timestamps
                        return a.price - b.price;  // ascending order
                    }
                    else{
                        return a.timestamp - b.timestamp;  // ascending order of timestamp
                    }
                })
            }
        }
    }
    // ----------------- function to place order -----------------
    /* 
        1. create new order {orderId, side, type, price, originalQuantity, remainingQuantity, executedQuantity, timestamp, user}
        2. match type if type == market -> call _marketMatch else call _limitMatch


    */
    placeOrder(side, type, price = null, quantity, user){
        /* Basic validation */

        // if(!symbol || !side || !type || !quantity || (type === "LIMIT" && price === null)){
        //     throw new Error("Invalid order parameters");
        // }

        let order = {
            orderId: this._generateOrderId(),
            // symbol: symbol,
            side: side,
            type: type,
            price: price,
            originalQuantity: quantity,
            remainingQuantity: quantity,
            executedQuantity: 0,
            timestamp: Date.now(),
            user: user
        }
        if(type === "MARKET"){
            let result = this._marketMatch(order);
            // if(result.remainingQuantity > 0){
            //     // do nothing
            //     console.log("Order completed: " + result.executedQuantity + " " + "Order cancelled: " + result.remainingQuantity)
            // }
            return {book:this.getBookSnapShot,result};
        }
        else{
            let result = this._limitMatch(order);
            return {book:this.getBookSnapShot,result};
        }
    }

    /*
        bids : [] asc order
        ask : [] desc order 
        1. type : buy/sell
        2. if BUY starts buying from ASK array starting from index 0
            loop while order.remainingQuantity > 0 and ASK.length array > 0
            buy min(order.remainingQuantity and ASK[0].remainingQuantity) 
            update order.remainingQuantity and order.executedQuantity from both sides
     */
    _marketMatch(order){
        if(order.side === "BUY"){
            let askArray = this.ask;
            while(order.remainingQuantity > 0 && askArray.length > 0){
                let top = askArray[0];
                let orderFill = Math.min(order.remainingQuantity, top.remainingQuantity);
                order.executedQuantity += orderFill;
                order.remainingQuantity -= orderFill;
                top.executedQuantity += orderFill;
                top.remainingQuantity -= orderFill;

                // assume order.remaining > 0 
                if(top.remainingQuantity == 0){
                    askArray.shift();  // remove the top element from ask array
                }
            }
            return {order};
        }
        else if (order.side === "SELL") {
            let bidArr = this.bids;
            while (order.remainingQuantity > 0 && bidArr.length > 0) {
                let top = bidArr[0];
                let orderFill = Math.min(order.remainingQuantity, top.remainingQuantity);
                order.executedQuantity += orderFill;
                order.remainingQuantity -= orderFill;
                top.executedQuantity += orderFill;
                top.remainingQuantity -= orderFill;

                this.lastTradedPrice = top.price;
                if (top.remainingQuantity <= 0) {
                    bidArr.shift();
                }
            }
            return order;
        }
    }
    _limitMatch(order){
        if(order.side === "BUY"){
            let opposite = this.ask;
            while(order.remainingQuantity > 0 && opposite.length > 0){
                let top = opposite[0];
                if(order.price >= top.price){
                    let fillOrder = Math.min(order.remainingQuantity, top.remainingQuantity);
                    order.remainingQuantity -= fillOrder;
                    order.executedQuantity += fillOrder;
                    top.remainingQuantity -= fillOrder;
                    top.executedQuantity += fillOrder;

                    if(top.remainingQuantity <= 0){
                        opposite.shift();
                    }
                }
            }
            if(order.remainingQuantity > 0){
                this.bids.push(order);
                this._sort("BUY");
            }
        }
        else{
            if(order.side === "SELL"){
                let opposite = this.bids;
                while(order.remainingQuantity > 0 && opposite.length > 0){
                    let top = opposite[0];
                    if(order.price <= top.price){
                        let fillOrder = Math.min(order.remainingQuantity, top.remainingQuantity);
                        order.remaqiningQuantity -= fillOrder;
                        order.executedQuantity += fillOrder;
                        top.remainingQuantity -= fillOrder;
                        top.executedQuantity += fillOrder;

                        if(top.remainingQuantity <= 0){
                            opposite.shift();
                        }
                    }
                    else{
                        break;
                    }
                }
                if(order.remainingQuantity > 0){
                    this.ask.push(order);
                    this._sort("SELL");
                }
            }
        }
        return order;
    }
    getBookSnapShot(){
        return{
            bids : this.bids.map((o)=>[o.price, o.remainingQuantity]),
            ask : this.ask.map((o)=>[o.price, o.remainingQuantity]),
            lastUpdated : Date.now()
            // currentPrice : 
        }
    }
}


// if a function or variable starts with _ it means it is private means only accessible within the class
//let orderBook = new OrderBook("BTCUSD");

//BUY ORDERS
let BTCUSDOrderBook = new OrderBook();
// BTCUSDOrderBook.bids.push({
//     orderId: 2,
//     side: "BUY",
//     type: "MARKET",
//     price: 100,
//     quantity: 10,
//     timestamp: Date.now(),
//     user: "Parmeet"
// }) 

// BTCUSDOrderBook.bids.push({
//     orderId: 2,
//     side: "BUY",
//     type: "MARKET",
//     price: 99,
//     quantity: 10,
//     timestamp: Date.now(),
//     user: "Inder"
// }) 

// BTCUSDOrderBook.bids.push({
//     orderId: 2,
//     side: "BUY",
//     type: "MARKET",
//     price: 104,
//     quantity: 10,
//     timestamp: Date.now(),
//     user: "Gurshan"
// }) 
// BTCUSDOrderBook._sort("BUY");
// console.log(BTCUSDOrderBook.bids);

// //SELL ORDERS
// BTCUSDOrderBook.ask.push({
//     orderId: 2,
//     side: "SELL",
//     type: "MARKET",
//     price: 100,
//     quantity: 10,
//     timestamp: Date.now(),
//     user: "Parmeet"
// }) 

// BTCUSDOrderBook.ask.push({
//     orderId: 2,
//     side: "SELL",
//     type: "MARKET",
//     price: 99,
//     quantity: 10,
//     timestamp: Date.now(),
//     user: "Inder"
// }) 

// BTCUSDOrderBook.ask.push({
//     orderId: 2,
//     side: "SELL",
//     type: "MARKET",
//     price: 104,
//     quantity: 10,
//     timestamp: Date.now(),
//     user: "Gurshan"
// }) 
// BTCUSDOrderBook._sort("SELL");
// console.log(BTCUSDOrderBook.ask);



// fill bids as market maker

console.log(BTCUSDOrderBook.getBookSnapShot());
BTCUSDOrderBook.placeOrder("BUY", "LIMIT", "1506.00", 10, "Parmeet")
BTCUSDOrderBook.placeOrder("BUY", "LIMIT", "1505.00", 20, "Romsha")
BTCUSDOrderBook.placeOrder("BUY", "LIMIT", "1500.00", 10, "Parmeet")
console.log(BTCUSDOrderBook.getBookSnapShot());

// fill ask as market maker
BTCUSDOrderBook.placeOrder("SELL", "LIMIT", "1507.00", 10, "Parmeet")
BTCUSDOrderBook.placeOrder("SELL", "LIMIT", "1508.00", 10, "Romsha")
BTCUSDOrderBook.placeOrder("SELL", "LIMIT", "1509.00", 10, "Parmeet")
console.log(BTCUSDOrderBook.getBookSnapShot());

// console.log(BTCUSDOrderBook.getBookSnapShot());
// BTCUSDOrderBook.placeOrder("BUY", "MARKET", null, 10, "Parmeet");
// console.log(BTCUSDOrderBook.getBookSnapShot());


module.exports = OrderBook;
