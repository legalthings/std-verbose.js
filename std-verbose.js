"use strict"

/* Verbose printing */

require('colors');
var yaml = require('js-yaml');

var verbose = function(subject, level, prefix) {
  if (typeof level === 'undefined') level = verbose.INFO;
  if (typeof prefix === 'undefined') prefix = '';
  
  if (level < verbose.minLevel) return;
  
  var status = '';
  
  if (typeof subject == 'object') {
    subject = yaml.safeDump(subject).replace(/\n$/, '');
  }

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
  }

  verbose.stream.write(subject.replace(/(^|\n)/g, '$1' + status + prefix) + '\n');
}

verbose.DEBUG = 0;
verbose.INFO = 1;
verbose.WARN = 2;
verbose.ERROR = 3;

// Defaults
verbose.minLevel = verbose.WARN;
verbose.stream = process.stderr;

module.exports = verbose;

