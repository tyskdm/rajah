# Rajah

Rajah is a [Jasmine 2.0](https://github.com/pivotal/jasmine) spec runner for Node.js
and [Google apps script](https://developers.google.com/apps-script).

Want to use GAS-Library now? [Project key is here](#library-project-for-google-apps-script).



## Version info:

Version: 2.0.0

Stability: [3 - Stable](http://nodejs.org/api/documentation.html#documentation_stability_index)

Date: 2014-05-09

Changes:
- add tests for Google apps script library.
- small fix.



## What’s Rajah?

Rajah is a simple Jasmine spec runner, but has 3 faces.

1. Jasmine spec runner for **Node.js**.

2. Jasmine spec runner for **Google apps script**.

3. **Script Library** for Google apps script.

4. [www.google.com/search?tbm=isch&q=jasmine+rajah](http://www.google.com/search?tbm=isch&q=jasmine+rajah)

Rajah allows you to test Node.js project files in your command line shell. - (1)

And also allows to compile Node.js project files and spec files into one source file.
That source code is executable on Google apps script environment and run all specs like as on your PC. - (2)

Last face of Rajah is Google apps script Library. In this case, Rajah is a thin wrapper of Jasmine.
It’s almost same as Jasmine itself, but simple and easy to use. - (3)

Following sections explain those 3 ways to use Rajah / Jasmine 2.0.



## Jasmine spec runner for Node.js

Nothing special. It's simple and easy to use jasmine spec runner.


#### Install

```sh
$ npm install -g rajah
```


#### usage

```sh
$ rajah SPECS [ options ]
```

- **SPECS**<br/>
    Spec files or directories.

- **Options**

    - **-m RegExp / --match=RegExp**<br/>
        Only math files in SPECS directories are loaded to run.

    - **--color / --noColor**<br/>
        Use color to report.

    - **-o FILEPATH / --output=FILEPATH**<br/>
        Store result into the file.

    - **[Not implemented yet]** -r TYPE / --reporttype=TYPE<br/>
        It will be 'console' or 'junit'.


## Jasmine spec runner for Google apps script

This is for [codegs](https://github.com/tyskdm/codegs) user. Need understanding how `codegs` works first.
* [codegs](https://github.com/tyskdm/codegs) is a tool to develop Google apps script application using Node.js development tools.<br/>

Rajah execute codegs to pack your project and spec files with special `doGet` function.

This doGet function provides spec runner functionality.
You can kick `doGet` by web IDE, HTTP Request(need to publish as web service), or Other triggers.

For quick understanding, see this sample.

1. Access sample project as [web service](https://script.google.com/macros/s/AKfycbz_9m0u59d01xCk4UUvGDgTZqt3oY2G6kdSR5FVGXsSXh3yNm21/exec).

Or

1. Open [`gas-console`](https://script.google.com/macros/s/AKfycbzZaq3NPqMHYBno7ByxV-bpTbDt6EZ4M_5-kjYXXeQ9HI-k_w8/exec).

2. Open [sample project](https://script.google.com/d/1JRe4VsU9yLYMoQGDYALZN-uGQz7h9OeDGiqiTb7Oj3RVrqe8HuCVpZE7/edit) and run `doGet` function.



#### Install

Need to install into project’s local directory.

```sh
$ npm install rajah        // NO -g option.
```

When package.json exists, install with `--save-dev` option.

```sh
$ npm install --save-dev rajah
```


#### Usage

1. **Run Rajah in local Node.js environment**

    rajah command is in local node_modules/.bin directory.

    ```sh
    $ ./node_modules/.bin/rajah SPECS [ options ]
    ```

    This works as same as above section (Jasmine spec runner for Node.js).


2. **Compile with --codegs option switch**

    Then, add option switch `--codegs` and you see merged long source code in your terminal.

    `-o filepath` let Rajah to store source code in that file.

    ```sh
    $ ./node_modules/.bin/rajah SPECS [ options ]  --codegs -o out.js [ codegs-options ]
    ```


3. **Paste to Google apps script file**

    Create new project for unit testing and import `console` script library (Project key: MYBwh3izlQThbSz1-36mOjVJodnbMh4p7).

    Open `Code.gs` file and paste compiled code.



4. **Open console**

    Open [`gas-console`](https://script.google.com/macros/s/AKfycbzZaq3NPqMHYBno7ByxV-bpTbDt6EZ4M_5-kjYXXeQ9HI-k_w8/exec)
    in onother browser window. >> [more about gas-console](https://www.npmjs.org/package/gas-console)


5. **Run doGet function**

    Back to google IDE.

    On toolbar, select function `doGet` and press `Run` button.

    You see result in gas-console window.



#### Running mode of `doGet` function

`doGet` function is able to be kicked by 3 ways.

1. IDE Run / Debug button

    Explained in usage section is this pattern.


2. HTTP request

    This is for headless unit testing.

    - Deploy your unit testing project as a web service.

        1. Goto menu: `File` > `Manage versions...` and put version number.
        2. Goto menu: `Publish` > `Deploy as web app...` and get URL of `Latest code`.

    - Access that URL. When access by browser, result is displayed in the window.

    - It's possible to add option values as url query parameters.

        - Valid options: specs, showColor, match
        - ex.  script.google.com/xxxxxx/exec/**?sepcs=test/spec&showColor=true**


3. [NOT YET IMPLEMENTED] Timer or other triggers

    Time trrigered unit testing for health checking.

    `onComplete` option(see below) let you set any function to notify the result or store as you like.



#### Command line options for --codegs

```sh
$ ./node_modules/.bin/rajah SPECS [ options ]  --codegs -o out.js [ codegs-options ]
```

- **-o FILEPATH / --output=FILEPATH**

- **-p PACKAGEFILE / --package=PACKAGEFILE**<br/>
    Package file let rajah know which files should be packed for running specs on the GAS environment.

- **--stamp=STAMP_STRING**<br/>
    This STAMP_STRING will be sotred into compiled file.
    And rajah output STAMP_STRING before any report results when executed in GAS environment.

    This is for checking if the result of doGet access is exactly from this source code.


#### Execute options for doGet function

- Top of compiled file, config object is defined as below.

    ```js
    var rajahConfig = {
      "specs": [
        "test/jasmine/jasmine-spec.js"
      ],
      "match": null,
      "reportType": null,
      "showColor": true,
      "stamp": "Fri May 09 2014 14:51:44 GMT+0900 (JST)"
    };
    ```

- These values is handed to rajah by command line option when compile with `--codegs` option switch.

- You can chenge this as you like in GAS online IDE.

- When http-access, url query parameters overwrite this(specs will be added).





## Script Library for Google apps script

#### Project keys

- Project key: MW3WzHQgUPiNsCAKwIwmYtVJodnbMh4p7

- Console URL: https://script.google.com/macros/s/AKfycbzZaq3NPqMHYBno7ByxV-bpTbDt6EZ4M_5-kjYXXeQ9HI-k_w8/exec

- [Sample project using rajah](https://script.google.com/d/11kk1FVsxDD3FgcR2hNmmHeVwjqww055VYy6ZO7NnCJeyN2pGfYbbRw_0/edit)


#### Install

1. Open your apps script project.

2. Goto menu: `Resources` > `Libraries...`

3. Copy & paste project key(above) into `Find a Library` and press `Select` button.

4. `rajah` will be showed up. select version(chose latest one).

5. `Save` button.


#### Usage

1. **Write code**

    Here's First sample code. You need to call only 2 methods.

    ```js
    rajah.init(this);

    function MyFunction() {
        // Any spec-code
        describe("Rajah", function () {
            it("is the best friend of Jasmine.", function () {
                expect(rajah.rajah.hasOwnProperty('jasmine')).toBe(true);
            });
        });

        rajah.run();
    }
    ```

    Only 2 methods to call:

    1. **rajah.init(this)**<br/>
        At the top of sourcefile, call init method with `this` argument.<br/>
        rajah copy Jasmine-interface functions into `this` object. At the top of sourcefile, `this` points global scope.

    2. **rajah.run()**<br/>
        Execute Jasmine after setup any spec-code.<br/>
        Jasmine-interface functions setup spec-code but not execute at that timing. run method execute Jasmine.


2. **Run your function**

    On toolbar, select function you wrote. And then press `Run` or `Debug` button.<br/>
    You see result in [gas-console](https://script.google.com/macros/s/AKfycbzZaq3NPqMHYBno7ByxV-bpTbDt6EZ4M_5-kjYXXeQ9HI-k_w8/exec).

    - note: rajah itself is using gas-console. so you don't need import gas-console in your library.


#### Other Methods and Properties:

- **rajah.init(scopeObject)**

    It's necessary to call first. rajah will copy jasmine interface API's(describe, it,..) into scopeObject.

    'scopeObject' should be `this`(global object).


- **rajah.run(onComplete)**

    Run rajah and execute jasmine. By default, results are printed to gas-console.

    `onComplete` is callback function called with arguments below.
    ```js
    function onComplete(passed, specs, failures, pendings)
    ```

- **rajah.addReporter(reporter)**

    Just call jasmine original `addReporter`.


- **rajah.addConsoleReporter(showColor, print)**

    Instead of gas-console, rajah report to `print` function.
    ```js
    function print(string)
    ```

    - tips: `gas-console` use cache service of google apps script and it take time-cost.
      Using this method, you can change it faster on-memory console.

    ```js
    var resultString = '';

    rajah.addReporter(false, function (str) {
        resultSting += str;
    });

    rajah.run(function () {
        console.log(resultStr);
        // or Report anyway you like.
    });
    ```

- **rajah.jasmine**

    original `jasmine` object.
