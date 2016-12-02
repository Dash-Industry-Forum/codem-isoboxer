var ISOFile = function(arrayBuffer) {
  this._cursor = new ISOBoxer.Cursor();
  this.boxes = [];
  if (arrayBuffer) {
    this._raw = new DataView(arrayBuffer);
  }
};

ISOFile.prototype.fetch = function(type) {
  var result = this.fetchAll(type, true);
  return (result.length ? result[0] : null);
};

ISOFile.prototype.fetchAll = function(type, returnEarly) {
  var result = [];
  ISOFile._sweep.call(this, type, result, returnEarly);
  return result;
};

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
};

ISOFile._sweep = function(type, result, returnEarly) {
  if (this.type && this.type == type) result.push(this);
  for (var box in this.boxes) {
    if (result.length && returnEarly) return;
    ISOFile._sweep.call(this.boxes[box], type, result, returnEarly);
  }
};

// @ifdef WRITE
ISOFile.prototype.write = function() {

  var length = 0,
      i;

  for (i = 0; i < this.boxes.length; i++) {
    length += this.boxes[i].getLength(false);
  }

  var bytes = new Uint8Array(length);
  this._rawo = new DataView(bytes.buffer);
  this.bytes = bytes;
  this._cursor.offset = 0;

  for (i = 0; i < this.boxes.length; i++) {
    this.boxes[i].write();
  }

  return bytes.buffer;
};

ISOFile.prototype.create = function(type, parent, previousType) {

  var newBox = ISOBox.create(type, parent),
      inserted = false;

  if (previousType) {
    for (var i = 0; i < parent.boxes.length; i++) {
      if (previousType === parent.boxes[i].type) {
        parent.boxes.splice(i + 1, 0, newBox);
        inserted = true;
        break;
      }
    }
  }

  if (!inserted) {
    parent.boxes.push(newBox);
  }

  return newBox;
};
// @endif
