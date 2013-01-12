# Rajah

## What's Rajah?

- Jasmine runner for Google apps script.

- `Logger.log()` viewer.


## Installation

**1. Install Rajah libraly into your project.**

- libraly code = <                         >

**2. Add small code into your source file.**

```js
    Rajah.init(this);
    function doGet(e) {
        return Rajah.doGet(e);
    };
```

- `Rajah.init()` should be called **before** using jasmine(`describe()`, etc,..). 

**3. Deploy your project as a web service.**

1. Save project and add version number ('File' menu > 'Manage version')
2. Deploy web service ('Resource' menu > 'deploy')

* Need call function doGet() once.

**4. Access URL.**

- Latest code.


## Usage

Tested function

- `describe()` , `xdescribe()`
- `it()` , `xit()`
- `expect()`

Spies and async methods have **not** been tested enough.

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

- console.log [Sample](http://minipaca.net/blog/javascript/firebug-console-api/)

- Execute in debbug mode.

    - Execute from debbug main function (not by button)

    - Step by step console.log display


