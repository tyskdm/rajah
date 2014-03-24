
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

    this.config = {
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
    this.reportContent = '';

    if (config) {
        RajahApp.prototype.addConfig.call(this, config);
    }
}

RajahApp.create = function (config) {
    return new RajahApp(config);
};


RajahApp.prototype.addConfig = function (config) {

    if (config.rootdir) {
        this.config.rootdir = config.rootdir;
    }

    if (config.mainfile) {
        this.config.mainfile = config.mainfile;
    }

    if (config.source) {
        if (this.config.source === null) {
            this.config.source = [];
        }
        this.config.source = this.config.source.concat(config.source);
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
            this.addCoreFiles,
            this.addNodeCoreFiles,
            this.addNodeModules,
            this.addSourceFiles,
            this.compile,
            this.out
        ],
        error = null;

    for (var i = 0; (i < steps.length) && (error === null); i++) {
        error = steps[i].apply(this);
    }
    return error;
};

RajahApp.prototype.setup = function (mockfs) {
    var fs = mockfs || require('fs');

    // config.rootdir
    if ( ! this.config.rootdir) {
        this.config.rootdir = process.cwd();
    }

    // config.mainfile
    if ( ! this.config.mainfile) {
        this.config.mainfile = process.cwd();
    }

    // config.core
    if (this.config.core) {
        this.config.core = path.resolve(this.config.rootdir, this.config.core);
        if ( ! fs.existsSync(this.config.core)) {
            return 'Error: core module directory is not existent.';
        }
        if ( ! fs.statSync(this.config.core).isDirectory()) {
            return 'Error: core module directory is not directory.';
        }
    } else {
        // default value. not check if it exists.
        this.config.core = path.resolve(this.config.rootdir, './core');
    }

    // config.node_core
    if (this.config.node_core) {
        this.config.node_core = path.resolve(this.config.rootdir, this.config.node_core);
        if ( ! fs.existsSync(this.config.node_core)) {
            return 'Error: node_core module directory is not existent.';
        }
        if ( ! fs.statSync(this.config.node_core).isDirectory()) {
            return 'Error: node_core module directory is not directory.';
        }
    } else {
        // default value. not check if it exists.
        this.config.node_core = path.resolve(this.config.rootdir, './node_core');
    }

    // files.main
    this.files.main = path.resolve(this.config.rootdir, this.config.mainfile);
    if ( ! fs.existsSync(this.files.main)) {
        this.files.main = null;
        return 'Error: main file is not existent.';
    }
    if ( ! fs.statSync(this.files.main).isFile()) {
        this.files.main = null;
        return 'Error: main file is not valid filetype.';
    }
    this._addIgnoreFilepath(this.files.main);

    // files.kernel
    if (this.config.kernel) {

        this.files.kernel = path.resolve(this.config.rootdir, this.config.kernel);
        if ( ! fs.existsSync(this.files.kernel)) {
            this.files.kernel = null;
            return 'Error: kernel file is not existent.';
        }
        if ( ! fs.statSync(this.files.kernel).isFile()) {
            this.files.kernel = null;
            return 'Error: kernel file is not valid filetype.';
        }
        this._addIgnoreFilepath(this.files.kernel);
    }

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

RajahApp.prototype.addSourceFiles = function (mockfs) {

    if (this.config.source === null) {
        this.config.source = [];
        this.config.source.push(this.config.rootdir);
    }

    var i, source, storepath, error = null;
    var rootdir = joinPath(this.config.rootdir);

    for (i = 0; i < this.config.source.length; i++) {

        storepath = source = joinPath(this.config.source[i]);

        if (storepath.slice(0, rootdir.length) !== rootdir) {
            return 'Error: Source directory is outside project root.';
        }
        storepath = storepath === rootdir ? '/' : storepath.slice(rootdir.length);

        error = this._addFilesToList(this.files.source, source, storepath, true, mockfs);
        if (error === null) {
            source = source.slice(-1) === '/' ? source.slice(0, -1) : source;
            this._addIgnoreFilepath(source);
        } else {
            break;
        }
    }
    return error;
};

RajahApp.prototype.compile = function (mockfs) {
    var fs = mockfs || require('fs');

    this.content = '';
    var content = '';

    content = RajahApp._compileFilesList(this.files.core, mockfs);
    this.content += content;

    content = RajahApp._compileFilesList(this.files.node_core, mockfs);
    this.content += content;

    content = RajahApp._compileFilesList(this.files.node_modules, mockfs);
    this.content += content;

    content = RajahApp._compileFilesList(this.files.source, mockfs);
    this.content += content;

    var mainfileList = RajahApp._createFilesList(this.config, this.files.main, 'main');
    content = RajahApp._compileFilesList(mainfileList, mockfs);
    this.content += content;

    if (this.files.kernel) {
        var corefileList = {};
        corefileList[this.files.kernel] = { type: 'core', path: '' };
        content = RajahApp._compileFilesList(corefileList, mockfs);
    } else {
        // kernel === null, then should not wrap. just read and append.
        content = fs.readFileSync(require.resolve('./module.js'));
    }
    this.content += content;

    return null;
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

RajahApp.prototype._addFilesToList = function (list, source, storepath, checkPattern, mockfs) {
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
        if (list[source] === undefined) {
            list[source] = {
                type : source.slice(-5) === '.json' ? 'json' : 'js',
                path : storepath
            };
        }
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
                // File types to add are only '.js' and '.json', by default.
                if (! ( ((files[i].length > 3) && (files[i].slice(-3) === '.js')) ||
                        ((files[i].length > 5) && (files[i].slice(-5) === '.json'))) ) {
                    continue;
                }
            }
            error = this._addFilesToList(list,
                                    joinPath(source, files[i]),
                                    joinPath(storepath, files[i]),
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
