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

describe('elst box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/editlist.mp4');
    var box = parsedFile.fetch('elst');

    expect(box.size).toEqual(28);
    expect(box.entry_count).toEqual(1);
    expect(box.entries[0].media_rate_integer).toEqual(1);
    expect(box.entries[0].media_rate_fraction).toEqual(0);
    expect(box.entries[0].media_time).toEqual(1024);
    expect(box.entries[0].segment_duration).toEqual(1000);
  })
});

describe('hdlr box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/captions.mp4');
    var box = parsedFile.fetch('hdlr');

    expect(box.type).toEqual('hdlr');
    expect(box.size).toEqual(68);
    
    expect(box.pre_defined).toEqual(0);
    expect(box.handler_type).toEqual('subt');
    expect(box.reserved).toEqual([0,0,0]);
    expect(box.name).toEqual('*xml:ext=ttml@GPAC0.5.1-DEV-rev5545');
  })  
})

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

describe('ssix box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/spliced_10000.m4v');
    var box = parsedFile.boxes[4];
    
    expect(box.type).toEqual('ssix');
    expect(box.size).toEqual(8124);
    expect(box.subsegment_count).toEqual(25);
    expect(box.subsegments.length).toEqual(25);
    
    // Test one of the subsegments
    expect(box.subsegments[0].ranges_count).toEqual(70);
    expect(box.subsegments[0].ranges[45].level).toEqual(2);
    expect(box.subsegments[0].ranges[45].range_size).toEqual(7312);
  })
})