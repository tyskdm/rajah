/**
 * Rajah.js : junsmine runner on google apps script.
 * @fileoverview jasmine runner on google apps script.
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
    var app = UiApp.createApplication();
    
    var splitPanel = app.createSplitLayoutPanel().setSize("100%","100%");
  
    var vPanel = app.createVerticalPanel().setSize("100%","");
    var title = app.createHTML("<h2>[ jasmine console ]</h2>").setSize("100%","");
    vPanel.add(title);
    var text = app.createHTML("------").setSize("100%","").setId("text");
    vPanel.add(text);
  
    var scrollPanel = app.createScrollPanel().setSize("100%", "100%");
    scrollPanel.add(vPanel);
    
    var handler = app.createServerHandler("executeTrigger").addCallbackElement(text);
    var b = app.createButton("Execute jasmine", handler).setSize("100%", "30");
  
    splitPanel.addNorth(b, 38).setWidgetMinSize(b, 38);
    splitPanel.add(scrollPanel);
    app.add(splitPanel);
  
    return app;
  };
  
  /**
   * UI-handler, set-up environment and execute jasmine.
   *
   */
  var executeTrigger = function (eventInfo) {
    var app = UiApp.createApplication(),
        logText = "",
        consoleHTML = app.getElementById("text"),
        colorChanged = "";
  
    var console = function (message) {
      var str, clearCode = "";
      message = message.replace(/\n/g, "<br />");
  
      var str = message.match(/\033\[32m|\033\[31m|\033\[33m|\033\[0m/);
      while (str !== null) {
        switch (str[0]) {
          case ('\033[32m'): // green
            message = message.replace(/\033\[32m/, clearCode + '<span style="color: #00aa00">');
            clearCode = '</span>';
            break;
          case ('\033[31m'): // red
            message = message.replace(/\033\[32m/, clearCode + '<span style="color: #ff0000">');
            clearCode = '</span>';
            break;
          case ('\033[33m'): // yellow
            message = message.replace(/\033\[32m/, clearCode + '<span style="color: #dddd00">');
            clearCode = '</span>';
            break;
          case ('\033[0m'):  // none
            message = message.replace(/\033\[0m/, clearCode);
            clearCode = "";
            break;
          default:
            break;
        }
        str = message.match(/\033\[32m|\033\[31m|\033\[33m|\033\[0m/);
      }
  
      logText += message;
      consoleHTML.setHTML(logText);
    };
  
    executeJasmine(console);
    
    return app;
  };

  var executeJasmine = function (console) {

    var jasmineEnv = jasmine.getEnv();
    var ConsoleReporter = new jasmine.ConsoleReporter(console, (function (r) { }), true);
    jasmineEnv.addReporter(ConsoleReporter);
    
    jasmineEnv.execute();
  
    return true;
  };

  var exports = {
    doGet: doGet
  }

  return exports;
})();


function setTimeout(f, t) {
  Utilities.sleep(t);
  f();
}

function clearTimeout() {}

function setInterval() {}

function clearInterval() {}


