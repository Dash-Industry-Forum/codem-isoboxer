(function(exports) {
  var Cursor = function(initialOffset) {
    this.offset = (typeof initialOffset == 'undefined' ? 0 : initialOffset);
  }
  
  var ISOBox = function() {
    this.cursor = new Cursor();
    this.cursor.name = 'ISOBox';
  }
  ISOBox.prototype.parseFullBox = function() {
    this.version = ISOUtils.readUint(this.raw, this.cursor, 8);
    this.flags = ISOUtils.readUint(this.raw, this.cursor, 24);
  }
  ISOBox.prototype.boxParsers = {};
  ISOBox.prototype.boxParsers['ftyp'] = function() {
    this.cursor.name += " ftyp";
    this.major_brand = ISOUtils.readString(this.raw, this.cursor, 4);
    this.minor_versions = ISOUtils.readUint(this.raw, this.cursor, 32);
    this.compatible_brands = [];
    
    while (this.cursor.offset < this.raw.byteLength) {
      this.compatible_brands.push(ISOUtils.readString(this.raw, this.cursor, 4));
    }
  }
  ISOBox.prototype.boxParsers['mvhd'] = function() {
    this.cursor.name += " mvhd";
    this.parseFullBox();
    
    if (this.version == 1) {
      this.creation_time = ISOUtils.readUint(this.raw, this.cursor, 64);
      this.modification_time = ISOUtils.readUint(this.raw, this.cursor, 64);
      this.timescale = ISOUtils.readUint(this.raw, this.cursor, 32);
      this.duration = ISOUtils.readUint(this.raw, this.cursor, 64);
    } else {
      this.creation_time = ISOUtils.readUint(this.raw, this.cursor, 32);
      this.modification_time = ISOUtils.readUint(this.raw, this.cursor, 32);
      this.timescale = ISOUtils.readUint(this.raw, this.cursor, 32);
      this.duration = ISOUtils.readUint(this.raw, this.cursor, 32);      
    }
    
    this.rate = ISOUtils.readTemplate(this.raw, this.cursor, 32);
    this.volume = ISOUtils.readTemplate(this.raw, this.cursor, 16);
    this.reserved1 = ISOUtils.readUint(this.raw, this.cursor, 16);
    this.reserved2 = [
      ISOUtils.readUint(this.raw, this.cursor, 32),
      ISOUtils.readUint(this.raw, this.cursor, 32)
    ];
    this.matrix = [];
    for (var i=0; i<9; i++) {
      this.matrix.push(ISOUtils.readTemplate(this.raw, this.cursor, 32));
    }
    this.pre_defined = [];
    for (var i=0; i<6; i++) {
      this.pre_defined.push(ISOUtils.readUint(this.raw, this.cursor, 32));
    }
    this.next_track_ID = ISOUtils.readUint(this.raw, this.cursor, 32);
  }
  ISOBox.prototype.boxParsers['moov'] = function() {
    this.cursor.name += " moov";
    this.boxes = [];
    while (this.cursor.offset < this.raw.byteLength) {
      var box = ISOUtils.parseBox(this.raw, this.cursor);
      this.boxes.push(box);
    }
  }
  ISOBox.prototype.boxParsers['tkhd'] = function() {
    this.cursor.name += " tkhd";
    this.parseFullBox();
    
    if (this.version == 1) {
      this.creation_time = ISOUtils.readUint(this.raw, this.cursor, 64);
      this.modification_time = ISOUtils.readUint(this.raw, this.cursor, 64);
      this.track_ID = ISOUtils.readUint(this.raw, this.cursor, 32);
      this.reserved1 = ISOUtils.readUint(this.raw, this.cursor, 32);
      this.duration = ISOUtils.readUint(this.raw, this.cursor, 64);
    } else {
      this.creation_time = ISOUtils.readUint(this.raw, this.cursor, 32);
      this.modification_time = ISOUtils.readUint(this.raw, this.cursor, 32);
      this.track_ID = ISOUtils.readUint(this.raw, this.cursor, 32);
      this.reserved1 = ISOUtils.readUint(this.raw, this.cursor, 32);
      this.duration = ISOUtils.readUint(this.raw, this.cursor, 32);
    }
    
    this.reserved2 = [
      ISOUtils.readUint(this.raw, this.cursor, 32),
      ISOUtils.readUint(this.raw, this.cursor, 32)
    ];
    this.layer = ISOUtils.readUint(this.raw, this.cursor, 16);
    this.alternate_group = ISOUtils.readUint(this.raw, this.cursor, 16);
    this.volume = ISOUtils.readTemplate(this.raw, this.cursor, 16);
    this.reserved3 = ISOUtils.readUint(this.raw, this.cursor, 16);
    this.matrix = [];
    for (var i=0; i<9; i++) {
      this.matrix.push(ISOUtils.readTemplate(this.raw, this.cursor, 32));
    }
    this.width = ISOUtils.readUint(this.raw, this.cursor, 32);
    this.height = ISOUtils.readUint(this.raw, this.cursor, 32);
  }
  ISOBox.prototype.boxParsers['trak'] = function() {
    this.cursor.name += " trak";
    this.boxes = [];
    while (this.cursor.offset < this.raw.byteLength) {
      var box = ISOUtils.parseBox(this.raw, this.cursor);
      this.boxes.push(box);
    }
  }

  var ISOFile = function(arrayBuffer) {
    this.dataView = new DataView(arrayBuffer);
    this.cursor = new Cursor();
    this.cursor.name = 'ISOFile';
    this.boxes = [];
  }

  ISOFile.prototype.getRootBoxes = function() {
    this.cursor.offset = 0;
    while (this.cursor.offset < this.dataView.byteLength) {
      var box = ISOUtils.parseBox(this.dataView, this.cursor);
      this.boxes.push(box);
    }
  }
  
  ISOFile.prototype.parse = function(cb) {
    this.getRootBoxes();
    cb(null, this);
  }
  
  var ISOUtils = {};
  ISOUtils.parseBox = function(view, cursor) {
    var newBox = new ISOBox();
    newBox.offset = cursor.offset;
    newBox.size = ISOUtils.readUint(view, cursor, 32);
    newBox.type = ISOUtils.readString(view, cursor, 4);
    console.log("type: " + newBox.type)
    if (newBox.size == 1)      { newBox.largesize = ISOUtils.readUint(view, cursor, 64); }
    if (newBox.type == 'uuid') { newBox.usertype = ISOUtils.readString(view, cursor, 16); }

    newBox.cursor.offset = cursor.offset;

    switch(newBox.size) {
    case 0:
      cursor.offset = view.byteLength;
      newBox.raw = new DataView(view.buffer, newBox.offset, (view.byteLength - cursor.offset));
      break;
    case 1:
      cursor.offset = newBox.offset + newBox.largesize;
      newBox.raw = new DataView(view.buffer, newBox.offset, newBox.largesize);
      break;
    default:
      cursor.offset = newBox.offset + newBox.size;
      newBox.raw = new DataView(view.buffer, newBox.offset, newBox.size);
    }

    // additional parsing
    if (newBox.boxParsers[newBox.type]) newBox.boxParsers[newBox.type].call(newBox);
    //console.log(newBox);
    return newBox;
  }
  ISOUtils.readString = function(view, cursor, length) {
    var str = '';
    for (var c = 0; c < length; c++) {
      var char = ISOUtils.readUint(view, cursor, 8);
      str += String.fromCharCode(char);
    }
    return str;    
  }
  ISOUtils.readTemplate = function(view, cursor, size) {
    var pre = ISOUtils.readUint(view, cursor, size / 2);
    var post = ISOUtils.readUint(view, cursor, size / 2);
    return pre + (post / Math.pow(2, size / 2));
  }
  
  ISOUtils.readUint = function(view, cursor, size) {
    console.log(cursor.name + ": " + cursor.offset);
    var result = null;
    switch(size) {
    case 8:
      result = view.getUint8(cursor.offset - view.byteOffset);
      break;
    case 16:
      result = view.getUint16(cursor.offset - view.byteOffset);
      break;
    case 24:
      var s1 = view.getUint16(cursor.offset - view.byteOffset);
      var s2 = view.getUint8(cursor.offset - view.byteOffset + 2);
      result = (s1 << 4) + s2;
      break;
    case 32:
      result = view.getUint32(cursor.offset - view.byteOffset);
      break;
    case 64:
      var s1 = view.getUint32(cursor.offset - view.byteOffset);
      var s2 = view.getUint32(cursor.offset - view.byteOffset + 4);
      result = (s1 << 8) + s2;
      break;
    }
    cursor.offset += (size >> 3);
    return result;    
  }
  
  exports.create = function(arrayBuffer, cb) {
    var file = new ISOFile(arrayBuffer);
    file.parse(cb);
  };
})(typeof exports === 'undefined'? this['ISOBoxer']={}: exports);