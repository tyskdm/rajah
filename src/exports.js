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
  global.it = it;
  global.beforeEach = beforeEach;
  global.afterEach = afterEach;
  global.expect = expect;
  global.spyOn = spyOn;
  global.xdescribe = xdescribe;
  global.xit = xit;
  global.runs = runs;
  global.waitsFor = waitsFor;
}

/**
 * Rajah.doGet(e) : for execute Rajah as web service.
 * @param e {object} HTTP Get option
 * @returns app {object} UiApp
 */
function doGet(e) {
  return Rajah.doGet(e);
}

/**
 * Rajah.executeJasmine() : execute Jasmine by script for debug mode.
 */
function executeJasmine() {
  Rajah.executeByScript();
}



