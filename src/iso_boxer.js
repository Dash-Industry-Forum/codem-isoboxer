var ISOBoxer = ISOBoxer || {};

ISOBoxer.create = function(arrayBuffer) {
  return new ISOFile(arrayBuffer).parse();
};