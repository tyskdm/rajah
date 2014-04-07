
describe("rajahApp:", function () {

    var path =   require('path');
    var rajahApp = require('../../src/rajahApp.js');
    var MockFs = require('../mock/mockfs.js');

    beforeEach(function () {
        // ;
    });

    describe("'rajahApp' itself:", function () {
        it("should be constractor.", function () {
            expect(typeof rajahApp).toBe('function');
        });
    });

    describe("Method create:", function () {
        var DEFAULT_CONFIG = {
                rootdir:      null,
                specs:        null,
                match:        null,
                packagefile:  null,
                reportType:   null,
                showColor:    null,
                output:       null,
                codegs:       null
            },
            DUMMY_CONFIG = {
                rootdir:      '/project'
            },
            ADDED_CONFIG = {
                rootdir:      '/project',

                specs:        null,
                match:        null,
                packagefile:  null,
                reportType:   null,
                showColor:    null,
                output:       null,
                codegs:       null
            };

        it("creates new rajahApp object.", function () {
            expect(rajahApp.create() instanceof rajahApp).toBe(true);
        });

        it("should return default values when argument not exists.", function () {
            var rajah = rajahApp.create();
            expect(rajah.config).toEqual(DEFAULT_CONFIG);
        });

        it("should set config-info into object", function () {
            var rajah = rajahApp.create(DUMMY_CONFIG);
            expect(rajah.config).toEqual(ADDED_CONFIG);
        });
    });

    describe("Method addConfig:", function () {
        var DEFAULT_CONFIG = {
                rootdir:      null,
                specs:        null,
                match:        null,
                packagefile:  null,
                reportType:   null,
                showColor:    null,
                output:       null,
                codegs:       null
            },
            ADDITIONAL_CONFIG = {
                rootdir:      '/project',
                specs:        ['spec'],
                match:        ['Spec.js'],
                packagefile:  '/package.json',
                reportType:   'console',
                showColor:    true,
                output:       ['out.js'],
                codegs:       ['code.gs']
            },
            ADDED_CONFIG = {
                rootdir:      '/project',
                specs:        ['spec', 'spec'],
                match:        ['Spec.js', 'Spec.js'],
                packagefile:  '/package.json',
                reportType:   'console',
                showColor:    true,
                output:       ['out.js'],
                codegs:       ['code.gs']
            };

        it("should set config values.", function () {
            var rajah = rajahApp.create();
            expect(rajah.config).toEqual(DEFAULT_CONFIG);
            rajah.addConfig(ADDITIONAL_CONFIG);
            expect(rajah.config).toEqual(ADDITIONAL_CONFIG);
            rajah.addConfig(ADDITIONAL_CONFIG);
            expect(rajah.config).toEqual(ADDED_CONFIG);
        });
    });

    describe("Method setup:", function () {

        describe("should set default config values:", function () {
            var DEFAULT_CONFIG = {
                    rootdir:      null,
                    specs:        null,
                    match:        null,
                    packagefile:  null,
                    reportType:   null,
                    showColor:    null,
                    output:       null,
                    codegs:       null
                },
                MATCH_PATTERN = {
                    match:        [ 'Spec\\.js$' ]
                },
                CWD = process.cwd();

            it("case#1: not added config.match.", function () {
                var rajah = rajahApp.create();
                expect(rajah.config).toEqual(DEFAULT_CONFIG);

                rajah.setup();
                expect(rajah.config.rootdir).toEqual(CWD);
                expect(rajah.matchPattern).toEqual([ /.+\.js$/i ]);
            });

            it("case#2: added config.match pattern.", function () {
                var rajah = rajahApp.create();
                expect(rajah.config).toEqual(DEFAULT_CONFIG);

                rajah.addConfig(MATCH_PATTERN);
                rajah.setup();
                expect(rajah.config.rootdir).toEqual(CWD);
                expect(rajah.matchPattern).toEqual([/Spec\.js$/i]);
            });
        });
    });

    describe("Methods addSpecFiles:", function () {

        describe("Private Method _addIgnoreFilepath:", function () {

            it("add ignore filepath into rajahApp object.", function () {
                var rajah = rajahApp.create();
                expect(rajah.ignoreFilepath).toEqual([]);

                rajah._addIgnoreFilepath('/main.js');

                expect(rajah.ignoreFilepath).toEqual(['/main.js']);
            });
        });

        describe("Private Method _isIgnoreFile:", function () {

            it("case#1 : should return true when match ignoreFile.", function () {
                var rajah = rajahApp.create();
                expect(rajah._isIgnoreFile('/spec/main.js', true)).toBe(false);

                rajah._addIgnoreFilepath('/spec/main.js');
                expect(rajah._isIgnoreFile('/spec/main.js', true)).toBe(true);
            });

            it("case#2 : should return false when unmatch ignore pattern.", function () {
                var rajah = rajahApp.create();
                expect(rajah._isIgnoreFile('/spec/main.js', true)).toBe(false);

                rajah._addIgnoreFilepath('/spec/main.json');
                expect(rajah._isIgnoreFile('/spec/main.js', true)).toBe(false);
            });
        });

        describe("Private Method _addMatchPattern:", function () {

            it("add match pattern into rajahApp object.", function () {
                var rajah = rajahApp.create();
                expect(rajah.matchPattern).toEqual([]);

                rajah._addMatchPattern( '.+\\.js$' );

                expect(rajah.matchPattern).toEqual([ /.+\.js$/i ]);
            });
        });

        describe("Private Method _isMatchPattern:", function () {

            it("case#1 : should return true when match pattern.", function () {
                var rajah = rajahApp.create();

                rajah._addMatchPattern('Spec\\.js$');
                expect(rajah._isMatchPattern('/mainSpec.js')).toBe(true);
                expect(rajah._isMatchPattern('/project/lib/mainSpec.js')).toBe(true);
            });

            it("case#2 : should return false when unmatch pattern.", function () {
                var rajah = rajahApp.create();

                rajah._addMatchPattern('Spec\\.js$');
                expect(rajah._isMatchPattern('/main.js')).toBe(false);
                expect(rajah._isMatchPattern('/project/lib/main.js')).toBe(false);
            });

            it("case#3 : should return false when pattern isn't set.", function () {
                var rajah = rajahApp.create();

                expect(rajah._isMatchPattern('/main.js')).toBe(false);
            });
        });

        describe("Static private Method _addFilesToList:", function () {

            it("case#1 : add files in ./core directory.", function () {
                var mockfs = new MockFs({
                    '/project/core/process.js':     { type: 'file'},
                    '/project/core/Buffer.json':    { type: 'file'}
                });

                var list = [];
                var rajah = rajahApp.create();
                rajah.setup();

                var err = rajah._addFilesToList(list, '/project/core', mockfs);

                expect(err).toBeNull();
                expect(list).toEqual(['/project/core/process.js']);
            });

            it("case#2 : add files from empty directory.", function () {
                var mockfs = new MockFs({
                    '/project/core':  { type: 'dir'}
                });

                var list = [];
                var rajah = rajahApp.create();
                rajah.setup();

                var err = rajah._addFilesToList(list, '/project/core', mockfs);

                expect(err).toBeNull();
                expect(list).toEqual([ /* empty */ ]);
            });

            it("case#3 : add files in ./core nested directory.", function () {
                var mockfs = new MockFs({
                    '/project/core/process.js':         { type: 'file'},
                    '/project/core/lib/Buffer.json':    { type: 'file'},
                    '/project/core/lib/sub/a.js':       { type: 'file'}
                });

                var list = [];
                var rajah = rajahApp.create();
                rajah.setup();

                var err = rajah._addFilesToList(list, '/project/core', mockfs);

                expect(err).toBeNull();
                expect(list).toEqual([
                    '/project/core/process.js',
                    '/project/core/lib/sub/a.js'
                ]);
            });

            it("case#4 : do nothing when directory not exists.", function () {
                var mockfs = new MockFs({
                    // empty.
                });

                var list = [];
                var rajah = rajahApp.create();
                rajah.setup();

                var err = rajah._addFilesToList(list, '/project/core', mockfs);

                expect(err).toBe("Error: File or Directory not Exists. '/project/core'");
                expect(list).toEqual([
                    // empty.
                ]);
            });
        });

        describe("Method addSpecFiles:", function () {

            it("case#1 : add all files in ./ directory.", function () {
                var mockfs = new MockFs({
                    '/project/modules/tool.js':     { type: 'file'},
                    '/project/modules/util.js':     { type: 'file'},
                    '/project/lib.js':              { type: 'file'},
                    '/project/index.js':            { type: 'file'}
                });
                var rajah = rajahApp.create({
                        rootdir:    '/project',
                        specs:      ['./']
                    });
                var err = null;
                err = rajah.setup(mockfs);
                expect(err).toBeNull();

                err = rajah.addSpecFiles(mockfs);
                expect(err).toBeNull();
                expect(rajah.files.specfiles).toEqual([
                    '/project/modules/tool.js',
                    '/project/modules/util.js',
                    '/project/lib.js',
                    '/project/index.js'
                ]);
            });

            it("case#2 : add files only in ./lib ./bin directory.", function () {
                var mockfs = new MockFs({
                    '/project/modules/tool.js':     { type: 'file'},
                    '/project/lib/module.js':       { type: 'file'},
                    '/project/bin/cli.js':          { type: 'file'},
                    '/project/index.js':            { type: 'file'}
                });
                var rajah = rajahApp.create({
                        rootdir:    '/project',
                        specs:      ['lib', 'bin']
                    });
                var err = null;
                err = rajah.setup(mockfs);
                expect(err).toBeNull();

                err = rajah.addSpecFiles(mockfs);
                expect(err).toBeNull();
                expect(rajah.files.specfiles).toEqual([
                    '/project/lib/module.js',
                    '/project/bin/cli.js'
                ]);
            });

            it("case#3 : Sourcefile not specified.", function () {
                var mockfs = new MockFs({
                    '/project/modules/tool.js':     { type: 'file'},
                    '/project/modules/util.js':     { type: 'file'},
                    '/project/index.js':            { type: 'file'}
                });
                var rajah = rajahApp.create({
                        rootdir:    '/project'
                    });
                var err = null;
                err = rajah.setup(mockfs);
                expect(err).toBeNull();

                err = rajah.addSpecFiles(mockfs);
                expect(err).toBeNull();
                expect(rajah.files.specfiles).toEqual([
                    // empty.
                ]);
            });
        });
    });
});
