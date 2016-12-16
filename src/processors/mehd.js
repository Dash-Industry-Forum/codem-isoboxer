// ISO/IEC 14496-12:2012 - 8.8.2 Movie Extends Header Box
ISOBox.prototype._boxProcessors['mehd'] = function() {
  this._procFullBox();
  this._procField('fragment_duration', 'uint', (this.version == 1) ? 64 : 32);
};
