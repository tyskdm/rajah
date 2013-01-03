/**
 * Rajah.Timer
 *
 */
var RajahQue = [];

function RajahTimer_Clear() {
  RajahQue = [];
}

function RajahTimer_Execute() {
  var i, l, f;
  
  while (RajahQue.length > 0) {
    l=RajahQue.length;
    i=0;
    for (i=0; i<l; i++) {
      f = RajahQue.shift();
      f.func();
    }
  }
}

var setTimeout = function (f, t) {

  RajahQue.push({func: f});
  return RajahQue.length;
//  Utilities.sleep(t);
//  try {
//    f();
//  } catch (e) {
//    ;
//  }
};

var clearTimeout = function () {};

var setInterval = function () {};

var clearInterval = function () {};



