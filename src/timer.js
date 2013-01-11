/**
 * Rajah.dummyTimer
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
};

var clearTimeout = function (id) {};

var setInterval = function (f, t) {};

var clearInterval = function (id) {};


Rajah.dummyTimer = (function () {

  var timerQue =[];
  var idCounter = 0;

  var clear = function () {
    timerQue.length = 0;
    // idCounter is NOT initialised here.
    // That's for keeping id unique, although after timer cleared.
  };

  var execute = function () {
    
    var now = new Date();

    // while task exists,
    while (timerQue.length > 0) {

      if (timerQue[0].time <= now) {
        timerQue[0].func();
        if (timerQue[0].t > 0) {
          // Re-entry (id, func, t)
          ;
        }
        timerQue.shift();   // delete entry that has been called.

      } else {
        // wait a while;
        sleep(timerQue[0].time - now);
      }
    }
  };
  
  var setTimeout = function (func, t) {
  
    var id = idCounter++;
  
    // not push. into order
    timerQue.push({
      id:       id,
      func:     func,
      time:     t + now,    // now should replace with like 'new Date'
      interval: 0
    });

    return id;
  };
  
  var clearTimeout = function () {};
  

  var setInterval = function (func, t) {

    if (t <= 0) {
      return -1;    // Error: t should be ' > 0 '
    }

    var id = idCounter++;
  
    // not push. into order
    timerQue.push({
      id:       id,
      func:     func,
      time:     t + now,    // now should replace with like 'new Date'
      interval: t
    });

    return id;
  };
  
  var clearInterval = function () {};

  
  var exports = {
    clear:          clear,
    execute:        execute,

    setTimeout:     setTimeout,
    clearTimeout:   clearTimeout,
    setInterval:    setInterval,
    clearInterval:  clearInterval,
  };
  return exports;

})();
