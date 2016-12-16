// ISO/IEC 14496-30:2014 - WebVTT Source Label Box
ISOBox.prototype._boxProcessors['vlab'] = function() {
  this._procField('source_label', 'utf8');
};
