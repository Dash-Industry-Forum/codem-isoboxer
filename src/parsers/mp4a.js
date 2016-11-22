// ISO/IEC 14496-12:2012 - 8.5.2.2 mp4a box (use AudioSampleEntry definition and naming)
ISOBox.prototype._boxParsers['mp4a'] = function() {
  // SampleEntry fields
  this.reserved1 = [
    this._readUint(8),
    this._readUint(8),
    this._readUint(8),
    this._readUint(8),
    this._readUint(8),
    this._readUint(8)
  ];
  this.data_reference_index = this._readUint(16);
  // AudioSampleEntry fields
  this.reserved2    = [this._readUint(32), this._readUint(32)];
  this.channelcount = this._readUint(16);
  this.samplesize   = this._readUint(16);
  this.pre_defined  = this._readUint(16);
  this.reserved3    = this._readUint(16);
  this.samplerate   = this._readTemplate(32);
  // ESDescriptor fields
  this.esds = this._readData();
}