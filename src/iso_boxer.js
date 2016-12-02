var ISOBoxer = {};

ISOBoxer.parseBuffer = function(arrayBuffer) {
  return new ISOFile(arrayBuffer).parse();
};

ISOBoxer.addBoxProcessor = function(type, parser) {
  if (typeof type !== 'string' || typeof parser !== 'function') {
    return;
  }
  ISOBox.prototype._boxProcessors[type] = parser;
};

// @ifdef WRITE
ISOBoxer.createFile = function() {
  return new ISOFile();
};

ISOBoxer.createBox = function(type, parent, previousType) {

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

ISOBoxer.createFullBox = function(type, parent, previousType) {
  var newBox = ISOBoxer.createBox(type, parent, previousType);
  newBox.version = 0;
  newBox.flags = 0;
  return newBox;
};
// @endif

ISOBoxer.Utils = {};
ISOBoxer.Utils.dataViewToString = function(dataView, encoding) {
  var impliedEncoding = encoding || 'utf-8';
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

// @ifdef WRITE
ISOBoxer.Utils.utf8ToByteArray = function(string) {
  // Only UTF-8 encoding is supported by TextEncoder
  var u, i;
  if (typeof TextEncoder !== 'undefined') {
    u = new TextEncoder().encode(string);
  } else {
    u = [];
    for (i = 0; i < string.length; ++i) {
      var c = string.charCodeAt(i);
      if (c < 0x80) {
        u.push(c);
      } else if (c < 0x800) {
        u.push(0xC0 | (c >> 6));
        u.push(0x80 | (63 & c));
      } else if (c < 0x10000) {
        u.push(0xE0 | (c >> 12));
        u.push(0x80 | (63 & (c >> 6)));
        u.push(0x80 | (63 & c));
      } else {
        u.push(0xF0 | (c >> 18));
        u.push(0x80 | (63 & (c >> 12)));
        u.push(0x80 | (63 & (c >> 6)));
        u.push(0x80 | (63 & c));
      }
    }
  }
  return u;
};
// @endif

if (typeof exports !== 'undefined') {
  exports.parseBuffer     = ISOBoxer.parseBuffer;
  exports.addBoxProcessor = ISOBoxer.addBoxProcessor;
  // @ifdef WRITE
  exports.createFile      = ISOBoxer.createFile;
  exports.createBox       = ISOBoxer.createBox;
  exports.createFullBox   = ISOBoxer.createFullBox;
  // @endif
  exports.Utils           = ISOBoxer.Utils;
}