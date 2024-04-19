// ISO/IEC 14496-12:202x - 8.4.6 Extended language tag
ISOBox.prototype._boxProcessors['elng'] = function() {
  this._procFullBox();
  this._procField('extended_language', 'utf8string');
};
