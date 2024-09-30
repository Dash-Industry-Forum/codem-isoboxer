// ISO/IEC 14496-12:2012 - 9.1.4.1 Identified media data box
ISOBox.prototype._boxProcessors['imda'] = function() {
  this._procField('imda_identifier', 'uint', 32);
  // until the end of the box
  this._procField('data', 'data', -1);
};
