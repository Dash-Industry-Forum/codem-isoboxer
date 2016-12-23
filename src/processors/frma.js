// ISO/IEC 14496-12:2012 - 8.12.2 Original Format Box
ISOBox.prototype._boxProcessors['frma'] = function() {
  this._procField('data_format', 'uint', 32);
};