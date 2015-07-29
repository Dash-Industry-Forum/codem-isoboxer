// ISO/IEC 14496-12:2012 - 8.8.7 Track Fragment Header Box
ISOBox.prototype._boxParsers['tfhd'] = function() {
  this._parseFullBox();
  this.track_ID = this._readUint(32);
  if (this.flags & 0x1) this.base_data_offset = this._readUint(64);
  if (this.flags & 0x2) this.sample_description_offset = this._readUint(32);
  if (this.flags & 0x8) this.default_sample_duration = this._readUint(32);
  if (this.flags & 0x10) this.default_sample_size = this._readUint(32);
  if (this.flags & 0x20) this.default_sample_flags = this._readUint(32);
}