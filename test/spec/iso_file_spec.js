var ISOBoxer = require('../../dist/iso_boxer.js'),
    fs = require('fs'),
    isArrayBufferEqual = require('arraybuffer-equal');

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
  });

  it('should fetch all boxes from a parsed file', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/captions_fragmented.mp4');
    var boxes = parsedFile.fetchAll('mdat');
    
    expect(boxes.length).toEqual(158);
    for (var box in boxes) {
      expect(boxes[box].type).toEqual('mdat');
    }
  });
});

describe('ISOFile.write', function() {
  const fixtureFolder = './test/fixtures/';
  // var files = fs.readdirSync(fixtureFolder);
  var files = ['caption_bbc.m4s',
               'captions.mp4',
               'captions_fragmented.mp4',
               'editlist.mp4',
               'emsg.m4s',
               'subsample.m4s',
               'test_frag.mp4',
               'webvtt.m4s',
               'mss_moof.mp4',
               'mss_moof_tfdt.mp4',
               'mss_moov_encrypted_audio.mp4',
               'mss_moov_encrypted_video.mp4'
               ];

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    it('should read/parse and write file ' + file, function() {
      var parsedFile  = loadParsedFixture(fixtureFolder + this);
      var inputBuffer = parsedFile._raw.buffer;
      var outputBuffer = parsedFile.write();
      expect(isArrayBufferEqual(inputBuffer, outputBuffer)).toEqual(true);
    }.bind(files[i]));
  }
});

describe('ISOFile.write-webvtt', function() {
  it('should read/parse and write webvtt file', function() {
    var parsedFile  = loadParsedFixture('./test/fixtures/webvtt.m4s');
    var mdat = parsedFile.fetch('mdat').data;
    var mdatBuffer = mdat.buffer.slice(mdat.byteOffset, mdat.byteOffset + mdat.byteLength);
    var vttFile = ISOBoxer.parseBuffer(mdatBuffer);
    var vttBuffer = vttFile.write();
    expect(isArrayBufferEqual(mdatBuffer, vttBuffer)).toEqual(true);
  });
});
