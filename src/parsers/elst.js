// ISO/IEC 14496-12:2012 - 8.6.6 Edit List Box
ISOBox.prototype._boxParsers['elst'] = function() {
  this._parseFullBox();
  this.entry_count = this._readUint(32);
  this.entries = [];
  
  for (var i=1; i <= this.entry_count; i++) {
    var entry = {};
    if (this.version == 1) {
      entry.segment_duration  = this._readUint(64);
      entry.media_time        = this._readInt(64);
    } else {
      entry.segment_duration  = this._readUint(32);
      entry.media_time        = this._readInt(32);
    }
    entry.media_rate_integer  = this._readInt(16);
    entry.media_rate_fraction = this._readInt(16);
    this.entries.push(entry);
  }
}