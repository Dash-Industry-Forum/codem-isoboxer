(function(exports) {
  var Cursor = function(initialOffset) {
    this.offset = (typeof initialOffset == 'undefined' ? 0 : initialOffset);
  }
  
  var ISOBox = function() {
    this.cursor = new Cursor();
    this.cursor.name = 'ISOBox';
  }
  ISOBox.parse = function(raw, cursor) {
    var newBox = new ISOBox();
    newBox.offset = cursor.offset;
    newBox.raw = raw;
    newBox.parseBox()
    cursor.offset = newBox.raw.byteOffset + newBox.raw.byteLength;
    return newBox;
  }
  ISOBox.prototype.readUint = function(size) {
    console.log(this.cursor.name + ": " + this.cursor.offset);
    var result = null;
    switch(size) {
    case 8:
      result = this.raw.getUint8(this.cursor.offset - this.raw.byteOffset);
      break;
    case 16:
      result = this.raw.getUint16(this.cursor.offset - this.raw.byteOffset);
      break;
    case 24:
      var s1 = this.raw.getUint16(this.cursor.offset - this.raw.byteOffset);
      var s2 = this.raw.getUint8(this.cursor.offset - this.raw.byteOffset + 2);
      result = (s1 << 4) + s2;
      break;
    case 32:
      result = this.raw.getUint32(this.cursor.offset - this.raw.byteOffset);
      break;
    case 64:
      var s1 = this.raw.getUint32(this.cursor.offset - this.raw.byteOffset);
      var s2 = this.raw.getUint32(this.cursor.offset - this.raw.byteOffset + 4);
      result = (s1 << 8) + s2;
      break;
    }
    this.cursor.offset += (size >> 3);
    return result;        
  }
  ISOBox.prototype.readString = function(length) {
    var str = '';
    for (var c = 0; c < length; c++) {
      var char = this.readUint(8);
      str += String.fromCharCode(char);
    }
    return str;    
  }
  ISOBox.prototype.readTemplate = function(size) {
    var pre = this.readUint(size / 2);
    var post = this.readUint(size / 2);
    return pre + (post / Math.pow(2, size / 2));
  }
  ISOBox.prototype.parseBox = function() {
    this.cursor.offset = this.offset;
    this.size = this.readUint(32);
    this.type = this.readString(4);
    console.log("type: " + this.type)
    if (this.size == 1)      { this.largesize = this.readUint(64); }
    if (this.type == 'uuid') { this.usertype = this.readString(16); }

    switch(this.size) {
    case 0:
      this.raw = new DataView(this.raw.buffer, this.offset, (this.raw.byteLength - this.cursor.offset));
      break;
    case 1:
      this.raw = new DataView(this.raw.buffer, this.offset, this.largesize);
      break;
    default:
      this.raw = new DataView(this.raw.buffer, this.offset, this.size);
    }

    // additional parsing
    if (this.boxParsers[this.type]) this.boxParsers[this.type].call(this);    
  }
  ISOBox.prototype.parseFullBox = function() {
    this.version = this.readUint(8);
    this.flags = this.readUint(24);
  }
  ISOBox.prototype.boxParsers = {};
  ISOBox.prototype.boxParsers['ftyp'] = function() {
    this.cursor.name += " ftyp";
    this.major_brand = this.readString(4);
    this.minor_versions = this.readUint(32);
    this.compatible_brands = [];
    
    while (this.cursor.offset < this.raw.byteLength) {
      this.compatible_brands.push(this.readString(4));
    }
  }
  ISOBox.prototype.boxParsers['moov'] = function() {
    this.cursor.name += " moov";
    this.boxes = [];
    while (this.cursor.offset < this.raw.byteLength) {
      this.boxes.push(ISOBox.parse(this.raw, this.cursor));
    }
  }
  ISOBox.prototype.boxParsers['mvhd'] = function() {
    this.cursor.name += " mvhd";
    this.parseFullBox();
    
    if (this.version == 1) {
      this.creation_time     = this.readUint(64);
      this.modification_time = this.readUint(64);
      this.timescale         = this.readUint(32);
      this.duration          = this.readUint(64);
    } else {
      this.creation_time     = this.readUint(32);
      this.modification_time = this.readUint(32);
      this.timescale         = this.readUint(32);
      this.duration          = this.readUint(32);      
    }
    
    this.rate      = this.readTemplate(32);
    this.volume    = this.readTemplate(16);
    this.reserved1 = this.readUint(16);
    this.reserved2 = [
      this.readUint(32),
      this.readUint(32)
    ];
    this.matrix = [];
    for (var i=0; i<9; i++) {
      this.matrix.push(this.readTemplate(32));
    }
    this.pre_defined = [];
    for (var i=0; i<6; i++) {
      this.pre_defined.push(this.readUint(32));
    }
    this.next_track_ID = this.readUint(32);
  }
  ISOBox.prototype.boxParsers['tkhd'] = function() {
    this.cursor.name += " tkhd";
    this.parseFullBox();
    
    if (this.version == 1) {
      this.creation_time = this.readUint(64);
      this.modification_time = this.readUint(64);
      this.track_ID = this.readUint(32);
      this.reserved1 = this.readUint(32);
      this.duration = this.readUint(64);
    } else {
      this.creation_time = this.readUint(32);
      this.modification_time = this.readUint(32);
      this.track_ID = this.readUint(32);
      this.reserved1 = this.readUint(32);
      this.duration = this.readUint(32);
    }
    
    this.reserved2 = [
      this.readUint(32),
      this.readUint(32)
    ];
    this.layer = this.readUint(16);
    this.alternate_group = this.readUint(16);
    this.volume = this.readTemplate(16);
    this.reserved3 = this.readUint(16);
    this.matrix = [];
    for (var i=0; i<9; i++) {
      this.matrix.push(this.readTemplate(32));
    }
    this.width = this.readUint(32);
    this.height = this.readUint(32);
  }
  ISOBox.prototype.boxParsers['trak'] = function() {
    this.cursor.name += " trak";
    this.boxes = [];
    while (this.cursor.offset < this.raw.byteLength) {
      this.boxes.push(ISOBox.parse(this.raw, this.cursor));
    }
  }

  var ISOFile = function(arrayBuffer) {
    this.raw = new DataView(arrayBuffer);
    this.cursor = new Cursor();
    this.cursor.name = 'ISOFile';
    this.boxes = [];
  }
  ISOFile.prototype.parse = function() {
    this.cursor.offset = 0;
    this.boxes = [];
    while (this.cursor.offset < this.raw.byteLength) {
      this.boxes.push(ISOBox.parse(this.raw, this.cursor));
    }
    return this;
  }
  
  exports.create = function(arrayBuffer) {
    return new ISOFile(arrayBuffer).parse();
  };
})(typeof exports === 'undefined'? this['ISOBoxer']={}: exports);