# std-verbose.js
[![Build Status](https://travis-ci.org/legalthings/std-verbose.js.svg?branch=master)](https://travis-ci.org/legalthings/std-verbose.js)

Verbose output with colored prefix for the commandline.

Output a string or an object. Objects are serialized to yaml.

![std-verbose](https://cloud.githubusercontent.com/assets/100821/8568421/ca35f450-256d-11e5-9cb4-4b7afee4aae6.png)


## Installation

    npm install std-verbose --save


## Usage

```js
verbose.minLevel = verbose.DEBUG;

verbose('Starting to wax the moon', verbose.INFO);
verbose('Finding a brush for the spoon', verbose.INFO);
verbose('User John is available', verbose.INFO);

verbose('Received a request:', verbose.DEBUG);
verbose({target: 'http://example.com', data: {first: 1, second: 'two', third: 'III'}}, verbose.DEBUG, '  ');

verbose('Response data doesn\'t contain expected key \'xyz\'', verbose.WARN);

verbose('Unable to continue, skipping this one', verbose.ERROR);
```

## Levels

There are 4 levels (from lowest to hightest):

* DEBUG
* INFO
* WARN
* ERROR

All messages with a level below `verbose.minLevel` will not be outputted. Defaults to `INFO`.

## Stream selection

By default messages are written to stderr. To write to another writable stream set `verbose.stream`.

```js
verbose.stream = process.stdout;
```

