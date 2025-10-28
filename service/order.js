class OrderBook{
  constructor(symbol="BTCUSD"){
    this.symbol=symbol
    this.bids=[],
    this.ask=[],
    this._nextId=1,
    this.lastTradedPrice=null
  }
  //helper
  _generate(){
    return this._nextId++;
  }
  _sort(sides){
    if(sides==="BUY"){
      this.bids.sort((a,b)=>{
        if(a.price!=b.price){
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
    placeOrder(){
      
    }
    _marketMatch(){

    }
    _limitMatch(){

    }
  }

//if a function or variable starts with _  baki language mei keywords(private) par js mei _ lagaya mtlb bahar vala samjh jaega ki private rakhna hai .... sirf class mei hi access ho payega
//let orderBook=new OrderBook("BTCUSD")
//js mei comparator se sort karna padhte hai

let BTCUSDOrderBook=new OrderBook()

BTCUSDOrderBook.bids.push({orderId:2, side:"BUY",type:"MARKET",price:99, quantity:10,timestamp:Date.now(),user:"Ragni"})

BTCUSDOrderBook.bids.push({orderId:2, side:"BUY",type:"MARKET",price:100, quantity:10,timestamp:Date.now(),user:"Vanshika"})

BTCUSDOrderBook.bids.push({orderId:2, side:"BUY",type:"MARKET",price:98, quantity:10,timestamp:Date.now(),user:"Vamika"})

// BTCUSDOrderBook._sort("BUY");
// console.log(BTCUSDOrderBook.bids);

BTCUSDOrderBook.ask.push({orderId:2, side:"BUY",type:"MARKET",price:99, quantity:10,timestamp:Date.now(),user:"Ragni"})

BTCUSDOrderBook.ask.push({orderId:2, side:"BUY",type:"MARKET",price:100, quantity:10,timestamp:Date.now(),user:"Vanshika"})

BTCUSDOrderBook.ask.push({orderId:2, side:"BUY",type:"MARKET",price:98, quantity:10,timestamp:Date.now(),user:"Vamika"})
BTCUSDOrderBook._sort("SELL");
console.log(BTCUSDOrderBook.ask);
