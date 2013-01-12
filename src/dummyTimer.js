/**
 * rajah.dummyTimer
 *
 */

var setTimeout = function (func, t) {
  return rajah.dummyTimer.setTimeout(func, t);
};

var clearTimeout = function (id) {
  rajah.dummyTimer.clearTimeout(id);
};

var setInterval = function (func, t) {
  return rajah.dummyTimer.setInterval(func, t);
};

var clearInterval = function (id) {
  rajah.dummyTimer.clearInterval(id);
};

rajah.dummyTimer = (function () {

  var idCounter = 0;
  var timerQue =[];
  
  var timerQue_ins_ = function (o) {
    var i;
    
    for (i = timerQue.length-1; i >= 0; i--) {
      if (timerQue[i].time > o.time) {
        continue;
      } else {
        break;
      }
    }
    // o should be inserted to next of 'i'.
    timerQue.splice(i+1, 0, o);
  };
  
  var timerQue_del_ = function (id) {
    var i;
    
    for (i = timerQue.length-1; i >= 0; i--) {
      if (timerQue[i].id == id) {
        timerQue.splice(i, 1);
        break;
      }
    }
  };
  
  var clear = function () {
    timerQue.length = 0;
    // idCounter is NOT initialised here.
    // That's for keeping id unique, although after timer cleared.
  };

  var execute = function () {
    
    // while task exists,
    while (timerQue.length > 0) {
      var now = new Date().getTime();
      
      if (now >= timerQue[0].time) {
        var o = timerQue.shift();
        o.func();
        if (o.interval > 0) {
          // Re-entry
          o.time += o.interval;
          timerQue_ins_(o);
        }
      } else {
        Utilities.sleep(timerQue[0].time - now);
      }
    }
  };
  
  var setTimeout = function (func, t) {
  
    var id = idCounter++;
  
    timerQue_ins_({
      id:       id,
      func:     func,
      time:     t + new Date().getTime(),
      interval: 0
    });

    return id;
  };
  
  var clearTimeout = function (id) {
    timerQue_del_(id);
  };
  

  var setInterval = function (func, t) {

    if (t <= 0) {
      return -1;    // Error: t should be ' > 0 '
    }

    var id = idCounter++;
  
    timerQue_ins_({
      id:       id,
      func:     func,
      time:     t + new Date().getTime(),
      interval: t
    });

    return id;
  };
  
  var clearInterval = function () {
    timerQue_del_(id);
  };

  
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
