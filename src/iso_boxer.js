var ISOBoxer = ISOBoxer || {};

ISOBoxer.parseBuffer = function(arrayBuffer) {
  return new ISOFile(arrayBuffer).parse();
};

ISOBoxer.Utils = {};
ISOBoxer.Utils.dataViewToString = function(dataView) {
  var str = '';
  for (var i=0; i<dataView.byteLength; i++) {
    str += String.fromCharCode(dataView.getUint8(i));
  }
  return str;  
};

if (typeof exports !== 'undefined') {
  exports.parseBuffer = ISOBoxer.parseBuffer;
  exports.Utils       = ISOBoxer.Utils;
}