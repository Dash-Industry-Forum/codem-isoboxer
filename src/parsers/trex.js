// ISO/IEC 14496-12:2012 - 8.8.3 Track Extends Box
ISOBox.prototype._boxParsers['trex'] = function() {
  this._parseFullBox();

  this.track_ID = this._readUint(32);
  this.default_sample_description_index = this._readUint(32);
  this.default_sample_duration = this._readUint(32);
  this.default_sample_size = this._readUint(32);
  this.default_sample_flags = this._readUint(32);
}