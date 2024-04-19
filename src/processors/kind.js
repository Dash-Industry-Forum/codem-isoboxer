// ISO/IEC 14496-12:202x - 8.10.4 Track kind box
ISOBox.prototype._boxProcessors['kind'] = function() {
  this._procFullBox();

  this._procField('schemeURI', 'utf8string');
  this._procField('value', 'utf8string');
};
