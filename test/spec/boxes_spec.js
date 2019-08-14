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
  });
});

describe('ftyp box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/captions.mp4');
    var box = parsedFile.boxes[0];

    expect(box.type).toEqual('ftyp');
    expect(box.size).toEqual(20);
    expect(box.major_brand).toEqual('isom');
    expect(box.minor_version).toEqual(1);
    expect(box.compatible_brands).toEqual(['isom']);
  });
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
  });
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
  });

  it('should handle null-terminated strings that are not null-terminated and might exceed box boundaries', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/240fps_go_pro_hero_4.mp4');
    var box = parsedFile.fetch('hdlr');

    expect(box.name).toEqual("\tGoPro AVC");
  });
});

describe('mdat box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/captions.mp4');
    var box = parsedFile.boxes[2];

    expect(box.type).toEqual('mdat');
    expect(box.size).toEqual(21530);
    expect(box.data.byteLength).toEqual(21522);
  });
});

describe('mehd box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/test_frag.mp4');
    var box = parsedFile.fetch('mehd');

    expect(box.type).toEqual('mehd');
    expect(box.size).toEqual(16);
    expect(box.fragment_duration).toEqual(2047);
  });
});

describe('mfro box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/test_frag.mp4');
    var box = parsedFile.fetch('mfro');

    expect(box.type).toEqual('mfro');
    expect(box.size).toEqual(16);
    expect(box.mfra_size).toEqual(105);
  });
});

describe('moov box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/captions.mp4');
    var box = parsedFile.boxes[1];

    expect(box.type).toEqual('moov');
    expect(box.size).toEqual(1028);
    expect(box.boxes.length).toEqual(2);
  });
});

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
  });
});

describe('stsd box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/240fps_go_pro_hero_4.mp4');
    var stsd = parsedFile.fetchAll('stsd');

    expect(stsd.length).toEqual(3);
    expect(stsd[0].entries[0].type).toEqual('avc1');
    expect(stsd[1].entries[0].type).toEqual('mp4a');
    expect(stsd[2].entries[0].type).toEqual('fdsc');
  });
});

describe('avc1 box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/240fps_go_pro_hero_4.mp4');
    var stsd = parsedFile.fetchAll('stsd');
    var box = stsd[0].entries[0];

    expect(box.type).toEqual('avc1');
    expect(box.size).toEqual(184);
    expect(box.reserved1).toEqual([0, 0, 0, 0, 0, 0]);
    expect(box.data_reference_index).toEqual(1);
    expect(box.pre_defined1).toEqual(0);
    expect(box.reserved2).toEqual(0);
    expect(box.pre_defined2).toEqual([0, 0, 0]);
    expect(box.width).toEqual(1280);
    expect(box.height).toEqual(720);
    expect(box.horizresolution).toEqual(72);
    expect(box.vertresolution).toEqual(72);
    expect(box.reserved3).toEqual(0);
    expect(box.frame_count).toEqual(1);
    expect(box.compressorname).toEqual([0x11, 0x47, 0x6F, 0x50, 0x72, 0x6F, 0x20, 0x41,
                                        0x56, 0x43, 0x20, 0x65, 0x6E, 0x63, 0x6F, 0x64,
                                        0x65, 0x72, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                                        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]); // length + 'GoPro AVC encoder'
    expect(box.depth).toEqual(24);
    expect(box.pre_defined3).toEqual(-1);
    expect(box.config.byteLength).toEqual(98);
  });
});

describe('hvc1 box', function() {
  it('should correctly parse the box', function() {
    var parsedFile = loadParsedFixture('./test/fixtures/hvc1_init.mp4');
    var stsd = parsedFile.fetchAll('stsd');
    var box = stsd[0].entries[0];

    expect(box.type).toEqual('hvc1');
    expect(box.size).toEqual(137);
    expect(box.reserved1).toEqual([0, 0, 0, 0, 0, 0]);
    expect(box.data_reference_index).toEqual(1);
    expect(box.pre_defined1).toEqual(0);
    expect(box.reserved2).toEqual(0);
    expect(box.pre_defined2).toEqual([0, 0, 0]);
    expect(box.width).toEqual(192);
    expect(box.height).toEqual(108);
    expect(box.horizresolution).toEqual(72);
    expect(box.vertresolution).toEqual(72);
    expect(box.reserved3).toEqual(0);
    expect(box.frame_count).toEqual(1);
    expect(box.compressorname).toEqual([0x0B, 0x48, 0x45, 0x56, 0x43, 0x20, 0x43, 0x6F,
                                        0x64, 0x69, 0x6E, 0x67, 0x00, 0x00, 0x00, 0x00,
                                        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                                        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]); // length + 'HEVC Coding'
    expect(box.depth).toEqual(24);
    expect(box.pre_defined3).toEqual(-1);
    expect(box.config.byteLength).toEqual(51);
  });
});

describe('mp4a box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/240fps_go_pro_hero_4.mp4');
    var stsd = parsedFile.fetchAll('stsd');
    var box = stsd[1].entries[0];

    expect(box.type).toEqual('mp4a');
    expect(box.size).toEqual(86);
    expect(box.reserved1).toEqual([0, 0, 0, 0, 0, 0]);
    expect(box.data_reference_index).toEqual(1);
    expect(box.reserved2).toEqual([0, 0]);
    expect(box.channelcount).toEqual(2);
    expect(box.samplesize).toEqual(16);
    //expect(box.pre_defined).toEqual(0); // not conformed value in the file, not tested
    expect(box.reserved3).toEqual(0);
    expect(box.samplerate).toEqual(48000);
    expect(box.esds.byteLength).toEqual(50);
  });
});

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
  });
});

describe('stts box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/editlist.mp4');
    var boxes = parsedFile.fetchAll('stts');
    var box = boxes[0];

    expect(boxes.length).toEqual(1);

    expect(box.type).toEqual('stts');
    expect(box.entry_count).toEqual(2);
    expect(box.entries.length).toEqual(2);
    expect(box.entries[0].sample_count).toEqual(47);
    expect(box.entries[0].sample_delta).toEqual(1024);
    expect(box.entries[1].sample_count).toEqual(1);
    expect(box.entries[1].sample_delta).toEqual(896);
  });
});

describe('ctts box', function() {
  it('should correctly parse the box', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/time_to_sample.mp4');
    var boxes = parsedFile.fetchAll('ctts');
    var box = boxes[0];

    expect(boxes.length).toEqual(1);

    expect(box.type).toEqual('ctts');
    expect(box.entry_count).toEqual(5);
    expect(box.entries.length).toEqual(5);
    expect(box.entries[0].sample_count).toEqual(1);
    expect(box.entries[0].sample_offset).toEqual(1024);
    expect(box.entries[1].sample_count).toEqual(1);
    expect(box.entries[1].sample_offset).toEqual(2560);
    expect(box.entries[2].sample_count).toEqual(1);
    expect(box.entries[2].sample_offset).toEqual(1024);
    expect(box.entries[3].sample_count).toEqual(1);
    expect(box.entries[3].sample_offset).toEqual(0);
    expect(box.entries[4].sample_count).toEqual(1);
    expect(box.entries[4].sample_offset).toEqual(512);
  });
});

describe('Text samples', function() {
  describe('vttc box', function() {
    it('should correctly parse the box from sample data', function() {
      var parsedFile  = loadParsedFixture('./test/fixtures/webvtt.m4s');
      var mdatData = parsedFile.fetch('mdat').data;

      var buffer = mdatData.buffer.slice(mdatData.byteOffset, mdatData.byteOffset + mdatData.byteLength);
      var parsedBuffer = ISOBoxer.parseBuffer(buffer);

      var box = parsedBuffer.boxes[0];
      expect(box.type).toEqual('vttc');
    });
  });

  describe('payl box', function() {
    it('should correctly parse the box from sample data', function() {
      var parsedFile  = loadParsedFixture('./test/fixtures/webvtt.m4s');
      var mdatData = parsedFile.fetch('mdat').data;

      var buffer = mdatData.buffer.slice(mdatData.byteOffset, mdatData.byteOffset + mdatData.byteLength);
      var parsedBuffer = ISOBoxer.parseBuffer(buffer);

      var box = parsedBuffer.boxes[0].boxes[0];
      expect(box.type).toEqual('payl');
      expect(box.cue_text).toEqual("You're a jerk, Thom.\n");
    });
  });

  describe('vtte box', function() {
    it('should correctly parse the box from sample data', function() {
      var parsedFile  = loadParsedFixture('./test/fixtures/webvtt.m4s');
      var mdatData = parsedFile.fetch('mdat').data;

      var buffer = mdatData.buffer.slice(mdatData.byteOffset, mdatData.byteOffset + mdatData.byteLength);
      var parsedBuffer = ISOBoxer.parseBuffer(buffer);

      var box = parsedBuffer.boxes[1];
      expect(box.type).toEqual('vtte');
    });
  });

  describe('subs box', function() {
    it('should correctly parse the box from sample data', function() {
      var parsedFile  = loadParsedFixture('./test/fixtures/subsample.m4s');
      var boxes = parsedFile.fetchAll('subs');
      expect(boxes.length).toEqual(1);
      expect(boxes[0].type).toEqual('subs');
      expect(boxes[0].entries.length).toEqual(1);
      expect(boxes[0].entries[0].sample_delta).toEqual(1);
      expect(boxes[0].entries[0].subsample_count).toEqual(3);
      expect(boxes[0].entries[0].subsamples.length).toEqual(3);
      expect(boxes[0].entries[0].subsamples[0].subsample_size).toEqual(5);
      expect(boxes[0].entries[0].subsamples[0].subsample_priority).toEqual(0);
      expect(boxes[0].entries[0].subsamples[0].discardable).toEqual(0);
      expect(boxes[0].entries[0].subsamples[0].codec_specific_parameters).toEqual(0);
    });
  });

  describe('smhd box', function() {
    it('should correctly parse the box from sample data', function() {
      var parsedFile  = loadParsedFixture('./test/fixtures/240fps_go_pro_hero_4.mp4');
      var boxes = parsedFile.fetchAll('smhd');
      expect(boxes.length).toEqual(1);
      expect(boxes[0].type).toEqual('smhd');
      expect(boxes[0].balance).toEqual(0.0);
    });
  });

  describe('vmhd box', function() {
    it('should correctly parse the box from sample data', function() {
      var parsedFile  = loadParsedFixture('./test/fixtures/240fps_go_pro_hero_4.mp4');
      var boxes = parsedFile.fetchAll('vmhd');
      expect(boxes.length).toEqual(1);
      expect(boxes[0].type).toEqual('vmhd');
      expect(boxes[0].graphicsmode).toEqual(0);
      expect(boxes[0].opcolor).toEqual([0,0,0]);
    });
  });

  describe('dref box', function() {
    it('should correctly parse the box from sample data', function() {
      var parsedFile  = loadParsedFixture('./test/fixtures/captions.mp4');
      var boxes = parsedFile.fetchAll('dref');
      expect(boxes.length).toEqual(1);
      expect(boxes[0].type).toEqual('dref');
      expect(boxes[0].entries.length).toEqual(1);
      expect(boxes[0].entries[0].type).toEqual('url ');
      expect(boxes[0].entries[0].version).toEqual(0);
      expect(boxes[0].entries[0].flags).toEqual(1);
      expect(boxes[0].entries[0].location).toEqual('');
    });
  });
});
