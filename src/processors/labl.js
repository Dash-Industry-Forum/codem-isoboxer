// ISO/IEC 14496-12:202x - 8.10.5 Label box
ISOBox.prototype._boxProcessors['labl'] = function() {
  this._procFullBox();
  var packed = this._readField('uint', 8);
  this.is_group_label = packed >> 7;
  this.reserved = packed & 0x7f;
  this._procField('label_id', 'uint', 16);
  this._procField('language', 'utf8string');
  this._procField('label', 'utf8string');
};
