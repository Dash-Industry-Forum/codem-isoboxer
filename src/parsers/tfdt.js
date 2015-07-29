// ISO/IEC 14496-12:2012 - 8.8.12 Track Fragmnent Decode Time
ISOBox.prototype._boxParsers['tfdt'] = function() {
  this._parseFullBox();
  if (this.version == 1) {
    this.baseMediaDecodeTime = this._readUint(64);
  } else {
    this.baseMediaDecodeTime = this._readUint(32);    
  }
}