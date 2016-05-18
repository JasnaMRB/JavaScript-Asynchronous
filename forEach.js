// for loop -> forEach loop
/* Worse performance than for loop but works with data that arrives asynchronously over time
*/

function getStockSymbolsForEach(stocks) {
    'use strict';
    var symbols = [];
    stocks.forEach(function (stock) {
        symbols.push(stock.symbol);
    });
    return symbols;
}

/* 
Array.map function works exactly the same way but with less code, also async
*/

function getStockSymbolsMap(stocks) {
    'use strict';
    return stocks.map(function (stock) {
        return stock.symbol;
    });
}

/*
To filter items in an array, use the Array.filter method, which accepts a predicate parameter (returns true or false)
*/


function getStocksOver(stocks, minPrice) {
    'use strict';
    return stocks.filter(function (stock) {
        return stock.price >= minPrice;
    });
}
/* Combining map and filter */

function filteredStockSymbols(stocks) {
    'use strict';
    return stocks.filter(function (stock) {
        return stock.price >= 150.00;
    }).
    map(function (stock) {
        return stock.symbol;
 });
}


/**
ConcatAll can be run on a nested array and returns each item in a new array of results. Not built in...
**/

Array.prototype.concatAll = function () {
    var results = [];
    this.forEach(function (subArray) {
        subArray.forEach(function (item) {
            results.push(item);
        });
    });
    return results;
}

var data = [
    { symbol: "XFX", price: 240.22, volume: 23432 },
    { symbol: "TNZ", price: 332.19, volume: 234 },
    { symbol: "JXJ", price: 120.22, volume: 5323 }
];

var exchanges = [
  [
      { symbol: "XFX", price: 240.22, volume: 23432 },
      { symbol: "TNZ", price: 332.19, volume: 234 }
    ],
  [
      { symbol: "JXJ", price: 120.22, volume: 5323 },
      { symbol: "NYN", price: 88.47, volume: 98275 }
    ]
];

var symbolsForEach = getStockSymbolsForEach(data);
var symbolsMap = getStockSymbolsMap(data);
var symbolsFilter = getStocksOver(data, 150.00);
var symbolsMappedFiltered =
    filteredStockSymbols(data);

var exchangesFlattened = exchanges.concatAll();

console.log("For each: ", JSON.stringify(symbolsForEach));
console.log("Map: ", JSON.stringify(symbolsMap));
console.log("Filter: ", JSON.stringify(symbolsFilter));
console.log("Filtered, mapped: ", JSON.stringify(symbolsMappedFiltered));
exchangesFlattened.forEach(function (stock) {
    console.log("Flattened: ", JSON.stringify(stock));
});
