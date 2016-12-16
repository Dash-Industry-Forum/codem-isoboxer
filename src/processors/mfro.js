// ISO/IEC 14496-12:2012 - 8.8.11 Movie Fragment Random Access Box
ISOBox.prototype._boxProcessors['mfro'] = function() {
  this._procFullBox();
  this._procField('mfra_size', 'uint', 32); // Called mfra_size to distinguish from the normal "size" attribute of a box
};

