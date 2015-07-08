"use strict"

/* Verbose printing */

require('colors');
var yaml = require('js-yaml');

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
  }

  verbose.stream.write(message.replace(/(^|\n)/g, '$1' + status + prefix) + '\n');
}

function cast(subject) {
  if (typeof subject !== 'object') return subject;
  
  if (typeof subject.inspect === 'function') {
    subject = cast(subject.inspect(0));
    if (typeof subject !== 'object') return subject;
  }
  
  return yaml.safeDump(subject).replace(/\n$/, '');
}

verbose.DEBUG = 0;
verbose.INFO = 1;
verbose.WARN = 2;
verbose.ERROR = 3;

// Defaults
verbose.minLevel = verbose.WARN;
verbose.stream = process.stderr;

module.exports = verbose;

