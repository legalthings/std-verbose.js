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
  if (typeof subject === 'string') return subject;
  if (typeof subject === 'number') return subject + '';

  if (typeof subject === 'undefined') return '[undefined]';
    
  if (typeof subject.inspect === 'function') {
    subject = cast(subject.inspect(0));
    if (typeof subject === 'string') return subject;
    if (typeof subject === 'number') return subject + '';
  }
  
  return yaml.dump(subject)
    .replace(/\n$/, '')
    .replace(/\!<tag:yaml.org,2002:js\/undefined> ''/g, '[undefined]')
    .replace(/\!<tag:yaml.org,2002:js\/function> '(.+\})'(\n|$)/g, '$1$2')
    .replace(/\!<tag:yaml.org,2002:js\/function> \|\-(\n|$)/g, '')
    .replace(/\!<tag:yaml.org,2002:js\/regexp> (?:(['"])(.*)\1(\n|$))?/g, function(full, quote, expr, newline) {
      return expr ? expr.replace(/\\\\/g, '\\') + newline : '';
    });
}

verbose.DEBUG = 0;
verbose.INFO = 1;
verbose.WARN = 2;
verbose.ERROR = 3;

// Defaults
verbose.stream = process.stderr;
verbose.minLevel = typeof verbose[process.env.VERBOSITY] !== 'undefined'
  ? verbose[process.env.VERBOSITY]
  : verbose.INFO;

module.exports = verbose;

