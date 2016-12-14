// ISO/IEC 14496-12:2012 - 8.8.5 Movie Fragment Header Box
ISOBox.prototype._boxProcessors['mfhd'] = function() {
  this._procFullBox();
  this._procField('sequence_number', 'uint', 32);
};
