var ISOBoxer = require('../../dist/iso_boxer.js'),
    fs = require('fs');

function loadParsedFixture(file) {
  var arrayBuffer = new Uint8Array(fs.readFileSync(file)).buffer;
  return ISOBoxer.parseBuffer(arrayBuffer);
}

describe('ISOFile', function() {
  it('should fetch a single box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/captions.mp4');
    var box = parsedFile.fetch('mdat');
    
    expect(box.type).toEqual('mdat');
    expect(box.size).toEqual(21530);
  })
  
  it('should fetch all boxes from a parsed file', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/captions_fragmented.mp4');
    var boxes = parsedFile.fetchAll('mdat');
    
    expect(boxes.length).toEqual(158);
    for (box in boxes) {
      expect(boxes[box].type).toEqual('mdat');
    }
  })
})