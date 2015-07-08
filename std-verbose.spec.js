var verbose = require('./std-verbose'),
    colors = require('colors')
    stream = require('mock-utf8-stream');

var streamMock = new stream.MockWritableStream();

verbose.minLevel = 0; // Verbose anything
verbose.stream = streamMock;

describe('verbose()', function() {
  describe('verbose a single line', function () {
    it('works for DEBUG', function () {
      streamMock.startCapture();
      verbose('Lorem ipsum dolor sit amet', verbose.DEBUG);
      expect(streamMock.capturedData).toEqual('DEBG '.green + 'Lorem ipsum dolor sit amet\n');
    });
    
    it('works for INFO', function () {
      streamMock.startCapture();
      verbose('Mauris tincidunt sapien vitae', verbose.INFO);
      expect(streamMock.capturedData).toEqual('INFO '.blue + 'Mauris tincidunt sapien vitae\n');
    });
    
    it('works for WARN', function () {
      streamMock.startCapture();
      verbose('Suspendisse a augue posuere', verbose.WARN);
      expect(streamMock.capturedData).toEqual('WARN '.yellow + 'Suspendisse a augue posuere\n');
    });
    
    it('works for ERROR', function () {
      streamMock.startCapture();
      verbose('Pellentesque venenatis augue', verbose.ERROR);
      expect(streamMock.capturedData).toEqual('ERR! '.red + 'Pellentesque venenatis augue\n');
    });
  });
  
  describe('verbose a multiple lines', function () {
    it('works for INFO', function () {
      var message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n' +
        'Ut gravida interdum tellus non volutpat.\n' +
        'Pellentesque tempus dui laoreet augue consectetur pretium.\n' +
        'Mauris dignissim neque a porta porta.';

      var expected = 'INFO '.blue + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n' +
        'INFO '.blue + 'Ut gravida interdum tellus non volutpat.\n' +
        'INFO '.blue + 'Pellentesque tempus dui laoreet augue consectetur pretium.\n' +
        'INFO '.blue + 'Mauris dignissim neque a porta porta.\n';
      
      streamMock.startCapture();
      verbose(message, verbose.INFO);
      expect(streamMock.capturedData).toEqual(expected);
    });
  });  
  
  describe('verbose an object', function () {
    it('works for INFO', function () {
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

      streamMock.startCapture();
      verbose(object, verbose.INFO);
      expect(streamMock.capturedData).toEqual(expected);
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
});

