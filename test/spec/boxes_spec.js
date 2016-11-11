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

  it('should handle null-terminated strings that are not null-terminated and might exceed box boundaries', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/240fps_go_pro_hero_4.mp4');
    var box = parsedFile.fetch('hdlr');

    expect(box.name).toEqual("\tGoPro AVC");
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

describe('mehd box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/test_frag.mp4');
    var box = parsedFile.fetch('mehd');

    expect(box.type).toEqual('mehd');
    expect(box.size).toEqual(16);
    expect(box.fragment_duration).toEqual(2047);
  })
})

describe('mfro box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/test_frag.mp4');
    var box = parsedFile.fetch('mfro');

    expect(box.type).toEqual('mfro');
    expect(box.size).toEqual(16);
    expect(box.mfra_size).toEqual(105);
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

describe('stsd box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/240fps_go_pro_hero_4.mp4');
    var stsd = parsedFile.fetchAll('stsd');

    expect(stsd.length).toEqual(3);
    expect(stsd[0].entries[0].type).toEqual('avc1');
    expect(stsd[1].entries[0].type).toEqual('mp4a');
    expect(stsd[2].entries[0].type).toEqual('fdsc');
  })
})

describe('trex box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/test_frag.mp4');
    var boxes = parsedFile.fetchAll('trex');

    expect(boxes.length).toEqual(2);

    expect(boxes[0].type).toEqual('trex');
    expect(boxes[0].size).toEqual(32);
    expect(boxes[0].track_ID).toEqual(1);
    expect(boxes[0].default_sample_description_index).toEqual(1);
    expect(boxes[0].default_sample_duration).toEqual(0);
    expect(boxes[0].default_sample_size).toEqual(0);
    expect(boxes[0].default_sample_flags).toEqual(0);

    expect(boxes[1].type).toEqual('trex');
    expect(boxes[1].size).toEqual(32);
    expect(boxes[1].track_ID).toEqual(2);
    expect(boxes[1].default_sample_description_index).toEqual(1);
    expect(boxes[1].default_sample_duration).toEqual(0);
    expect(boxes[1].default_sample_size).toEqual(0);
    expect(boxes[1].default_sample_flags).toEqual(0);
  })
})

describe('Text samples', function() {
  describe('vttc box', function() {
    it('should correctly parse the box from sample data', function() {
      var parsedFile  = loadParsedFixture('./test/fixtures/webvtt.m4s');
      var mdatData = parsedFile.fetch('mdat').data;

      var buffer = mdatData.buffer.slice(mdatData.byteOffset, mdatData.byteOffset + mdatData.byteLength);
      var parsedBuffer = ISOBoxer.parseBuffer(buffer);

      var box = parsedBuffer.boxes[0];
      expect(box.type).toEqual('vttc');
    })
  })

  describe('payl box', function() {
    it('should correctly parse the box from sample data', function() {
      var parsedFile  = loadParsedFixture('./test/fixtures/webvtt.m4s');
      var mdatData = parsedFile.fetch('mdat').data;

      var buffer = mdatData.buffer.slice(mdatData.byteOffset, mdatData.byteOffset + mdatData.byteLength);
      var parsedBuffer = ISOBoxer.parseBuffer(buffer);

      var box = parsedBuffer.boxes[0].boxes[0];
      expect(box.type).toEqual('payl');
      expect(box.cue_text).toEqual("You're a jerk, Thom.\n")
    })
  })

  describe('vtte box', function() {
    it('should correctly parse the box from sample data', function() {
      var parsedFile  = loadParsedFixture('./test/fixtures/webvtt.m4s');
      var mdatData = parsedFile.fetch('mdat').data;

      var buffer = mdatData.buffer.slice(mdatData.byteOffset, mdatData.byteOffset + mdatData.byteLength);
      var parsedBuffer = ISOBoxer.parseBuffer(buffer);

      var box = parsedBuffer.boxes[1];
      expect(box.type).toEqual('vtte');
    })
  })

  describe('subs box', function() {
    it('should correctly parse the box from sample data', function() {
      var parsedFile  = loadParsedFixture('./test/fixtures/subsample.m4s');
      var boxes = parsedFile.fetchAll('subs');
      expect(boxes.length).toEqual(1);
      expect(boxes[0].type).toEqual('subs');
      expect(boxes[0].samples_with_subsamples.length).toEqual(1);
      var sample = boxes[0].samples_with_subsamples[0];
      expect(sample.nr).toEqual(1);
      expect(sample.subsamples.length).toEqual(3);
      expect(sample.subsamples[0].size).toEqual(5);
      expect(sample.subsamples[1].size).toEqual(6);
      expect(sample.subsamples[2].size).toEqual(5);
    })
  })
})
