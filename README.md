# Rajah
=====

## What's Rajah?

- Jasmine runner for Google apps script.
- Rajah open report window and execute button.


## Install Rajah.

1. Install Rajah libraly into your project.
- libraly code = <                         >

2. Add small code top of your source file.


Rajah.init(this);

function doGet(e) {
    return Rajah.doGet(e);
}


- Before using describe(), etc,.. Rajah.init() should be called.

3. Deploy web service.

- Save project and add version number ('File' menu > 'Manage version')
- Deploy web service ('Resource' menu > 'deploy')

- Need call function doGet() once.

4. Access URL.

- Latest code.


## Using Rajah.

1. Write spec & code.

2. 'Execute jasmine' Button.

3. You can see jasmine report & Logger.log text

4. Tested function

- describe() / xdescribe()
- it() / xit()
- expect()


## Limitation

1. Async test doesn't work.

- waitsFor()

2. Spies are not tested.

- spyOn()


## Wish list

- Visual Reporter and Filter

- console.log

- Execute in debbug mode.

-- Execute from debbug main function (not by button)

-- Step by step console.log display



