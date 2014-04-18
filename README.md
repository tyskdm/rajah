# Rajah

Rajah is a [Jasmine 2.0](https://github.com/pivotal/jasmine) spec runner for Node.js
and [Google apps script](https://developers.google.com/apps-script).

Want to use GAS-Library now? [Here’s project key](#library-project-for-google-apps-script).



## Version info:

#### Rajah 2 v0.2.0 (development version) : branch [`Release/2.x`](https://github.com/tyskdm/rajah/tree/Release/2.x) (`master`)

* new release for Jasmine 2.0
* [Stability: 2 - Unstable](http://nodejs.org/api/documentation.html#documentation_stability_index)

##### r2 v0.2.0

date: 2014-04-18

changes:
- add auto test on Google apps script: pack with --codegs, upload to google, and get result via doGet function.
- cli: implement --output
- cli: fix --noColor


#### Rajah v1.00b (stable version) : branch [`Release/1.0`](https://github.com/tyskdm/rajah/tree/Release/1.0)

* Jasmine 1.3
* Only Google apps script Library.



## What’s Rajah?

Rajah is a simple Jasmine spec runner, but has 3 faces.

1. Jasmine spec runner for **Node.js**.

2. Jasmine spec runner for **Google apps script**.

3. **Library project** for Google apps script.

4. www.google.com/search?tbm=isch&q=rajah+jasmine

Rajah allows you to test Node.js project files in your PC’s command line shell. - (1)

And also allows to pack Node.js module files and spec files into one source file.
That source code is executable on Google apps script environment and run all specs as same as on your PC. - (2)

Last face of Rajah is Google apps script Library. In this case, Rajah is a thin wrapper of Jasmine.
It’s almost same as Jasmine itself, but simple and easy to use. - (3)

Following sections explain those 3 ways to use Rajah / Jasmine 2.0.



## Jasmine spec runner for Node.js

Nothing special. It's simple jasmine spec runner.


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
        Use color to report results.

    - **-o FILEPATH / --output=FILEPATH**<br/>
        Store result into that file.

    - **Not implemented yet** : -r TYPE / --reporttype=TYPE<br/>
        It will be 'console' or 'junit'.


## Jasmine spec runner for Google apps script

This is for [codegs](https://github.com/tyskdm/codegs) user. Need understanding how `codegs` works first.
* [codegs](https://github.com/tyskdm/codegs) is a tool to develop Google apps script application using Node.js development tools.<br/>

Rajah execute codegs to pack your project and spec files with special `doGet` spec runner function.
You can kick `doGet` by web IDE, HTTP Request(need to publish as web service), or Other triggers.

For quick understanding, see this sample.

1. Open [`gas-console`](https://script.google.com/macros/s/AKfycbzZaq3NPqMHYBno7ByxV-bpTbDt6EZ4M_5-kjYXXeQ9HI-k_w8/exec).

2. Open [sample project](https://script.google.com/d/1JRe4VsU9yLYMoQGDYALZN-uGQz7h9OeDGiqiTb7Oj3RVrqe8HuCVpZE7/edit) and run `doGet` function.

3. Or access sample project as [web service](https://script.google.com/macros/s/AKfycbz_9m0u59d01xCk4UUvGDgTZqt3oY2G6kdSR5FVGXsSXh3yNm21/exec).

Source files are in 'test/case-04'.



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

    `-o filepath` let Rajah to store source code in the file.

    ```sh
    $ ./node_modules/.bin/rajah SPECS [ options ]  --codegs -o out.js [ codegs-options ]
    ```


3. **Paste to Google apps script file**

    Create new project for unit testing and open `Code.gs` file. Then paste into that file.


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

    This is challenge to headless unit testing. (not complete)

    - Deploy as web service your unit testing project.

        1. Goto menu: `File` > `Manage versions...` and put version number.
        2. Goto menu: `Publish` > `Deploy as web app...` and get URL of `Latest code`.

    - Access that URL. When access by browser, result is displayed in the window.

    - It's possible to add option values as url query parameters.

        - Valid options: specs, showColor, match
        - ex.  script.google.com/xxxxxx/exec/**?sepcs=test/spec&showColor=true**


3. Timer or other triggers

    Time trrigered unit testing for health checking.

    `onComplete` option(see below) let you set any function to notify the result or store as you like.


#### Execute options for doGet function


**TO BE FILLED LATER**


#### Command line options for --codegs

```sh
$ ./node_modules/.bin/rajah SPECS [ options ]  --codegs -o out.js [ codegs-options ]
```

- `-o FILEPATH / --output=FILEPATH`

- `-p PACKAGEFILE / --package=PACKAGEFILE`


#### Tips

- Minimize file size




## Library project for Google apps script

#### Project keys

**Rajah 2 v0.1.0**

- Project key: MW3WzHQgUPiNsCAKwIwmYtVJodnbMh4p7
- Console URL: https://script.google.com/macros/s/AKfycbzZaq3NPqMHYBno7ByxV-bpTbDt6EZ4M_5-kjYXXeQ9HI-k_w8/exec
- [Sample project using rajah](https://script.google.com/d/11kk1FVsxDD3FgcR2hNmmHeVwjqww055VYy6ZO7NnCJeyN2pGfYbbRw_0/edit)

**Rajah v1.00b**

- Project key: Mn7JlN4wYLKUhi13E3mbpdVJodnbMh4p7
- [Sample project using rajah](https://script.google.com/d/1D6qmc_sIehOP-p6__Z29uSQTbGYrcTF0wXIwWgsD2Hba8Onjf6EWrRym/edit)
- [Sample's published web page](https://script.google.com/macros/s/AKfycbz5tA3qJOgNHU9M8pSM7hLHO76pg8A3mx_b7bqziHIpSCwXWus/exec)

Following section explains usage of Rajah 2.<br/>
For v1.00b, See [README.md for v0.100b]().


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
    You see result in console window.



#### Methods and Properties:

- rajah.init(scopeObject)


- rajah.run(onComplete)


- rajah.addReporter(reporter)


- rajah.addConsoleReporter(showColor, print)


- rajah.jasmine
