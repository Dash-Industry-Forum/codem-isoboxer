var ISOBoxer = require('../../dist/iso_boxer.js'),
    fs = require('fs');

function loadParsedFixture(file) {
  var arrayBuffer = new Uint8Array(fs.readFileSync(file)).buffer;
  return ISOBoxer.parseBuffer(arrayBuffer);
}

describe('ISOBoxer', function() {
  it('should parse a buffer', function() {
    // Sample 'ftyp' box (20 bytes)
    var arrayBuffer = new Uint8Array([ 0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d, 0x00, 0x00, 0x00, 0x01, 0x69, 0x73, 0x6f, 0x6d ]).buffer;
    var parsedFile = ISOBoxer.parseBuffer(arrayBuffer);
    var box = parsedFile.boxes[0];
    
    expect(parsedFile.boxes.length).toEqual(1);
    expect(box.type).toEqual('ftyp');
    expect(box.size).toEqual(20);
    expect(box.major_brand).toEqual('isom');
    expect(box.minor_versions).toEqual(1);
    expect(box.compatible_brands).toEqual(['isom']);
  })
  
  it('should convert a simple dataView to a string', function() {
    var arrayBuffer = new Uint8Array([0x74, 0x65, 0x73, 0x74, 0x20, 0x73, 0x74, 0x72, 0x69, 0x6e, 0x67]).buffer;
    var dataView = new DataView(arrayBuffer);
    expect(ISOBoxer.Utils.dataViewToString(dataView)).toEqual('test string')
  })
  
  it('should allow adding additional box parsers', function() {
    var emptyFunction = function() { }
    var parsedFile = loadParsedFixture('./test/fixtures/captions.mp4');
    var box = parsedFile.boxes[0];
    ISOBoxer.addBoxParser('xxxx', emptyFunction);
    expect(box._boxParsers['xxxx']).toEqual(emptyFunction);
  })
  
  describe('when parsing an incomplete buffer', function() {
    it('should mark the incomplete box and root object as incomplete', function() {
      var parsedFile = loadParsedFixture('./test/fixtures/spliced_1500.m4v');
      expect(parsedFile._incomplete).toEqual(true);
      expect(parsedFile.boxes.length).toEqual(5);
      expect(parsedFile.boxes[parsedFile.boxes.length - 1]._incomplete).toEqual(true);
    })
    
    it('should not mark complete boxes as incomplete', function() {
      var parsedFile = loadParsedFixture('./test/fixtures/spliced_1500.m4v');
      for (var i = 0; i < parsedFile.boxes.length - 1; i++) {
        expect(parsedFile.boxes[i]._incomplete).toEqual(undefined);        
      }
    })
    
    it('should reject boxes that are cut in the header and set incomplete on the root', function() {
      var parsedFile = loadParsedFixture('./test/fixtures/spliced_34.m4v');
      expect(parsedFile._incomplete).toEqual(true);
      expect(parsedFile.boxes.length).toEqual(1);
    })
    
    it('should not parse boxes nested inside incomplete boxes', function() {
      var parsedFile = loadParsedFixture('./test/fixtures/spliced_251.m4v');
      expect(parsedFile._incomplete).toEqual(true);
      expect(parsedFile.boxes.length).toEqual(2);
      expect(parsedFile.boxes[1].boxes).toEqual(undefined);
      expect(parsedFile.fetch('trak')).toEqual(undefined);
    })
  })
})