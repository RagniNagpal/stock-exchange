class OrderBook {
  constructor (symbol = "BTCUSD") {
    this.symbol = symbol
    this.bids = [],   // sorted descending
    this.ask = [],    // sorted ascending 
    this._nextId = 1,
    this.lastTradedPrice = null
  }

  //helper
_generate() {
  return this._nextId++;
}

_sort (sides) {    
  if (sides === "BUY" ) {
    this.bids.sort((a, b) => {
      if (a.price !=b.price){
        return b.price-a.price
      }
        return a.timestamp-b.timestamp;
      })
    }else{
      this.ask.sort((a,b)=>{
        if(a.price!=b.price){
          return a.price-b.price;
        }
        return a.timestamp-b.timestamp;
      })
    }
  }

    //PUBLIC FUNCTION
    // function to place a new order in orderbook (price optional ho sakta hai )
    /* 
    1. create new order {orderId, side, type, price?, originalQty, remainingQty, execQty, timestamp, user}
    2. match type if type == market, call marketMatch, else call limitMatch
    */
placeOrder (side, type, price = null, quantity, user) {
  /* Basic Validation (mtlb kuch cheejen important hai jaise symbol or side milni hi chahiye) */
  let order = {
    order : this._generate(),
    symbol : this.symbol,
    side : side,   // buyer or seller 
    type : type,
    price : price, 
    originalQty : quantity,
    remainingQty : quantity,
    execQty : 0,
    timestamp : Date.now(),
    user : user
  }
// let trades = [];   // ye humne isliye kiya taki hum baad mai trades ki history show kar paye
  if (type === "MARKET") {
    let result = this._marketMatch(order);
    if (result.remainingQty > 0) {
      console.log("Order completed" + result.execQty + " " + "Cancel order: " + result.remainingQty);
    }
  } else {
    this._limitMatch(order);
  }
}

// execute order if it is a market order
/* bids : sorted descending  (bids hamara kharidne wala hota hai )
asks : sorted ascending   0th index se shuru karenge (or asks hamara bechne wala hota hai )
1. side check : buy | sell  
2. if buy start buying from asks array starting from index 0 
loop while order.remainingQty > 0 && asks.length > 0   (idhar loop tab tak chalegi jab tak hamari required quantity buy nhi ho jati ya phir koi bech hi nhi rha hoga )
buy min(order.remainingQty, asks[0].remainingQty)  - jaise hamare pass 1500 ke pass 5 quantity hai or 1501 ke pass 10 or hamara bids ko chahiye 7 quantity toh sabse pehle voh 1500 mai 5 khared lega or 2 remaining rhe jayegi or phir agar quantity 4 chahiye bids ko toh phir 4 kharid lega or phir asks ke pass 1 quantity rhe jayegi iska mtlb har baari hamari minimum quantity buy ho rhi hai 
update remainingQty and execQty
*/

// market order hamara create or execute hota hai ismai order book nhi banti 
 _marketMatch(order) {
    if (order.side === "BUY") {
      let asksArr = this.ask;

      while (order.remainingQty > 0 && asksArr.length > 0) {
        let top = asksArr[0];
        let orderFill = Math.min(order.remainingQty, top.remainingQty);

        order.execQty += orderFill;
        order.remainingQty -= orderFill;

        top.execQty += orderFill;
        top.remainingQty -= orderFill;

        if (top.remainingQty === 0) {
          asksArr.shift(); // remove fully filled ask
        }
      }
      return order;
    }

    if (order.side === "SELL") {
      let bidsArr = this.bids; // ✅ FIXED (was this.bid before)

      while (order.remainingQty > 0 && bidsArr.length > 0) {
        let top = bidsArr[0];
        let orderFill = Math.min(order.remainingQty, top.remainingQty);

        order.execQty += orderFill;
        order.remainingQty -= orderFill;

        top.execQty += orderFill;
        top.remainingQty -= orderFill;

        if (top.remainingQty === 0) {
          bidsArr.shift(); // remove fully filled bid
        }
      }
      return order;
    }
  }


// execute order if it a limit order  (limit order hamara order book mai show hota hai )
/* pehle ka toh market match wala hi same hai */
_limitMatch(order) {
  if (order.side === "BUY") {
    let opposite = this.ask;  // jab first time order banega toh ye array empty hoga (hamen buy karna hai opposite array se mtlb buy karna hai ask wale se )
    while (order.remainingQty > 0 && opposite.length > 0) {
      let top = opposite[0];   // sabse pehle 0th index se start karenge kyuki vahan sasti value hoti hai 
      if (order.price >= top.price) {
        let filledOrder = Math.min(order.remainingQty, top.remainingQty);
        order.remainingQty -= filledOrder;
        order.execQty += filledOrder;

        top.remainingQty -= filledOrder;
        top.execQty += filledOrder;

        if(top.remainingQty <= 0) {
          opposite.shift();
        }
      }else {
        break;
      }
    }
    if (order.remainingQty > 0) {
      this.bids.push(order);
      this._sort("BUY");
    }
  }
  else if (order.side === "SELL") {
    let opposite = this.bids;
    while (order.remainingQty > 0 && opposite.length > 0) {
      let top = opposite[0];   // sabse pehle 0th index se start karenge kyuki vahan sasti value hoti hai 
      if (order.price <= top.price) {
        let filledOrder = Math.min(order.remainingQty, top.remainingQty);
        order.remainingQty -= filledOrder;
        order.execQty += filledOrder;

        top.remainingQty -= filledOrder;
        top.execQty += filledOrder;

        if(top.remainingQty <= 0) {
          opposite.shift();
        }
      }else {
        break;
      }
    }
    if (order.remainingQty > 0) {
      this.ask.push(order);
      this._sort("SELL");
    }
  }
}

getBookSnapshot () {
  return {
    bids : this.bids.map((o) => [o.price, o.remainingQty]),
    ask : this.ask.map((o) => [o.price, o.remainingQty]),

    // currentPrice : 
  }
}  
}

//if a function or variable starts with _  baki language mei keywords(private) par js mei _ lagaya mtlb bahar vala samjh jaega ki private rakhna hai .... sirf class mei hi access ho payega
//let orderBook=new OrderBook("BTCUSD")
//js mei comparator se sort karna padhte hai

let BTCUSDOrderBook=new OrderBook()
// fill bids as a market maker
console.log(BTCUSDOrderBook.getBookSnapshot());
BTCUSDOrderBook.placeOrder("BUY", "LIMIT", "1500.00", 10, "Vamika");
BTCUSDOrderBook.placeOrder("BUY", "LIMIT", "1505.00", 20, "Ragni");
BTCUSDOrderBook.placeOrder("BUY", "LIMIT", "1506.00", 10, "Vanshika");

console.log(BTCUSDOrderBook.getBookSnapshot());

// fill ask as a market maker
BTCUSDOrderBook.placeOrder("SELL", "LIMIT", "1507.00", 10, "Vamika");
BTCUSDOrderBook.placeOrder("SELL", "LIMIT", "1508.00", 10, "Ragni");
BTCUSDOrderBook.placeOrder("SELL", "LIMIT", "1509.00", 10, "Vanshika");
console.log(BTCUSDOrderBook.getBookSnapshot());
