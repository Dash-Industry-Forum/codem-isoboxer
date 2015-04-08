var ISOBoxer = require('../../dist/iso_boxer.js'),
    fs = require('fs');

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
})