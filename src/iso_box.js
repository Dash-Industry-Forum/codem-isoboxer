var ISOBox = function() {
  this._cursor = new ISOBoxer.Cursor();
};

ISOBox.parse = function(parent) {
  var newBox = new ISOBox();
  newBox._offset = parent._cursor.offset;
  newBox._root = (parent._root ? parent._root : parent);
  newBox._raw = parent._raw;
  newBox._parent = parent;
  newBox._parseBox();
  parent._cursor.offset = newBox._raw.byteOffset + newBox._raw.byteLength;
  return newBox;
};

ISOBox.create = function(type, parent) {
  var newBox = new ISOBox();
  newBox.type = type;
  newBox.boxes = [];
  newBox._offset = parent._cursor.offset;
  newBox._root = (parent._root ? parent._root : parent);
  newBox._raw = parent._raw;
  newBox._parent = parent;
  return newBox;
};

ISOBox.prototype._boxContainers = ['dinf', 'edts', 'mdia', 'meco', 'mfra', 'minf', 'moof', 'moov', 'mvex', 'stbl', 'strk', 'traf', 'trak', 'tref', 'udta', 'vttc'];

ISOBox.prototype._boxProcessors = {};

///////////////////////////////////////////////////////////////////////////////////////////////////
// Generic read/write functions

ISOBox.prototype._procField = function (name, type, size) {
  if (this._parsing) {
    this[name] = this._readField(type, size);
  }
  // @ifdef WRITE
  else {
    this._writeField(type, size, this[name]);
  }
  // @endif
};

ISOBox.prototype._procFieldArray = function (name, length, type, size) {
  var i;
  if (this._parsing) {
    this[name] = [];
    for (i = 0; i < length; i++) {
      this[name][i] = this._readField(type, size);
    }
  }
  // @ifdef WRITE
  else {
    for (i = 0; i < this[name].length; i++) {
      this._writeField(type, size, this[name][i]);
    }
  }
  // @endif
};

ISOBox.prototype._procFullBox = function() {
  this._procField('version', 'uint', 8);
  this._procField('flags', 'uint', 24);
};

ISOBox.prototype._procEntries = function(name, length, fn) {
  var i;
  if (this._parsing) {
    this[name] = [];
    for (i = 0; i < length; i++) {
      this[name].push({});
      fn.call(this, this[name][i]);
    }
  }
  // @ifdef WRITE
  else {
    for (i = 0; i < length; i++) {
      fn.call(this, this[name][i]);
    }
  }
  // @endif
};

ISOBox.prototype._procSubEntries = function(entry, name, length, fn) {
  var i;
  if (this._parsing) {
    entry[name] = [];
    for (i = 0; i < length; i++) {
      entry[name].push({});
      fn.call(this, entry[name][i]);
    }
  }
  // @ifdef WRITE
  else {
    for (i = 0; i < length; i++) {
      fn.call(this, entry[name][i]);
    }
  }
  // @endif
};

ISOBox.prototype._procEntryField = function (entry, name, type, size) {
  if (this._parsing) {
    entry[name] = this._readField(type, size);
  }
  // @ifdef WRITE
  else {
    this._writeField(type, size, entry[name]);
  }
  // @endif
};

ISOBox.prototype._procSubBoxes = function(name, length) {
  var i;
  if (this._parsing) {
    this[name] = [];
    for (i = 0; i < length; i++) {
      this[name].push(ISOBox.parse(this));
    }
  }
  // @ifdef WRITE
  else {
    for (i = 0; i < length; i++) {
      if (this._rawo) {
        this[name][i].write();
      } else {
        this.size += this[name][i].getLength();
      }
    }
  }
  // @endif
};

///////////////////////////////////////////////////////////////////////////////////////////////////
// Read/parse functions

ISOBox.prototype._readField = function(type, size) {
  switch (type) {
    case 'uint':
      return this._readUint(size);
    case 'int':
      return this._readInt(size);
    case 'template':
      return this._readTemplate(size);
    case 'string':
      return (size === -1) ? this._readTerminatedString() : this._readString(size);
    case 'data':
      return this._readData(size);
    case 'utf8':
      return this._readUTF8String();
    default:
      return -1;
  }
};

ISOBox.prototype._readInt = function(size) {
  var result = null,
      offset = this._cursor.offset - this._raw.byteOffset;
  switch(size) {
  case 8:
    result = this._raw.getInt8(offset);
    break;
  case 16:
    result = this._raw.getInt16(offset);
    break;
  case 32:
    result = this._raw.getInt32(offset);
    break;
  case 64:
    // Warning: JavaScript cannot handle 64-bit integers natively.
    // This will give unexpected results for integers >= 2^53
    var s1 = this._raw.getInt32(offset);
    var s2 = this._raw.getInt32(offset + 4);
    result = (s1 * Math.pow(2,32)) + s2;
    break;
  }
  this._cursor.offset += (size >> 3);
  return result;
};

ISOBox.prototype._readUint = function(size) {
  var result = null,
      offset = this._cursor.offset - this._raw.byteOffset,
      s1, s2;
  switch(size) {
  case 8:
    result = this._raw.getUint8(offset);
    break;
  case 16:
    result = this._raw.getUint16(offset);
    break;
  case 24:
    s1 = this._raw.getUint16(offset);
    s2 = this._raw.getUint8(offset + 2);
    result = (s1 << 8) + s2;
    break;
  case 32:
    result = this._raw.getUint32(offset);
    break;
  case 64:
    // Warning: JavaScript cannot handle 64-bit integers natively.
    // This will give unexpected results for integers >= 2^53
    s1 = this._raw.getUint32(offset);
    s2 = this._raw.getUint32(offset + 4);
    result = (s1 * Math.pow(2,32)) + s2;
    break;
  }
  this._cursor.offset += (size >> 3);
  return result;
};

ISOBox.prototype._readString = function(length) {
  var str = '';
  for (var c = 0; c < length; c++) {
    var char = this._readUint(8);
    str += String.fromCharCode(char);
  }
  return str;
};

ISOBox.prototype._readTemplate = function(size) {
  var pre = this._readUint(size / 2);
  var post = this._readUint(size / 2);
  return pre + (post / Math.pow(2, size / 2));
};

ISOBox.prototype._readTerminatedString = function() {
  var str = '';
  while (this._cursor.offset - this._offset < this._raw.byteLength) {
    var char = this._readUint(8);
    if (char === 0) break;
    str += String.fromCharCode(char);
  }
  return str;
};

ISOBox.prototype._readData = function(size) {
  var length = (size > 0) ? size : (this._raw.byteLength - (this._cursor.offset - this._offset));
  var data = new DataView(this._raw.buffer, this._cursor.offset, length);
  this._cursor.offset += length;
  return data;
};

ISOBox.prototype._parseBox = function() {
  this._parsing = true;
  this._cursor.offset = this._offset;

  // return immediately if there are not enough bytes to read the header
  if (this._offset + 8 > this._raw.buffer.byteLength) {
    this._root._incomplete = true;
    return;
  }

  this._procField('size', 'uint', 32);
  this._procField('type', 'string', 4);

  if (this.size === 1)      { this._procField('largesize', 'uint', 64); }
  if (this.type === 'uuid') { this._procFieldArray('usertype', 16, 'uint', 8); }

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
  if (!this._incomplete) {
    if (this._boxContainers.indexOf(this.type) !== -1) {
      this._parseContainerBox();
    } else if (this._boxProcessors[this.type]) {
      this._boxProcessors[this.type].call(this);
    }
  }
};

ISOBox.prototype._parseFullBox = function() {
  this.version = this._readUint(8);
  this.flags = this._readUint(24);
};

ISOBox.prototype._parseContainerBox = function() {
  this.boxes = [];
  while (this._cursor.offset - this._raw.byteOffset < this._raw.byteLength) {
    this.boxes.push(ISOBox.parse(this));
  }
};


