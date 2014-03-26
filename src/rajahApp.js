
var minimatch = require('minimatch');
var path =  require('path');

var joinPath = (function () {
    var _join = path.join;
    return function (base, request) {
        if (request) {
            return _join(base, request).replace(/\\/g, '/');
        }
        return base.replace(/\\/g, '/');
    };
})();


function RajahApp(config) {

    this.rajah = require('./rajah.js');

    this.config = {
        rootdir:      null,
        specs:        null,
        matcher:      null,
        helpers:      null,
        reportType:   null,
        output:       null,
        codegs:       null,
        packagefile:  null
    };

    this.files = {
        specfiles:    [],
        helpers:      []
    };
    this.ignoreFilepath = [];
    this.ignorePattern = [];
    this.reportContent = '';

    if (config) {
        RajahApp.prototype.addConfig.call(this, config);
    }
}

RajahApp.create = function (config) {
    return new RajahApp(config);
};


RajahApp.prototype.addConfig = function (config) {

    if (config.specs) {
        if (this.config.specs === null) {
            this.config.specs = [];
        }
        this.config.specs = this.config.specs.concat(config.specs);
    }

    if (config.rootdir) {
        this.config.rootdir = config.rootdir;
    }

    if (config.mainfile) {
        this.config.mainfile = config.mainfile;
    }

    if (config.output) {
        this.config.output = config.output;
    }

    if (config.core) {
        this.config.core = config.core;
    }

    if (config.node_core) {
        this.config.node_core = config.node_core;
    }

    if (config.node_modules) {
        if (this.config.node_modules === null) {
            this.config.node_modules = [];
        }
        this.config.node_modules = this.config.node_modules.concat(config.node_modules);
    }

    if (config.kernel) {
        this.config.kernel = config.kernel;
    }

    return null;
};


RajahApp.prototype.run = function () {
    var steps = [
            this.setup,
            // this.addSpecHelpers,
            this.addSpecFiles,
            // this.addCoreFiles,
            // this.addNodeCoreFiles,
            // this.addNodeModules,
            this.executeJasmine
            // this.out
        ],
        error = null;

    for (var i = 0; (i < steps.length) && (error === null); i++) {
        error = steps[i].apply(this);
    }
    return error;
};

RajahApp.prototype.setup = function (mockfs) {
    var fs = mockfs || require('fs');

    this.config.rootdir = process.cwd();

    return null;
};

RajahApp.prototype.addSpecFiles = function (mockfs) {

    if (this.config.specs === null) {
        this.config.specs = [];
    }

    var i, specfile, error = null;
    var rootdir = joinPath(this.config.rootdir);

    for (i = 0; i < this.config.specs.length; i++) {

        specfile = joinPath(this.config.specs[i]);
        console.log('add : ' + specfile);

        error = this._addFilesToList(this.files.specfiles, specfile, true, mockfs);
        console.log('addFilesToList returns : ' + this.files.specfiles);

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
    var fs = mockfs || require('fs');

    this.rajah.setup(global);

    for (var i = 0; i < this.files.specfiles.length; i++) {
        require(this.files.specfiles[i]);
    }

    this.rajah.run(function (e) { console.log('END:' + e); });

    return null;
};

RajahApp.prototype.addCoreFiles = function (mockfs) {

    if (typeof this.config.core !== 'string') {
        return 'Error: core file directory is not specified.';
    }

    var coredir = joinPath(this.config.core);
    var error = this._addFilesToList(this.files.core, coredir, 'core/', false, mockfs);
    if (error === null) {
        coredir = coredir.slice(-1) === '/' ? coredir.slice(0, -1) : coredir;
        this._addIgnoreFilepath(coredir);
    }
    return error;
};

RajahApp.prototype.addNodeCoreFiles = function (mockfs) {

    if (typeof this.config.node_core !== 'string') {
        return 'Error: node_core file directory is not specified.';
    }

    var nodecoredir = joinPath(this.config.node_core);
    var error = this._addFilesToList(this.files.node_core, nodecoredir, 'node_core/', false, mockfs);
    if (error === null) {
        nodecoredir = nodecoredir.slice(-1) === '/' ? nodecoredir.slice(0, -1) : nodecoredir;
        this._addIgnoreFilepath(nodecoredir);
    }
    return error;
};

RajahApp.prototype.addNodeModules = function (mockfs) {

    var error = null;
    var rootdir = joinPath(this.config.rootdir);
    var moduledir = joinPath(rootdir, './node_modules');

    if (this.config.node_modules === null) {
        error = this._addFilesToList(this.files.node_modules, moduledir, '/node_modules/', false, mockfs);
        if (error === null) {
            this._addIgnoreFilepath(moduledir);
        }
        return error;
    }

    var i, source, storepath;
    for (i = 0; i < this.config.node_modules.length; i++) {

        storepath = source = joinPath(moduledir, this.config.node_modules[i]);
        storepath = storepath === rootdir ? '/' : storepath.slice(rootdir.length);

        error = this._addFilesToList(this.files.node_modules, source, storepath, false, mockfs);
        if (error === null) {
            source = source.slice(-1) === '/' ? source.slice(0, -1) : source;
            this._addIgnoreFilepath(source);
        } else {
            break;
        }
    }
    return error;
};

RajahApp.prototype.out = function (mockfs) {
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


RajahApp._createFilesList = function (config, file, type) {
    var rootdir = joinPath(config.rootdir);
    var rootlength = rootdir.length　- (rootdir.slice(-1) === '/' ? 1 : 0);

    var mainpath = file.slice(rootlength);
    var fileList = {};

    fileList[file] = { type: type, path: mainpath};

    return fileList;
};

RajahApp._compileFilesList = function (filesList, mockfs) {
    var fs = mockfs || require('fs');
    var codegsModule = require('./module');

    var file, content, mergedContent = '';

    for (file in filesList) {
        if (filesList.hasOwnProperty(file)) {
            content = fs.readFileSync(file, {encoding: 'utf8'});
            content = codegsModule.wrap(content, filesList[file].path, filesList[file].type);
            if (content === null) {
                throw new Error("Error: Invalid filepath '" + filesList[file].path +
                                "'or type '" + filesList[file].type + "'");
            }
            mergedContent += content;
        }
    }
    return mergedContent;
};

RajahApp.prototype._addIgnoreFilepath = function (filepath) {
    this.ignoreFilepath.push(filepath);
};

RajahApp.prototype._addIgnorePattern = function (pattern) {
    this.ignorePattern.push(pattern);
};

RajahApp.prototype._isIgnoreFile = function (file, checkPattern) {
    for (var i = 0; i < this.ignoreFilepath.length; i++) {
        if (file === this.ignoreFilepath[i]) {
            return true;
        }
    }
    if (checkPattern) {
        for (var j = 0; j < this.ignorePattern.length; j++) {
            if (minimatch(file, this.ignorePattern[j])) {
                return true;
            }
        }
    }
    return false;
};

RajahApp.prototype._addFilesToList = function (list, source, checkPattern, mockfs) {
    var fs = mockfs || require('fs');

    if (this._isIgnoreFile(source, checkPattern)) {
        return null;
    }

    if ( ! fs.existsSync(source)) {
        //return ("Error: File or Directory not Exists. '" + source + "'");
        return null;
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
            if (this._isIgnoreFile(files[i], checkPattern)) {
                continue;
            }
            stat = fs.statSync(joinPath(source, files[i]));
            if (stat.isFile()) {
                // File types to add are only '.js' by default.
                if (! ((files[i].length > 3) && (files[i].slice(-3) === '.js'))) {
                    continue;
                }
            }
            error = this._addFilesToList(list,
                                    joinPath(source, files[i]),
                                    checkPattern,
                                    mockfs);
            if (error !== null) {
                return error;
            }
        }
        return null;
    }
    return null;
};


module.exports = RajahApp;
