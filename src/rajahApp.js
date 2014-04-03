
var minimatch = require('minimatch');
var path =  require('path');

var joinPath = (function () {
    var _join = path.join;
    return function (base, request) {
        return _join(base, request).replace(/\\/g, '/');
    };
})();


function RajahApp(config) {

    this.rajah = require('./rajah.js');

    this.config = {
        rootdir:    null,
        specs:      null,
        match:      null,
        helpers:    null,
        reportType: null,   // 'console' or 'onMemory'
        showColor:  null,
        output:     null,
        codegs:     null
    };

    this.files = {
        specfiles:  [],
        helpers:    []
    };

    this.ignoreFilepath = [];
    this.matchPattern= [];
    this.reportContent = '';

    this.output = function (passed) {
        this.output.apply(this, arguments);
    };

    if (config) {
        this.addConfig(config);
    }
}

RajahApp.create = function (config) {
    return new RajahApp(config);
};

RajahApp.prototype.addConfig = function (config) {

    if (config.rootdir) {
        this.config.rootdir = config.rootdir;
    }

    if (config.specs) {
        if (this.config.specs === null) {
            this.config.specs = [];
        }
        this.config.specs = this.config.specs.concat(config.specs);
    }

    if (config.match) {
        if (this.config.match === null) {
            this.config.match = [];
        }
        this.config.match = this.config.match.concat(config.match);
    }

    if (config.helpers) {
        if (this.config.helpers === null) {
            this.config.helpers = [];
        }
        this.config.helpers = this.config.helpers.concat(config.helpers);
    }

    if (config.reportType) {
        this.config.reportType = config.reportType;
    }

    if (typeof config.showColor !== 'undefined') {   // showColor is boolean.
        this.config.showColor = config.showColor;
    }

    if (config.output) {
        this.config.output = config.output;
    }


    if (config.codegs) {
        this.config.codegs = config.codegs;
    }

    return null;
};


RajahApp.prototype.run = function () {
    var error = null;

    if (this.config.codegs === null) {
        error = this.runJasmine();
    } else {
        error = this.runCodegs();
        // console.log('runCodegs not yet impremented.');
    }

    return error;
};

RajahApp.prototype.runJasmine = function () {
    var steps = [
            this.setup,
            this.addSpecFiles,
            this.executeJasmine
        ],
        error = null;

    for (var i = 0; (i < steps.length) && (error === null); i++) {
        error = steps[i].apply(this);
    }
    return error;
};

RajahApp.prototype.runCodegs = function () {
    var steps = [
            this.setup,
            this.addSpecFiles,
            this.executeCodegs
        ],
        error = null;

    for (var i = 0; (i < steps.length) && (error === null); i++) {
        error = steps[i].apply(this);
    }
    return error;
};

RajahApp.prototype.setup = function (mockfs) {
    // var fs = mockfs || require('fs');

    if (this.config.rootdir === null) {
        this.config.rootdir = process.cwd();
    }

    if (this.config.match !== null) {
        for (var i = 0; i < this.config.match.length; i++) {
            this._addMatchPattern('**/' + this.config.match[i]);
        }
    } else {
        this._addMatchPattern('**/*.js');
    }

    return null;
};

RajahApp.prototype.addSpecFiles = function (mockfs) {

    if (this.config.specs === null) {
        this.config.specs = [];
    }

    var i, specfile, error = null;
    for (i = 0; i < this.config.specs.length; i++) {
        specfile = joinPath(this.config.rootdir, this.config.specs[i]);
        error = this._addFilesToList(this.files.specfiles, specfile, mockfs);

        if (error === null) {
            specfile = specfile.slice(-1) === '/' ? specfile.slice(0, -1) : specfile;
            this._addIgnoreFilepath(specfile);
        } else {
            break;
        }
    }
    return error;
};

RajahApp.prototype.executeJasmine = function (mockfs) {
    // var fs = mockfs || require('fs');

    this.rajah.setup(global);
    global.jasmine = this.rajah.jasmine;

    if (this.config.reportType === 'onMemory') {
        var THIS = this;
        var print = function() {
            for (var i = 0, len = arguments.length; i < len; ++i) {
                THIS.reportContent += arguments[i];
            }
        };
        this.rajah.addConsoleReporter(this.config.showColor, print);
    }

    for (var i = 0; i < this.files.helpers.length; i++) {
        require(this.files.helpers[i]);
    }

    for (var j = 0; j < this.files.specfiles.length; j++) {
        require(this.files.specfiles[j]);
    }

    this.rajah.run();

    return null;
};

RajahApp.prototype.executeCodegs = function (mockfs) {
    var fs = mockfs || require('fs');

    var packageJson = joinPath(this.config.rootdir, './package.json');
    if ( ! fs.existsSync(packageJson)) {
        packageJson = null;
    }

    // Create configure Application.
    var codegs = require('codegs');
    var code = codegs.create();
    var error;

    var rajahFiles = [];

    var rajahSource = [
        '../src/rajah.js',
        '../src/rajahApp.js',
        '../src/timers.js'
    ];
    for (var i = 0; i < rajahSource.length; i++) {
        rajahFiles.push(joinPath(__dirname, rajahSource[i]));
    }

    var node_modules = [
        'minimatch/package.json',
        'minimatch/minimatch.js',
        'minimatch/node_modules/lru-cache/package.json',
        'minimatch/node_modules/lru-cache/lib/lru-cache.js',
        'minimatch/node_modules/sigmund/package.json',
        'minimatch/node_modules/sigmund/sigmund.js',
        'jasmine-core/lib/jasmine-core/jasmine.js',
        'jasmine-core/lib/console/console.js'
    ];
    for (var j = 0; j < node_modules.length; j++) {
        rajahFiles.push(joinPath(__dirname + '/../node_modules', node_modules[j]));
    }



    if (packageJson) {
        error = code.loadPackageJson(packageJson);
        if (error) return error;
    }

    // all options should be fully resolved path.
    // and be possibly using platform path delimiter('\').
    var config = {
        rootdir:    this.config.rootdir,

        mainfile:   require.resolve('./doGet.js'),

        source:     this.files.specfiles
                    .concat(this.files.helpers)
                    .concat(rajahFiles),

        output:     this.config.codegs || null,

        core:       code.config.core ?
                        null : path.resolve(__dirname, '../node_modules/codegs-core/code/gas'),

        node_core:  code.config.node_core ?
                        null : path.resolve(__dirname, '../node_modules/codegs-core/node/v0.10.26'),

        kernel:     null
    };

    error = code.addConfig(config);
    if (error) return error;

    error = code.run();
    if (error) return error;

    return null;
};

RajahApp.prototype.getReport = function () {
    return this.reportContent;
};

RajahApp.prototype.output = function (passed, mockfs) {
    var fs = mockfs || require('fs');

    if (this.config.output) {
        try {
            fs.writeFileSync(this.config.output, this.content);
        } catch(e) {
            return 'Error: ' + e;
        }
        return null;
    }

    return this.content;
};


RajahApp.prototype._addIgnoreFilepath = function (filepath) {
    this.ignoreFilepath.push(filepath);
};

RajahApp.prototype._isIgnoreFile = function (file) {
    for (var i = 0; i < this.ignoreFilepath.length; i++) {
        if (file === this.ignoreFilepath[i]) {
            return true;
        }
    }
    return false;
};

RajahApp.prototype._addMatchPattern = function (pattern) {
    this.matchPattern.push(pattern);
};

RajahApp.prototype._isMatchPattern = function (file) {
    for (var j = 0; j < this.matchPattern.length; j++) {
        if (minimatch(file, this.matchPattern[j])) {
            return true;
        }
    }
    return false;
};

RajahApp.prototype._addFilesToList = function (list, source, mockfs) {
    var fs = mockfs || require('fs');

    if (this._isIgnoreFile(source)) {
        return null;
    }

    if ( ! fs.existsSync(source)) {
        return ("Error: File or Directory not Exists. '" + source + "'");
    }

    var stat = fs.statSync(source);

    if (stat.isFile()) {
        // If specific file passed, no file type checking to add.
        list.push(source);
        return null;
    }
    if (stat.isDirectory()) {
        var files = fs.readdirSync(source);

        var error;
        for (var i = 0; i < files.length; i++) {
            if (this._isIgnoreFile(files[i])) {
                continue;
            }
            stat = fs.statSync(joinPath(source, files[i]));
            if (stat.isFile()) {
                if ( ! this._isMatchPattern(files[i])) {
                    continue;
                }
            }
            error = this._addFilesToList(
                            list, joinPath(source, files[i]), mockfs);
            if (error !== null) {
                return error;
            }
        }
        return null;
    }
    return null;
};


module.exports = RajahApp;
