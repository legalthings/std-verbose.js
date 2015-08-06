/* Cast variable to string (using yaml) */

var yaml = require('js-yaml');

module.exports = function cast(subject) {
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

