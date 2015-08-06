"use strict"

/* Verbose printing to stream (stderr) */

require('colors');
var cast = require('./cast');

var verbose = function(subject, level, prefix) {
  if (typeof level === 'undefined') level = verbose.INFO;
  if (typeof prefix === 'undefined') prefix = '';
  
  if (level < verbose.minLevel) return;
  
  var message = cast(subject);
  var status = '';

  switch(level) {
    case verbose.DEBUG:
      status = 'DEBG '.green;
      break;
    case verbose.INFO:
      status = 'INFO '.blue;
      break;
    case verbose.WARN:
      status = 'WARN '.yellow;
      break;
    case verbose.ERROR:
      status = 'ERR! '.red;
      break;
    case verbose.CRITICAL:
      status = 'CRIT '.red;
      break;
  }

  verbose.stream.write(message.replace(/(^|\n)/g, '$1' + status + prefix) + '\n');
}

// Level methods
verbose.debug = function(subject, prefix) {
  verbose(subject, verbose.DEBUG, prefix);
};

verbose.info = function(subject, prefix) {
  verbose(subject, verbose.INFO, prefix);
};

verbose.warn = function(subject, prefix) {
  verbose(subject, verbose.WARN, prefix);
};

verbose.error = function(subject, prefix) {
  verbose(subject, verbose.ERROR, prefix);
};

verbose.critical = function(subject, prefix) {
  verbose(subject, verbose.CRITICAL, prefix);
};

// Levels
verbose.DEBUG = 0;
verbose.INFO = 1;
verbose.WARN = 2;
verbose.ERROR = 3;
verbose.CRITICAL = 4;

// Defaults
verbose.stream = process.stderr;
verbose.minLevel = typeof verbose[process.env.VERBOSITY] !== 'undefined'
  ? verbose[process.env.VERBOSITY]
  : verbose.INFO;

module.exports = verbose;

