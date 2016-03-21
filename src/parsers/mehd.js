// ISO/IEC 14496-12:2012 - 8.8.2 Movie Extends Header Box
ISOBox.prototype._boxParsers['mehd'] = function() {
  this._parseFullBox();

  if (this.version == 1) {
    this.fragment_duration = this._readUint(64);
   } else { // version==0
    this.fragment_duration = this._readUint(32);
   }
}