// ISO/IEC 14496-12:2012 - 8.1.1 Media Data Box
ISOBox.prototype._boxParsers['mdat'] = function() {
  this.data = this._readData();
}