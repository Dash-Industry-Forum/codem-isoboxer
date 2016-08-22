// ISO/IEC 14496-12:2012 - 8.5.2.2 mp4a box (use AudioSampleEntry definition and naming)
ISOBox.prototype._boxParsers['mp4a'] = function() {
  this.reserved1    = [this._readUint(32), this._readUint(32)];
  this.channelcount = this._readUint(16);
  this.samplesize   = this._readUint(16);
  this.pre_defined  = this._readUint(16);
  this.reserved2    = this._readUint(16);
  this.sample_rate  = this._readUint(32);
}