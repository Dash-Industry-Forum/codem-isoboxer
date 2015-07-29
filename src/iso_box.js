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

ISOBox.prototype._boxParsers = {};