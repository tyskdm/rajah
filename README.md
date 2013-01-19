# Rajah

## What's rajah

1. [Jasmine](https://github.com/pivotal/jasmine/wiki) runner for [Google apps script](https://developers.google.com/apps-script/).

2. `Logger.log()` viewer.

- Sample GAS project using rajah is [here](https://script.google.com/d/1D6qmc_sIehOP-p6__Z29uSQTbGYrcTF0wXIwWgsD2Hba8Onjf6EWrRym/edit).

## Installation

**1. Import Rajah libraly.**

You can try Raja lib instantly:
- Project key = < Mn7JlN4wYLKUhi13E3mbpdVJodnbMh4p7 >
- Import that Project key into your project as a library.


**2. Add small code into your GAS project.**

```js
rajah.init(this);
function doGet(e) {
    return Rajah.doGet(e);
};
```

- `Rajah.init()` should be called **before** using jasmine(`describe()`, etc,..). 

**3. Deploy your GAS project as a web service.**

1. Save project and add version number ('File' menu > 'Manage version')
2. Deploy web service ('Publish' menu > 'Deploy as web app')

**4. Access web service.**

- **USE** web app URL for latest code, showed `Test web app for your latest code.`


### Create your own library (if you need)

1. Create Rajah lib project : create GAS project and put following three files in.
    1. rajah.gs : It's [here](https://github.com/tyskdm/rajah/blob/master/gs/rajah.gs). and it should be first file in your project. keep this order.
    2. jasmine.js : from github >> [here](https://github.com/pivotal/jasmine/blob/master/lib/jasmine-core/jasmine.js)
    3. ConsoleReporter.js : from github >> [here](https://github.com/pivotal/jasmine/blob/master/src/console/ConsoleReporter.js)

2. Import to your GAS project.


## Usage

**Sample project using Rajah lib. is [here](https://script.google.com/d/1D6qmc_sIehOP-p6__Z29uSQTbGYrcTF0wXIwWgsD2Hba8Onjf6EWrRym/edit).**


Tested functions are:

- `describe()` , `xdescribe()`
- `it()` , `xit()`
- `expect()`

Following methods have **not** been tested enough.

- `spyOn()`
- `run()`, `wait()`, `waitsFor()`


## Limitation

As you know, GAS doesn't provide following timer services.

- `setTimeout()`, `clearTimeout()`, `setInterval()`, `clearInteval()`

And jasmine use them, so Rajah has dummyTimer functions internaly based on `Utilities.sleep()`

But It's not clean way, so Rajah does not open these functions to global namespace.

If you need use them, access as follows:

````js
function setTimer(func, t) {
    return rajah.setTimer(func, t);
}
````


## Wish list

- Visual Reporter and Filter

- console.log >> http://minipaca.net/blog/javascript/firebug-console-api/

- Execute in debbug mode.

    - Execute from debbug main function (not by button)

    - Step by step console.log display


