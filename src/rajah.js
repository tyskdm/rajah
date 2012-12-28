/**
 * Rajah.js : junsmine runner on google apps script.
 * @fileoverview jasmine runner on google apps script.
 *
 * todo: add function for debugger.
 *
 */

var Rajah = (function () {
  /**
   * Main application should call this function in main doGet() function.
   * and should return results of this function.
   *
   * @param {object} Currently not in use. for futhur extention.
   */
  var doGet = function (e) {
    var app = UiApp.createApplication().setTitle("Rajah");
    {
      var panel = app.createVerticalPanel().setSize("100%","100%");
      {
        var label = app.createHTML('<span style="font-size: 160%">Rajah</span> -- Jasmine runner for GAS')
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

          var handler = app.createServerHandler("Rajah.executeByButton")
          .addCallbackElement(jasmineLog)
          .addCallbackElement(loggerLog)
          .addCallbackElement(timeStamp);
          
          var b = app.createButton("Execute jasmine", handler).setSize("94%", "30");
          horizontalPanel.add(b);
        }
        panel.add(horizontalPanel).setCellHeight(horizontalPanel, 38)

        tabBar.addSelectionHandler(
          app.createServerHandler("Rajah.selectTab")
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
  function selectTab(eventInfo) {
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
  function executeByButton(eventInfo) {
    var app = UiApp.createApplication(),
        jasmineLog = app.getElementById("jasmineLog"),
        loggerLog = app.getElementById("loggerLog"),
        timeStamp = app.getElementById("timeStamp"),
        con = new Rajah.Console(),
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
  function executeByScript() {
    var con = new Rajah.Console(true);
  
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

    RajahTimer_Clear();
    
    jasmineEnv.execute();

    RajahTimer_Execute();
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
 * Rajah.Console
 *
 */
Rajah.Console = function (ignoreColor) {
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



