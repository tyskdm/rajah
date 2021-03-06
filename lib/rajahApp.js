'use strict';

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
        rootdir:        null,
        specs:          null,
        match:          null,
        packagefile:    null,
        reportType:     null,   // 'console' or 'onMemConsole'
        showColor:      null,
        stamp:          null,
        output:         null,
        codegs:         null
    };

    this.files = {
        specfiles: []
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

    if (config.packagefile) {
        this.config.packagefile = config.packagefile;
    }

    if (config.reportType) {
        this.config.reportType = config.reportType;
    }

    if (typeof config.showColor !== 'undefined') {   // showColor is boolean.
        this.config.showColor = config.showColor;
    }

    if (config.stamp) {
        this.config.stamp = config.stamp;
    }

    if (config.output) {
        this.config.output = config.output;
    }

    if (config.codegs) {
        this.config.codegs = config.codegs;
    }

    return null;
};


RajahApp.prototype.run = function (onComplete) {
    var error = null;

    if (this.config.codegs === null) {
        error = this.runJasmine(onComplete);
    } else {
        error = this.runCodegs();
    }

    return error;
};

RajahApp.prototype.runJasmine = function (onComplete) {
    var steps = [
            this.setup,
            this.addSpecFiles
        ],
        error = null;

    for (var i = 0; (i < steps.length) && (error === null); i++) {
        error = steps[i].apply(this);
    }
    if (error) {
        return error;
    }

    error =  this.executeJasmine(onComplete);

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
            this._addMatchPattern(this.config.match[i]);
        }
    } else {
        this._addMatchPattern( '.+\\.js$' );
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

RajahApp.prototype.executeJasmine = function (onComplete, mockfs) {
    var fs = mockfs || require('fs');

    var THIS = this;
    this.rajah.setup(global);
    global.jasmine = this.rajah.jasmine;

    if (this.config.output !== null) {
        if ((this.config.reportType === null) ||
            (this.config.reportType === 'console')) {

            this.config.reportType = 'onMemConsole';
        }
    }

    switch (this.config.reportType) {
    case 'console':
        this.rajah.addConsoleReporter(this.config.showColor);
        if (this.config.stamp) {
            console.log(this.config.stamp.replace(/\n/g, ''));
        }
        break;

    case null:
        this.rajah.addConsoleReporter(this.config.showColor);
        if (this.config.stamp) {
            console.log(this.config.stamp.replace(/\n/g, ''));
        }
        break;

    // case 'onMemConsole':
    default:
        if (this.config.stamp) {
            THIS.reportContent += this.config.stamp.replace(/\n/g, '') + '\n';
        }
        var print = function() {
            for (var i = 0, len = arguments.length; i < len; ++i) {
                THIS.reportContent += arguments[i];
            }
        };
        this.rajah.addConsoleReporter(this.config.showColor, print);
    }

    for (var j = 0; j < this.files.specfiles.length; j++) {
        require(this.files.specfiles[j]);
    }

    this.rajah.run(function (passed, specs, failure, pending) {
        if (THIS.config.output !== null) {
            fs.writeFileSync(THIS.config.output, THIS.getReport(), {encoding: 'utf8'});
        }
        if (typeof onComplete === 'function') {
            onComplete.apply(this, arguments);
        }
    });

    return null;
};

RajahApp.prototype.executeCodegs = function (mockfs) {
    var fs = mockfs || require('fs');

    var packageJson = this.config.packagefile ||
                      joinPath(this.config.rootdir, './package.json');
    if ( ! fs.existsSync(packageJson)) {
        packageJson = null;
    }

    // Create configure Application.
    var codegs = require('codegs');
    var code = codegs.create();
    var error;

    var rajahFiles = [];

    [   './rajah.js',
        './rajahApp.js',
        './dumbreporter.js',
        './timers.js'
    ].forEach(function (filepath) {
        rajahFiles.push(joinPath(__dirname, filepath));
    });

    [   'jasmine-core/lib/jasmine-core/jasmine.js',
        'jasmine-core/lib/console/console.js'
    ].forEach(function (filepath) {
        rajahFiles.push(joinPath(__dirname + '/../node_modules', filepath));
    });

    if (packageJson) {
        error = code.loadPackageJson(packageJson);
        if (error) {
            return error;
        }
    }

    // all options should be fully resolved path.
    // and be possibly using platform path delimiter('\').
    var config = {
        rootdir:    this.config.rootdir,

        mainfile:   require.resolve('./doGet.js'),

        source:     this.files.specfiles.concat(rajahFiles),

        output:     this.config.output || null,

        core:       code.config.core ?
                        null : path.resolve(__dirname, '../node_modules/codegs-core/code/gas'),

        node_core:  code.config.node_core ?
                        null : path.resolve(__dirname, '../node_modules/codegs-core/node/v0.10.26'),

        kernel:     null
    };

    error = code.addConfig(config);
    if (error) {
        return error;
    }

    error = code.run();
    if (error) {
        return error;
    }

    if (this.config.output) {
        var rajahConfig =
            "var rajahConfig = " +
            JSON.stringify({
                specs:      this.config.specs,
                match:      this.config.match,
                reportType: this.config.reportType,
                showColor:  this.config.showColor,
                stamp:      this.config.stamp
            }, null, 2) +
            ";\n\n";

        rajahConfig = rajahConfig + fs.readFileSync(this.config.output, {encoding: 'utf8'});
        fs.writeFileSync(this.config.output, rajahConfig, {encoding: 'utf8'});
    }

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
    this.matchPattern.push(new RegExp(pattern, 'i'));
};

RajahApp.prototype._isMatchPattern = function (file) {
    for (var j = 0; j < this.matchPattern.length; j++) {
        if (this.matchPattern[j].test(file)) {
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
