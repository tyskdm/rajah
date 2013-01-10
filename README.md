# Rajah

[Development version](https://script.google.com/macros/s/AKfycbyHks7gWzANG1pBkrifXC4scyY1aHrlv1pBrf_gvizN/dev)


## What's Rajah?

- Jasmine runner for Google apps script.

// - Rajah also provides log console.


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

Spies have **not** tested enough.

- `spyOn()`


## Limitation

**Async test doesn't work.**

- `run()`, `wait()`, `waitsFor()`



## Wish list

- Visual Reporter and Filter

- console.log [Sample](http://minipaca.net/blog/javascript/firebug-console-api/)

- Execute in debbug mode.

  - Execute from debbug main function (not by button)

  - Step by step console.log display


