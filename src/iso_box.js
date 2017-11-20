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

ISOBox.create = function(type) {
  var newBox = new ISOBox();
  newBox.type = type;
  newBox.boxes = [];
  return newBox;
};

ISOBox.prototype._boxContainers = ['dinf', 'edts', 'mdia', 'meco', 'mfra', 'minf', 'moof', 'moov', 'mvex', 'stbl', 'strk', 'traf', 'trak', 'tref', 'udta', 'vttc', 'sinf', 'schi', 'encv', 'enca'];

ISOBox.prototype._boxProcessors = {};

///////////////////////////////////////////////////////////////////////////////////////////////////
// Generic read/write functions

ISOBox.prototype._procField = function (name, type, size) {
  if (this._parsing) {
    this[name] = this._readField(type, size);
  }
  // @if WRITE
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
  // @if WRITE
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
  // @if WRITE
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
  // @if WRITE
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
  // @if WRITE
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
  // @if WRITE
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
  if (length > 0) {
    var data = new Uint8Array(this._raw.buffer, this._cursor.offset, length);

    this._cursor.offset += length;
    return data;
  }
  else {
    return null;
  }
};

ISOBox.prototype._readUTF8String = function() {
  var length = this._raw.byteLength - (this._cursor.offset - this._offset);
  var data = null;
  if (length > 0) {
    data = new DataView(this._raw.buffer, this._cursor.offset, length);
    this._cursor.offset += length;
  }
 
  return data ? ISOBoxer.Utils.dataViewToString(data) : data;
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
    this._raw = new DataView(this._raw.buffer, this._offset, (this._raw.byteLength - this._cursor.offset + 8));
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
    if (this._boxProcessors[this.type]) {
      this._boxProcessors[this.type].call(this);
    }
    if (this._boxContainers.indexOf(this.type) !== -1) {
      this._parseContainerBox();
    } else{
      // Unknown box => read and store box content
      this._data = this._readData();
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

// @if WRITE
///////////////////////////////////////////////////////////////////////////////////////////////////
// Write functions

ISOBox.prototype.append = function(box, pos) {
  ISOBoxer.Utils.appendBox(this, box, pos);
};

ISOBox.prototype.getLength = function() {
  this._parsing = false;
  this._rawo = null;

  this.size = 0;
  this._procField('size', 'uint', 32);
  this._procField('type', 'string', 4);

  if (this.size === 1)      { this._procField('largesize', 'uint', 64); }
  if (this.type === 'uuid') { this._procFieldArray('usertype', 16, 'uint', 8); }

  if (this._boxProcessors[this.type]) {
    this._boxProcessors[this.type].call(this);
  }

  if (this._boxContainers.indexOf(this.type) !== -1) {
    for (var i = 0; i < this.boxes.length; i++) {
      this.size += this.boxes[i].getLength();
    }
  } 

  if (this._data) {
    this._writeData(this._data);
  }

  return this.size;
};

ISOBox.prototype.write = function() {
  this._parsing = false;
  this._cursor.offset = this._parent._cursor.offset;

  switch(this.size) {
  case 0:
    this._rawo = new DataView(this._parent._rawo.buffer, this._cursor.offset, (this.parent._rawo.byteLength - this._cursor.offset));
    break;
  case 1:
      this._rawo = new DataView(this._parent._rawo.buffer, this._cursor.offset, this.largesize);
    break;
  default:
      this._rawo = new DataView(this._parent._rawo.buffer, this._cursor.offset, this.size);
  }

  this._procField('size', 'uint', 32);
  this._procField('type', 'string', 4);

  if (this.size === 1)      { this._procField('largesize', 'uint', 64); }
  if (this.type === 'uuid') { this._procFieldArray('usertype', 16, 'uint', 8); }

  if (this._boxProcessors[this.type]) {
    this._boxProcessors[this.type].call(this);
  }

  if (this._boxContainers.indexOf(this.type) !== -1) {
    for (var i = 0; i < this.boxes.length; i++) {
      this.boxes[i].write();
    }
  } 

  if (this._data) {
    this._writeData(this._data);
  }

  this._parent._cursor.offset += this.size;

  return this.size;
};

ISOBox.prototype._writeInt = function(size, value) {
  if (this._rawo) {
    var offset = this._cursor.offset - this._rawo.byteOffset;
    switch(size) {
    case 8:
      this._rawo.setInt8(offset, value);
      break;
    case 16:
      this._rawo.setInt16(offset, value);
      break;
    case 32:
      this._rawo.setInt32(offset, value);
      break;
    case 64:
      // Warning: JavaScript cannot handle 64-bit integers natively.
      // This will give unexpected results for integers >= 2^53
      var s1 = Math.floor(value / Math.pow(2,32));
      var s2 = value - (s1 * Math.pow(2,32));
      this._rawo.setUint32(offset, s1);
      this._rawo.setUint32(offset + 4, s2);
      break;
    }
    this._cursor.offset += (size >> 3);
  } else {
    this.size += (size >> 3);
  }
};

ISOBox.prototype._writeUint = function(size, value) {

  if (this._rawo) {
    var offset = this._cursor.offset - this._rawo.byteOffset,
        s1, s2;
    switch(size) {
    case 8:
      this._rawo.setUint8(offset, value);
      break;
    case 16:
      this._rawo.setUint16(offset, value);
      break;
    case 24:
      s1 = (value & 0xFFFF00) >> 8;
      s2 = (value & 0x0000FF);
      this._rawo.setUint16(offset, s1);
      this._rawo.setUint8(offset + 2, s2);
      break;
    case 32:
      this._rawo.setUint32(offset, value);
      break;
    case 64:
      // Warning: JavaScript cannot handle 64-bit integers natively.
      // This will give unexpected results for integers >= 2^53
      s1 = Math.floor(value / Math.pow(2,32));
      s2 = value - (s1 * Math.pow(2,32));
      this._rawo.setUint32(offset, s1);
      this._rawo.setUint32(offset + 4, s2);
      break;
    }
    this._cursor.offset += (size >> 3);
  } else {
    this.size += (size >> 3);
  }
};

ISOBox.prototype._writeString = function(size, str) {
  for (var c = 0; c < size; c++) {
    this._writeUint(8, str.charCodeAt(c));
  }
};

ISOBox.prototype._writeTerminatedString = function(str) {
  if (str.length === 0) {
    return;
  }
  for (var c = 0; c < str.length; c++) {
    this._writeUint(8, str.charCodeAt(c));
  }
  this._writeUint(8, 0);
};

ISOBox.prototype._writeTemplate = function(size, value) {
  var pre = Math.floor(value);
  var post = (value - pre) * Math.pow(2, size / 2);
  this._writeUint(size / 2, pre);
  this._writeUint(size / 2, post);
};

ISOBox.prototype._writeData = function(data) {
  var i;
  //data to copy
  if (data) {
    if (this._rawo) {
      //Array and Uint8Array has also to be managed
      if (data instanceof Array) {
        var offset = this._cursor.offset - this._rawo.byteOffset;
        for (var i = 0; i < data.length; i++) {
          this._rawo.setInt8(offset + i, data[i]);
        }
        this._cursor.offset += data.length;
      } 

      if (data instanceof Uint8Array) {
        this._root.bytes.set(data, this._cursor.offset);
        this._cursor.offset += data.length;
      }

    } else {
      //nothing to copy only size to compute
      this.size += data.length;
    }
  }
};

ISOBox.prototype._writeUTF8String = function(string) {
  var u = ISOBoxer.Utils.utf8ToByteArray(string);
  if (this._rawo) {
    var dataView = new DataView(this._rawo.buffer, this._cursor.offset, u.length);
    for (var i = 0; i < u.length; i++) {
      dataView.setUint8(i, u[i]);
    }
  } else {
    this.size += u.length;
  }
};

ISOBox.prototype._writeField = function(type, size, value) {
  switch (type) {
  case 'uint':
    this._writeUint(size, value);
    break;
  case 'int':
    this._writeInt(size, value);
    break;
  case 'template':
    this._writeTemplate(size, value);
    break;
  case 'string':
      if (size == -1) {
        this._writeTerminatedString(value);
      } else {
        this._writeString(size, value);
      }
      break;
  case 'data':
    this._writeData(value);
    break;
  case 'utf8':
    this._writeUTF8String(value);
    break;
  default:
    break;
  }
};
// @endif
