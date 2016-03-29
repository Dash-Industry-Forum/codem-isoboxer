// ISO/IEC 14496-12:2012 - 8.8.11 Movie Fragment Random Access Box
ISOBox.prototype._boxParsers['mfro'] = function() {
  this._parseFullBox();
  this.mfra_size = this._readUint(32); // Called mfra_size to distinguish from the normal "size" attribute of a box
}
