// ISO/IEC 14496-12:2012 - 8.4.5.3 Sound Media Header Box
ISOBox.prototype._boxProcessors['smhd'] = function() {
  this._procFullBox();
  this._procField('balance',  'uint', 16);
  this._procField('reserved', 'uint', 16);
};
