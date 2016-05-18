/*
Observable is a collection that arrives over time. Can be used to model events, async requests,  and animations. Can be transformed, combined, consumed using Array methods (see forEach.js). 
*/

var Observable = Rx.Observable;

var button = document.getElementById('button');
var buttonPoint = document.getElementById('buttonPoint');
/*
--
Under the hood, this is similar to what Observable is doing. It is saying that when you add a forEach loop to the observable collection (clicks), it will add an event listener and process it. (It is lazy.)
--

var handler = function(e) {
	alert('clicked');
	button.removeEventListener('click', handler);
};

button.addEventListener('click', handler);
*/

var clicks = Observable.fromEvent(button, 'click');
var subscription = clicks.forEach(
        function onNext(e) {
            'use strict';
            alert('clicked');
            subscription.dispose();
        },
        function onError(error) {
            'use strict';
            console.log('ERROR!');
        },
        function onCompleted() {
            'use strict';
            console.log("done");
        }
    );

/** Using Observable with Array.map
**/

var clicksPoint = Observable.fromEvent(buttonPoint, 'click');

var points = 
	clicksPoint.map(function(e) {
		return {x: e.clientX, y: e.clientY};
	});

var subscriptionPoint = 
	points.forEach(
		function onNext(point) {
			alert('clicked:' + JSON.stringify(point));
			subscriptionPoint.dispose();
		},
		function onError(error) {				 		
			console.log('ERROR!');
		},
		function onCompleted() {
			console.log("done");
		});

/**
    Using Obesrvable with map to create a draggable widget
*/
var parent = document.getElementById("parent");
var widget = document.getElementById("widget");

var mouseDowns = Observable.fromEvent(widget, "mousedown");
var parentMouseMoves = Observable.fromEvent(parent, "mousemove");
var parentMouseUps = Observable.fromEvent(parent, "mouseup");
var drags = 
  mouseDowns.
    map(function(e) {
      return parentMouseMoves.
        takeUntil(parentMouseUps);
    }).
    concatAll();

var subscriptionDrag = 
  drags.forEach(
    function onNext(e) {
      widget.style.left = e.clientX + "px";
      widget.style.top = e.clientY + "px";
    },
      function onError(error) {
      console.log('error');
    },
    function onCompleted() {
      
    });

/** 
Using Observable with nested arrays to map and filter through them
**/

var exchangesNested = [
  { 
    name: "NYSE",
    stocks: [
      { 
        symbol: "XFX", 
        closes: [
          { date: new Date(2014,11,24), price: 240.10 },
          { date: new Date(2014,11,23), price: 232.08 },
          { date: new Date(2014,11,22), price: 241.09 }
        ]
      },
      { 
        symbol: "TNZ", 
        closes: [
          { date: new Date(2014,11,24), price: 521.24 },
          { date: new Date(2014,11,23), price: 511.00 },
          { date: new Date(2014,11,22), price: 519.29 }     
        ]
      },
    ]
  },
  { 
    name: "TSX",
    stocks: [
      { 
        symbol: "JXJ", 
        closes: [
          { date: new Date(2014,11,24), price: 423.22 },
          { date: new Date(2014,11,23), price: 424.84 },
          { date: new Date(2014,11,22), price: 419.72 }
        ]
      },
      { 
        symbol: "NYN", 
        closes: [
          { date: new Date(2014,11,24), price: 16.82 },
          { date: new Date(2014,11,23), price: 16.12 },
          { date: new Date(2014,11,22), price: 15.77 }
        ]
      },
    ]
  }
];

Array.prototype.concatAllNested = function() {
  var results = [];
  
  this.forEach(function(subArray) {
    subArray.forEach(function(item) {
      results.push(item);
    });
  });
  
  return results;
};
//[1,2,3].map(function(num) { return num + 1; }) -> [2,3,4]
//[1,2].map(function(num) { return [num + 1, num + 2]; }) -> [[2,3],[3,4]]

var christmasEveCloses =
  exchangesNested.
    map(function(exchange) {
      return exchange.stocks.
        map(function(stock) {
          return stock.closes.
            filter(function(close) {
              return close.date.getMonth() === 11 &&
                close.date.getDate() === 24;
            }).
            map(function(close) {
              return {
                symbol: stock.symbol,
                price: close.price
              };            
            });
        }).
        concatAll();
    }).
    concatAll();

christmasEveCloses.forEach(function(christmasEveClose) {
  console.log(christmasEveClose);
});