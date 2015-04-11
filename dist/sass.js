/*! sass.js - v0.0.0 (1712509) - built 2015-04-11
  providing libsass 3.2.0-beta.5 (f82a41b)
  via emscripten 1.30.2 (dac9f88)
 */
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.Sass = factory();
  }
}(this, function () {
  'use strict';
  /*global Worker*/
  
  var Sass = {
    _worker: null,
    _callbacks: {},

    style: {
      nested: 0,
      expanded: 1,
      compact: 2,
      compressed: 3
    },
    comments: {
      'none': 0,
      'default': 1
    },

    _dispatch: function(options, callback) {
      options.id = 'cb' + Date.now() + Math.random();
      Sass._callbacks[options.id] = callback;
      Sass._worker.postMessage(options);
    },

    writeFile: function(filename, text, callback) {
      Sass._dispatch({
        command: 'writeFile',
        filename: filename,
        text: text
      }, callback);
    },

    readFile: function(filename, callback) {
      Sass._dispatch({
        command: 'readFile',
        filename: filename
      }, callback);
    },

    listFiles: function(callback) {
      Sass._dispatch({
        command: 'listFiles'
      }, callback);
    },

    removeFile: function(filename, callback) {
      Sass._dispatch({
        command: 'removeFile',
        filename: filename
      }, callback);
    },

    clearFiles: function(callback) {
      Sass._dispatch({
        command: 'clearFiles'
      }, callback);
    },

    lazyFiles: function(base, directory, files, callback) {
      Sass._dispatch({
        command: 'lazyFiles',
        base: base,
        directory: directory,
        files: files,
      }, callback);
    },

    preloadFiles: function(base, directory, files, callback) {
      Sass._dispatch({
        command: 'preloadFiles',
        base: base,
        directory: directory,
        files: files,
      }, callback);
    },

    options: function(options, callback) {
      Sass._dispatch({
        command: 'options',
        options: options
      }, callback);
    },

    compile: function(text, callback) {
      Sass._dispatch({
        command: 'compile',
        text: text
      }, callback);
    },

    _eval: function(func, callback) {
      Sass._dispatch({
        command: '_eval',
        func: String(func)
      }, callback);
    },

    initialize: function(workerUrl) {
      if (Sass._worker) {
        throw new Error('Sass Worker is already initalized');
      }

      Sass._worker = new Worker(workerUrl);
      Sass._worker.addEventListener('message', function(event) {
        Sass._callbacks[event.data.id] && Sass._callbacks[event.data.id](event.data.result);
        delete Sass._callbacks[event.data.id];
      }, false);
    }
  };

  return Sass;
}));