/*! codem-isoboxer v0.2.2 https://github.com/madebyhiro/codem-isoboxer/blob/master/LICENSE.txt */
var ISOBoxer = {};

ISOBoxer.parseBuffer = function(arrayBuffer) {
  return new ISOFile(arrayBuffer).parse();
};

ISOBoxer.Utils = {};
ISOBoxer.Utils.dataViewToString = function(dataView, encoding) {
  var impliedEncoding = encoding || 'utf-8'
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder(impliedEncoding).decode(dataView);
  }
  var a = [];
  var i = 0;
  
  if (impliedEncoding === 'utf-8') {
    /* The following algorithm is essentially a rewrite of the UTF8.decode at 
    http://bannister.us/weblog/2007/simple-base64-encodedecode-javascript/
    */
  
    while (i < dataView.byteLength) {
      var c = dataView.getUint8(i++);
      if (c < 0x80) {
        // 1-byte character (7 bits)
      } else if (c < 0xe0) {
        // 2-byte character (11 bits)
        c = (c & 0x1f) << 6;
        c |= (dataView.getUint8(i++) & 0x3f);
      } else if (c < 0xf0) {
        // 3-byte character (16 bits)
        c = (c & 0xf) << 12;
        c |= (dataView.getUint8(i++) & 0x3f) << 6;
        c |= (dataView.getUint8(i++) & 0x3f);
      } else {
        // 4-byte character (21 bits)
        c = (c & 0x7) << 18;
        c |= (dataView.getUint8(i++) & 0x3f) << 12;
        c |= (dataView.getUint8(i++) & 0x3f) << 6;
        c |= (dataView.getUint8(i++) & 0x3f);
      }
      a.push(String.fromCharCode(c));
    }
  } else { // Just map byte-by-byte (probably wrong)
    while (i < dataView.byteLength) {
      a.push(String.fromCharCode(dataView.getUint8(i++)));
    }
  }
  return a.join('');  
};

if (typeof exports !== 'undefined') {
  exports.parseBuffer = ISOBoxer.parseBuffer;
  exports.Utils       = ISOBoxer.Utils;
};
ISOBoxer.Cursor = function(initialOffset) {
  this.offset = (typeof initialOffset == 'undefined' ? 0 : initialOffset);
};
var ISOFile = function(arrayBuffer) {
  this._raw = new DataView(arrayBuffer);
  this._cursor = new ISOBoxer.Cursor();
  this.boxes = [];
}

ISOFile.prototype.fetch = function(type) {
  var result = this.fetchAll(type, true);
  return (result.length ? result[0] : null);
}

ISOFile.prototype.fetchAll = function(type, returnEarly) {
  var result = [];
  ISOFile._sweep.call(this, type, result, returnEarly);
  return result;
}

ISOFile.prototype.parse = function() {
  this._cursor.offset = 0;
  this.boxes = [];
  while (this._cursor.offset < this._raw.byteLength) {
    var box = ISOBox.parse(this);

    // Box could not be parsed
    if (typeof box.type === 'undefined') break;

    this.boxes.push(box);
  }
  return this;
}

ISOFile._sweep = function(type, result, returnEarly) {
  if (this.type && this.type == type) result.push(this);
  for (var box in this.boxes) {
    if (result.length && returnEarly) return;
    ISOFile._sweep.call(this.boxes[box], type, result, returnEarly);
  }
};
var ISOBox = function() {
  this._cursor = new ISOBoxer.Cursor();
}

ISOBox.parse = function(parent) {
  var newBox = new ISOBox();
  newBox._offset = parent._cursor.offset;
  newBox._root = (parent._root ? parent._root : parent);
  newBox._raw = parent._raw;
  newBox._parent = parent;
  newBox._parseBox();
  parent._cursor.offset = newBox._raw.byteOffset + newBox._raw.byteLength;
  return newBox;
}

ISOBox.prototype._readInt = function(size) {
  var result = null;
  switch(size) {
  case 8:
    result = this._raw.getInt8(this._cursor.offset - this._raw.byteOffset);
    break;
  case 16:
    result = this._raw.getInt16(this._cursor.offset - this._raw.byteOffset);
    break;
  case 32:
    result = this._raw.getInt32(this._cursor.offset - this._raw.byteOffset);
    break;
  case 64:
    // Warning: JavaScript cannot handle 64-bit integers natively.
    // This will give unexpected results for integers >= 2^53
    var s1 = this._raw.getInt32(this._cursor.offset - this._raw.byteOffset);
    var s2 = this._raw.getInt32(this._cursor.offset - this._raw.byteOffset + 4);
    result = (s1 * Math.pow(2,32)) + s2;
    break;
  }
  this._cursor.offset += (size >> 3);
  return result;        
}

ISOBox.prototype._readUint = function(size) {
  var result = null;
  switch(size) {
  case 8:
    result = this._raw.getUint8(this._cursor.offset - this._raw.byteOffset);
    break;
  case 16:
    result = this._raw.getUint16(this._cursor.offset - this._raw.byteOffset);
    break;
  case 24:
    var s1 = this._raw.getUint16(this._cursor.offset - this._raw.byteOffset);
    var s2 = this._raw.getUint8(this._cursor.offset - this._raw.byteOffset + 2);
    result = (s1 << 8) + s2;
    break;
  case 32:
    result = this._raw.getUint32(this._cursor.offset - this._raw.byteOffset);
    break;
  case 64:
    // Warning: JavaScript cannot handle 64-bit integers natively.
    // This will give unexpected results for integers >= 2^53
    var s1 = this._raw.getUint32(this._cursor.offset - this._raw.byteOffset);
    var s2 = this._raw.getUint32(this._cursor.offset - this._raw.byteOffset + 4);
    result = (s1 * Math.pow(2,32)) + s2;
    break;
  }
  this._cursor.offset += (size >> 3);
  return result;        
}

ISOBox.prototype._readString = function(length) {
  var str = '';
  for (var c = 0; c < length; c++) {
    var char = this._readUint(8);
    str += String.fromCharCode(char);
  }
  return str;    
}

ISOBox.prototype._readTerminatedString = function() {
  var str = '';
  while (true) {
    var char = this._readUint(8);
    if (char == 0) break;
    str += String.fromCharCode(char);
  }
  return str;
}

ISOBox.prototype._readTemplate = function(size) {
  var pre = this._readUint(size / 2);
  var post = this._readUint(size / 2);
  return pre + (post / Math.pow(2, size / 2));
}

ISOBox.prototype._parseBox = function() {
  this._cursor.offset = this._offset;
  
  // return immediately if there are not enough bytes to read the header
  if (this._offset + 8 > this._raw.buffer.byteLength) {
    this._root._incomplete = true;
    return;
  }
  
  this.size = this._readUint(32);
  this.type = this._readString(4);

  if (this.size == 1)      { this.largesize = this._readUint(64); }
  if (this.type == 'uuid') { this.usertype = this._readString(16); }

  switch(this.size) {
  case 0:
    this._raw = new DataView(this._raw.buffer, this._offset, (this._raw.byteLength - this._cursor.offset));
    break;
  case 1:
    if (this._offset + this.size > this._raw.buffer.byteLength) {
      this._incomplete = true;
      this._root._incomplete = true;
    } else {
      this._raw = new DataView(this._raw.buffer, this._offset, this.largesize);      
    }
    break;
  default:
    if (this._offset + this.size > this._raw.buffer.byteLength) {
      this._incomplete = true;
      this._root._incomplete = true;
    } else {
      this._raw = new DataView(this._raw.buffer, this._offset, this.size);      
    }
  }

  // additional parsing
  if (!this._incomplete && this._boxParsers[this.type]) this._boxParsers[this.type].call(this);    
}

ISOBox.prototype._parseFullBox = function() {
  this.version = this._readUint(8);
  this.flags = this._readUint(24);
}

ISOBox.prototype._boxParsers = {};;
// Simple container boxes, all from ISO/IEC 14496-12:2012 except vttc which is from 14496-30.
[
  'moov', 'trak', 'tref', 'mdia', 'minf', 'stbl', 'edts', 'dinf',
  'mvex', 'moof', 'traf', 'mfra', 'udta', 'meco', 'strk', 'vttc'
].forEach(function(boxType) {
  ISOBox.prototype._boxParsers[boxType] = function() {
    this.boxes = [];
    while (this._cursor.offset - this._raw.byteOffset < this._raw.byteLength) {
      this.boxes.push(ISOBox.parse(this));
    }  
  }  
})
;
// ISO/IEC 14496-12:2012 - 8.6.6 Edit List Box
ISOBox.prototype._boxParsers['elst'] = function() {
  this._parseFullBox();
  this.entry_count = this._readUint(32);
  this.entries = [];
  
  for (var i=1; i <= this.entry_count; i++) {
    var entry = {};
    if (this.version == 1) {
      entry.segment_duration  = this._readUint(64);
      entry.media_time        = this._readInt(64);
    } else {
      entry.segment_duration  = this._readUint(32);
      entry.media_time        = this._readInt(32);
    }
    entry.media_rate_integer  = this._readInt(16);
    entry.media_rate_fraction = this._readInt(16);
    this.entries.push(entry);
  }
};
// ISO/IEC 23009-1:2014 - 5.10.3.3 Event Message Box
ISOBox.prototype._boxParsers['emsg'] = function() {
  this._parseFullBox();
  this.scheme_id_uri           = this._readTerminatedString();
  this.value                   = this._readTerminatedString();
  this.timescale               = this._readUint(32);
  this.presentation_time_delta = this._readUint(32);
  this.event_duration          = this._readUint(32);
  this.id                      = this._readUint(32);
  this.message_data            = new DataView(this._raw.buffer, this._cursor.offset, this._raw.byteLength - (this._cursor.offset - this._offset));
};
// ISO/IEC 14496-12:2012 - 8.1.2 Free Space Box
ISOBox.prototype._boxParsers['free'] = ISOBox.prototype._boxParsers['skip'] = function() {
  this.data = new DataView(this._raw.buffer, this._cursor.offset, this._raw.byteLength - (this._cursor.offset - this._offset));
};
// ISO/IEC 14496-12:2012 - 4.3 File Type Box / 8.16.2 Segment Type Box
ISOBox.prototype._boxParsers['ftyp'] = ISOBox.prototype._boxParsers['styp'] = function() {
  this.major_brand = this._readString(4);
  this.minor_versions = this._readUint(32);
  this.compatible_brands = [];
  
  while (this._cursor.offset - this._raw.byteOffset < this._raw.byteLength) {
    this.compatible_brands.push(this._readString(4));
  }
};
// ISO/IEC 14496-12:2012 - 8.4.3 Handler Reference Box
ISOBox.prototype._boxParsers['hdlr'] = function() {
  this._parseFullBox();
  this.pre_defined = this._readUint(32);
  this.handler_type = this._readString(4);
  this.reserved = [this._readUint(32), this._readUint(32), this._readUint(32)]
  this.name = this._readTerminatedString()
};
// ISO/IEC 14496-12:2012 - 8.1.1 Media Data Box
ISOBox.prototype._boxParsers['mdat'] = function() {
  this.data = new DataView(this._raw.buffer, this._cursor.offset, this._raw.byteLength - (this._cursor.offset - this._offset));
};
// ISO/IEC 14496-12:2012 - 8.4.2 Media Header Box
ISOBox.prototype._boxParsers['mdhd'] = function() {
  this._parseFullBox();
  if (this.version == 1) {
    this.creation_time = this._readUint(64);
    this.modification_time = this._readUint(64);
    this.timescale = this._readUint(32);
    this.duration = this._readUint(64);
  } else {
    this.creation_time = this._readUint(32);
    this.modification_time = this._readUint(32);
    this.timescale = this._readUint(32);
    this.duration = this._readUint(32);
  }
  var language = this._readUint(16);
  this.pad = (language >> 15);
  this.language = String.fromCharCode(
    ((language >> 10) & 0x1F) + 0x60,
    ((language >> 5) & 0x1F) + 0x60,
    (language & 0x1F) + 0x60
  );
  this.pre_defined = this._readUint(16);
};
// ISO/IEC 14496-12:2012 - 8.8.5 Movie Fragment Header Box
ISOBox.prototype._boxParsers['mfhd'] = function() {
  this._parseFullBox();
  this.sequence_number = this._readUint(32);
};
// ISO/IEC 14496-12:2012 - 8.2.2 Movie Header Box
ISOBox.prototype._boxParsers['mvhd'] = function() {
  this._parseFullBox();
  
  if (this.version == 1) {
    this.creation_time     = this._readUint(64);
    this.modification_time = this._readUint(64);
    this.timescale         = this._readUint(32);
    this.duration          = this._readUint(64);
  } else {
    this.creation_time     = this._readUint(32);
    this.modification_time = this._readUint(32);
    this.timescale         = this._readUint(32);
    this.duration          = this._readUint(32);      
  }
  
  this.rate      = this._readTemplate(32);
  this.volume    = this._readTemplate(16);
  this.reserved1 = this._readUint(16);
  this.reserved2 = [ this._readUint(32), this._readUint(32) ];
  this.matrix = [];
  for (var i=0; i<9; i++) {
    this.matrix.push(this._readTemplate(32));
  }
  this.pre_defined = [];
  for (var i=0; i<6; i++) {
    this.pre_defined.push(this._readUint(32));
  }
  this.next_track_ID = this._readUint(32);
};
// ISO/IEC 14496-30:2014 - WebVTT Cue Payload Box.
ISOBox.prototype._boxParsers['payl'] = function() {
  var cue_text_raw = new DataView(this._raw.buffer, this._cursor.offset, this._raw.byteLength - (this._cursor.offset - this._offset));
  this.cue_text = ISOBoxer.Utils.dataViewToString(cue_text_raw);
}
;
// ISO/IEC 14496-12:2012 - 8.16.3 Segment Index Box
ISOBox.prototype._boxParsers['sidx'] = function() {
  this._parseFullBox();
  this.reference_ID = this._readUint(32);
  this.timescale = this._readUint(32);
  if (this.version == 0) {
    this.earliest_presentation_time = this._readUint(32);
    this.first_offset = this._readUint(32);
  } else {
    this.earliest_presentation_time = this._readUint(64);
    this.first_offset = this._readUint(64);    
  }
  this.reserved = this._readUint(16);
  this.reference_count = this._readUint(16);
  this.references = [];
  for (var i=0; i<this.reference_count; i++) {
    var ref = {};
    var reference = this._readUint(32);
    ref.reference_type = (reference >> 31) & 0x1;
    ref.referenced_size = reference & 0x7FFFFFFF;
    ref.subsegment_duration = this._readUint(32);
    var sap = this._readUint(32);
    ref.starts_with_SAP = (sap >> 31) & 0x1;
    ref.SAP_type = (sap >> 28) & 0x7;
    ref.SAP_delta_time = sap & 0xFFFFFFF;
    this.references.push(ref);
  }
};
// ISO/IEC 14496-12:2012 - 8.16.4 Subsegment Index Box
ISOBox.prototype._boxParsers['ssix'] = function() {
  this._parseFullBox();
  this.subsegment_count = this._readUint(32);
  this.subsegments = [];

  for (var i=0; i<this.subsegment_count; i++) {
    var subsegment = {};
    subsegment.ranges_count = this._readUint(32);
    subsegment.ranges = [];
    
    for (var j=0; j<subsegment.ranges_count; j++) {
      var range = {};
      range.level = this._readUint(8);
      range.range_size = this._readUint(24);
      subsegment.ranges.push(range);
    }
    this.subsegments.push(subsegment);
  }
};
// ISO/IEC 14496-12:2012 - 8.8.12 Track Fragmnent Decode Time
ISOBox.prototype._boxParsers['tfdt'] = function() {
  this._parseFullBox();
  if (this.version == 1) {
    this.baseMediaDecodeTime = this._readUint(64);
  } else {
    this.baseMediaDecodeTime = this._readUint(32);    
  }
};
// ISO/IEC 14496-12:2012 - 8.8.7 Track Fragment Header Box
ISOBox.prototype._boxParsers['tfhd'] = function() {
  this._parseFullBox();
  this.track_ID = this._readUint(32);
  if (this.flags & 0x1) this.base_data_offset = this._readUint(64);
  if (this.flags & 0x2) this.sample_description_offset = this._readUint(32);
  if (this.flags & 0x8) this.default_sample_duration = this._readUint(32);
  if (this.flags & 0x10) this.default_sample_size = this._readUint(32);
  if (this.flags & 0x20) this.default_sample_flags = this._readUint(32);
};
// ISO/IEC 14496-12:2012 - 8.3.2 Track Header Box
ISOBox.prototype._boxParsers['tkhd'] = function() {
  this._parseFullBox();
  
  if (this.version == 1) {
    this.creation_time     = this._readUint(64);
    this.modification_time = this._readUint(64);
    this.track_ID          = this._readUint(32);
    this.reserved1         = this._readUint(32);
    this.duration          = this._readUint(64);
  } else {
    this.creation_time     = this._readUint(32);
    this.modification_time = this._readUint(32);
    this.track_ID          = this._readUint(32);
    this.reserved1         = this._readUint(32);
    this.duration          = this._readUint(32);
  }
  
  this.reserved2 = [
    this._readUint(32),
    this._readUint(32)
  ];
  this.layer = this._readUint(16);
  this.alternate_group = this._readUint(16);
  this.volume = this._readTemplate(16);
  this.reserved3 = this._readUint(16);
  this.matrix = [];
  for (var i=0; i<9; i++) {
    this.matrix.push(this._readTemplate(32));
  }
  this.width = this._readUint(32);
  this.height = this._readUint(32);
};
// ISO/IEC 14496-12:2012 - 8.8.8 Track Run Box
// Note: the 'trun' box has a direct relation to the 'tfhd' box for defaults.
// These defaults are not set explicitly here, but are left to resolve for the user.
ISOBox.prototype._boxParsers['trun'] = function() {
  this._parseFullBox();
  this.sample_count = this._readUint(32);
  if (this.flags & 0x1) this.data_offset = this._readInt(32);
  if (this.flags & 0x4) this.first_sample_flags = this._readUint(32);
  this.samples = [];
  for (var i=0; i<this.sample_count; i++) {
    var sample = {};
    if (this.flags & 0x100) sample.sample_duration = this._readUint(32);
    if (this.flags & 0x200) sample.sample_size = this._readUint(32);
    if (this.flags & 0x400) sample.sample_flags = this._readUint(32);
    if (this.flags & 0x800) {
      if (this.version == 0) {
        sample.sample_composition_time_offset = this._readUint(32);
      } else {
        sample.sample_composition_time_offset = this._readInt(32);
      }
    }
    this.samples.push(sample);
  }
};
// ISO/IEC 14496-30:2014 - WebVTT Source Label Box
ISOBox.prototype._boxParsers['vlab'] = function() {
  var source_label_raw = new DataView(this._raw.buffer, this._cursor.offset, this._raw.byteLength - (this._cursor.offset - this._offset));
  this.source_label = ISOBoxer.Utils.dataViewToString(source_label_raw);
}
;
// ISO/IEC 14496-30:2014 - WebVTT Configuration Box
ISOBox.prototype._boxParsers['vttC'] = function() {
  var config_raw = new DataView(this._raw.buffer, this._cursor.offset, this._raw.byteLength - (this._cursor.offset - this._offset));
  this.config = ISOBoxer.Utils.dataViewToString(config_raw);
}
;
// ISO/IEC 14496-30:2014 - WebVTT Empty Sample Box
ISOBox.prototype._boxParsers['vtte'] = function() {
  // Nothing should happen here.
}
