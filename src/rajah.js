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
          horizontalPanel.add(app.createLabel("jasmine.version : " + jasmine.getEnv().versionString())
          //horizontalPanel.add(app.createLabel("jasmine.version : " + jasmine.version_.major + '.' + jasmine.version_.minor + '.' + jasmine.version_.build)
          .setStyleAttributes({'text-align': "center", 'padding-left': "8", 'padding-top': "10"}));

          var handler = app.createServerHandler("executeByButton")
          .addCallbackElement(jasmineLog)
          .addCallbackElement(loggerLog)
          .addCallbackElement(timeStamp);

          var b = app.createButton("Execute jasmine", handler).setSize("94%", "30");
          horizontalPanel.add(b);
        }
        panel.add(horizontalPanel).setCellHeight(horizontalPanel, 38)

        tabBar.addSelectionHandler(
          app.createServerHandler("selectTab")
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



function executeByButton () {
  return rajah.executeByButton();
}

function selectTab (eventInfo) {
  return rajah.selectTab(eventInfo);
}
