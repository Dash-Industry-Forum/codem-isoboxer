// ISO/IEC 14496-15:2014 - avc1 box
ISOBox.prototype._boxParsers['avc1'] = function() {
  this.version               = this._readUint(16);
  this.revision_level        = this._readUint(16);
  this.vendor                = this._readUint(32);
  this.temporal_quality      = this._readUint(32);
  this.spatial_quality       = this._readUint(32);
  this.width                 = this._readUint(16);
  this.height                = this._readUint(16);
  this.horizontal_resolution = this._readUint(32);
  this.vertical_resolution   = this._readUint(32);
  this.data_size             = this._readUint(32);
  this.frame_count           = this._readUint(16);
  this.compressor_name       = this._readUint(32);
  this.depth                 = this._readUint(16);
  this.color_table_id        = this._readUint(16);
}