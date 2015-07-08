var verbose = require('./std-verbose'),
    colors = require('colors')
    stream = require('mock-utf8-stream');

var streamMock = new stream.MockWritableStream();
verbose.stream = streamMock;

describe('verbose', function() {
  beforeEach(function() {
    verbose.minLevel = 0; // Verbose anything
    streamMock.startCapture();
  });

  describe('a single line', function () {
    it('works for DEBUG', function () {
      verbose('Lorem ipsum dolor sit amet', verbose.DEBUG);
      expect(streamMock.capturedData).toEqual('DEBG '.green + 'Lorem ipsum dolor sit amet\n');
    });
    
    it('works for INFO', function () {
      verbose('Mauris tincidunt sapien vitae', verbose.INFO);
      expect(streamMock.capturedData).toEqual('INFO '.blue + 'Mauris tincidunt sapien vitae\n');
    });
    
    it('works for WARN', function () {
      verbose('Suspendisse a augue posuere', verbose.WARN);
      expect(streamMock.capturedData).toEqual('WARN '.yellow + 'Suspendisse a augue posuere\n');
    });
    
    it('works for ERROR', function () {
      verbose('Pellentesque venenatis augue', verbose.ERROR);
      expect(streamMock.capturedData).toEqual('ERR! '.red + 'Pellentesque venenatis augue\n');
    });
    
    it('works with the default level', function () {
      verbose('Mauris dignissim neque a porta porta');
      expect(streamMock.capturedData).toEqual('INFO '.blue + 'Mauris dignissim neque a porta porta\n');
    });    
  });
  
  describe('multiple lines', function () {
    it('works', function () {
      var message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n' +
        'Ut gravida interdum tellus non volutpat.\n' +
        'Pellentesque tempus dui laoreet augue consectetur pretium.\n' +
        'Mauris dignissim neque a porta porta.';

      var expected = 'INFO '.blue + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n' +
        'INFO '.blue + 'Ut gravida interdum tellus non volutpat.\n' +
        'INFO '.blue + 'Pellentesque tempus dui laoreet augue consectetur pretium.\n' +
        'INFO '.blue + 'Mauris dignissim neque a porta porta.\n';
      
      verbose(message, verbose.INFO);
      expect(streamMock.capturedData).toEqual(expected);
    });
  });
  
  describe('a number', function() {
    it('works with an integer', function () {
      verbose(173, verbose.INFO);
      expect(streamMock.capturedData).toEqual('INFO '.blue + '173\n');
    });
    
    it('works with a float', function () {
      verbose(3.52, verbose.INFO);
      expect(streamMock.capturedData).toEqual('INFO '.blue + '3.52\n');
    });
  });
  
  describe('a boolean', function() {
    it('works with false', function () {
      verbose(false, verbose.INFO);
      expect(streamMock.capturedData).toEqual('INFO '.blue + 'false\n');
    });
    
    it('works with true', function () {
      verbose(true, verbose.INFO);
      expect(streamMock.capturedData).toEqual('INFO '.blue + 'true\n');
    });
  });
  
  describe('an array', function() {
    it('works', function () {
      var list = [
        'faucibus',
        'orci',
        'luctus'
      ];

      var expected = 'INFO '.blue + '- faucibus\n' +
        'INFO '.blue + '- orci\n' +
        'INFO '.blue + '- luctus\n';

      verbose(list, verbose.INFO);
      expect(streamMock.capturedData).toEqual(expected);
    });
  });
  
  describe('undefined', function() {
    it('works', function () {
      verbose(undefined, verbose.INFO);
      expect(streamMock.capturedData).toEqual('INFO '.blue + '[undefined]\n');
    });
  });
  
  describe('a function', function() {
    it('works with an empty function', function () {
      verbose(function () { }, verbose.INFO);
      expect(streamMock.capturedData).toEqual('INFO '.blue + 'function () { }\n');
    });
    
    it('works with a bigger function', function () {
      var fn = function () {
        var a = "A";
      };
      
      var expected = 'INFO '.blue + 'function () {\n' +
        'INFO '.blue + '        var a = "A";\n' +
        'INFO '.blue + '      }\n';
      
      verbose(fn, verbose.INFO);
      expect(streamMock.capturedData).toEqual(expected);
    });
  });
  
  describe('a regex', function() {
    it('works', function () {
      verbose(/^abc\w\d.*/, verbose.INFO);
      expect(streamMock.capturedData).toEqual('INFO '.blue + '/^abc\\w\\d.*/\n');
    });
  });
  
  describe('an object', function () {
    it('works', function () {
      var object = {
        abc: 'vestibulum',
        def: 'ante',
        ghi: 'primis:wobus',
        list: [
          'faucibus',
          'orci',
          'luctus'
        ]
      };

      var expected = 'INFO '.blue + 'abc: vestibulum\n' +
        'INFO '.blue + 'def: ante\n' +
        'INFO '.blue + 'ghi: \'primis:wobus\'\n' +
        'INFO '.blue + 'list:\n' +
        'INFO '.blue + '  - faucibus\n' +
        'INFO '.blue + '  - orci\n' +
        'INFO '.blue + '  - luctus\n';

      verbose(object, verbose.INFO);
      expect(streamMock.capturedData).toEqual(expected);
    });
    
    it('works for undefined, function and regex properties', function () {
      var object = {
        abc: 'vestibulum',
        def: undefined,
        ghi: function() { },
        jkl: function() {
          var a = "A";
        },
        mno: /abc/
      };

      var expected = 'INFO '.blue + 'abc: vestibulum\n' +
        'INFO '.blue + 'def: [undefined]\n' +
        'INFO '.blue + 'ghi: function () { }\n' +
        'INFO '.blue + 'jkl:   function () {\n' +
        'INFO '.blue + '            var a = "A";\n' +
        'INFO '.blue + '          }\n' +
        'INFO '.blue + 'mno: /abc/\n';

      verbose(object, verbose.INFO);
      expect(streamMock.capturedData).toEqual(expected);
    });
    
    describe('with an inspect function', function () {
      it('works when inspect() returns a string', function () {
        var object = {
          abc: 'vestibulum',
          inspect: function() {
            return 'primis';
          }
        };

        verbose(object, verbose.INFO);
        expect(streamMock.capturedData).toEqual('INFO '.blue + 'primis\n');
      });
      
      it('works when inspect() returns an array', function () {
        var object = {
          abc: 'vestibulum',
          list: [
            'faucibus',
            'orci',
            'luctus'
          ],
          inspect: function() {
            return this.list;
          }
        };

        var expected = 'INFO '.blue + '- faucibus\n' +
          'INFO '.blue + '- orci\n' +
          'INFO '.blue + '- luctus\n';

        verbose(object, verbose.INFO);
        expect(streamMock.capturedData).toEqual(expected);
      });
    });
  });
  
  describe('using minLevel to ignore messages', function () {
    it('works for minLevel INFO', function () {
      verbose.minLevel = verbose.INFO;
      
      streamMock.startCapture();
      verbose('Lorem ipsum dolor sit amet', verbose.DEBUG);
      expect(streamMock.capturedData).toEqual('');
      
      streamMock.startCapture();
      verbose('Mauris tincidunt sapien vitae', verbose.INFO);
      expect(streamMock.capturedData).toEqual('INFO '.blue + 'Mauris tincidunt sapien vitae\n');

      streamMock.startCapture();
      verbose('Suspendisse a augue posuere', verbose.WARN);
      expect(streamMock.capturedData).toEqual('WARN '.yellow + 'Suspendisse a augue posuere\n');
      
      streamMock.startCapture();
      verbose('Pellentesque venenatis augue', verbose.ERROR);
      expect(streamMock.capturedData).toEqual('ERR! '.red + 'Pellentesque venenatis augue\n');
    });
    
    it('works for minLevel WARN', function () {
      verbose.minLevel = verbose.WARN;
      
      streamMock.startCapture();
      verbose('Lorem ipsum dolor sit amet', verbose.DEBUG);
      expect(streamMock.capturedData).toEqual('');
      
      streamMock.startCapture();
      verbose('Mauris tincidunt sapien vitae', verbose.INFO);
      expect(streamMock.capturedData).toEqual('');

      streamMock.startCapture();
      verbose('Suspendisse a augue posuere', verbose.WARN);
      expect(streamMock.capturedData).toEqual('WARN '.yellow + 'Suspendisse a augue posuere\n');
      
      streamMock.startCapture();
      verbose('Pellentesque venenatis augue', verbose.ERROR);
      expect(streamMock.capturedData).toEqual('ERR! '.red + 'Pellentesque venenatis augue\n');
    });

    it('works for minLevel ERROR', function () {
      verbose.minLevel = verbose.ERROR;
      
      streamMock.startCapture();
      verbose('Lorem ipsum dolor sit amet', verbose.DEBUG);
      expect(streamMock.capturedData).toEqual('');
      
      streamMock.startCapture();
      verbose('Mauris tincidunt sapien vitae', verbose.INFO);
      expect(streamMock.capturedData).toEqual('');

      streamMock.startCapture();
      verbose('Suspendisse a augue posuere', verbose.WARN);
      expect(streamMock.capturedData).toEqual('');
      
      streamMock.startCapture();
      verbose('Pellentesque venenatis augue', verbose.ERROR);
      expect(streamMock.capturedData).toEqual('ERR! '.red + 'Pellentesque venenatis augue\n');
    });
  });
  
  describe('with a prefix', function () {
    it('works for a single line', function () {
      verbose('Suspendisse a augue posuere', verbose.INFO, '|--> ');
      expect(streamMock.capturedData).toEqual('INFO '.blue + '|--> Suspendisse a augue posuere\n');
    });    
    
    it('works for a multiple lines', function () {
      var message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n' +
        'Ut gravida interdum tellus non volutpat.\n' +
        'Pellentesque tempus dui laoreet augue consectetur pretium.\n' +
        'Mauris dignissim neque a porta porta.';

      var expected = 'INFO '.blue + '#>Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n' +
        'INFO '.blue + '#>Ut gravida interdum tellus non volutpat.\n' +
        'INFO '.blue + '#>Pellentesque tempus dui laoreet augue consectetur pretium.\n' +
        'INFO '.blue + '#>Mauris dignissim neque a porta porta.\n';
        
      verbose(message, verbose.INFO, '#>');
      expect(streamMock.capturedData).toEqual(expected);
    });    
  });
});

