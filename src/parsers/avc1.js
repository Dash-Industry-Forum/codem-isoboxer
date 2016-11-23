// ISO/IEC 14496-15:2014 - avc1 box
ISOBox.prototype._boxParsers['avc1'] = function() {
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
  // VisualSampleEntry fields
  this.pre_defined1 = this._readUint(16);
  this.reserved2 = this._readUint(16);
  this.pre_defined2 = [
    this._readUint(32),
    this._readUint(32),
    this._readUint(32)
  ];
  this.width                 = this._readUint(16);
  this.height                = this._readUint(16);
  this.horizresolution       = this._readTemplate(32);
  this.vertresolution        = this._readTemplate(32);
  this.reserved3             = this._readUint(32);
  this.frame_count           = this._readUint(16);
  var length = this._readUint(8);
  this.compressorname        = this._readString(length);
  for (var i = 0; i < (31 - length); i++) {
    this._readUint(8);
  }
  this.depth                 = this._readUint(16);
  this.pre_defined3          = this._readInt(16);
  // AVCSampleEntry fields
  this.config = this._readData();
};