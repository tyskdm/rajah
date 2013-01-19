/**
 * rajah.js : jasmine runner on google apps script main module.
 * @fileoverview jasmine runner on google apps script main module.
 *
 */

/**
 * @namespace rajah
 */
var rajah = (function () {
  /**
   * Main application should call this function in user-side doGet() function.
   * and should return results of this function.
   * @example
   * function doGet(e) {
   *   return rajah.doGet(e);
   * }
   * @param {object} Currently not in use. for future extention.
   */
  var doGet = function (e) {
    var app = UiApp.createApplication().setTitle("Rajah");
    {
      var panel = app.createVerticalPanel().setSize("100%","100%");
      {
        var label = app.createHTML('<span style="font-size: 160%">rajah</span> -- Jasmine runner for GAS')
        .setStyleAttributes({'padding-left': "10", 'padding-top': "8"});
        panel.add(label).setCellHeight(label, "40");
      
        var tabBar = app.createDecoratedTabBar().setSize("100%", "24");
        tabBar.addTab("jasmine").addTab("Logger")
        .selectTab(0);
        panel.add(tabBar).setCellHeight(tabBar, "24");

        var timeStamp = app.createHTML(Utilities.formatDate(new Date(), "PST", "yyyy.MM.dd HH:mm:ss")).setId("timeStamp")
        .setStyleAttributes({background:"#92c1f0", color: "white", 'text-align': "right", 'padding-right': "8"}).setWidth("100%-8");
        panel.add(timeStamp).setCellHeight(timeStamp, "3");
        
        var deckPanel = app.createAbsolutePanel().setSize("100%", "100%");
        {
          var jasmineScrollPanel = app.createScrollPanel().setSize("100%", "100%").setId("jasmineScrollPanel");
          {
            var jasmineLog = app.createHTML("--- jasmineLog ---").setId("jasmineLog")
            .setStyleAttributes({'padding-left': "8", 'padding-right': "8", 'padding-top': "4"})
            .setSize("100%-16","100%-4").setWordWrap(true);
            jasmineScrollPanel.add(jasmineLog);
          }
          deckPanel.add(jasmineScrollPanel, 0, 0);

          var loggerScrollPanel = app.createScrollPanel().setSize("100%", "100%").setId("loggerScrollPanel")
          .setVisible(false);
          {
            var loggerLog = app.createHTML("--- Logger.getLog() ---").setId("loggerLog")
            .setStyleAttributes({'padding-left': "8", 'padding-right': "8", 'padding-top': "4"})
            .setSize("100%-16","100%-4").setWordWrap(true);
            loggerScrollPanel.add(loggerLog);
          }
          deckPanel.add(loggerScrollPanel, 0, 0);


        }
        panel.add(deckPanel);

        var horizontalPanel = app.createHorizontalPanel().setSize("100%", "100%")
        .setStyleAttributes({'background': "#e0e0e0"});
        {
          horizontalPanel.add(app.createLabel("jasmine.version_ : " + jasmine.version_.major + '.' + jasmine.version_.minor + '.' + jasmine.version_.build)
          .setStyleAttributes({'text-align': "center", 'padding-left': "8", 'padding-top': "10"}));

          var handler = app.createServerHandler("rajah.executeByButton")
          .addCallbackElement(jasmineLog)
          .addCallbackElement(loggerLog)
          .addCallbackElement(timeStamp);
          
          var b = app.createButton("Execute jasmine", handler).setSize("94%", "30");
          horizontalPanel.add(b);
        }
        panel.add(horizontalPanel).setCellHeight(horizontalPanel, 38)

        tabBar.addSelectionHandler(
          app.createServerHandler("rajah.selectTab")
          .addCallbackElement(jasmineScrollPanel)
          .addCallbackElement(loggerScrollPanel)
        );

      }
      app.add(panel);
    }
    return app;
  };
  
  /**
   * UI-handler, select TabPanel.
   *
   */
  var selectTab = function (eventInfo) {
    var app = UiApp.createApplication(),
        jasmineScrollPanel = app.getElementById("jasmineScrollPanel"),
        loggerScrollPanel = app.getElementById("loggerScrollPanel");
    
    switch (eventInfo.parameter[eventInfo.parameter.source]) {
      case "0":
        jasmineScrollPanel.setVisible(true);
        loggerScrollPanel.setVisible(false);
        break;
      case "1":
        jasmineScrollPanel.setVisible(false);
        loggerScrollPanel.setVisible(true);
        break;
      default:
        break;
    }
    
    return app;
  };

  /**
   * UI-handler, set-up environment and execute jasmine.
   *
   */
  var executeByButton = function (eventInfo) {
    var app = UiApp.createApplication(),
        jasmineLog = app.getElementById("jasmineLog"),
        loggerLog = app.getElementById("loggerLog"),
        timeStamp = app.getElementById("timeStamp"),
        con = new rajah.Console(),
        log = "";
    
    executeJasmine(con.put);
    
    jasmineLog.setHTML(con.get());
    log = Logger.getLog().replace(/\n/g, "<br />") || "<< Logger.getLog() empty. >>";
    Logger.clear();
    loggerLog.setHTML(log);
    timeStamp.setHTML(Utilities.formatDate(new Date(), "PST", "yyyy.MM.dd HH:mm:ss"));

    return app;
  };


  /**
   * Called by Other script, execute jasmine.
   *
   */
  var executeByScript = function () {
    var con = new rajah.Console(true);
  
    executeJasmine(con.put);
    
    return con.get();
  };


  /**
   * execute jasmine.
   *
   */
  var executeJasmine = function (console) {

    var jasmineEnv = jasmine.getEnv();
    var ConsoleReporter = new jasmine.ConsoleReporter(console, (function () {}), true);
    jasmineEnv.addReporter(ConsoleReporter);

    rajah.dummyTimer.clear();
    
    jasmineEnv.execute();

    rajah.dummyTimer.execute();
  };

  var exports = {
    doGet: doGet,
    executeByButton: executeByButton,
    executeByScript: executeByScript,
    selectTab: selectTab
  };

  return exports;
})();





/**
 * rajah.dummyTimer
 *
 */


/*
 * Following four wrapper functions are interface for jasmine.
 * - jasmine needs timer functions to be in global object.
 * - HERE is global context for jasmine.js
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


/**
 * @namespace dummyTimer
 */
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
    // That's for keeping id unique, even if after timer cleared.
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
/**
 * rajah.Console
 *
 */
rajah.Console = function (ignoreColor) {
  var logHTML = "";
  var igColor = ignoreColor;
  var clearCode = "";

  this.put = function (message) {
    var str;
    
    message = message.replace(/\n/g, "<br />");
    
    str = message.match(/\033\[32m|\033\[31m|\033\[33m|\033\[0m/);
    while (str !== null) {
      switch (str[0]) {
        case ('\033[32m'): // green
          message = igColor ? message.replace(/\033\[32m/, '') : message.replace(/\033\[32m/, clearCode + '<span style="color: #00aa00">');
          clearCode = '</span>';
          break;
        case ('\033[31m'): // red
          message = igColor ? message.replace(/\033\[31m/, '') : message.replace(/\033\[31m/, clearCode + '<span style="color: #ff0000">');
          clearCode = '</span>';
          break;
        case ('\033[33m'): // yellow
          message = igColor ? message.replace(/\033\[33m/, '') : message.replace(/\033\[33m/, clearCode + '<span style="color: #dddd00">');
          clearCode = '</span>';
          break;
        case ('\033[0m'):  // none
          message = igColor ? message.replace(/\033\[0m/, '') : message.replace(/\033\[0m/, clearCode);
          clearCode = "";
          break;
        default:
          break;
      }
      str = message.match(/\033\[32m|\033\[31m|\033\[33m|\033\[0m/);
    }
    
    logHTML += message;
  };

  this.get = function () {
    return logHTML;
  };
  
  return this;
};
/**
 * Exports objects and functions of Rajah and Jasmine to outside Rajah.gs library. 
 * @fileoverview Exports objects and functions of Rajah and Jasmine to outside Rajah.gs library.
 */


/**
 * Exports Jasmine objects and functons to global object.
 * @param global {object} Global object of Rajah-user context.
 */
function init(global) {

  global.jasmine = jasmine;
  global.describe = describe;
  global.xdescribe = xdescribe;
  global.it = it;
  global.xit = xit;
  global.beforeEach = beforeEach;
  global.afterEach = afterEach;
  global.expect = expect;
  global.spyOn = spyOn;
  global.runs = runs;
  global.waits = waits;
  global.waitsFor = waitsFor;

//  global.setTimeout = setTimeout;
//  global.clearTimeout = clearTimeout;
//  global.setInterval = setInterval;
//  global.clearInterval = clearInterval;
}

/**
 * rajah.doGet(e) : for execute rajah as web service.
 * @param e {object} HTTP Get option
 * @returns app {object} UiApp
 */
function doGet(e) {
  return rajah.doGet(e);
}

/**
 * rajah.executeJasmine() : execute Jasmine by script for debug mode.
 */
function executeJasmine() {
  rajah.executeByScript();
}



