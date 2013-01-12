# Rajah

## What's Rajah?

- Jasmine runner for Google apps script.

- `Logger.log()` viewer.


## Installation

**1. Create and Install Rajah libraly.**

1. Create rajah.gs : `sh build.sh` >> ./gs/rajah.gs

2. Create Rajah lib project : need rajah.gs and two jasmine source file, jasmine.js and ConsoleReporter.js

3. Import to your GAS project.

- You can try Raja lib instantly, Project key = < Mn7JlN4wYLKUhi13E3mbpdVJodnbMh4p7 >

**2. Add small code into your GAS project.**

```js
Rajah.init(this);
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


## Usage

- Sample project using Rajah lib. is [here](https://script.google.com/d/1D6qmc_sIehOP-p6__Z29uSQTbGYrcTF0wXIwWgsD2Hba8Onjf6EWrRym/edit).

- and Rajah URL is [here](https://script.google.com/macros/s/AKfycbywg8Pk94M5rn_h0sWFkKKJ2SOZQAE4FNqfdUlHQ20/dev).


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
    return Rajah.setTimer(func, t);
}
````


## Wish list

- Visual Reporter and Filter

- console.log >> http://minipaca.net/blog/javascript/firebug-console-api/

- Execute in debbug mode.

    - Execute from debbug main function (not by button)

    - Step by step console.log display


