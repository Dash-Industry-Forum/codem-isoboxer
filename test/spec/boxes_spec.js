var ISOBoxer = require('../../dist/iso_boxer.js'),
    fs = require('fs');

function loadParsedFixture(file) {
  var arrayBuffer = new Uint8Array(fs.readFileSync(file)).buffer;
  return ISOBoxer.parseBuffer(arrayBuffer);
}

describe('free box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/captions.mp4');
    var box = parsedFile.boxes[3];

    expect(box.type).toEqual('free');
    expect(box.size).toEqual(59);
    expect(box.data.byteLength).toEqual(51);
  })  
})  

describe('ftyp box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/captions.mp4');
    var box = parsedFile.boxes[0];

    expect(box.type).toEqual('ftyp');
    expect(box.size).toEqual(20);
    expect(box.major_brand).toEqual('isom');
    expect(box.minor_versions).toEqual(1);
    expect(box.compatible_brands).toEqual(['isom']);
  })
});

describe('mdat box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/captions.mp4');
    var box = parsedFile.boxes[2];

    expect(box.type).toEqual('mdat');
    expect(box.size).toEqual(21530);
    expect(box.data.byteLength).toEqual(21522);
  })
  
})

describe('moov box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/captions.mp4');
    var box = parsedFile.boxes[1];

    expect(box.type).toEqual('moov');
    expect(box.size).toEqual(1028);
    expect(box.boxes.length).toEqual(2);
  })
})