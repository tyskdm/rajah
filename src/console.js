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
