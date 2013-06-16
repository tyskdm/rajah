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
  return rajah.executeByScript();
}



