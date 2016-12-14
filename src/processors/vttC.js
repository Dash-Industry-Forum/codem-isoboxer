// ISO/IEC 14496-30:2014 - WebVTT Configuration Box
ISOBox.prototype._boxProcessors['vttC'] = function() {
  this._procField('config', 'utf8');
};
