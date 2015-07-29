// ISO/IEC 14496-12:2012 - 8.8.8 Track Run Box
// Note: the 'trun' box has a direct relation to the 'tfhd' box for defaults.
// These defaults are not set explicitly here, but are left to resolve for the user.
ISOBox.prototype._boxParsers['trun'] = function() {
  this._parseFullBox();
  this.sample_count = this._readUint(32);
  if (this.flags & 0x1) this.data_offset = this._readInt(32);
  if (this.flags & 0x4) this.first_sample_flags = this._readUint(32);
  this.samples = [];
  for (var i=0; i<this.sample_count; i++) {
    var sample = {};
    if (this.flags & 0x100) sample.sample_duration = this._readUint(32);
    if (this.flags & 0x200) sample.sample_size = this._readUint(32);
    if (this.flags & 0x400) sample.sample_flags = this._readUint(32);
    if (this.flags & 0x800) {
      if (this.version == 0) {
        sample.sample_composition_time_offset = this._readUint(32);
      } else {
        sample.sample_composition_time_offset = this._readInt(32);
      }
    }
    this.samples.push(sample);
  }
}