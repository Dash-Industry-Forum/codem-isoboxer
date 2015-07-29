// ISO/IEC 14496-12:2012 - 8.8.5 Movie Fragment Header Box
ISOBox.prototype._boxParsers['mfhd'] = function() {
  this._parseFullBox();
  this.sequence_number = this._readUint(32);
}