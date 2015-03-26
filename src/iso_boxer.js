var ISOBoxer = ISOBoxer || {};

ISOBoxer.create = function(arrayBuffer) {
  return new ISOFile(arrayBuffer).parse();
};

if (typeof exports !== 'undefined') exports.create = ISOBoxer.create;