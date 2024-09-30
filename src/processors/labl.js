// ISO/IEC 14496-12:202x - 8.10.5 Label box
ISOBox.prototype._boxProcessors['labl'] = function() {
  this._procFullBox();
  this.is_group_label = (this.flags & 0x1) != 0;
  this._procField('label_id', 'uint', 16);
  this._procField('language', 'utf8string');
  this._procField('label', 'utf8string');
};
