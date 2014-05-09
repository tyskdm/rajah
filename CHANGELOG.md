#### v2.0.1:
date: 2014-05-09

[Stability: 3 - Stable](http://nodejs.org/api/documentation.html#documentation_stability_index)

changes:
- add tests for Google apps script library.
- small fix.
- gruntfile: add deploy task.

date: 2014-05-07

[Stability: 2 - Unstable](http://nodejs.org/api/documentation.html#documentation_stability_index)

changes:
- doGet: add more error handling. doget returns detail error information.
- add tests for doget.
- modify Gruntfile:check-result task to test doget results.

date: 2014-04-24

[Stability: 2 - Unstable](http://nodejs.org/api/documentation.html#documentation_stability_index)

changes:
- cli/doGet: add `--stamp` option that allows to check if result of http access is created correct source code.
- rajah-core: add 'dumbReporter' for jasmine to let 'onComplete' callback function gets arguments about spec results.
- add tests and fix bugs.

date: 2014-04-18

[Stability: 2 - Unstable](http://nodejs.org/api/documentation.html#documentation_stability_index)

changes:
- add grunt: jshint - static checks, rajah - spec check, nodeunit - behavior check
- add auto test on Google apps script: pack with --codegs, upload to google, and get result via doGet function.
- cli: implement --output
- cli: fix --noColor
- other issues.


#### r2 v0.1.0:
date: 2014-04-09

[Stability: 1 - Experimental](http://nodejs.org/api/documentation.html#documentation_stability_index)

changes:
